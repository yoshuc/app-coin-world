import { useState, useMemo } from 'react'
import { PRO, PRO_FONT } from '../components/ProLogo.jsx'
import ProField from '../components/ProField.jsx'
import { supabase } from '../lib/supabase.js'
import { t } from '../i18n/strings.js'
import { COLORS } from '../components/ChunkyButton.jsx'

const KIDS_FONT = "'Fredoka', system-ui, sans-serif"

function Section({ title, children }) {
  return (
    <div style={{
      background: PRO.card, borderRadius: 16,
      border: `1px solid ${PRO.border}`,
      boxShadow: '0 1px 3px rgba(15,23,42,0.05)',
      overflow: 'hidden', marginBottom: 14,
    }}>
      <div style={{
        padding: '12px 18px', borderBottom: `1px solid ${PRO.border}`,
        fontFamily: PRO_FONT, fontWeight: 700, fontSize: 12,
        letterSpacing: '0.08em', textTransform: 'uppercase',
        color: PRO.mute,
      }}>{title}</div>
      <div style={{ padding: '14px 18px' }}>{children}</div>
    </div>
  )
}

function StatusChip({ ok, lang }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: ok ? '#DCFCE7' : '#FEF9C3',
      color: ok ? '#166534' : '#854D0E',
      border: `1px solid ${ok ? '#BBF7D0' : '#FDE68A'}`,
      borderRadius: 999, padding: '3px 10px',
      fontFamily: PRO_FONT, fontWeight: 700, fontSize: 12,
    }}>
      {ok ? '✓' : '⚠'} {ok
        ? (lang === 'es' ? 'Correo verificado' : 'Email verified')
        : (lang === 'es' ? 'Sin verificar' : 'Not verified')}
    </span>
  )
}

