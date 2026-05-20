import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import ChunkyButton, { COLORS } from '../components/ChunkyButton.jsx'
import LangPill from '../components/LangPill.jsx'
import { Moneda } from '../components/Art.jsx'
import { t } from '../i18n/strings.js'

const KIDS_FONT = "'Fredoka', system-ui, -apple-system, sans-serif"

function KidsField({ label, type = 'text', placeholder, value, onChange, error, helper, autoComplete }) {
  const [focus, setFocus] = useState(false)
  return (
    <label style={{ display: 'block' }}>
      <span style={{
        display: 'block',
        fontFamily: KIDS_FONT, fontWeight: 700, fontSize: 14, color: COLORS.ink,
        marginBottom: 6,
      }}>{label}</span>
      <div style={{
        display: 'flex', alignItems: 'center',
        background: '#FFFFFF',
        border: `3px solid ${error ? COLORS.red : COLORS.ink}`,
        borderRadius: 14,
        boxShadow: error ? `0 4px 0 ${COLORS.red}` : `0 4px 0 ${COLORS.ink}`,
        transform: focus ? 'translateY(-1px)' : 'none',
        transition: 'transform 120ms',
      }}>
        <input
          type={type} placeholder={placeholder} value={value}
          autoComplete={autoComplete}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{
            flex: 1, minWidth: 0, appearance: 'none',
            border: 'none', background: 'transparent', outline: 'none',
            padding: '12px 14px',
            fontFamily: KIDS_FONT, fontSize: 16, fontWeight: 600,
            color: COLORS.ink,
          }}
        />
      </div>
      {error ? (
        <span style={{
          display: 'block', marginTop: 4,
          fontFamily: KIDS_FONT, fontSize: 12.5, color: COLORS.red, fontWeight: 700,
        }}>{error}</span>
      ) : helper ? (
        <span style={{
          display: 'block', marginTop: 4,
          fontFamily: KIDS_FONT, fontSize: 12.5, color: COLORS.ink, opacity: 0.6, fontWeight: 500,
          lineHeight: 1.35,
        }}>{helper}</span>
      ) : null}
    </label>
  )
}

function KidsGenderToggle({ label, value, onChange, error, maleLabel, femaleLabel }) {
  const opt = (val, txt, emoji) => {
    const sel = value === val
    const color = val === 'M' ? COLORS.blue : COLORS.purple
    return (
      <button type="button" key={val} onClick={() => onChange(val)} style={{
        flex: 1, minWidth: 0, appearance: 'none', cursor: 'pointer',
        background: sel ? color : '#FFFFFF',
        color: sel ? '#FFFBEB' : COLORS.ink,
        border: `3px solid ${COLORS.ink}`,
        borderRadius: 14, height: 56,
        fontFamily: KIDS_FONT, fontWeight: 800, fontSize: 16,
        boxShadow: sel ? `0 4px 0 ${COLORS.ink}` : `0 4px 0 rgba(31,17,8,0.5)`,
        transform: sel ? 'translateY(-1px)' : 'none',
        transition: 'transform 120ms, background 140ms',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}>
        <span style={{ fontSize: 22, lineHeight: 1 }}>{emoji}</span>
        {txt}
      </button>
    )
  }
  return (
    <div>
      <span style={{
        display: 'block',
        fontFamily: KIDS_FONT, fontWeight: 700, fontSize: 14, color: COLORS.ink,
        marginBottom: 6,
      }}>{label}</span>
      <div style={{ display: 'flex', gap: 10 }}>
        {opt('M', maleLabel, '👦')}
        {opt('F', femaleLabel, '👧')}
      </div>
      {error && (
        <span style={{
          display: 'block', marginTop: 4,
          fontFamily: KIDS_FONT, fontSize: 12.5, color: COLORS.red, fontWeight: 700,
        }}>{error}</span>
      )}
    </div>
  )
}

function KidsStepPill({ lang }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: '#FFFBEB', color: COLORS.ink,
      border: `2px solid ${COLORS.ink}`, borderRadius: 999,
      padding: '4px 10px',
      fontFamily: KIDS_FONT, fontWeight: 800, fontSize: 12,
      letterSpacing: '0.02em', whiteSpace: 'nowrap',
      boxShadow: `0 2px 0 ${COLORS.ink}`,
    }}>
      <span style={{ display: 'inline-flex', gap: 3 }}>
        <span style={{ width: 7, height: 7, borderRadius: 999, background: COLORS.green, border: `1.5px solid ${COLORS.ink}` }} />
        <span style={{ width: 7, height: 7, borderRadius: 999, background: COLORS.green, border: `1.5px solid ${COLORS.ink}` }} />
      </span>
      {t(lang, 'step2of2')}
    </div>
  )
}

