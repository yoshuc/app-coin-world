import { useState, useEffect } from 'react'
import ScreenHeader from '../components/ScreenHeader.jsx'
import ChunkyButton, { COLORS } from '../components/ChunkyButton.jsx'
import { Moneda, CoinIcon } from '../components/Art.jsx'
import { MARKET_ITEMS, UNIT_LESSON_RANGES } from '../data/marketItems.js'

const FONT = "'Fredoka', system-ui, sans-serif"

const UNIT_LABELS = {
  unit1: { es: 'Unidad 1 · Siempre disponible', en: 'Unit 1 · Always available' },
  unit2: { es: 'Unidad 2 · Completa la lección 10', en: 'Unit 2 · Complete lesson 10' },
  unit3: { es: 'Unidad 3 · Completa la lección 15', en: 'Unit 3 · Complete lesson 15' },
  unit4: { es: 'Unidad 4 · Completa la lección 20', en: 'Unit 4 · Complete lesson 20' },
}

function isUnitUnlocked(unitKey, completedLessonIds) {
  if (unitKey === 'unit1') return true
  const lessons = UNIT_LESSON_RANGES[unitKey] || []
  return lessons.every(id => completedLessonIds?.has(id))
}

function findItem(itemId) {
  if (!itemId) return null
  for (const unit of Object.values(MARKET_ITEMS)) {
    const found = unit.find(it => it.id === itemId)
    if (found) return found
  }
  return null
}