function ChildRow({ child, lang, onUpdated }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    firstName: child.first_name,
    lastName: child.last_name,
    dob: child.dob,
    gender: child.gender,
  })
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function save() {
    setSaving(true)
    setErr('')
    const { error } = await supabase.from('children')
      .update({
        first_name: form.firstName,
        last_name: form.lastName,
        dob: form.dob,
        gender: form.gender,
      })
      .eq('id', child.id)
    setSaving(false)
    if (error) { setErr(error.message); return }
    onUpdated({ ...child, first_name: form.firstName, last_name: form.lastName, dob: form.dob, gender: form.gender })
    setEditing(false)
  }

  if (!editing) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 0', borderBottom: `1px solid ${PRO.border}`,
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: 999,
          background: child.gender === 'M' ? '#DBEAFE' : '#FAE8FF',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, flexShrink: 0,
        }}>
          {child.gender === 'M' ? '👦' : '👧'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: PRO_FONT, fontWeight: 700, fontSize: 15, color: PRO.ink }}>
            {child.first_name} {child.last_name}
          </div>
          <div style={{ fontFamily: PRO_FONT, fontWeight: 500, fontSize: 12, color: PRO.mute }}>
            {child.dob ? new Date(child.dob).toLocaleDateString() : '—'} · {child.points || 0} {lang === 'es' ? 'pts' : 'pts'}
          </div>
        </div>
        <button onClick={() => setEditing(true)} style={{
          appearance: 'none', border: `1.5px solid ${PRO.brand}`, cursor: 'pointer',
          background: '#FFFFFF', color: PRO.brand, borderRadius: 8,
          padding: '5px 12px', fontFamily: PRO_FONT, fontWeight: 700, fontSize: 13,
        }}>
          {lang === 'es' ? 'Editar' : 'Edit'}
        </button>
      </div>
    )
  }

  return (
    <div style={{ padding: '12px 0', borderBottom: `1px solid ${PRO.border}` }}>
      {err && (
        <div style={{ background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: 8, padding: '8px 12px', marginBottom: 10, fontSize: 13, color: '#DC2626', fontWeight: 600 }}>{err}</div>
      )}
      <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <ProField label={lang === 'es' ? 'Nombre' : 'First name'} value={form.firstName} onChange={v => set('firstName', v)} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <ProField label={lang === 'es' ? 'Apellido' : 'Last name'} value={form.lastName} onChange={v => set('lastName', v)} />
        </div>
      </div>
      <ProField label={lang === 'es' ? 'Fecha de nacimiento' : 'Date of birth'} type="date" value={form.dob} onChange={v => set('dob', v)} />
      <div style={{ marginTop: 10 }}>
        <div style={{ fontFamily: PRO_FONT, fontWeight: 600, fontSize: 13, color: PRO.ink, marginBottom: 6 }}>
          {lang === 'es' ? 'Género' : 'Gender'}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[['M', lang === 'es' ? 'Masculino' : 'Male'], ['F', lang === 'es' ? 'Femenino' : 'Female']].map(([val, label]) => (
            <button key={val} type="button" onClick={() => set('gender', val)} style={{
              flex: 1, appearance: 'none', cursor: 'pointer', height: 40,
              background: form.gender === val ? PRO.brandSolid : '#FFFFFF',
              color: form.gender === val ? '#FFFFFF' : PRO.mute,
              border: `1.5px solid ${form.gender === val ? PRO.brandSolid : PRO.inputBorder}`,
              borderRadius: 8, fontFamily: PRO_FONT, fontWeight: 700, fontSize: 14,
              transition: 'all 120ms',
            }}>{label}</button>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button onClick={save} disabled={saving} style={{
          flex: 1, appearance: 'none', cursor: 'pointer', height: 40, borderRadius: 10,
          background: PRO.brandSolid, color: '#FFFFFF', border: 'none',
          fontFamily: PRO_FONT, fontWeight: 700, fontSize: 14,
          opacity: saving ? 0.7 : 1,
        }}>
          {saving ? '...' : (lang === 'es' ? 'Guardar' : 'Save')}
        </button>
        <button onClick={() => setEditing(false)} style={{
          flex: 1, appearance: 'none', cursor: 'pointer', height: 40, borderRadius: 10,
          background: '#FFFFFF', color: PRO.mute,
          border: `1.5px solid ${PRO.border}`,
          fontFamily: PRO_FONT, fontWeight: 600, fontSize: 14,
        }}>
          {lang === 'es' ? 'Cancelar' : 'Cancel'}
        </button>
      </div>
    </div>
  )
}

function AddChildForm({ lang, tutorId, onAdded, onCancel }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', dob: '', gender: '' })
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  const errors = useMemo(() => {
    const e = {}
    if (!form.firstName.trim()) e.firstName = lang === 'es' ? 'Requerido' : 'Required'
    if (!form.lastName.trim()) e.lastName = lang === 'es' ? 'Requerido' : 'Required'
    if (!form.dob) e.dob = lang === 'es' ? 'Requerido' : 'Required'
    if (!form.gender) e.gender = lang === 'es' ? 'Requerido' : 'Required'
    return e
  }, [form, lang])

  async function submit() {
    setSubmitted(true)
    if (Object.keys(errors).length > 0) return
    setSaving(true)
    setErr('')
    const { data, error } = await supabase.from('children').insert({
      tutor_id: tutorId,
      first_name: form.firstName,
      last_name: form.lastName,
      dob: form.dob,
      gender: form.gender,
      points: 0,
    }).select().single()
    setSaving(false)
    if (error) { setErr(error.message); return }
    onAdded(data)
  }

  return (
    <div style={{ padding: '12px 0', borderTop: `1px solid ${PRO.border}` }}>
      {err && (
        <div style={{ background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: 8, padding: '8px 12px', marginBottom: 10, fontSize: 13, color: '#DC2626', fontWeight: 600 }}>{err}</div>
      )}
      <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <ProField label={lang === 'es' ? 'Nombre' : 'First name'}
            placeholder={lang === 'es' ? 'Lucía' : 'Lucy'}
            value={form.firstName} onChange={v => set('firstName', v)}
            error={submitted && errors.firstName} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <ProField label={lang === 'es' ? 'Apellido' : 'Last name'}
            placeholder={lang === 'es' ? 'García' : 'Garcia'}
            value={form.lastName} onChange={v => set('lastName', v)}
            error={submitted && errors.lastName} />
        </div>
      </div>
      <ProField label={lang === 'es' ? 'Fecha de nacimiento' : 'Date of birth'}
        type="date" value={form.dob} onChange={v => set('dob', v)}
        error={submitted && errors.dob} />
      <div style={{ marginTop: 10 }}>
        <div style={{ fontFamily: PRO_FONT, fontWeight: 600, fontSize: 13, color: PRO.ink, marginBottom: 6 }}>
          {lang === 'es' ? 'Género' : 'Gender'}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[['M', lang === 'es' ? 'Masculino' : 'Male'], ['F', lang === 'es' ? 'Femenino' : 'Female']].map(([val, lbl]) => (
            <button key={val} type="button" onClick={() => set('gender', val)} style={{
              flex: 1, appearance: 'none', cursor: 'pointer', height: 40,
              background: form.gender === val ? PRO.brandSolid : '#FFFFFF',
              color: form.gender === val ? '#FFFFFF' : PRO.mute,
              border: `1.5px solid ${form.gender === val ? PRO.brandSolid : (submitted && errors.gender ? '#EF4444' : PRO.inputBorder)}`,
              borderRadius: 8, fontFamily: PRO_FONT, fontWeight: 700, fontSize: 14,
              transition: 'all 120ms',
            }}>{lbl}</button>
          ))}
        </div>
        {submitted && errors.gender && (
          <div style={{ marginTop: 4, fontSize: 12, color: '#EF4444', fontWeight: 600 }}>{errors.gender}</div>
        )}
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button onClick={submit} disabled={saving} style={{
          flex: 1, appearance: 'none', cursor: 'pointer', height: 40, borderRadius: 10,
          background: PRO.brandSolid, color: '#FFFFFF', border: 'none',
          fontFamily: PRO_FONT, fontWeight: 700, fontSize: 14,
          opacity: saving ? 0.7 : 1,
        }}>
          {saving ? '...' : (lang === 'es' ? '+ Agregar' : '+ Add child')}
        </button>
        <button onClick={onCancel} style={{
          flex: 1, appearance: 'none', cursor: 'pointer', height: 40, borderRadius: 10,
          background: '#FFFFFF', color: PRO.mute, border: `1.5px solid ${PRO.border}`,
          fontFamily: PRO_FONT, fontWeight: 600, fontSize: 14,
        }}>
          {lang === 'es' ? 'Cancelar' : 'Cancel'}
        </button>
      </div>
    </div>
  )
}

