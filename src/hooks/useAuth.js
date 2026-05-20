import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase.js'

export function useAuth() {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [child, setChild] = useState(null)
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
          .limit(1)
        setChild(children?.[0] ?? null)
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
    }).select().single()
    if (error) throw error
    setChild(data)
    return data
  }, [user])

  const updateChildPoints = useCallback(async (points) => {
    if (!child) return
    const newPoints = (child.points || 0) + points
    const { error } = await supabase
      .from('children')
      .update({ points: newPoints })
      .eq('id', child.id)
    if (!error) {
      setChild((prev) => ({ ...prev, points: newPoints }))
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

  return {
    session,
    user,
    profile,
    child,
    loading,
    signUp,
    signIn,
    signOut,
    addChild,
    updateChildPoints,
    unlockBuilding,
    saveProgress,
    loadProgress,
    loadUnlockedBuildings,
  }
}
