import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import ProLogo, { PRO, PRO_FONT } from '../components/ProLogo.jsx'
import ProLangToggle from '../components/ProLangToggle.jsx'
import ProField from '../components/ProField.jsx'
import { t } from '../i18n/strings.js'

function StepPill({ current, total, lang }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 10px', borderRadius: 999,
      background: PRO.brandSoft, color: PRO.brand,
      fontFamily: PRO_FONT, fontWeight: 700, fontSize: 12,
      letterSpacing: '0.02em',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 999, background: PRO.brandSolid }} />
      {t(lang, 'stepOf')} {current} {t(lang, 'stepOfWord')} {total}
    </div>
  )
}

function GenderToggle({ label, value, onChange, error, maleLabel, femaleLabel }) {
  const opt = (val, txt) => {
    const sel = value === val
    return (
      <button type="button" key={val} onClick={() => onChange(val)} style={{
        flex: 1, minWidth: 0, appearance: 'none', cursor: 'pointer',
        background: sel ? PRO.brandSolid : '#FFFFFF',
        color: sel ? '#FFFFFF' : PRO.mute,
        border: `1.5px solid ${sel ? PRO.brandSolid : (error ? '#EF4444' : PRO.inputBorder)}`,
        borderRadius: 10, height: 46,
        fontFamily: PRO_FONT, fontWeight: sel ? 700 : 600, fontSize: 14.5,
        letterSpacing: '-0.005em',
        transition: 'all 140ms',
        boxShadow: sel ? '0 2px 8px rgba(34,197,94,0.18)' : 'none',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
             stroke={sel ? '#FFFFFF' : '#94A3B8'}
             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {val === 'M' ? (
            <><circle cx="10" cy="14" r="5" /><path d="M14 10l6-6M15 4h5v5" /></>
          ) : (
            <><circle cx="12" cy="9" r="5" /><path d="M12 14v7M9 19h6" /></>
          )}
        </svg>
        {txt}
      </button>
    )
  }
  return (
    <div>
      <span style={{
        display: 'block', fontSize: 13, fontWeight: 600, color: PRO.ink,
        marginBottom: 6, letterSpacing: '-0.005em',
      }}>{label}</span>
      <div style={{ display: 'flex', gap: 10 }}>
        {opt('M', maleLabel)}
        {opt('F', femaleLabel)}
      </div>
      {error && (
        <span style={{
          display: 'block', marginTop: 4, fontSize: 12, color: '#EF4444', fontWeight: 600,
        }}>{error}</span>
      )}
    </div>
  )
}

function EyeToggle({ on, onToggle, lang }) {
  return (
    <button type="button" onClick={onToggle} style={{
      appearance: 'none', border: 'none', background: 'transparent',
      cursor: 'pointer', padding: 6, color: PRO.mute,
      display: 'flex', alignItems: 'center',
    }} aria-label={on ? t(lang, 'hidePw') : t(lang, 'showPw')}>
      {on ? (
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
  )
}

function ProCheckbox({ checked, onChange, error, children }) {
  return (
    <div>
      <label style={{
        display: 'flex', alignItems: 'flex-start', gap: 10,
        cursor: 'pointer', userSelect: 'none',
      }}>
        <span onClick={() => onChange(!checked)} style={{
          flexShrink: 0, marginTop: 1,
          width: 20, height: 20, borderRadius: 6,
          background: checked ? PRO.brandSolid : '#FFFFFF',
          border: `1.5px solid ${checked ? PRO.brandSolid : (error ? '#EF4444' : PRO.inputBorder)}`,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 120ms',
        }}>
          {checked && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF"
                 strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12l5 5 9-11" />
            </svg>
          )}
        </span>
        <span style={{
          flex: 1, fontFamily: PRO_FONT, fontSize: 13, lineHeight: 1.45,
          color: PRO.ink, fontWeight: 500,
        }} onClick={() => onChange(!checked)}>{children}</span>
        <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)}
               style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }} />
      </label>
      {error && (
        <div style={{ marginLeft: 30, marginTop: 4, fontSize: 12, color: '#EF4444', fontWeight: 600 }}>{error}</div>
      )}
    </div>
  )
}

function ProInlineLink({ children }) {
  return (
    <a href="#" onClick={e => e.preventDefault()} style={{
      color: PRO.brand, textDecoration: 'underline', textUnderlineOffset: 2, fontWeight: 600,
    }}>{children}</a>
  )
}

