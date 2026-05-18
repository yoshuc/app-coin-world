import { COLORS } from './ChunkyButton.jsx'

export default function LangPill({ lang, onChange }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center',
      background: 'rgba(0,0,0,0.18)', borderRadius: 999,
      padding: 3, border: `2px solid ${COLORS.ink}`,
    }}>
      {['es', 'en'].map(l => (
        <button key={l} onClick={() => onChange(l)} style={{
          appearance: 'none', border: 'none', cursor: 'pointer',
          background: lang === l ? '#FFFBEB' : 'transparent',
          color: lang === l ? COLORS.ink : 'rgba(255,255,255,0.85)',
          fontFamily: 'Fredoka, system-ui',
          fontWeight: lang === l ? 800 : 600,
          fontSize: 13, letterSpacing: '0.06em',
          padding: '5px 10px', borderRadius: 999, minWidth: 30,
          transition: 'all 140ms',
        }}>{l.toUpperCase()}</button>
      ))}
    </div>
  )
}
