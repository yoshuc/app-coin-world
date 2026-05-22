import { useState, useEffect } from 'react'
import ScreenHeader from '../components/ScreenHeader.jsx'
import ChunkyButton, { COLORS } from '../components/ChunkyButton.jsx'
import { Building, Moneda } from '../components/Art.jsx'
import { BUILDINGS } from '../constants/buildings.js'
import { BUILDING_NPCS } from '../constants/buildingNPCs.js'
import { t } from '../i18n/strings.js'
import { supabase } from '../lib/supabase.js'

const KIDS_FONT = "'Fredoka', system-ui, sans-serif"

const BUILDING_PARTICLES = {
  house:   ['🏠','❤️','✨'],
  park:    ['🌸','🍃','⭐'],
  school:  ['📚','✏️','🌟'],
  bakery:  ['🥐','🍞','✨'],
  library: ['📖','🔖','💡'],
  cinema:  ['🎬','🍿','⭐'],
  rocket:  ['🚀','⭐','✨'],
  castle:  ['🏰','👑','✨'],
}

function playBuildingSound(freq = 523) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.frequency.value = freq
    osc.type = 'sine'
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.3)
  } catch {}
}

function EmailBanner({ lang }) {
  const [dismissed, setDismissed] = useState(false)
  const [show, setShow] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user && !data.user.email_confirmed_at) {
        setShow(true)
        setUserEmail(data.user.email || '')
      }
    })
  }, [])

  if (!show || dismissed) return null

  function resend() {
    if (userEmail) supabase.auth.resend({ type: 'signup', email: userEmail })
  }

  return (
    <div style={{
      background: '#FEF9C3', borderBottom: '2px solid #EAB308',
      padding: '10px 16px', display: 'flex', alignItems: 'center',
      gap: 10, fontFamily: KIDS_FONT, fontSize: 14, color: '#1F1108', flexWrap: 'wrap',
    }}>
      <span style={{ flex: 1 }}>{t(lang, 'confirmEmailBanner')}</span>
      <button onClick={resend} style={{
        appearance: 'none', border: 'none', background: 'transparent',
        color: '#D97706', fontFamily: KIDS_FONT, fontWeight: 700, fontSize: 14,
        cursor: 'pointer', padding: 0, textDecoration: 'underline',
      }}>{t(lang, 'resendEmail')}</button>
      <button onClick={() => setDismissed(true)} aria-label="dismiss" style={{
        appearance: 'none', border: 'none', background: 'transparent',
        cursor: 'pointer', padding: 4, color: '#92400E', display: 'flex', alignItems: 'center',
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

function ChildSwitcher({ allChildren, activeChild, switchChild }) {
  return (
    <div style={{
      padding: '8px 16px 0',
      display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
    }}>
      {allChildren.map(c => {
        const active = c.id === activeChild?.id
        return (
          <button key={c.id} onClick={() => switchChild(c.id)} style={{
            appearance: 'none', cursor: 'pointer',
            background: active ? COLORS.red : '#FFFFFF',
            color: active ? '#FFFBEB' : COLORS.ink,
            border: `2.5px solid ${COLORS.ink}`,
            borderRadius: 999, padding: '4px 12px',
            fontFamily: KIDS_FONT, fontWeight: active ? 800 : 600, fontSize: 14,
            boxShadow: active ? `0 3px 0 ${COLORS.ink}` : `0 2px 0 rgba(31,17,8,0.35)`,
            transform: active ? 'translateY(-1px)' : 'none',
            transition: 'all 120ms',
          }}>
            {c.first_name}
          </button>
        )
      })}
    </div>
  )
}

export default function HomeScreen({ lang, setLang, points, unlocked, goMarket, goLearn, todayEarned, allChildren = [], activeChild, switchChild, onProfile, childName, childEmoji }) {
  const unlockedCount = unlocked.length
  const total = BUILDINGS.length
  const multiChild = allChildren.length > 1

  const [showMonedaTip, setShowMonedaTip] = useState(false)
  const [tappedBuilding, setTappedBuilding] = useState(null)
  const [particles, setParticles] = useState([])
  const [lockedShake, setLockedShake] = useState(null)
  const [lockedTip, setLockedTip] = useState(null)
  const [npcBubble, setNpcBubble] = useState(null)

  function tapBuilding(b) {
    setTappedBuilding(b.id)
    setTimeout(() => setTappedBuilding(null), 600)

    const emojis = BUILDING_PARTICLES[b.id] || ['✨','⭐','🎉']
    const newParticles = emojis.flatMap((emoji, ei) =>
      [0,1].map((_, pi) => ({
        id: `${b.id}-${ei}-${pi}-${Date.now()}`,
        emoji,
        x: (Math.random() - 0.5) * 80,
        y: -(40 + Math.random() * 60),
      }))
    )
    setParticles(prev => [...prev, ...newParticles])
    setTimeout(() => setParticles(prev => prev.filter(p => !newParticles.find(n => n.id === p.id))), 800)

    playBuildingSound(b.id === 'castle' ? 659 : b.id === 'rocket' ? 587 : 523)

    const npc = BUILDING_NPCS[b.id]
    if (npc) {
      const tipIndex = Math.floor(Math.random() * npc.tips[lang].length)
      setNpcBubble({ buildingId: b.id, tipIndex })
      setTimeout(() => setNpcBubble(null), 3000)
    }
  }

  function tapLocked(b) {
    setLockedShake(b.id)
    setLockedTip(b.id)
    setTimeout(() => setLockedShake(null), 500)
    setTimeout(() => setLockedTip(null), 2000)
  }

  const monedaTipText = lang === 'es'
    ? '¡Cada día que practicas creces más! ⭐'
    : 'Every day you practice you grow more! ⭐'

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @keyframes buildingPop {
          0% { transform: scale(1); }
          30% { transform: scale(1.15); }
          60% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
        @keyframes particleFly {
          0% { transform: translate(0,0) scale(1); opacity: 1; }
          100% { transform: translate(var(--px), var(--py)) scale(0); opacity: 0; }
        }
        @keyframes buildingShake {
          0%,100% { transform: translateX(0); }
          20% { transform: translateX(-5px); }
          40% { transform: translateX(5px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
      `}</style>

      <EmailBanner lang={lang} />

      {multiChild && (
        <ChildSwitcher
          allChildren={allChildren}
          activeChild={activeChild}
          switchChild={switchChild}
        />
      )}

      <ScreenHeader
        color={COLORS.red} lang={lang} onLang={setLang} points={points}
        titleEs="Mi Pueblo" titleEn="My Town"
        subtitle={`${t(lang, 'level')} ${Math.min(1 + Math.floor(unlockedCount / 2), 9)} · ${unlockedCount}/${total} ${t(lang, 'buildings')} ${t(lang, 'unlocked')}`}
        onProfile={onProfile}
        childName={childName}
        childEmoji={childEmoji}
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '22px 16px 140px' }}>
        <div style={{
          background: COLORS.yellow, borderRadius: 18,
          border: `3px solid ${COLORS.ink}`, boxShadow: `0 4px 0 ${COLORS.ink}`,
          padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12,
          marginBottom: 14, position: 'relative',
        }}>
          <div style={{ flexShrink: 0, position: 'relative' }}>
            <Moneda size={64} mood="cheer" onClick={() => setShowMonedaTip(v => !v)} />
            {showMonedaTip && (
              <div onClick={() => setShowMonedaTip(false)} style={{
                position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)',
                marginBottom: 8, zIndex: 20,
                background: '#FFFBEB', border: `3px solid ${COLORS.ink}`,
                borderRadius: 14, padding: '8px 12px',
                fontFamily: KIDS_FONT, fontWeight: 600, fontSize: 13, color: COLORS.ink,
                width: 160, textAlign: 'center',
                boxShadow: `0 3px 0 ${COLORS.ink}`,
                cursor: 'pointer', whiteSpace: 'normal',
              }}>
                {monedaTipText}
              </div>
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: KIDS_FONT, fontWeight: 700, fontSize: 13,
              color: COLORS.ink, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>{t(lang, 'todayEarned')}</div>
            <div style={{
              fontFamily: KIDS_FONT, fontWeight: 800, fontSize: 28, lineHeight: 1.05,
              color: COLORS.ink, letterSpacing: '-0.02em',
            }}>+{todayEarned} {t(lang, 'points')}</div>
          </div>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12,
          marginBottom: 16,
        }}>
          {BUILDINGS.map(b => {
            const isUnlocked = unlocked.includes(b.id)
            return (
              <div key={b.id}
                onClick={() => isUnlocked ? tapBuilding(b) : tapLocked(b)}
                style={{
                  background: '#FFFFFF', borderRadius: 18,
                  border: `3px solid ${isUnlocked ? COLORS.ink : '#D1D5DB'}`,
                  boxShadow: isUnlocked ? `0 4px 0 ${COLORS.ink}` : 'none',
                  padding: 10, position: 'relative', aspectRatio: '1 / 1',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  cursor: isUnlocked ? 'pointer' : 'default',
                  animation: tappedBuilding === b.id ? 'buildingPop 600ms ease-out' : lockedShake === b.id ? 'buildingShake 500ms ease-out' : 'none',
                }}>
                <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Building id={b.id} color={b.color} locked={!isUnlocked} size={108} />
                  </div>
                  {/* particles */}
                  {particles.filter(p => p.id.startsWith(b.id)).map(p => (
                    <div key={p.id} style={{
                      position: 'absolute', top: '50%', left: '50%',
                      fontSize: 20, pointerEvents: 'none',
                      '--px': `${p.x}px`, '--py': `${p.y}px`,
                      animation: 'particleFly 800ms ease-out forwards',
                    }}>{p.emoji}</div>
                  ))}
                  {/* NPC emoji */}
                  {isUnlocked && BUILDING_NPCS[b.id] && (
                    <div style={{
                      position: 'absolute', bottom: -10, left: '50%', transform: 'translateX(-50%)',
                      fontSize: 20, zIndex: 2,
                    }}>
                      {BUILDING_NPCS[b.id].emoji}
                    </div>
                  )}
                  {/* NPC speech bubble */}
                  {npcBubble?.buildingId === b.id && (() => {
                    const npc = BUILDING_NPCS[b.id]
                    return (
                      <div style={{
                        position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)',
                        marginBottom: 8, zIndex: 20,
                        background: '#FFFBEB', border: `3px solid ${COLORS.ink}`,
                        borderRadius: 14, padding: '8px 12px',
                        fontFamily: KIDS_FONT, fontWeight: 600, fontSize: 13, color: COLORS.ink,
                        width: 160, textAlign: 'center',
                        boxShadow: `0 3px 0 ${COLORS.ink}`,
                        pointerEvents: 'none',
                      }}>
                        <div style={{ fontWeight: 800, marginBottom: 2 }}>{npc.emoji} {lang === 'es' ? npc.nameEs : npc.nameEn}</div>
                        {npc.tips[lang][npcBubble.tipIndex]}
                      </div>
                    )
                  })()}
                  {/* locked tip */}
                  {lockedTip === b.id && (
                    <div style={{
                      position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)',
                      background: COLORS.ink, color: '#FFFBEB',
                      borderRadius: 10, padding: '5px 10px', whiteSpace: 'nowrap',
                      fontFamily: KIDS_FONT, fontWeight: 600, fontSize: 12,
                      zIndex: 10, pointerEvents: 'none',
                    }}>
                      📚 {lang === 'es' ? '¡Completa más lecciones!' : 'Complete more lessons!'}
                    </div>
                  )}
                </div>
                <div style={{
                  fontFamily: KIDS_FONT, fontWeight: 700, fontSize: 13,
                  color: isUnlocked ? COLORS.ink : '#9CA3AF',
                  textAlign: 'center', marginTop: 2,
                }}>{isUnlocked ? (lang === 'es' ? b.es : b.en) : `${b.cost} ★`}</div>
              </div>
            )
          })}
        </div>

        <ChunkyButton color={COLORS.green} fullWidth onClick={goMarket}
                      style={{ color: '#FFFBEB', fontSize: 22 }}>
          🛒  {t(lang, 'goToMarket')}
        </ChunkyButton>

        <button onClick={goLearn} style={{
          marginTop: 10, width: '100%', appearance: 'none', cursor: 'pointer',
          background: '#FFFBEB', border: `3px dashed ${COLORS.purple}`, color: COLORS.purple,
          borderRadius: 16, padding: '12px', fontFamily: KIDS_FONT, fontWeight: 700, fontSize: 16,
        }}>
          📚  {lang === 'es' ? '¡Aprende y gana monedas!' : 'Learn & earn coins!'}
        </button>
      </div>
    </div>
  )
}
