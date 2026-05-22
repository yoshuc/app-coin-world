import { useState, useEffect, useMemo } from 'react'
import ScreenHeader from '../components/ScreenHeader.jsx'
import ChunkyButton, { COLORS } from '../components/ChunkyButton.jsx'
import { Building, Moneda } from '../components/Art.jsx'
import { BUILDINGS } from '../constants/buildings.js'
import { t } from '../i18n/strings.js'
import { supabase } from '../lib/supabase.js'

const KIDS_FONT = "'Fredoka', system-ui, sans-serif"

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
    if (userEmail) supabase.auth.resend({ type: 'signup', email: userEmail })
  }

  return (
    <div style={{
      background: '#FEF9C3', borderBottom: '2px solid #EAB308',
      padding: '10px 16px', display: 'flex', alignItems: 'center',
      gap: 10, fontFamily: KIDS_FONT, fontSize: 14, color: '#1F1108', flexWrap: 'wrap',
    }}>
      <span style={{ flex: 1 }}>{t(lang, 'confirmEmailBanner')}</span>
      <button onClick={resend} style={{
        appearance: 'none', border: 'none', background: 'transparent',
        color: '#D97706', fontFamily: KIDS_FONT, fontWeight: 700, fontSize: 14,
        cursor: 'pointer', padding: 0, textDecoration: 'underline',
      }}>{t(lang, 'resendEmail')}</button>
      <button onClick={() => setDismissed(true)} aria-label="dismiss" style={{
        appearance: 'none', border: 'none', background: 'transparent',
        cursor: 'pointer', padding: 4, color: '#92400E', display: 'flex', alignItems: 'center',
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

function ChildSwitcher({ allChildren, activeChild, switchChild, lang, onAddChild }) {
  return (
    <div style={{
      padding: '8px 16px 0',
      display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
    }}>
      {allChildren.map(c => {
        const active = c.id === activeChild?.id
        return (
          <button key={c.id} onClick={() => switchChild(c.id)} style={{
            appearance: 'none', cursor: 'pointer',
            background: active ? COLORS.red : '#FFFFFF',
            color: active ? '#FFFBEB' : COLORS.ink,
            border: `2.5px solid ${COLORS.ink}`,
            borderRadius: 999, padding: '4px 12px',
            fontFamily: KIDS_FONT, fontWeight: active ? 800 : 600, fontSize: 14,
            boxShadow: active ? `0 3px 0 ${COLORS.ink}` : `0 2px 0 rgba(31,17,8,0.35)`,
            transform: active ? 'translateY(-1px)' : 'none',
            transition: 'all 120ms',
          }}>
            {c.first_name}
          </button>
        )
      })}
      <button onClick={onAddChild} style={{
        appearance: 'none', cursor: 'pointer',
        background: COLORS.yellow,
        color: COLORS.ink,
        border: `2.5px solid ${COLORS.ink}`,
        borderRadius: 999, padding: '4px 10px',
        fontFamily: KIDS_FONT, fontWeight: 700, fontSize: 14,
        boxShadow: `0 2px 0 rgba(31,17,8,0.35)`,
        display: 'inline-flex', alignItems: 'center', gap: 4,
      }}>
        <span style={{ fontSize: 16, lineHeight: 1 }}>+</span>
        {lang === 'es' ? 'Añadir' : 'Add'}
      </button>
    </div>
  )
}

function AddChildModal({ lang, onAdd, onClose }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', dob: '', gender: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  const errors = useMemo(() => {
    const e = {}
    if (!form.firstName.trim()) e.firstName = lang === 'es' ? 'Requerido' : 'Required'
    if (!form.lastName.trim()) e.lastName = lang === 'es' ? 'Requerido' : 'Required'
    if (!form.dob) e.dob = lang === 'es' ? 'Requerido' : 'Required'
    if (!form.gender) e.gender = lang === 'es' ? 'Selecciona una opción' : 'Select an option'
    return e
  }, [form, lang])

  async function submit(e) {
    e?.preventDefault()
    setSubmitted(true)
    if (Object.keys(errors).length > 0) return
    setLoading(true)
    setError('')
    try {
      await onAdd({
        first_name: form.firstName,
        last_name: form.lastName,
        dob: form.dob,
        gender: form.gender,
      })
      onClose()
    } catch (err) {
      setError(err.message || (lang === 'es' ? 'Algo salió mal.' : 'Something went wrong.'))
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = (hasErr) => ({
    width: '100%', appearance: 'none', outline: 'none',
    border: `3px solid ${hasErr ? COLORS.red : COLORS.ink}`,
    borderRadius: 14, padding: '11px 14px',
    fontFamily: KIDS_FONT, fontSize: 16, fontWeight: 600, color: COLORS.ink,
    background: '#FFFFFF',
    boxShadow: hasErr ? `0 3px 0 ${COLORS.red}` : `0 3px 0 ${COLORS.ink}`,
    boxSizing: 'border-box',
  })

  const label = (txt) => (
    <span style={{ display: 'block', fontFamily: KIDS_FONT, fontWeight: 700, fontSize: 14, color: COLORS.ink, marginBottom: 5 }}>
      {txt}
    </span>
  )

  const errMsg = (key) => submitted && errors[key]
    ? <span style={{ display: 'block', marginTop: 3, fontFamily: KIDS_FONT, fontSize: 12, color: COLORS.red, fontWeight: 700 }}>{errors[key]}</span>
    : null

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 40,
        background: 'rgba(31,17,8,0.55)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
    >
      <div style={{
        width: '100%', maxWidth: 430,
        background: '#FFFBEB',
        borderTopLeftRadius: 28, borderTopRightRadius: 28,
        border: `3px solid ${COLORS.ink}`, borderBottom: 'none',
        boxShadow: '0 -6px 0 rgba(0,0,0,0.12)',
        padding: '20px 18px 36px',
        maxHeight: '90dvh', overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <Moneda size={56} mood="cheer" wave />
          <div>
            <div style={{ fontFamily: KIDS_FONT, fontWeight: 800, fontSize: 22, color: COLORS.ink, lineHeight: 1.1 }}>
              {lang === 'es' ? '¿Quién más aprende?' : 'Who else is learning?'}
            </div>
            <div style={{ fontFamily: KIDS_FONT, fontWeight: 600, fontSize: 13, color: COLORS.ink, opacity: 0.65, marginTop: 2 }}>
              {lang === 'es' ? 'Agrega otro niño o niña' : 'Add another child'}
            </div>
          </div>
          <button onClick={onClose} aria-label="close" style={{
            marginLeft: 'auto', appearance: 'none', border: 'none',
            background: 'rgba(0,0,0,0.08)', borderRadius: 999,
            width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: COLORS.ink, flexShrink: 0,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div style={{
            background: '#FEE2E2', border: `2px solid ${COLORS.red}`, borderRadius: 12,
            padding: '9px 12px', marginBottom: 12,
            fontFamily: KIDS_FONT, fontSize: 13, color: COLORS.red, fontWeight: 700,
          }}>{error}</div>
        )}

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              {label(lang === 'es' ? 'Nombre' : 'First name')}
              <input
                value={form.firstName} onChange={e => set('firstName', e.target.value)}
                placeholder={lang === 'es' ? 'Lucía' : 'Lucy'}
                autoComplete="given-name"
                style={inputStyle(submitted && errors.firstName)}
              />
              {errMsg('firstName')}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              {label(lang === 'es' ? 'Apellido' : 'Last name')}
              <input
                value={form.lastName} onChange={e => set('lastName', e.target.value)}
                placeholder={lang === 'es' ? 'García' : 'Garcia'}
                autoComplete="family-name"
                style={inputStyle(submitted && errors.lastName)}
              />
              {errMsg('lastName')}
            </div>
          </div>

          <div>
            {label(lang === 'es' ? 'Fecha de nacimiento' : 'Date of birth')}
            <input
              type="date" value={form.dob} onChange={e => set('dob', e.target.value)}
              style={inputStyle(submitted && errors.dob)}
            />
            {errMsg('dob')}
          </div>

          <div>
            {label(lang === 'es' ? 'Género' : 'Gender')}
            <div style={{ display: 'flex', gap: 10 }}>
              {[['M', '👦', lang === 'es' ? 'Niño' : 'Boy'], ['F', '👧', lang === 'es' ? 'Niña' : 'Girl']].map(([val, emoji, txt]) => {
                const sel = form.gender === val
                const color = val === 'M' ? COLORS.blue : COLORS.purple
                return (
                  <button key={val} type="button" onClick={() => set('gender', val)} style={{
                    flex: 1, appearance: 'none', cursor: 'pointer',
                    background: sel ? color : '#FFFFFF',
                    color: sel ? '#FFFBEB' : COLORS.ink,
                    border: `3px solid ${submitted && errors.gender ? COLORS.red : COLORS.ink}`,
                    borderRadius: 14, height: 52,
                    fontFamily: KIDS_FONT, fontWeight: 800, fontSize: 16,
                    boxShadow: sel ? `0 4px 0 ${COLORS.ink}` : `0 3px 0 rgba(31,17,8,0.4)`,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}>
                    <span style={{ fontSize: 20 }}>{emoji}</span>{txt}
                  </button>
                )
              })}
            </div>
            {errMsg('gender')}
          </div>

          <ChunkyButton color={COLORS.green} fullWidth
                        style={{ color: '#FFFBEB', marginTop: 4, fontSize: 20 }}
                        onClick={submit}>
            {loading ? '...' : `🎉  ${lang === 'es' ? '¡Agregar!' : 'Add child!'}`}
          </ChunkyButton>
        </form>
      </div>
    </div>
  )
}

export default function HomeScreen({ lang, setLang, points, unlocked, goMarket, goLearn, todayEarned, allChildren = [], activeChild, switchChild, addChild }) {
  const [showAddChild, setShowAddChild] = useState(false)
  const unlockedCount = unlocked.length
  const total = BUILDINGS.length
  const multiChild = allChildren.length > 1

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <EmailBanner lang={lang} />

      {multiChild && (
        <ChildSwitcher
          allChildren={allChildren}
          activeChild={activeChild}
          switchChild={switchChild}
          lang={lang}
          onAddChild={() => setShowAddChild(true)}
        />
      )}

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
              fontFamily: KIDS_FONT, fontWeight: 700, fontSize: 13,
              color: COLORS.ink, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>{t(lang, 'todayEarned')}</div>
            <div style={{
              fontFamily: KIDS_FONT, fontWeight: 800, fontSize: 28, lineHeight: 1.05,
              color: COLORS.ink, letterSpacing: '-0.02em',
            }}>+{todayEarned} {t(lang, 'points')}</div>
          </div>
          {!multiChild && addChild && (
            <button onClick={() => setShowAddChild(true)} style={{
              appearance: 'none', cursor: 'pointer', flexShrink: 0,
              background: COLORS.yellow, color: COLORS.ink,
              border: `2.5px solid ${COLORS.ink}`, borderRadius: 12,
              padding: '6px 10px', fontFamily: KIDS_FONT, fontWeight: 700, fontSize: 13,
              boxShadow: `0 2px 0 ${COLORS.ink}`,
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <span style={{ fontSize: 18 }}>👨‍👩‍👧‍👦</span>
              {lang === 'es' ? '+Niño' : '+Child'}
            </button>
          )}
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
                  fontFamily: KIDS_FONT, fontWeight: 700, fontSize: 13,
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
          borderRadius: 16, padding: '12px', fontFamily: KIDS_FONT, fontWeight: 700, fontSize: 16,
        }}>
          📚  {lang === 'es' ? '¡Aprende y gana monedas!' : 'Learn & earn coins!'}
        </button>
      </div>

      {showAddChild && (
        <AddChildModal
          lang={lang}
          onAdd={addChild}
          onClose={() => setShowAddChild(false)}
        />
      )}
    </div>
  )
}
