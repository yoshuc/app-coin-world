import { CoinIcon } from './Art.jsx'
import { COLORS } from './ChunkyButton.jsx'

export default function CoinPill({ value, dark }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: dark ? 'rgba(0,0,0,0.22)' : '#FFFBEB',
      color: dark ? '#FFFBEB' : COLORS.ink,
      padding: '4px 12px 4px 6px', borderRadius: 999,
      border: `2px solid ${COLORS.ink}`,
      fontFamily: 'Fredoka', fontWeight: 800, fontSize: 18,
    }}>
      <CoinIcon size={22} />
      <span style={{ paddingTop: 2 }}>{value}</span>
    </div>
  )
}
