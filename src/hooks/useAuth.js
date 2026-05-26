import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase.js'

export function useAuth() {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [child, setChild] = useState(null)
  const [allChildren, setAllChildren] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        setUser(session.user)
        loadProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session?.user) {
        setUser(session.user)
        loadProfile(session.user.id)
      } else {
        setUser(null)
        setProfile(null)
        setChild(null)
        setAllChildren([])
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function loadProfile(userId) {
    try {
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()
      setProfile(data)

      if (data) {
        const { data: children } = await supabase
          .from('children')
          .select('*')
          .eq('tutor_id', userId)
          .order('created_at', { ascending: true })
        const list = children || []
        setAllChildren(list)
        setChild(list[0] ?? null)
      }
    } catch (err) {
      console.error('Failed to load profile', err)
    } finally {
      setLoading(false)
    }
  }

  const signUp = useCallback(async ({ email, password, role, first_name, last_name, dob, gender }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role, first_name, last_name, dob, gender },
      },
    })
    if (error) throw error
    return data
  }, [])

  const signIn = useCallback(async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }, [])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  const addChild = useCallback(async ({ first_name, last_name, dob, gender }) => {
    if (!user) throw new Error('Not authenticated')
    const { data, error } = await supabase.from('children').insert({
      tutor_id: user.id,
      first_name,
      last_name,
      dob,
      gender,
      points: 0,
    }).select().single()
    if (error) throw error
    setAllChildren(prev => [...prev, data])
    setChild(data)
    return data
  }, [user])

  const switchChild = useCallback((childId) => {
    setAllChildren(prev => {
      const found = prev.find(c => c.id === childId)
      if (found) setChild(found)
      return prev
    })
  }, [])

  const updateChildPoints = useCallback(async (points) => {
    if (!child) return
    const newPoints = (child.points || 0) + points
    const { error } = await supabase
      .from('children')
      .update({ points: newPoints })
      .eq('id', child.id)
    if (!error) {
      setChild((prev) => ({ ...prev, points: newPoints }))
      setAllChildren(prev => prev.map(c => c.id === child.id ? { ...c, points: newPoints } : c))
    }
  }, [child])

  const unlockBuilding = useCallback(async (buildingId) => {
    if (!child) return
    const { error } = await supabase.from('buildings_unlocked').insert({
      child_id: child.id,
      building_id: buildingId,
    })
    return !error
  }, [child])

  const saveProgress = useCallback(async (lessonId, score) => {
    if (!child) return
    await supabase.from('progress').upsert({
      child_id: child.id,
      lesson_id: lessonId,
      completed: true,
      score,
    }, { onConflict: 'child_id,lesson_id' })
  }, [child])

  const loadProgress = useCallback(async () => {
    if (!child) return []
    const { data } = await supabase
      .from('progress')
      .select('*')
      .eq('child_id', child.id)
    return data || []
  }, [child])

  const loadUnlockedBuildings = useCallback(async () => {
    if (!child) return []
    const { data } = await supabase
      .from('buildings_unlocked')
      .select('building_id')
      .eq('child_id', child.id)
    return data?.map((r) => r.building_id) || []
  }, [child])

  // daily_points table (run once in Supabase SQL editor):
  // CREATE TABLE daily_points (
  //   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  //   child_id uuid REFERENCES children(id) ON DELETE CASCADE,
  //   date date NOT NULL,
  //   points int DEFAULT 0,
  //   timezone text,
  //   created_at timestamptz DEFAULT now(),
  //   UNIQUE(child_id, date)
  // );
  // ALTER TABLE daily_points ENABLE ROW LEVEL SECURITY;
  // CREATE POLICY "daily_points_select" ON daily_points FOR SELECT USING (child_id IN (SELECT id FROM children WHERE tutor_id = auth.uid()));
  // CREATE POLICY "daily_points_insert" ON daily_points FOR INSERT WITH CHECK (child_id IN (SELECT id FROM children WHERE tutor_id = auth.uid()));
  // CREATE POLICY "daily_points_update" ON daily_points FOR UPDATE USING (child_id IN (SELECT id FROM children WHERE tutor_id = auth.uid()));
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

  const loadDailyPoints = useCallback(async () => {
    if (!child) return 0
    const today = new Date().toLocaleDateString('en-CA', { timeZone: timezone })
    const { data } = await supabase
      .from('daily_points')
      .select('points')
      .eq('child_id', child.id)
      .eq('date', today)
      .single()
    return data?.points ?? 0
  }, [child])

  const saveDailyPoints = useCallback(async (points) => {
    if (!child) return
    const today = new Date().toLocaleDateString('en-CA', { timeZone: timezone })
    await supabase.from('daily_points').upsert({
      child_id: child.id,
      date: today,
      points,
      timezone,
    }, { onConflict: 'child_id,date' })
  }, [child])

  // ALTER TABLE children ADD COLUMN IF NOT EXISTS streak_days int DEFAULT 0;
  // ALTER TABLE children ADD COLUMN IF NOT EXISTS last_active_date date;
  const updateStreak = useCallback(async () => {
    if (!child) return
    const today = new Date().toLocaleDateString('en-CA', { timeZone: timezone })
    if (child.last_active_date === today) return
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yest = yesterday.toLocaleDateString('en-CA', { timeZone: timezone })
    const newStreak = child.last_active_date === yest ? (child.streak_days || 0) + 1 : 1
    const { error } = await supabase.from('children')
      .update({ streak_days: newStreak, last_active_date: today })
      .eq('id', child.id)
    if (!error) setChild(prev => ({ ...prev, streak_days: newStreak, last_active_date: today }))
  }, [child])

  // ALTER TABLE children ADD COLUMN IF NOT EXISTS active_goal_id text;
  const setActiveGoal = useCallback(async (itemId) => {
    if (!child) return
    const { error } = await supabase.from('children')
      .update({ active_goal_id: itemId })
      .eq('id', child.id)
    if (!error) setChild(prev => ({ ...prev, active_goal_id: itemId }))
  }, [child])

  // CREATE TABLE IF NOT EXISTS unlocked_items (
  //   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  //   child_id uuid REFERENCES children(id) ON DELETE CASCADE,
  //   item_id text NOT NULL, unlocked_at timestamptz DEFAULT now(),
  //   UNIQUE(child_id, item_id)
  // );
  // ALTER TABLE unlocked_items ENABLE ROW LEVEL SECURITY;
  // CREATE POLICY "unlocked_items_select" ON unlocked_items FOR SELECT USING (child_id IN (SELECT id FROM children WHERE tutor_id = auth.uid()));
  // CREATE POLICY "unlocked_items_insert" ON unlocked_items FOR INSERT WITH CHECK (child_id IN (SELECT id FROM children WHERE tutor_id = auth.uid()));
  const loadUnlockedItems = useCallback(async () => {
    if (!child) return []
    const { data } = await supabase.from('unlocked_items').select('item_id').eq('child_id', child.id)
    return data?.map(r => r.item_id) || []
  }, [child])

  const unlockItem = useCallback(async (itemId) => {
    if (!child) return
    await supabase.from('unlocked_items').upsert(
      { child_id: child.id, item_id: itemId },
      { onConflict: 'child_id,item_id' }
    )
  }, [child])

  // ALTER TABLE children ADD COLUMN IF NOT EXISTS completed_units jsonb DEFAULT '[]';
  const completeUnit = useCallback(async (unitNum, onBonus) => {
    if (!child) return false
    const done = child.completed_units || []
    if (done.includes(unitNum)) return false
    const newDone = [...done, unitNum]
    const newPoints = (child.points || 0) + 10
    const { error } = await supabase.from('children')
      .update({ completed_units: newDone, points: newPoints })
      .eq('id', child.id)
    if (!error) {
      setChild(prev => ({ ...prev, completed_units: newDone, points: newPoints }))
      if (onBonus) onBonus(10)
      return true
    }
    return false
  }, [child])

  return {
    session,
    user,
    profile,
    child,
    allChildren,
    loading,
    signUp,
    signIn,
    signOut,
    addChild,
    switchChild,
    updateChildPoints,
    unlockBuilding,
    saveProgress,
    loadProgress,
    loadUnlockedBuildings,
    loadDailyPoints,
    saveDailyPoints,
    updateStreak,
    setActiveGoal,
    loadUnlockedItems,
    unlockItem,
    completeUnit,
  }
}
