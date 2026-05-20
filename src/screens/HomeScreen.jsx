import { useState, useEffect } from 'react'
import ScreenHeader from '../components/ScreenHeader.jsx'
import ChunkyButton, { COLORS } from '../components/ChunkyButton.jsx'
import { Building, Moneda } from '../components/Art.jsx'
import { BUILDINGS } from '../constants/buildings.js'
import { t } from '../i18n/strings.js'
import { supabase } from '../lib/supabase.js'

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
    if (userEmail) {
      supabase.auth.resend({ type: 'signup', email: userEmail })
    }
  }

  return (
    <div style={{
      background: '#FEF9C3',
      borderBottom: '2px solid #EAB308',
      padding: '10px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      fontFamily: 'Fredoka',
      fontSize: 14,
      color: '#1F1108',
      flexWrap: 'wrap',
    }}>
      <span style={{ flex: 1 }}>
        {t(lang, 'confirmEmailBanner')}
      </span>
      <button
        onClick={resend}
        style={{
          appearance: 'none', border: 'none', background: 'transparent',
          color: '#D97706', fontFamily: 'Fredoka', fontWeight: 700, fontSize: 14,
          cursor: 'pointer', padding: 0, textDecoration: 'underline',
        }}
      >
        {t(lang, 'resendEmail')}
      </button>
      <button
        onClick={() => setDismissed(true)}
        aria-label="dismiss"
        style={{
          appearance: 'none', border: 'none', background: 'transparent',
          cursor: 'pointer', padding: 4, color: '#92400E', display: 'flex', alignItems: 'center',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

export default function HomeScreen({ lang, setLang, points, unlocked, goMarket, goLearn, todayEarned }) {
  const unlockedCount = unlocked.length
  const total = BUILDINGS.length
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <EmailBanner lang={lang} />
      <ScreenHeader
        color={COLORS.red} lang={lang} onLang={setLang} points={points}
        titleEs="Mi Pueblo" titleEn="My Town"
        subtitle={`${t(lang, 'level')} ${Math.min(1 + Math.floor(unlockedCount / 2), 9)} · ${unlockedCount}/${total} ${t(lang, 'buildings')} ${t(lang, 'unlocked')}`}
      />
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px 140px' }}>
        <div style={{
          background: COLORS.yellow, borderRadius: 18,
          border: `3px solid ${COLORS.ink}`, boxShadow: `0 4px 0 ${COLORS.ink}`,
          padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12,
          marginBottom: 14,
        }}>
          <div style={{ flexShrink: 0 }}>
            <Moneda size={64} mood="cheer" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: 'Fredoka', fontWeight: 700, fontSize: 13,
              color: COLORS.ink, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>{t(lang, 'todayEarned')}</div>
            <div style={{
              fontFamily: 'Fredoka', fontWeight: 800, fontSize: 28, lineHeight: 1.05,
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
              <div key={b.id} style={{
                background: '#FFFFFF', borderRadius: 18,
                border: `3px solid ${isUnlocked ? COLORS.ink : '#D1D5DB'}`,
                boxShadow: isUnlocked ? `0 4px 0 ${COLORS.ink}` : 'none',
                padding: 10, position: 'relative', aspectRatio: '1 / 1',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building id={b.id} color={b.color} locked={!isUnlocked} size={108} />
                </div>
                <div style={{
                  fontFamily: 'Fredoka', fontWeight: 700, fontSize: 13,
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
          borderRadius: 16, padding: '12px', fontFamily: 'Fredoka', fontWeight: 700, fontSize: 16,
        }}>
          📚  {lang === 'es' ? '¡Aprende y gana monedas!' : 'Learn & earn coins!'}
        </button>
      </div>
    </div>
  )
}