export default function RegisterScreen({ mode = 'adult', lang, setLang, auth }) {
  const navigate = useNavigate()
  const isTutor = mode === 'tutor'
  const totalSteps = isTutor ? 2 : 1

  const [form, setForm] = useState({
    firstName: '', lastName: '', dob: '', gender: '',
    email: '', password: '', confirm: '',
    terms: false, dataConsent: false,
  })
  const [submitted, setSubmitted] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [showPw2, setShowPw2] = useState(false)
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  const errors = useMemo(() => {
    const e = {}
    if (!form.firstName.trim()) e.firstName = t(lang, 'errRequired')
    if (!form.lastName.trim()) e.lastName = t(lang, 'errRequired')
    if (!form.dob) e.dob = t(lang, 'errRequired')
    if (!form.gender) e.gender = t(lang, 'errGender')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = t(lang, 'errEmail')
    if (form.password.length < 6) e.password = t(lang, 'errPwShort')
    if (form.confirm !== form.password || !form.confirm) e.confirm = t(lang, 'errPwMatch')
    if (!form.terms) e.terms = t(lang, 'errMustAccept')
    if (!form.dataConsent) e.dataConsent = t(lang, 'errMustAccept')
    return e
  }, [form, lang])

  const showErr = (key) => submitted && errors[key]

  async function handleSubmit(e) {
    e && e.preventDefault()
    setSubmitted(true)
    if (Object.keys(errors).length > 0) return
    setLoading(true)
    setServerError('')
    try {
      await auth.signUp({
        email: form.email,
        password: form.password,
        role: isTutor ? 'tutor' : 'adult',
        first_name: form.firstName,
        last_name: form.lastName,
        dob: form.dob,
        gender: form.gender,
      })
      if (isTutor) {
        await auth.signIn({ email: form.email, password: form.password })
        navigate('/register/child')
      } else {
        navigate('/app')
      }
    } catch (err) {
      setServerError(err.message || t(lang, 'registerError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      height: '100%', width: '100%', background: PRO.bg,
      fontFamily: PRO_FONT, color: PRO.ink,
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '18px 20px 0',
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

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 20px 28px' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 18,
        }}>
          <ProLogo size="sm" />
          <StepPill current={1} total={totalSteps} lang={lang} />
        </div>

        <h1 style={{
          margin: '0 0 6px', fontFamily: PRO_FONT, fontWeight: 700,
          fontSize: 26, lineHeight: 1.15, letterSpacing: '-0.025em', color: PRO.ink,
        }}>{isTutor ? t(lang, 'regTutorTitle') : t(lang, 'regAdultTitle')}</h1>
        <p style={{
          margin: '0 0 22px', fontSize: 14.5, lineHeight: 1.45, color: PRO.mute, fontWeight: 500,
        }}>{isTutor ? t(lang, 'regTutorSub') : t(lang, 'regAdultSub')}</p>

        {serverError && (
          <div style={{
            background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: 8,
            padding: '10px 14px', marginBottom: 14,
            fontSize: 13, color: '#DC2626', fontWeight: 600,
          }}>{serverError}</div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <ProField
                label={t(lang, 'firstName')} placeholder={t(lang, 'firstNamePh')}
                value={form.firstName} onChange={v => set('firstName', v)}
                error={showErr('firstName')} autoComplete="given-name"
              />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <ProField
                label={t(lang, 'lastName')} placeholder={t(lang, 'lastNamePh')}
                value={form.lastName} onChange={v => set('lastName', v)}
                error={showErr('lastName')} autoComplete="family-name"
              />
            </div>
          </div>

          <ProField
            label={t(lang, 'dob')} type="date"
            placeholder={t(lang, 'dobHint')}
            value={form.dob} onChange={v => set('dob', v)}
            error={showErr('dob')} autoComplete="bday"
            helper={t(lang, 'dobHint')}
          />

          <GenderToggle
            label={t(lang, 'gender')} value={form.gender}
            onChange={v => set('gender', v)} error={showErr('gender')}
            maleLabel={t(lang, 'male')} femaleLabel={t(lang, 'female')}
          />

          <ProField
            label={t(lang, 'emailLabel')} type="email" autoComplete="email"
            placeholder={t(lang, 'emailPh')}
            value={form.email} onChange={v => set('email', v)}
            error={showErr('email')}
          />

          <ProField
            label={t(lang, 'passwordLabel')}
            type={showPw ? 'text' : 'password'} autoComplete="new-password"
            placeholder={t(lang, 'passwordPh')}
            value={form.password} onChange={v => set('password', v)}
            error={showErr('password')}
            right={<EyeToggle on={showPw} onToggle={() => setShowPw(s => !s)} lang={lang} />}
          />

          <ProField
            label={t(lang, 'confirmPw')}
            type={showPw2 ? 'text' : 'password'} autoComplete="new-password"
            placeholder={t(lang, 'passwordPh')}
            value={form.confirm} onChange={v => set('confirm', v)}
            error={showErr('confirm')}
            right={<EyeToggle on={showPw2} onToggle={() => setShowPw2(s => !s)} lang={lang} />}
          />

          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <ProCheckbox checked={form.terms} onChange={v => set('terms', v)} error={showErr('terms')}>
              {t(lang, 'termsAccept')}{' '}
              <ProInlineLink>{t(lang, 'termsLink')}</ProInlineLink>{' '}
              {t(lang, 'termsAnd')}{' '}
              <ProInlineLink>{t(lang, 'privacyLink')}</ProInlineLink>.
            </ProCheckbox>
            <ProCheckbox checked={form.dataConsent} onChange={v => set('dataConsent', v)} error={showErr('dataConsent')}>
              {t(lang, 'dataConsent')}
            </ProCheckbox>
          </div>

          <button type="submit" disabled={loading} style={{
            appearance: 'none', border: 'none', cursor: 'pointer',
            background: PRO.brandSolid, color: '#FFFFFF',
            fontFamily: PRO_FONT, fontWeight: 700, fontSize: 16,
            height: 50, borderRadius: 12,
            boxShadow: '0 4px 14px rgba(34,197,94,0.28)',
            marginTop: 14, transition: 'all 140ms',
            opacity: loading ? 0.7 : 1,
          }}
          onMouseEnter={e => !loading && (e.currentTarget.style.background = '#16A34A')}
          onMouseLeave={e => (e.currentTarget.style.background = PRO.brandSolid)}>
            {loading ? '...' : (isTutor ? t(lang, 'continueCTA') : t(lang, 'createCTA'))}
          </button>

          <div style={{
            textAlign: 'center', fontSize: 13.5, color: PRO.mute, fontWeight: 500, marginTop: 4,
          }}>
            {t(lang, 'alreadyAccount')}{' '}
            <button type="button" onClick={() => navigate('/login')} style={{
              appearance: 'none', border: 'none', background: 'transparent',
              color: PRO.brand, fontFamily: PRO_FONT, fontWeight: 700, fontSize: 13.5,
              cursor: 'pointer', padding: 0, textDecoration: 'underline', textUnderlineOffset: 3,
            }}>{t(lang, 'logIn')}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
