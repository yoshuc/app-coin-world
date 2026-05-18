export const PRO = {
  brand: '#15803D',
  brandSolid: '#22C55E',
  brandSoft: '#DCFCE7',
  ink: '#0F172A',
  mute: '#64748B',
  border: '#E2E8F0',
  inputBorder: '#CBD5E1',
  bg: '#FAFAF7',
  card: '#FFFFFF',
}
export const PRO_FONT = "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif"

export default function ProLogo({ size = 'md', mono = false }) {
  const h = size === 'lg' ? 32 : size === 'sm' ? 20 : 24
  const color = mono ? PRO.ink : PRO.brand
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <svg width={h} height={h} viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="none" stroke={color} strokeWidth="2" />
        <path d="M14.5 8.5 H11 a2.5 2.5 0 0 0 0 5 h2 a2.5 2.5 0 0 1 0 5 H9.5 M12 7 v1 M12 16 v1"
              fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span style={{
        fontFamily: PRO_FONT, fontWeight: 700,
        fontSize: h * 0.72, letterSpacing: '-0.02em', color: PRO.ink,
      }}>coinworld</span>
    </div>
  )
}
