import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProLogo, { PRO, PRO_FONT } from '../components/ProLogo.jsx'
import ProLangToggle from '../components/ProLangToggle.jsx'
import ProField from '../components/ProField.jsx'
import { supabase } from '../lib/supabase.js'
import { t } from '../i18n/strings.js'

const ERROR_MESSAGES = {
  email_not_confirmed: {
    es: 'Confirma tu correo antes de iniciar sesión. Revisa tu bandeja.',
    en: 'Please confirm your email before signing in. Check your inbox.',
  },
  invalid_login_credentials: {
    es: 'Correo o contraseña incorrectos.',
    en: 'Incorrect email or password.',
  },
  user_not_found: {
    es: 'No encontramos una cuenta con ese correo.',
    en: 'No account found with that email.',
  },
  over_email_send_rate_limit: {
    es: 'Demasiados intentos. Espera unos minutos.',
    en: 'Too many attempts. Please wait a few minutes.',
  },
}

export default function LoginScreen({ lang, setLang, auth, initialError }) {
  const navigate = useNavigate()
  const [email, setEmailState] = useState('')
  const [pw, setPwState] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [touched, setTouched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState(initialError || '')
  const [showResend, setShowResend] = useState(initialError === 'confirmation_expired')
  const [resendStatus, setResendStatus] = useState('')

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const pwValid = pw.length >= 6
  const canSubmit = emailValid && pwValid

  function setEmail(v) { setEmailState(v); setServerError(''); setResendStatus('') }
  function setPw(v) { setPwState(v); setServerError('') }

  async function submit(e) {
    e && e.preventDefault()
    setTouched(true)
    if (!canSubmit) return
    setLoading(true)
    setServerError('')
    setShowResend(false)
    try {
      await auth.signIn({ email, password: pw })
      navigate('/app')
    } catch (err) {
      const code = err.code || err.message?.toLowerCase().replace(/\s+/g, '_')
      const msgMap = ERROR_MESSAGES[code]
      const msg = msgMap
        ? (msgMap[lang] || msgMap.en)
        : (err.message || (lang === 'es' ? 'Algo salió mal.' : 'Something went wrong.'))
      setServerError(msg)
      if (code === 'email_not_confirmed') setShowResend(true)
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    if (!emailValid) {
      setResendStatus(lang === 'es' ? 'Escribe tu correo primero.' : 'Enter your email address first.')
      return
    }
    setResendStatus('...')
    const { error } = await supabase.auth.resend({ type: 'signup', email })
    if (error) {
      setResendStatus(lang === 'es'
        ? 'No se pudo enviar. Verifica el correo.'
        : 'Could not send email. Make sure the address is correct.')
    } else {
      setResendStatus(lang === 'es'
        ? '¡Correo enviado! Revisa tu bandeja.'
        : 'Confirmation email sent! Check your inbox.')
    }
  }

  const expiredBanner = initialError === 'confirmation_expired'

  return (
    <div style={{
      height: '100%', width: '100%',
      background: PRO.bg,
      fontFamily: PRO_FONT, color: PRO.ink,
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 24px 0',
      }}>
        <button onClick={() => navigate('/')} style={{
          appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', gap: 4, padding: 0,
          color: PRO.mute, fontFamily: PRO_FONT, fontSize: 14, fontWeight: 600,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 6l-6 6 6 6" />
          </svg>
          {t(lang, 'backToWelcome')}
        </button>
        <ProLangToggle lang={lang} onChange={setLang} />
      </div>

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '24px 24px 28px',
      }}>
        <div style={{
          background: PRO.card, borderRadius: 18,
          border: `1px solid ${PRO.border}`,
          boxShadow: '0 1px 2px rgba(15,23,42,0.04), 0 12px 32px rgba(15,23,42,0.06)',
          padding: '28px 22px 22px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
            <ProLogo size="sm" />
          </div>
          <h2 style={{
            margin: 0, textAlign: 'center',
            fontFamily: PRO_FONT, fontWeight: 700, fontSize: 24,
            letterSpacing: '-0.02em', color: PRO.ink,
          }}>{t(lang, 'welcomeBack')}</h2>
          <p style={{
            margin: '6px 0 22px', textAlign: 'center',
            fontSize: 14, color: PRO.mute, fontWeight: 500, lineHeight: 1.4,
          }}>{t(lang, 'enterToContinue')}</p>

          {expiredBanner && !serverError && (
            <div style={{
              background: '#FEF9C3', border: '1px solid #EAB308', borderRadius: 8,
              padding: '10px 14px', marginBottom: 14,
              fontSize: 13, color: '#854D0E', fontWeight: 600,
            }}>
              {lang === 'es'
                ? 'Tu enlace de confirmación ha expirado.'
                : 'Your email confirmation link has expired.'}
            </div>
          )}

          {serverError && (
            <div style={{
              background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: 8,
              padding: '10px 14px', marginBottom: showResend ? 6 : 14,
              fontSize: 13, color: '#DC2626', fontWeight: 600,
            }}>{serverError}</div>
          )}

          {(showResend || expiredBanner) && (
            <div style={{ marginBottom: 14 }}>
              <button type="button" onClick={handleResend} style={{
                appearance: 'none', border: 'none', background: 'transparent',
                cursor: 'pointer', padding: 0,
                color: PRO.brand, fontFamily: PRO_FONT, fontWeight: 600, fontSize: 13,
                textDecoration: 'underline', textUnderlineOffset: 3,
              }}>
                {lang === 'es' ? 'Reenviar correo de confirmación' : 'Resend confirmation email'}
              </button>
              {resendStatus && (
                <div style={{
                  marginTop: 6, fontSize: 12, fontWeight: 500,
                  color: resendStatus === '...' ? PRO.mute : resendStatus.includes('sent') || resendStatus.includes('enviado') ? '#166534' : '#DC2626',
                }}>{resendStatus}</div>
              )}
            </div>
          )}

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <ProField
              label={t(lang, 'emailLabel')}
              type="email" autoComplete="email"
              placeholder={t(lang, 'emailPh')}
              value={email} onChange={setEmail}
              error={touched && !emailValid ? t(lang, 'errEmail') : ''}
            />
            <ProField
              label={t(lang, 'passwordLabel')}
              type={showPw ? 'text' : 'password'} autoComplete="current-password"
              placeholder={t(lang, 'passwordPh')}
              value={pw} onChange={setPw}
              error={touched && !pwValid ? t(lang, 'errPwShort') : ''}
              right={
                <button type="button" onClick={() => setShowPw(s => !s)} style={{
                  appearance: 'none', border: 'none', background: 'transparent',
                  cursor: 'pointer', padding: 6,
                  color: PRO.mute, display: 'flex', alignItems: 'center',
                }} aria-label={showPw ? t(lang, 'hidePw') : t(lang, 'showPw')}>
                  {showPw ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 3l18 18" />
                      <path d="M10.6 6.1A10.9 10.9 0 0112 6c5 0 9.3 3.1 11 7-.5 1.2-1.2 2.3-2.1 3.2M6.6 6.6C4.6 8 3 9.9 2 12c1.7 3.9 6 7 11 7 1.8 0 3.5-.4 5-1.1" />
                      <path d="M9.5 9.5a3 3 0 004.2 4.2" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 12s4-7 11-7 11 7 11 7-4 7-11 7S2 12 2 12z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              }
            />

            <div style={{ textAlign: 'right', marginTop: -4 }}>
              <a href="#" onClick={e => e.preventDefault()} style={{
                color: PRO.brand, fontSize: 13, fontWeight: 600, textDecoration: 'none',
              }}>{t(lang, 'forgotPw')}</a>
            </div>

            <button type="submit" disabled={loading} style={{
              appearance: 'none', border: 'none', cursor: canSubmit ? 'pointer' : 'not-allowed',
              background: canSubmit ? PRO.brandSolid : '#A7F3D0',
              color: '#FFFFFF',
              fontFamily: PRO_FONT, fontWeight: 700, fontSize: 16,
              height: 50, borderRadius: 12,
              boxShadow: canSubmit ? '0 4px 14px rgba(34,197,94,0.28)' : 'none',
              transition: 'all 140ms',
              marginTop: 4,
              opacity: loading ? 0.7 : 1,
            }}>{loading ? '...' : t(lang, 'logIn')}</button>
          </form>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0 14px',
            color: PRO.mute, fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            <div style={{ flex: 1, height: 1, background: PRO.border }} />
            <span>{t(lang, 'orSep')}</span>
            <div style={{ flex: 1, height: 1, background: PRO.border }} />
          </div>

          <button onClick={() => navigate('/register')} style={{
            width: '100%', appearance: 'none', cursor: 'pointer',
            background: '#FFFFFF', color: PRO.brand,
            border: `1.5px solid ${PRO.brand}`, borderRadius: 12,
            height: 48, fontFamily: PRO_FONT, fontWeight: 700, fontSize: 15,
            transition: 'background 140ms',
          }}
          onMouseEnter={e => e.currentTarget.style.background = PRO.brandSoft}
          onMouseLeave={e => e.currentTarget.style.background = '#FFFFFF'}>
            {t(lang, 'createAccount')}
          </button>
        </div>

        <p style={{
          textAlign: 'center', fontSize: 12, color: PRO.mute, fontWeight: 500,
          marginTop: 16, lineHeight: 1.4,
        }}>{t(lang, 'termsNote')}</p>
      </div>
    </div>
  )
}
