import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProLogo, { PRO, PRO_FONT } from '../components/ProLogo.jsx'
import ProLangToggle from '../components/ProLangToggle.jsx'
import { t } from '../i18n/strings.js'

function ProChoiceCard({ primary, title, subtitle, onClick, iconKind }) {
  const [hover, setHover] = useState(false)
  const styleBase = {
    appearance: 'none', cursor: 'pointer', textAlign: 'left',
    width: '100%', borderRadius: 14, padding: '16px 18px',
    fontFamily: PRO_FONT,
    display: 'flex', alignItems: 'center', gap: 14,
    transition: 'all 140ms ease',
  }
  const style = primary ? {
    ...styleBase,
    background: hover ? '#166534' : '#15803D',
    color: '#FFFFFF', border: 'none',
    boxShadow: hover ? '0 8px 24px rgba(21,128,61,0.34)' : '0 4px 14px rgba(21,128,61,0.22)',
    transform: hover ? 'translateY(-1px)' : 'translateY(0)',
  } : {
    ...styleBase,
    background: hover ? PRO.brandSoft : '#FFFFFF',
    color: PRO.brand,
    border: `1.5px solid ${PRO.brand}`,
  }
  const iconColor = primary ? '#FFFFFF' : PRO.brand
  return (
    <button
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onClick={onClick} style={style}
    >
      <span style={{
        width: 40, height: 40, borderRadius: 12,
        background: primary ? 'rgba(255,255,255,0.18)' : PRO.brandSoft,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        {iconKind === 'family' ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2"
               strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="7" r="3" /><circle cx="17" cy="9" r="2" />
            <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
            <path d="M15 20c0-2.2 1.8-4 4-4s4 1.8 4 4" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2"
               strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
          </svg>
        )}
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontWeight: 700, fontSize: 16, letterSpacing: '-0.01em', lineHeight: 1.25 }}>
          {title}
        </span>
        <span style={{ display: 'block', fontWeight: 500, fontSize: 13, color: primary ? 'rgba(255,255,255,0.9)' : '#166534', marginTop: 2 }}>
          {subtitle}
        </span>
      </span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2"
           strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.7 }}>
        <path d="M9 6l6 6-6 6" />
      </svg>
    </button>
  )
}

export default function WelcomeScreen({ lang, setLang }) {
  const navigate = useNavigate()
  return (
    <div style={{
      height: '100%', width: '100%',
      background: PRO.bg,
      fontFamily: PRO_FONT, color: PRO.ink,
      display: 'flex', flexDirection: 'column',
      padding: '20px 24px 28px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <ProLogo />
        <ProLangToggle lang={lang} onChange={setLang} />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 36 }}>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: PRO.brandSoft, color: PRO.brand,
            border: `1px solid ${PRO.brandSoft}`,
            borderRadius: 999, padding: '4px 10px',
            fontSize: 12, fontWeight: 600, letterSpacing: '0.01em',
            marginBottom: 18,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: PRO.brandSolid }} />
            {lang === 'es' ? 'Familias · Ages 5–10' : 'Families · Ages 5–10'}
          </div>
          <h1 style={{
            margin: 0,
            fontFamily: PRO_FONT, fontWeight: 700,
            fontSize: 40, lineHeight: 1.05, letterSpacing: '-0.035em',
            color: PRO.ink,
          }}>{t(lang, 'learnToSave')}</h1>
          <p style={{
            margin: '12px 0 0',
            fontSize: 16, lineHeight: 1.45, color: PRO.mute, fontWeight: 500,
            maxWidth: 320,
          }}>{t(lang, 'howStart')}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <ProChoiceCard
            primary
            title={t(lang, 'imAdult')}
            subtitle={t(lang, 'imAdultSub')}
            onClick={() => navigate('/register')}
            iconKind="user"
          />
          <ProChoiceCard
            title={t(lang, 'registerChild')}
            subtitle={t(lang, 'registerChildSub')}
            onClick={() => navigate('/register/tutor')}
            iconKind="family"
          />
        </div>
      </div>

      <div style={{
        textAlign: 'center', fontSize: 14, color: PRO.mute, fontWeight: 500,
        paddingTop: 12,
      }}>
        {t(lang, 'alreadyAccount')}{' '}
        <button onClick={() => navigate('/login')} style={{
          appearance: 'none', border: 'none', background: 'transparent',
          color: PRO.brand, fontFamily: PRO_FONT, fontWeight: 700, fontSize: 14,
          cursor: 'pointer', padding: 0, textDecoration: 'underline',
          textUnderlineOffset: 3,
        }}>{t(lang, 'logIn')}</button>
      </div>
    </div>
  )
}