function ChildHeader({ lang, setLang, onBack }) {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        background: COLORS.red, padding: '14px 18px 30px',
        borderBottomLeftRadius: 28, borderBottomRightRadius: 28,
        boxShadow: 'inset 0 -6px 0 rgba(0,0,0,0.12)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <button onClick={onBack} aria-label="back" style={{
            appearance: 'none', cursor: 'pointer',
            background: 'rgba(0,0,0,0.18)', color: '#FFFBEB',
            border: `2px solid ${COLORS.ink}`, borderRadius: 999,
            width: 36, height: 36, flexShrink: 0,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
          <KidsStepPill lang={lang} />
          <LangPill lang={lang} onChange={setLang} />
        </div>

        <div style={{ paddingRight: 76 }}>
          <h1 style={{
            margin: 0, color: '#FFFBEB',
            fontFamily: KIDS_FONT, fontWeight: 800,
            fontSize: 24, lineHeight: 1.05, letterSpacing: '-0.02em',
            textShadow: `3px 3px 0 ${COLORS.ink}`,
          }}>{t(lang, 'whoLearns')}</h1>
          <div style={{
            color: '#FFFBEB', opacity: 0.95,
            fontFamily: KIDS_FONT, fontWeight: 600, fontSize: 13.5,
            marginTop: 6, lineHeight: 1.35,
          }}>{t(lang, 'whoLearnsSub')}</div>
        </div>

        <div style={{
          position: 'absolute', right: 10, bottom: -14, zIndex: 2,
          pointerEvents: 'none',
          filter: 'drop-shadow(0 3px 4px rgba(0,0,0,0.18))',
        }}>
          <Moneda size={70} mood="cheer" wave />
        </div>
      </div>

      <svg viewBox="0 0 375 30" width="100%" height="14"
           style={{ position: 'absolute', top: 0, left: 0, opacity: 0.18, pointerEvents: 'none' }}>
        <circle cx="60" cy="14" r="10" fill="#FFFBEB" />
        <circle cx="78" cy="10" r="14" fill="#FFFBEB" />
        <circle cx="200" cy="16" r="8" fill="#FFFBEB" />
        <circle cx="218" cy="12" r="12" fill="#FFFBEB" />
      </svg>
    </div>
  )
}

export default function RegisterChildScreen({ lang, setLang, auth }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ firstName: '', lastName: '', dob: '', gender: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  const errors = useMemo(() => {
    const e = {}
    if (!form.firstName.trim()) e.firstName = t(lang, 'errRequired')
    if (!form.lastName.trim()) e.lastName = t(lang, 'errRequired')
    if (!form.dob) e.dob = t(lang, 'errRequired')
    if (!form.gender) e.gender = t(lang, 'errGender')
    return e
  }, [form, lang])

  const showErr = (k) => submitted && errors[k]

  async function submit(e) {
    e && e.preventDefault()
    setSubmitted(true)
    if (Object.keys(errors).length > 0) return
    setLoading(true)
    setServerError('')
    try {
      let { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        await new Promise(r => setTimeout(r, 1000))
        const retry = await supabase.auth.getSession()
        session = retry.data.session
      }
      if (!session) throw new Error(t(lang, 'errRequired'))
      await auth.addChild({
        first_name: form.firstName,
        last_name: form.lastName,
        dob: form.dob,
        gender: form.gender,
      })
      navigate('/app')
    } catch (err) {
      setServerError(err.message || t(lang, 'registerError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      height: '100%', width: '100%', display: 'flex', flexDirection: 'column',
      background: COLORS.bg, fontFamily: KIDS_FONT, color: COLORS.ink,
    }}>
      <ChildHeader lang={lang} setLang={setLang} onBack={() => navigate('/register/tutor')} />

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 18px 28px' }}>
        {serverError && (
          <div style={{
            background: '#FEE2E2', border: `2px solid ${COLORS.red}`, borderRadius: 12,
            padding: '10px 14px', marginBottom: 14,
            fontFamily: KIDS_FONT, fontSize: 13, color: COLORS.red, fontWeight: 700,
          }}>{serverError}</div>
        )}

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <KidsField
                label={t(lang, 'firstName')} placeholder={t(lang, 'childFirstNamePh')}
                value={form.firstName} onChange={v => set('firstName', v)}
                error={showErr('firstName')} autoComplete="given-name"
              />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <KidsField
                label={t(lang, 'lastName')} placeholder={t(lang, 'childLastNamePh')}
                value={form.lastName} onChange={v => set('lastName', v)}
                error={showErr('lastName')} autoComplete="family-name"
              />
            </div>
          </div>

          <KidsField
            label={t(lang, 'dob')} type="date" placeholder={t(lang, 'dobHint')}
            value={form.dob} onChange={v => set('dob', v)}
            error={showErr('dob')} helper={t(lang, 'dobAgeNote')}
          />

          <KidsGenderToggle
            label={t(lang, 'gender')} value={form.gender} onChange={v => set('gender', v)}
            error={showErr('gender')} maleLabel={t(lang, 'male')} femaleLabel={t(lang, 'female')}
          />

          <div style={{
            background: '#FFFFFF', border: `2px dashed ${COLORS.ink}`,
            borderRadius: 14, padding: '12px 14px',
            display: 'flex', gap: 10, alignItems: 'flex-start', marginTop: 4,
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={COLORS.ink}
                 strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                 style={{ flexShrink: 0, marginTop: 1 }}>
              <path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            <span style={{
              fontFamily: KIDS_FONT, fontWeight: 500, fontSize: 13.5,
              lineHeight: 1.4, color: COLORS.ink, opacity: 0.78,
            }}>{t(lang, 'childPrivacy')}</span>
          </div>

          <ChunkyButton color={COLORS.green} fullWidth
                        style={{ color: '#FFFBEB', marginTop: 8, fontSize: 22 }}
                        onClick={submit}>
            {loading ? '...' : `🎉  ${t(lang, 'letsStart')}`}
          </ChunkyButton>

          <button type="button" onClick={() => navigate('/app')} style={{
            appearance: 'none', border: 'none', background: 'transparent',
            cursor: 'pointer', padding: 0,
            color: COLORS.purple, fontFamily: KIDS_FONT, fontWeight: 700, fontSize: 15,
            textAlign: 'center', alignSelf: 'center', marginTop: 2,
          }}>{t(lang, 'addAnother')}</button>
        </form>
      </div>
    </div>
  )
}
