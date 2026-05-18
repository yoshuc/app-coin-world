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

export default function MarketScreen({ lang, setLang, points, setPoints }) {
  const [reaction, setReaction] = useState({
    mood: 'happy',
    textEs: STRINGS.marketHi.es,
    textEn: STRINGS.marketHi.en,
  })
  const reactionTimer = useRef(null)
  const startPoints = useRef(points)

  const maxBudget = Math.max(startPoints.current, 50)
  const ratio = Math.max(0, Math.min(1, points / maxBudget))

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
          {ITEMS.map(it => (
            <div key={it.id} style={{
              background: '#FFFFFF', borderRadius: 18,
              border: `3px solid ${COLORS.ink}`, boxShadow: `0 4px 0 ${COLORS.ink}`,
              padding: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
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
              </div>
              <div style={{ fontFamily: 'Fredoka', fontWeight: 700, fontSize: 14, color: COLORS.ink, textAlign: 'center' }}>
                {lang === 'es' ? it.es : it.en}
              </div>
              <div style={{ display: 'flex', gap: 6, width: '100%' }}>
                <ChunkyButton small color={COLORS.red} style={{ color: '#FFFBEB', flex: 1, minWidth: 0 }}
                              onClick={() => handleBuy(it)}>{t(lang, 'buy')}</ChunkyButton>
                <ChunkyButton small color={COLORS.blue} style={{ color: '#FFFBEB', flex: 1, minWidth: 0 }}
                              onClick={() => handleSave(it)}>{t(lang, 'save')}</ChunkyButton>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        position: 'absolute', bottom: 110, left: 14, right: 14, zIndex: 4,
        display: 'flex', alignItems: 'flex-end', gap: 8, pointerEvents: 'none',
      }}>
        <div style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))' }}>
          <Moneda size={64} mood={reaction.mood} wave={reaction.mood === 'cheer'} />
        </div>
        <SpeechBubble small>{lang === 'es' ? reaction.textEs : reaction.textEn}</SpeechBubble>
      </div>
    </div>
  )
}
