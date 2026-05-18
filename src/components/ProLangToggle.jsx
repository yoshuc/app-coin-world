import { PRO, PRO_FONT } from './ProLogo.jsx'

export default function ProLangToggle({ lang, onChange }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 2,
      background: '#FFFFFF', border: `1px solid ${PRO.border}`,
      borderRadius: 999, padding: 3,
      fontFamily: PRO_FONT,
    }}>
      {['es', 'en'].map(l => (
        <button key={l} onClick={() => onChange(l)} style={{
          appearance: 'none', border: 'none', cursor: 'pointer',
          background: lang === l ? PRO.ink : 'transparent',
          color: lang === l ? '#FFFFFF' : PRO.mute,
          fontFamily: PRO_FONT,
          fontWeight: lang === l ? 700 : 500,
          fontSize: 12, letterSpacing: '0.06em',
          padding: '5px 10px', borderRadius: 999,
          minWidth: 26, transition: 'all 140ms',
        }}>{l.toUpperCase()}</button>
      ))}
    </div>
  )
}
