import { useState, useEffect } from 'react'
import ScreenHeader from '../components/ScreenHeader.jsx'
import { COLORS } from '../components/ChunkyButton.jsx'

const FONT = "'Fredoka', system-ui, sans-serif"

const UNITS = [
  { num: 1, lessons: [1,2,3,4,5],      emoji: '💰', color: '#F97316', es: '¿Qué es el dinero?',      en: 'What is money?' },
  { num: 2, lessons: [6,7,8,9,10],     emoji: '🏦', color: '#22C55E', es: 'Ahorrar es poder',         en: 'Saving is power' },
  { num: 3, lessons: [11,12,13,14,15], emoji: '🧠', color: '#3B82F6', es: 'Decisiones inteligentes',  en: 'Smart decisions' },
  { num: 4, lessons: [16,17,18,19,20], emoji: '🌟', color: '#A855F7', es: '¡Metas alcanzadas!',       en: 'Goals achieved!' },
]

export default function AchievementsScreen({ lang, setLang, points, completedLessonIds, child, awardEarn, completeUnit, onBack, onProfile, childName, childEmoji }) {
  const [bonusShown, setBonusShown] = useState({})

  useEffect(() => {
    if (!completeUnit) return
    for (const unit of UNITS) {
      const allDone = unit.lessons.every(id => completedLessonIds?.has(id))
      const alreadyCompleted = (child?.completed_units || []).includes(unit.num)
      if (allDone && !alreadyCompleted && !bonusShown[unit.num]) {
        setBonusShown(prev => ({ ...prev, [unit.num]: true }))
        completeUnit(unit.num, awardEarn)
      }
    }
  }, [completedLessonIds, child])

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader
        color={COLORS.green} lang={lang} onLang={setLang} points={points}
        titleEs="El Parque 🌳" titleEn="The Park 🌳"
        subtitle={lang === 'es' ? 'Tu historia de aprendizaje' : 'Your learning story'}
        onBack={onBack}
        onProfile={onProfile}
        childName={childName}
        childEmoji={childEmoji}
      />
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px 40px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {UNITS.map(unit => {
          const completedInUnit = unit.lessons.filter(id => completedLessonIds?.has(id)).length
          const total = unit.lessons.length
          const isComplete = completedInUnit === total
          const inProgress = completedInUnit > 0 && !isComplete
          const isLocked = completedInUnit === 0

          const statusLabel = isComplete
            ? (lang === 'es' ? 'Completada ✅' : 'Completed ✅')
            : inProgress
              ? (lang === 'es' ? 'En progreso 🔄' : 'In progress 🔄')
              : (lang === 'es' ? 'Bloqueada 🔒' : 'Locked 🔒')

          const statusColor = isComplete ? COLORS.green : inProgress ? COLORS.blue : '#9CA3AF'

          const justCompleted = bonusShown[unit.num]

          return (
            <div key={unit.num} style={{
              background: isLocked ? '#F9FAFB' : '#FFFFFF',
              borderRadius: 22,
              border: `3px solid ${isComplete ? unit.color : isLocked ? '#E5E7EB' : COLORS.ink}`,
              boxShadow: isLocked ? 'none' : `0 4px 0 ${isComplete ? unit.color : COLORS.ink}`,
              padding: '16px 18px', overflow: 'hidden', position: 'relative',
            }}>
              {isComplete && (
                <div style={{
                  position: 'absolute', top: 0, right: 0, left: 0, height: 4,
                  background: `linear-gradient(90deg, ${unit.color}, ${unit.color}aa)`,
                }} />
              )}
              {justCompleted && (
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: 22,
                  background: 'rgba(34,197,94,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  pointerEvents: 'none', animation: 'bonusFade 3s ease-out forwards',
                }}>
                  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 20, color: COLORS.green, textAlign: 'center' }}>
                    🎉 {lang === 'es' ? '¡Unidad completada! +10 monedas' : 'Unit complete! +10 coins'}
                  </div>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 12 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: isLocked ? '#F3F4F6' : unit.color + '22',
                  border: `2px solid ${isLocked ? '#E5E7EB' : unit.color}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 28, flexShrink: 0,
                  filter: isLocked ? 'grayscale(1) opacity(0.5)' : 'none',
                }}>
                  {unit.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 17, color: isLocked ? '#9CA3AF' : COLORS.ink }}>
                    {lang === 'es' ? `Unidad ${unit.num} · ${unit.es}` : `Unit ${unit.num} · ${unit.en}`}
                  </div>
                  <div style={{
                    display: 'inline-block', marginTop: 4,
                    background: statusColor + '22', color: statusColor,
                    borderRadius: 999, padding: '2px 10px',
                    fontFamily: FONT, fontWeight: 700, fontSize: 12,
                    border: `1.5px solid ${statusColor}`,
                  }}>
                    {statusLabel}
                  </div>
                </div>
              </div>
              {/* Stars row */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                {unit.lessons.map(id => (
                  <span key={id} style={{ fontSize: 22, opacity: completedLessonIds?.has(id) ? 1 : 0.2 }}>⭐</span>
                ))}
              </div>
              {/* Progress bar */}
              <div style={{ height: 10, background: '#F3F4F6', borderRadius: 6, overflow: 'hidden', border: `1.5px solid ${isLocked ? '#E5E7EB' : COLORS.ink}` }}>
                <div style={{
                  height: '100%', width: `${(completedInUnit / total) * 100}%`,
                  background: isComplete ? unit.color : `linear-gradient(90deg, ${unit.color}, ${unit.color}bb)`,
                  transition: 'width 600ms ease',
                }} />
              </div>
              <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 13, color: isLocked ? '#9CA3AF' : COLORS.ink, opacity: 0.65, marginTop: 6 }}>
                {completedInUnit}/{total} {lang === 'es' ? 'lecciones' : 'lessons'}
                {isComplete && ' 🏆'}
              </div>
            </div>
          )
        })}
        <style>{`
          @keyframes bonusFade {
            0% { opacity: 0; } 15% { opacity: 1; } 75% { opacity: 1; } 100% { opacity: 0; }
          }
        `}</style>
      </div>
    </div>
  )
}
