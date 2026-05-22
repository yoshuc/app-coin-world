import { useState, useRef } from 'react'
import ScreenHeader from '../components/ScreenHeader.jsx'
import ChunkyButton, { COLORS } from '../components/ChunkyButton.jsx'
import { MarketItem, Moneda, CoinIcon } from '../components/Art.jsx'
import { ITEMS } from '../constants/items.js'
import { STRINGS, t } from '../i18n/strings.js'

function SpeechBubble({ children, small }) {
  return (
    <div style={{
      position: 'relative', flex: 1,
      background: '#FFFBEB', border: `3px solid ${COLORS.ink}`,
      borderRadius: 18, padding: small ? '8px 12px' : '12px 14px',
      fontFamily: 'Fredoka', fontWeight: 600, fontSize: small ? 14 : 16,
      color: COLORS.ink, lineHeight: 1.25,
      boxShadow: `0 3px 0 ${COLORS.ink}`,
    }}>
      {children}
      <svg style={{ position: 'absolute', bottom: 12, left: -12 }} width="14" height="16" viewBox="0 0 14 16">
        <path d="M14 0 L0 8 L14 16 Z" fill="#FFFBEB" stroke={COLORS.ink} strokeWidth="3" strokeLinejoin="round" />
        <rect x="11" y="2" width="3" height="12" fill="#FFFBEB" />
      </svg>
    </div>
  )
}

function MonedaTip({ visible, lang, onClose }) {
  if (!visible) return null
  const text = lang === 'es'
    ? '¡Piensa antes de comprar! ¿Lo necesitas o solo lo quieres? 🤔'
    : 'Think before you buy! Do you need it or just want it? 🤔'
  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute', bottom: 80, left: 14, right: 14, zIndex: 10,
        display: 'flex', justifyContent: 'center', pointerEvents: 'auto',
      }}
    >
      <div style={{
        background: '#FFFBEB', border: `3px solid ${COLORS.ink}`,
        borderRadius: 14, padding: '10px 14px',
        fontFamily: 'Fredoka', fontWeight: 600, fontSize: 14, color: COLORS.ink,
        maxWidth: 200, textAlign: 'center',
        boxShadow: `0 3px 0 ${COLORS.ink}`,
        cursor: 'pointer',
      }}>
        {text}
      </div>
    </div>
  )
}

function getCompletedUnits(completedLessonIds) {
  let count = 0
  for (let unit = 1; unit <= 4; unit++) {
    const start = (unit - 1) * 5 + 1
    const end = unit * 5
    let unitDone = true
    for (let id = start; id <= end; id++) {
      if (!completedLessonIds?.has(id)) { unitDone = false; break }
    }
    if (unitDone) count++
  }
  return count
}