export default function GoalsScreen({ lang, setLang, points, completedLessonIds, activeGoalId, unlockedItemIds, onSetGoal, onItemUnlock, onBack, onProfile, childName, childEmoji }) {
  const [celebration, setCelebration] = useState(null)

  // Check if any newly afforded items should auto-unlock
  useEffect(() => {
    for (const [unitKey, items] of Object.entries(MARKET_ITEMS)) {
      if (!isUnitUnlocked(unitKey, completedLessonIds)) continue
      for (const item of items) {
        if (!unlockedItemIds?.has(item.id) && points >= item.cost) {
          onItemUnlock(item.id)
          if (activeGoalId === item.id) {
            setCelebration(item)
            setTimeout(() => { setCelebration(null); onSetGoal(null) }, 3000)
          }
        }
      }
    }
  }, [points, completedLessonIds])

  const activeGoal = findItem(activeGoalId)
  const activeProgress = activeGoal ? Math.min(1, points / activeGoal.cost) : 0

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <ScreenHeader
        color={COLORS.red} lang={lang} onLang={setLang} points={points}
        titleEs="Mis Metas 🎯" titleEn="My Goals 🎯"
        onBack={onBack}
        onProfile={onProfile}
        childName={childName}
        childEmoji={childEmoji}
      />

      {celebration && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 50,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            background: '#FFFBEB', borderRadius: 22,
            border: `3px solid ${COLORS.ink}`, boxShadow: `0 6px 0 ${COLORS.ink}`,
            padding: '28px 24px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 56, marginBottom: 8 }}>{celebration.emoji}</div>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 22, color: COLORS.ink }}>
              {lang === 'es' ? '¡Meta desbloqueada!' : 'Goal unlocked!'}
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 18, color: COLORS.green, marginTop: 4 }}>
              ✨ {lang === 'es' ? celebration.es : celebration.en}
            </div>
          </div>
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px 40px' }}>
        {/* Active goal card */}
        {activeGoal ? (
          <div style={{
            background: COLORS.yellow, borderRadius: 20,
            border: `3px solid ${COLORS.ink}`, boxShadow: `0 4px 0 ${COLORS.ink}`,
            padding: '14px 16px', marginBottom: 20,
            animation: 'goalPulse 2s ease-in-out infinite',
          }}>
            <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 12, color: COLORS.ink, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
              {lang === 'es' ? '🎯 Meta activa' : '🎯 Active goal'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <span style={{ fontSize: 40 }}>{activeGoal.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 18, color: COLORS.ink }}>
                  {lang === 'es' ? activeGoal.es : activeGoal.en}
                </div>
                <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 14, color: COLORS.ink, opacity: 0.7 }}>
                  {points} / {activeGoal.cost} {lang === 'es' ? 'monedas' : 'coins'}
                </div>
              </div>
            </div>
            <div style={{ height: 12, background: 'rgba(255,255,255,0.5)', borderRadius: 8, border: `2px solid ${COLORS.ink}`, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${activeProgress * 100}%`,
                background: COLORS.green,
                transition: 'width 500ms ease',
              }} />
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 13, color: COLORS.ink, opacity: 0.7, marginTop: 6 }}>
              {activeProgress >= 1
                ? (lang === 'es' ? '¡Desbloqueada! ✨' : 'Unlocked! ✨')
                : (lang === 'es' ? `Te faltan ${activeGoal.cost - points} monedas · ¡sigue aprendiendo! 💪` : `${activeGoal.cost - points} coins to go · keep learning! 💪`)
              }
            </div>
          </div>
        ) : (
          <div style={{
            background: '#FFFBEB', borderRadius: 20,
            border: `3px dashed ${COLORS.ink}`,
            padding: '14px 16px', marginBottom: 20, textAlign: 'center',
            fontFamily: FONT, fontWeight: 600, fontSize: 15, color: COLORS.ink, opacity: 0.7,
          }}>
            {lang === 'es' ? '¡Elige una meta tocando un artículo! 👇' : 'Choose a goal by tapping an item! 👇'}
          </div>
        )}

        <style>{`
          @keyframes goalPulse {
            0%, 100% { box-shadow: 0 4px 0 ${COLORS.ink}; }
            50% { box-shadow: 0 4px 0 ${COLORS.ink}, 0 0 0 4px rgba(251,191,36,0.4); }
          }
          @keyframes unlockedBadge {
            0% { transform: scale(0.8); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}</style>

        {/* Catalog by unit */}
        {Object.entries(MARKET_ITEMS).map(([unitKey, items]) => {
          const unitUnlocked = isUnitUnlocked(unitKey, completedLessonIds)
          const label = lang === 'es' ? UNIT_LABELS[unitKey].es : UNIT_LABELS[unitKey].en
          return (
            <div key={unitKey} style={{ marginBottom: 24 }}>
              <div style={{
                fontFamily: FONT, fontWeight: 700, fontSize: 13,
                color: unitUnlocked ? COLORS.ink : '#9CA3AF',
                textTransform: 'uppercase', letterSpacing: '0.05em',
                marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6,
              }}>
                {!unitUnlocked && <span>🔒</span>}
                {label}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                {items.map(item => {
                  const isUnlockedItem = unlockedItemIds?.has(item.id)
                  const isActive = activeGoalId === item.id
                  const isAffordable = points >= item.cost
                  const isLocked = !unitUnlocked

                  if (isLocked) {
                    return (
                      <div key={item.id} style={{
                        background: '#F9FAFB', borderRadius: 18,
                        border: '3px dashed #D1D5DB', padding: 10,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                      }}>
                        <div style={{
                          width: '100%', aspectRatio: '1/1', background: '#F3F4F6',
                          borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          position: 'relative',
                        }}>
                          <span style={{ fontSize: 42, filter: 'grayscale(1) opacity(0.3)' }}>{item.emoji}</span>
                          <div style={{ position: 'absolute', inset: 0, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: 26 }}>🔒</span>
                          </div>
                        </div>
                        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 14, color: '#9CA3AF', textAlign: 'center' }}>
                          {lang === 'es' ? item.es : item.en}
                        </div>
                      </div>
                    )
                  }

                  if (isUnlockedItem) {
                    return (
                      <div key={item.id} style={{
                        background: '#F0FDF4', borderRadius: 18,
                        border: `3px solid ${COLORS.green}`,
                        boxShadow: `0 4px 0 ${COLORS.green}`,
                        padding: 10,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                      }}>
                        <div style={{
                          width: '100%', aspectRatio: '1/1', background: '#DCFCE7',
                          borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          position: 'relative',
                        }}>
                          <span style={{ fontSize: 42 }}>{item.emoji}</span>
                          <div style={{
                            position: 'absolute', bottom: -8, right: -8,
                            background: COLORS.green, color: '#fff',
                            border: `2px solid ${COLORS.ink}`, borderRadius: 999,
                            padding: '2px 8px',
                            fontFamily: FONT, fontWeight: 800, fontSize: 11,
                            animation: 'unlockedBadge 300ms ease-out',
                          }}>
                            ✨ {lang === 'es' ? 'Tuyo' : 'Yours'}
                          </div>
                        </div>
                        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 14, color: COLORS.ink, textAlign: 'center' }}>
                          {lang === 'es' ? item.es : item.en}
                        </div>
                        <div style={{
                          fontFamily: FONT, fontWeight: 700, fontSize: 12, color: COLORS.green, textAlign: 'center',
                        }}>¡{lang === 'es' ? 'Desbloqueado' : 'Unlocked'}! ✅</div>
                      </div>
                    )
                  }

                  return (
                    <div key={item.id}
                      onClick={() => onSetGoal(isActive ? null : item.id)}
                      style={{
                        background: isActive ? '#FEF9C3' : '#FFFFFF', borderRadius: 18,
                        border: isActive ? `3px solid ${COLORS.yellow}` : `3px solid ${COLORS.ink}`,
                        boxShadow: isActive ? `0 4px 0 ${COLORS.yellow}` : `0 4px 0 ${COLORS.ink}`,
                        padding: 10, cursor: 'pointer',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                        transition: 'all 160ms',
                      }}>
                      <div style={{
                        width: '100%', aspectRatio: '1/1', background: '#FEF3C7',
                        borderRadius: 12, border: `2px solid ${COLORS.ink}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        position: 'relative',
                      }}>
                        <span style={{ fontSize: 42 }}>{item.emoji}</span>
                        <div style={{
                          position: 'absolute', top: -8, right: -8,
                          background: COLORS.yellow, color: COLORS.ink,
                          border: `2px solid ${COLORS.ink}`, borderRadius: 999,
                          padding: '2px 8px', fontFamily: FONT, fontWeight: 800, fontSize: 13,
                          display: 'flex', alignItems: 'center', gap: 3,
                          boxShadow: `0 2px 0 ${COLORS.ink}`,
                        }}>
                          <CoinIcon size={13} />{item.cost}
                        </div>
                        {isAffordable && (
                          <div style={{
                            position: 'absolute', bottom: -8, right: -8,
                            background: COLORS.green, color: '#fff',
                            border: `2px solid ${COLORS.ink}`, borderRadius: 999,
                            padding: '2px 6px', fontFamily: FONT, fontWeight: 800, fontSize: 10,
                          }}>✓</div>
                        )}
                      </div>
                      <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 14, color: COLORS.ink, textAlign: 'center' }}>
                        {lang === 'es' ? item.es : item.en}
                      </div>
                      <div style={{
                        width: '100%', height: 36, borderRadius: 12,
                        background: isActive ? COLORS.yellow : '#FEF3C7',
                        border: `2px solid ${COLORS.ink}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: FONT, fontWeight: 700, fontSize: 13, color: COLORS.ink,
                      }}>
                        {isActive
                          ? (lang === 'es' ? '🎯 Meta activa' : '🎯 Active goal')
                          : (lang === 'es' ? 'Elegir como meta' : 'Set as goal')}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
