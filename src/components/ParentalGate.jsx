import { useState } from 'react'
import { Moneda } from './Art.jsx'
import { COLORS } from './ChunkyButton.jsx'

function makeQuestion() {
  const a = Math.floor(Math.random() * 8) + 2
  const b = Math.floor(Math.random() * 8) + 2
  const correct = a + b
  const wrongs = new Set()
  while (wrongs.size < 3) {
    const delta = Math.floor(Math.random() * 4) + 1
    const candidate = correct + (Math.random() > 0.5 ? delta : -delta)
    if (candidate > 0 && candidate !== correct) wrongs.add(candidate)
  }
  const options = [correct, ...wrongs].sort(() => Math.random() - 0.5)
  return { a, b, correct, options }
}

export default function ParentalGate({ lang, onPass, onClose }) {
  const [q, setQ] = useState(makeQuestion)
  const [shake, setShake] = useState(false)
  const [wrong, setWrong] = useState(false)

  function tryAnswer(val) {
    if (val === q.correct) {
      onPass()
    } else {
      setWrong(true)
      setShake(true)
      setTimeout(() => {
        setShake(false)
        setTimeout(() => {
          setWrong(false)
          setQ(makeQuestion())
        }, 200)
      }, 500)
    }
  }

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: 'rgba(31,17,8,0.72)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 20px',
      }}
    >
      <style>{`
        @keyframes gateShake {
          0%,100% { transform: translateX(0); }
          20%      { transform: translateX(-10px); }
          40%      { transform: translateX(10px); }
          60%      { transform: translateX(-10px); }
          80%      { transform: translateX(10px); }
        }
      `}</style>
      <div style={{
        background: '#FFFBEB', borderRadius: 24,
        border: `3px solid ${COLORS.ink}`, boxShadow: `0 8px 0 ${COLORS.ink}`,
        padding: '28px 22px', width: '100%', maxWidth: 370,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
        animation: shake ? 'gateShake 500ms ease-out' : undefined,
      }}>
        <Moneda size={80} mood="think" />

        <div style={{
          fontFamily: 'Fredoka', fontWeight: 800, fontSize: 22,
          color: COLORS.ink, textAlign: 'center', lineHeight: 1.2,
        }}>
          {lang === 'es' ? '¿Eres un adulto?' : 'Are you a grown-up?'}
        </div>

        <div style={{
          fontFamily: 'Fredoka', fontWeight: 600, fontSize: 15,
          color: COLORS.ink, opacity: 0.65, textAlign: 'center',
        }}>
          {lang === 'es' ? 'Resuelve para continuar:' : 'Solve this to continue:'}
        </div>

        <div style={{
          fontFamily: 'Fredoka', fontWeight: 800, fontSize: 44,
          color: COLORS.ink, background: COLORS.cream, borderRadius: 16,
          padding: '10px 28px', border: `3px solid ${COLORS.ink}`,
          boxShadow: `0 4px 0 ${COLORS.ink}`,
        }}>
          {q.a} + {q.b} = ?
        </div>

        {wrong && (
          <div style={{
            fontFamily: 'Fredoka', fontWeight: 700, fontSize: 15,
            color: COLORS.red,
          }}>
            {lang === 'es' ? '¡Inténtalo de nuevo!' : 'Try again!'}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: '100%' }}>
          {q.options.map(opt => (
            <button key={opt} onClick={() => tryAnswer(opt)} style={{
              appearance: 'none', cursor: 'pointer',
              background: '#FFFFFF', color: COLORS.ink,
              border: `3px solid ${COLORS.ink}`,
              borderRadius: 16, height: 56,
              fontFamily: 'Fredoka', fontWeight: 800, fontSize: 26,
              boxShadow: `0 4px 0 ${COLORS.ink}`,
              transition: 'transform 80ms, box-shadow 80ms',
            }}>
              {opt}
            </button>
          ))}
        </div>

        <button onClick={onClose} style={{
          appearance: 'none', border: 'none', background: 'transparent',
          color: COLORS.ink, opacity: 0.45,
          fontFamily: 'Fredoka', fontWeight: 600, fontSize: 14,
          cursor: 'pointer', padding: '4px 0',
        }}>
          {lang === 'es' ? 'Cancelar' : 'Cancel'}
        </button>
      </div>
    </div>
  )
}
