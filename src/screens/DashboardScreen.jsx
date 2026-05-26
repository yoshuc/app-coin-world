import { useState, useEffect } from 'react'
import ScreenHeader from '../components/ScreenHeader.jsx'
import { COLORS } from '../components/ChunkyButton.jsx'
import { Moneda } from '../components/Art.jsx'
import { MARKET_ITEMS } from '../data/marketItems.js'

const FONT = "'Fredoka', system-ui, sans-serif"

function CountUp({ target, duration = 800 }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (target === 0) return
    const start = performance.now()
    function tick(now) {
      const p = Math.min(1, (now - start) / duration)
      setVal(Math.floor(p * target))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration])
  return <>{val}</>
}

function findActiveGoalItem(activeGoalId) {
  if (!activeGoalId) return null
  for (const unit of Object.values(MARKET_ITEMS)) {
    const found = unit.find(it => it.id === activeGoalId)
    if (found) return found
  }
  return null
}

export default function DashboardScreen({ lang, setLang, points, todayEarned, child, activeGoalId, onBack, onProfile, childName, childEmoji }) {
  const streak = child?.streak_days || 0
  const activeGoal = findActiveGoalItem(activeGoalId)
  const progress = activeGoal ? Math.min(1, points / activeGoal.cost) : 0

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader
        color={COLORS.orange} lang={lang} onLang={setLang} points={points}
        titleEs="Mi Casa" titleEn="My Home"
        onBack={onBack}
        onProfile={onProfile}
        childName={childName}
        childEmoji={childEmoji}
      />
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px 40px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Today's coins */}
        <div style={{
          background: COLORS.yellow, borderRadius: 22,
          border: `3px solid ${COLORS.ink}`, boxShadow: `0 4px 0 ${COLORS.ink}`,
          padding: '20px 22px',
        }}>
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 13, color: COLORS.ink, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
            {lang === 'es' ? 'Monedas ganadas hoy' : 'Coins earned today'}
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 52, color: COLORS.ink, lineHeight: 1, letterSpacing: '-0.03em' }}>
            +<CountUp target={todayEarned} />
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 14, color: COLORS.ink, opacity: 0.6, marginTop: 4 }}>
            {lang === 'es' ? '🌟 ¡Sigue así!' : '🌟 Keep it up!'}
          </div>
        </div>

        {/* Streak */}
        <div style={{
          background: '#FFFBEB', borderRadius: 22,
          border: `3px solid ${COLORS.ink}`, boxShadow: `0 4px 0 ${COLORS.ink}`,
          padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{ fontSize: 42, lineHeight: 1 }}>🔥</div>
          <div>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 32, color: COLORS.ink, lineHeight: 1 }}>
              {streak} {lang === 'es' ? 'días' : 'days'}
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 14, color: COLORS.ink, opacity: 0.65 }}>
              {lang === 'es' ? 'racha seguida 💪' : 'in a row 💪'}
            </div>
          </div>
        </div>

        {/* Active goal */}
        <div style={{
          background: '#FFFBEB', borderRadius: 22,
          border: `3px solid ${COLORS.ink}`, boxShadow: `0 4px 0 ${COLORS.ink}`,
          padding: '18px 22px',
        }}>
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 13, color: COLORS.ink, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
            {lang === 'es' ? 'Meta activa 🎯' : 'Active goal 🎯'}
          </div>
          {activeGoal ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <span style={{ fontSize: 36 }}>{activeGoal.emoji}</span>
                <div>
                  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 20, color: COLORS.ink }}>
                    {lang === 'es' ? activeGoal.es : activeGoal.en}
                  </div>
                  <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 14, color: COLORS.ink, opacity: 0.65 }}>
                    {points} / {activeGoal.cost} {lang === 'es' ? 'monedas' : 'coins'}
                  </div>
                </div>
              </div>
              <div style={{ height: 14, background: '#FEF3C7', borderRadius: 8, border: `2px solid ${COLORS.ink}`, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${progress * 100}%`,
                  background: `linear-gradient(90deg, ${COLORS.yellow}, ${COLORS.green})`,
                  transition: 'width 600ms cubic-bezier(.2,.7,.2,1)',
                  borderRight: progress < 1 ? `2px solid ${COLORS.ink}` : 'none',
                }} />
              </div>
              {progress >= 1 && (
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 16, color: COLORS.green, marginTop: 8 }}>
                  ¡{lang === 'es' ? 'Meta alcanzada' : 'Goal reached'}! 🎉
                </div>
              )}
              {progress < 1 && (
                <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 13, color: COLORS.ink, opacity: 0.65, marginTop: 6 }}>
                  {lang === 'es' ? `Te faltan ${activeGoal.cost - points} monedas · ¡sigue aprendiendo! 💪` : `${activeGoal.cost - points} coins to go · keep learning! 💪`}
                </div>
              )}
            </>
          ) : (
            <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 15, color: COLORS.ink, opacity: 0.65, textAlign: 'center', padding: '8px 0' }}>
              {lang === 'es' ? '¡Elige una meta en la tienda! 🏪' : 'Choose a goal in the shop! 🏪'}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 4 }}>
          <Moneda size={60} mood="cheer" />
        </div>
      </div>
    </div>
  )
}