export default function ProfileScreen({ lang, auth, onClose }) {
  const { profile, user, allChildren } = auth
  const [children, setChildren] = useState(allChildren || [])
  const [editingProfile, setEditingProfile] = useState(false)
  const [profileForm, setProfileForm] = useState({
    firstName: profile?.first_name || '',
    lastName: profile?.last_name || '',
  })
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileErr, setProfileErr] = useState('')
  const [resendStatus, setResendStatus] = useState('')
  const [showAddChild, setShowAddChild] = useState(false)
  const [confirmSignOut, setConfirmSignOut] = useState(false)

  const emailVerified = !!user?.email_confirmed_at

  function setProfileField(k, v) { setProfileForm(f => ({ ...f, [k]: v })) }

  async function saveProfile() {
    setSavingProfile(true)
    setProfileErr('')
    const { error } = await supabase.from('users')
      .update({ first_name: profileForm.firstName, last_name: profileForm.lastName })
      .eq('id', user.id)
    setSavingProfile(false)
    if (error) { setProfileErr(error.message); return }
    setEditingProfile(false)
  }

  async function resendVerification() {
    setResendStatus('...')
    const { error } = await supabase.auth.resend({ type: 'signup', email: user.email })
    setResendStatus(error
      ? (error.message || (lang === 'es' ? 'Error al enviar.' : 'Failed to send.'))
      : (lang === 'es' ? '¡Correo enviado! Revisa tu bandeja.' : 'Email sent! Check your inbox.'))
  }

  async function handleSignOut() {
    await auth.signOut()
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 40,
      background: PRO.bg, display: 'flex', flexDirection: 'column',
      fontFamily: PRO_FONT, color: PRO.ink,
      maxWidth: 430, margin: '0 auto',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '20px 20px 14px',
        borderBottom: `1px solid ${PRO.border}`,
        background: PRO.card,
      }}>
        <button onClick={onClose} style={{
          appearance: 'none', border: 'none', background: 'transparent',
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
          color: PRO.mute, fontFamily: PRO_FONT, fontWeight: 600, fontSize: 14, padding: 0,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 6l-6 6 6 6" />
          </svg>
          {lang === 'es' ? 'Volver' : 'Back'}
        </button>
        <div style={{ flex: 1, fontFamily: PRO_FONT, fontWeight: 700, fontSize: 18, color: PRO.ink, textAlign: 'center' }}>
          {lang === 'es' ? 'Mi perfil' : 'My profile'}
        </div>
        <div style={{ width: 56 }} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 40px' }}>

        {/* Section 1 — Tutor info */}
        <Section title={lang === 'es' ? 'Información de la cuenta' : 'Account information'}>
          {!editingProfile ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontFamily: PRO_FONT, fontWeight: 700, fontSize: 18, color: PRO.ink }}>
                    {profile?.first_name} {profile?.last_name}
                  </div>
                  <div style={{ fontFamily: PRO_FONT, fontWeight: 500, fontSize: 14, color: PRO.mute, marginTop: 2 }}>
                    {user?.email}
                  </div>
                </div>
                <button onClick={() => setEditingProfile(true)} style={{
                  appearance: 'none', border: `1.5px solid ${PRO.brand}`, cursor: 'pointer',
                  background: '#FFFFFF', color: PRO.brand, borderRadius: 8,
                  padding: '6px 14px', fontFamily: PRO_FONT, fontWeight: 700, fontSize: 13,
                }}>
                  {lang === 'es' ? 'Editar' : 'Edit'}
                </button>
              </div>
            </>
          ) : (
            <>
              {profileErr && (
                <div style={{ background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: 8, padding: '8px 12px', marginBottom: 12, fontSize: 13, color: '#DC2626', fontWeight: 600 }}>{profileErr}</div>
              )}
              <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <ProField label={lang === 'es' ? 'Nombre' : 'First name'} value={profileForm.firstName} onChange={v => setProfileField('firstName', v)} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <ProField label={lang === 'es' ? 'Apellido' : 'Last name'} value={profileForm.lastName} onChange={v => setProfileField('lastName', v)} />
                </div>
              </div>
              <ProField label={lang === 'es' ? 'Correo (no editable)' : 'Email (read-only)'} value={user?.email || ''} onChange={() => {}} />
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button onClick={saveProfile} disabled={savingProfile} style={{
                  flex: 1, appearance: 'none', cursor: 'pointer', height: 42, borderRadius: 10,
                  background: PRO.brandSolid, color: '#FFFFFF', border: 'none',
                  fontFamily: PRO_FONT, fontWeight: 700, fontSize: 14, opacity: savingProfile ? 0.7 : 1,
                }}>
                  {savingProfile ? '...' : (lang === 'es' ? 'Guardar' : 'Save changes')}
                </button>
                <button onClick={() => setEditingProfile(false)} style={{
                  flex: 1, appearance: 'none', cursor: 'pointer', height: 42, borderRadius: 10,
                  background: '#FFFFFF', color: PRO.mute, border: `1.5px solid ${PRO.border}`,
                  fontFamily: PRO_FONT, fontWeight: 600, fontSize: 14,
                }}>
                  {lang === 'es' ? 'Cancelar' : 'Cancel'}
                </button>
              </div>
            </>
          )}
        </Section>

        {/* Section 2 — Email verification */}
        <Section title={lang === 'es' ? 'Verificación de correo' : 'Email verification'}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <StatusChip ok={emailVerified} lang={lang} />
            {!emailVerified && (
              <button onClick={resendVerification} style={{
                appearance: 'none', border: 'none', background: 'transparent',
                color: PRO.brand, fontFamily: PRO_FONT, fontWeight: 600, fontSize: 13,
                cursor: 'pointer', padding: 0, textDecoration: 'underline', textUnderlineOffset: 3,
              }}>
                {lang === 'es' ? 'Reenviar correo de verificación' : 'Resend verification email'}
              </button>
            )}
          </div>
          {resendStatus && (
            <div style={{
              marginTop: 8, fontSize: 13, fontWeight: 600,
              color: resendStatus === '...' ? PRO.mute
                : resendStatus.includes('sent') || resendStatus.includes('enviado') ? '#166534'
                : '#DC2626',
            }}>{resendStatus}</div>
          )}
        </Section>

        {/* Section 3 — Children */}
        <Section title={lang === 'es' ? 'Niños registrados' : 'Registered children'}>
          {children.length === 0 && (
            <div style={{ fontFamily: PRO_FONT, fontWeight: 500, fontSize: 14, color: PRO.mute, marginBottom: 12 }}>
              {lang === 'es' ? 'Aún no hay niños registrados.' : 'No children registered yet.'}
            </div>
          )}
          {children.map(c => (
            <ChildRow key={c.id} child={c} lang={lang}
              onUpdated={updated => setChildren(prev => prev.map(ch => ch.id === updated.id ? updated : ch))} />
          ))}
          {!showAddChild ? (
            <button onClick={() => setShowAddChild(true)} style={{
              marginTop: 12, width: '100%', appearance: 'none', cursor: 'pointer', height: 44,
              background: PRO.brandSoft, color: PRO.brand,
              border: `1.5px solid ${PRO.brand}`, borderRadius: 10,
              fontFamily: PRO_FONT, fontWeight: 700, fontSize: 14,
            }}>
              + {lang === 'es' ? 'Agregar niño/a' : 'Add child'}
            </button>
          ) : (
            <AddChildForm
              lang={lang} tutorId={user?.id}
              onAdded={child => { setChildren(prev => [...prev, child]); setShowAddChild(false) }}
              onCancel={() => setShowAddChild(false)}
            />
          )}
        </Section>

        {/* Section 4 — Sign out */}
        <Section title={lang === 'es' ? 'Sesión' : 'Session'}>
          {!confirmSignOut ? (
            <button onClick={() => setConfirmSignOut(true)} style={{
              width: '100%', appearance: 'none', cursor: 'pointer', height: 46, borderRadius: 10,
              background: '#FEF2F2', color: '#DC2626',
              border: '1.5px solid #FECACA',
              fontFamily: PRO_FONT, fontWeight: 700, fontSize: 15,
            }}>
              {lang === 'es' ? 'Cerrar sesión' : 'Sign out'}
            </button>
          ) : (
            <div>
              <div style={{ fontFamily: PRO_FONT, fontWeight: 600, fontSize: 14, color: PRO.ink, marginBottom: 12 }}>
                {lang === 'es' ? '¿Seguro que quieres cerrar sesión?' : 'Are you sure you want to sign out?'}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={handleSignOut} style={{
                  flex: 1, appearance: 'none', cursor: 'pointer', height: 44, borderRadius: 10,
                  background: '#DC2626', color: '#FFFFFF', border: 'none',
                  fontFamily: PRO_FONT, fontWeight: 700, fontSize: 14,
                }}>
                  {lang === 'es' ? 'Sí, salir' : 'Yes, sign out'}
                </button>
                <button onClick={() => setConfirmSignOut(false)} style={{
                  flex: 1, appearance: 'none', cursor: 'pointer', height: 44, borderRadius: 10,
                  background: '#FFFFFF', color: PRO.mute, border: `1.5px solid ${PRO.border}`,
                  fontFamily: PRO_FONT, fontWeight: 600, fontSize: 14,
                }}>
                  {lang === 'es' ? 'Cancelar' : 'Cancel'}
                </button>
              </div>
            </div>
          )}
        </Section>
      </div>
    </div>
  )
}
