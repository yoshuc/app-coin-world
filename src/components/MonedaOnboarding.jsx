import { useState } from 'react'
import { Moneda } from './Art.jsx'

const FONT = "'Fredoka', system-ui, -apple-system, sans-serif"

const SLIDES = [
  {
    es: '¡Este es tu pueblo! Está vacío... ¡vamos a construirlo! 🏗️',
    en: "This is your town! It's empty... let's build it! 🏗️",
  },
  {
    es: '¡Aprende aquí y gana monedas! 📚',
    en: 'Learn here and earn coins! 📚',
  },
  {
    es: '¡Gasta en el mercado para crecer tu pueblo! 🛒',
    en: 'Spend at the market to grow your town! 🛒',
  },
]

const CSS = `
  @keyframes cwBounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-12px); }
  }
  @keyframes cwPulseRing {
    0%, 100% { box-shadow: 0 0 0 0px rgba(251,191,36,0.4); }
    50% { box-shadow: 0 0 0 8px rgba(251,191,36,0.4); }
  }
`

export default function MonedaOnboarding({ lang = 'es', onDone, initialSlide = 0 }) {
  const [slide, setSlide] = useState(initialSlide)
  const isLast = slide === SLIDES.length - 1

  function advance() {
    if (isLast) {
      onDone()
    } else {
      setSlide(s => s + 1)
    }
  }

  return (
    <div
      onClick={isLast ? undefined : advance}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: 'rgba(31,17,8,0.85)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '24px 32px',
        cursor: isLast ? 'default' : 'pointer',
      }}
    >
      <style>{CSS}</style>

      {/* Moneda bouncing */}
      <div style={{ animation: 'cwBounce 1.2s ease-in-out infinite' }}>
        <Moneda size={120} mood="cheer" wave />
      </div>

      {/* Speech bubble */}
      <div style={{
        marginTop: 24,
        background: '#FFFBEB',
        border: '3px solid #1F1108',
        borderRadius: 20,
        padding: '16px 20px',
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: 20,
        color: '#1F1108',
        textAlign: 'center',
        lineHeight: 1.3,
        maxWidth: 320,
        boxShadow: '0 4px 0 #1F1108',
      }}>
        {SLIDES[slide][lang]}
      </div>

      {/* Slide dots */}
      <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
        {SLIDES.map((_, i) => (
          <div key={i} style={{
            width: i === slide ? 22 : 10, height: 10, borderRadius: 999,
            background: i === slide ? '#FBBF24' : 'rgba(255,255,255,0.3)',
            border: '2px solid rgba(255,255,255,0.5)',
            transition: 'width 200ms',
          }} />
        ))}
      </div>

      {isLast ? (
        <button
          onClick={onDone}
          style={{
            marginTop: 24,
            appearance: 'none', border: '3px solid #1F1108',
            background: '#22C55E', color: '#FFFBEB',
            fontFamily: FONT, fontWeight: 800, fontSize: 20,
            borderRadius: 16, padding: '14px 32px',
            cursor: 'pointer',
            boxShadow: '0 4px 0 #1F1108',
          }}
        >
          {lang === 'es' ? '¡Empecemos!' : "Let's go!"}
        </button>
      ) : (
        <div style={{
          marginTop: 20,
          fontFamily: FONT, fontWeight: 600, fontSize: 14,
          color: 'rgba(255,255,255,0.6)',
        }}>
          {lang === 'es' ? 'Toca para continuar' : 'Tap to continue'}
        </div>
      )}
    </div>
  )
}
