import { useState } from 'react'

export const COLORS = {
  red: '#EF4444', orange: '#F97316', green: '#22C55E',
  blue: '#3B82F6', purple: '#A855F7',
  bg: '#FFFBEB', ink: '#1F1108', cream: '#FEF3C7',
  yellow: '#FBBF24',
}

export default function ChunkyButton({ color, ink = '#1F1108', children, onClick, fullWidth, small, style = {} }) {
  const [press, setPress] = useState(false)
  const h = small ? 44 : 56
  return (
    <button
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      onMouseLeave={() => setPress(false)}
      onTouchStart={() => setPress(true)}
      onTouchEnd={() => setPress(false)}
      onClick={onClick}
      style={{
        appearance: 'none', border: 'none', cursor: 'pointer',
        background: color, color: ink,
        height: h, minWidth: small ? 70 : 120,
        width: fullWidth ? '100%' : 'auto',
        padding: small ? '0 14px' : '0 22px',
        borderRadius: small ? 14 : 18,
        fontFamily: 'Fredoka, system-ui',
        fontWeight: 700,
        fontSize: small ? 16 : 20,
        letterSpacing: '-0.01em',
        boxShadow: press
          ? `0 1px 0 ${COLORS.ink}, inset 0 -1px 0 rgba(0,0,0,0.1)`
          : `0 4px 0 ${COLORS.ink}, 0 4px 0 0 rgba(0,0,0,0.05)`,
        transform: press ? 'translateY(3px)' : 'translateY(0)',
        transition: 'transform 80ms, box-shadow 80ms',
        outline: `3px solid ${COLORS.ink}`,
        outlineOffset: -3,
        textWrap: 'pretty',
        whiteSpace: 'nowrap',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        ...style,
      }}
    >
      {children}
    </button>
  )
}
