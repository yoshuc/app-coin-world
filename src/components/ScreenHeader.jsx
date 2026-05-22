import CoinPill from './CoinPill.jsx'
import LangPill from './LangPill.jsx'

export default function ScreenHeader({ color, lang, onLang, points, titleEs, titleEn, subtitle, onProfile, childName, childEmoji }) {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        background: color, padding: '14px 18px 38px',
        borderBottomLeftRadius: 28, borderBottomRightRadius: 28,
        boxShadow: 'inset 0 -6px 0 rgba(0,0,0,0.12)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CoinPill value={points} dark />
            {childName && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 5,
                background: 'rgba(255,255,255,0.22)',
                border: '2px solid rgba(255,255,255,0.45)',
                borderRadius: 999, padding: '3px 10px',
                fontFamily: 'Fredoka', fontWeight: 700, fontSize: 13, color: '#FFFBEB',
              }}>
                <span style={{ fontSize: 16 }}>{childEmoji || '⭐'}</span>
                {childName}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {onProfile && (
              <button onClick={onProfile} aria-label="Profile" style={{
                appearance: 'none', cursor: 'pointer',
                background: 'rgba(255,255,255,0.22)',
                border: '2px solid rgba(255,255,255,0.55)',
                borderRadius: 999, width: 36, height: 36,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#FFFBEB',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
              </button>
            )}
            <LangPill lang={lang} onChange={onLang} />
          </div>
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