export default function MarketScreen({ lang, setLang, points, setPoints, completedLessonIds, onProfile, childName, childEmoji }) {
  const [reaction, setReaction] = useState({
    mood: 'happy',
    textEs: STRINGS.marketHi.es,
    textEn: STRINGS.marketHi.en,
  })
  const [showTip, setShowTip] = useState(false)
  const reactionTimer = useRef(null)
  const startPoints = useRef(points)

  const maxBudget = Math.max(startPoints.current, 50)
  const ratio = Math.max(0, Math.min(1, points / maxBudget))
  const completedUnits = getCompletedUnits(completedLessonIds)

  function react(mood, textEs, textEn, duration = 2400) {
    if (reactionTimer.current) clearTimeout(reactionTimer.current)
    setReaction({ mood, textEs, textEn })
    reactionTimer.current = setTimeout(() => {
      setReaction({ mood: 'happy', textEs: STRINGS.marketHi.es, textEn: STRINGS.marketHi.en })
    }, duration)
  }

  function handleBuy(item) {
    if (points < item.cost) {
      react('sad', STRINGS.marketBroke.es, STRINGS.marketBroke.en)
      return
    }
    setPoints(p => p - item.cost)
    react('happy', `${STRINGS.marketBuy.es} ${item.es} 🎉`, `${STRINGS.marketBuy.en} ${item.en} 🎉`)
  }

  function handleSave(item) {
    react('cheer', STRINGS.marketSave.es, STRINGS.marketSave.en)
    setPoints(p => p + 2)
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <ScreenHeader
        color={COLORS.green} lang={lang} onLang={setLang} points={points}
        titleEs="El Mercado" titleEn="The Market"
        onProfile={onProfile}
        childName={childName}
        childEmoji={childEmoji}
      />

      <div style={{ padding: '12px 16px 0' }}>
        <div style={{
          background: '#FFFBEB', borderRadius: 16,
          border: `3px solid ${COLORS.ink}`, boxShadow: `0 4px 0 ${COLORS.ink}`,
          padding: '10px 12px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
            <span style={{ fontFamily: 'Fredoka', fontWeight: 700, fontSize: 14, color: COLORS.ink }}>
              {t(lang, 'budget')}
            </span>
            <span style={{ fontFamily: 'Fredoka', fontWeight: 800, fontSize: 18, color: COLORS.ink }}>
              {points} <span style={{ fontSize: 12, color: '#6B7280' }}>/ {maxBudget}</span>
            </span>
          </div>
          <div style={{
            height: 14, background: '#FEF3C7', borderRadius: 8,
            border: `2px solid ${COLORS.ink}`, overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', width: `${ratio * 100}%`,
              background: `linear-gradient(90deg, ${COLORS.yellow}, ${COLORS.orange})`,
              transition: 'width 320ms cubic-bezier(.2,.7,.2,1)',
              borderRight: ratio < 1 ? `2px solid ${COLORS.ink}` : 'none',
            }} />
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px 200px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {ITEMS.map(it => {
            const isLocked = (it.unlocksAtUnit || 0) > completedUnits
            return (
              <div key={it.id} style={{
                background: '#FFFFFF', borderRadius: 18,
                border: isLocked ? '2px solid #D1D5DB' : `3px solid ${COLORS.ink}`,
                boxShadow: isLocked ? 'none' : `0 4px 0 ${COLORS.ink}`,
                padding: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                opacity: isLocked ? 0.65 : 1,
              }}>
                <div style={{
                  width: '100%', aspectRatio: '1 / 1', background: '#FEF3C7',
                  borderRadius: 12, border: `2px solid ${COLORS.ink}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative',
                }}>
                  <MarketItem id={it.id} color={it.color} size={86} />
                  <div style={{
                    position: 'absolute', top: -8, right: -8,
                    background: COLORS.yellow, color: COLORS.ink,
                    border: `2px solid ${COLORS.ink}`, borderRadius: 999,
                    padding: '2px 8px', fontFamily: 'Fredoka', fontWeight: 800, fontSize: 14,
                    display: 'flex', alignItems: 'center', gap: 3,
                    boxShadow: `0 2px 0 ${COLORS.ink}`,
                  }}>
                    <CoinIcon size={14} />{it.cost}
                  </div>
                  {isLocked && (
                    <div style={{
                      position: 'absolute', inset: 0, borderRadius: 12,
                      background: 'rgba(0,0,0,0.45)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      gap: 4,
                    }}>
                      <span style={{ fontSize: 22 }}>🔒</span>
                      <span style={{ fontFamily: 'Fredoka', fontWeight: 700, fontSize: 11, color: '#FFFBEB', textAlign: 'center', padding: '0 4px' }}>
                        {lang === 'es' ? `Completa Unidad ${it.unlocksAtUnit}` : `Complete Unit ${it.unlocksAtUnit}`}
                      </span>
                    </div>
                  )}
                </div>
                <div style={{ fontFamily: 'Fredoka', fontWeight: 700, fontSize: 14, color: COLORS.ink, textAlign: 'center' }}>
                  {lang === 'es' ? it.es : it.en}
                </div>
                {isLocked ? (
                  <div style={{
                    width: '100%', height: 40, borderRadius: 12, background: '#F3F4F6',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Fredoka', fontWeight: 700, fontSize: 13, color: '#9CA3AF',
                    border: '2px solid #E5E7EB',
                  }}>
                    🔒 {lang === 'es' ? `Completa Unidad ${it.unlocksAtUnit}` : `Complete Unit ${it.unlocksAtUnit}`}
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: 6, width: '100%' }}>
                    <ChunkyButton small color={COLORS.red} style={{ color: '#FFFBEB', flex: 1, minWidth: 0 }}
                                  onClick={() => handleBuy(it)}>{t(lang, 'buy')}</ChunkyButton>
                    <ChunkyButton small color={COLORS.blue} style={{ color: '#FFFBEB', flex: 1, minWidth: 0 }}
                                  onClick={() => handleSave(it)}>{t(lang, 'save')}</ChunkyButton>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div style={{
        position: 'absolute', bottom: 110, left: 14, right: 14, zIndex: 4,
        display: 'flex', alignItems: 'flex-end', gap: 8, pointerEvents: 'none',
      }}>
        <div style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))', pointerEvents: 'auto' }}>
          <Moneda size={64} mood={reaction.mood} wave={reaction.mood === 'cheer'} onClick={() => setShowTip(v => !v)} />
        </div>
        <SpeechBubble small>{lang === 'es' ? reaction.textEs : reaction.textEn}</SpeechBubble>
      </div>

      <MonedaTip visible={showTip} lang={lang} onClose={() => setShowTip(false)} />
    </div>
  )
}
