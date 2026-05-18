import CoinPill from './CoinPill.jsx'
import LangPill from './LangPill.jsx'

export default function ScreenHeader({ color, lang, onLang, points, titleEs, titleEn, subtitle }) {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        background: color, padding: '14px 18px 38px',
        borderBottomLeftRadius: 28, borderBottomRightRadius: 28,
        boxShadow: 'inset 0 -6px 0 rgba(0,0,0,0.12)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <CoinPill value={points} dark />
          <LangPill lang={lang} onChange={onLang} />
        </div>
        <h1 style={{
          margin: 0, color: '#FFFBEB',
          fontFamily: 'Fredoka', fontWeight: 800,
          fontSize: 36, lineHeight: 1, letterSpacing: '-0.02em',
          textShadow: '3px 3px 0 #1F1108',
        }}>{lang === 'es' ? titleEs : titleEn}</h1>
        {subtitle && (
          <div style={{
            color: '#FFFBEB', opacity: 0.92, fontFamily: 'Fredoka', fontWeight: 500,
            fontSize: 14, marginTop: 6,
          }}>{subtitle}</div>
        )}
      </div>
      <svg viewBox="0 0 375 30" width="100%" height="14"
           style={{ position: 'absolute', top: 0, left: 0, opacity: 0.18, pointerEvents: 'none' }}>
        <circle cx="60" cy="14" r="10" fill="#FFFBEB" />
        <circle cx="78" cy="10" r="14" fill="#FFFBEB" />
        <circle cx="280" cy="16" r="8" fill="#FFFBEB" />
        <circle cx="298" cy="12" r="12" fill="#FFFBEB" />
      </svg>
    </div>
  )
}
