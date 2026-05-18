import { useState } from 'react'
import { PRO, PRO_FONT } from './ProLogo.jsx'

export default function ProField({ label, type = 'text', placeholder, value, onChange, error, right, autoComplete, helper }) {
  const [focus, setFocus] = useState(false)
  return (
    <label style={{ display: 'block' }}>
      <span style={{
        display: 'block', fontSize: 13, fontWeight: 600, color: PRO.ink,
        marginBottom: 6, letterSpacing: '-0.005em',
      }}>{label}</span>
      <div style={{
        display: 'flex', alignItems: 'center',
        background: '#FFFFFF',
        border: `1.5px solid ${error ? '#EF4444' : focus ? PRO.brand : PRO.inputBorder}`,
        borderRadius: 10, transition: 'border-color 120ms, box-shadow 120ms',
        boxShadow: focus ? `0 0 0 4px ${error ? 'rgba(239,68,68,0.10)' : 'rgba(34,197,94,0.12)'}` : 'none',
        paddingRight: right ? 4 : 0,
      }}>
        <input
          type={type} placeholder={placeholder} value={value}
          autoComplete={autoComplete}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{
            flex: 1, minWidth: 0, appearance: 'none', border: 'none', background: 'transparent',
            outline: 'none', padding: '12px 14px',
            fontFamily: PRO_FONT, fontSize: 15, color: PRO.ink, fontWeight: 500,
          }}
        />
        {right}
      </div>
      {error ? (
        <span style={{
          display: 'block', marginTop: 4,
          fontSize: 12, color: '#EF4444', fontWeight: 600,
        }}>{error}</span>
      ) : helper ? (
        <span style={{
          display: 'block', marginTop: 4,
          fontSize: 12, color: PRO.mute, fontWeight: 500,
        }}>{helper}</span>
      ) : null}
    </label>
  )
}
