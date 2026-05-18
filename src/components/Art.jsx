// Art.jsx — Moneda character + flat building/item SVGs
// Ported verbatim from prototype art.jsx

export function Moneda({ size = 88, mood = 'happy', wave = false }) {
  const eye = (cx) => (
    <g key={cx}>
      <ellipse cx={cx} cy="44" rx="5.5" ry="6.5" fill="#1F1108" />
      <circle cx={cx + 1.6} cy="42" r="1.8" fill="#fff" />
    </g>
  )
  const blush = (cx) => <ellipse cx={cx} cy="56" rx="5" ry="3" fill="#F472B6" opacity="0.6" />

  let mouth
  if (mood === 'cheer') {
    mouth = <path d="M40 56 Q50 70 60 56 Z" fill="#7A1F00" stroke="#1F1108" strokeWidth="2.5" strokeLinejoin="round" />
  } else if (mood === 'sad') {
    mouth = <path d="M42 62 Q50 56 58 62" fill="none" stroke="#1F1108" strokeWidth="3" strokeLinecap="round" />
  } else if (mood === 'think') {
    mouth = <path d="M44 60 L56 60" stroke="#1F1108" strokeWidth="3" strokeLinecap="round" />
  } else {
    mouth = <path d="M40 55 Q50 65 60 55" fill="none" stroke="#1F1108" strokeWidth="3" strokeLinecap="round" />
  }

  return (
    <svg viewBox="0 0 100 120" width={size} height={size * 1.2} style={{ overflow: 'visible' }}>
      <ellipse cx="50" cy="116" rx="26" ry="3.5" fill="#000" opacity="0.12" />
      <path d="M36 92 L34 110" stroke="#1F1108" strokeWidth="5" strokeLinecap="round" />
      <path d="M64 92 L66 110" stroke="#1F1108" strokeWidth="5" strokeLinecap="round" />
      <ellipse cx="32" cy="113" rx="8" ry="3.5" fill="#1F1108" />
      <ellipse cx="68" cy="113" rx="8" ry="3.5" fill="#1F1108" />
      <circle cx="50" cy="50" r="40" fill="#FBBF24" stroke="#1F1108" strokeWidth="4" />
      <circle cx="50" cy="50" r="33" fill="none" stroke="#F59E0B" strokeWidth="3" />
      <text x="50" y="32" textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight="700"
            fontSize="14" fill="#F59E0B" opacity="0.7">$</text>
      {eye(37)}{eye(63)}
      {blush(28)}{blush(72)}
      {mouth}
      {wave ? (
        <>
          <path d="M14 60 Q4 40 16 28" stroke="#1F1108" strokeWidth="5" strokeLinecap="round" fill="none" />
          <circle cx="16" cy="28" r="5" fill="#1F1108" />
        </>
      ) : (
        <path d="M14 60 Q6 70 14 82" stroke="#1F1108" strokeWidth="5" strokeLinecap="round" fill="none" />
      )}
      <path d="M86 60 Q94 70 86 82" stroke="#1F1108" strokeWidth="5" strokeLinecap="round" fill="none" />
    </svg>
  )
}

export function CoinIcon({ size = 22 }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} style={{ flexShrink: 0 }}>
      <circle cx="16" cy="16" r="13" fill="#FBBF24" stroke="#1F1108" strokeWidth="2.5" />
      <circle cx="16" cy="16" r="9" fill="none" stroke="#F59E0B" strokeWidth="1.8" />
      <text x="16" y="21" textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight="700"
            fontSize="14" fill="#1F1108">$</text>
    </svg>
  )
}

function tint(c) {
  const map = {
    '#EF4444': '#FECACA',
    '#F97316': '#FED7AA',
    '#22C55E': '#BBF7D0',
    '#3B82F6': '#BFDBFE',
    '#A855F7': '#E9D5FF',
  }
  return map[c] || '#FEF3C7'
}

export function Building({ id, color, locked, size = 130 }) {
  if (locked) {
    return (
      <svg viewBox="0 0 130 130" width={size} height={size}>
        <rect x="6" y="6" width="118" height="118" rx="18"
              fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="3" strokeDasharray="6 6" />
        <line x1="65" y1="44" x2="65" y2="86" stroke="#9CA3AF" strokeWidth="6" strokeLinecap="round" />
        <line x1="44" y1="65" x2="86" y2="65" stroke="#9CA3AF" strokeWidth="6" strokeLinecap="round" />
      </svg>
    )
  }

  const wrap = (inner) => (
    <svg viewBox="0 0 130 130" width={size} height={size}>
      <rect x="6" y="6" width="118" height="118" rx="18" fill={tint(color)} />
      <ellipse cx="65" cy="108" rx="42" ry="4" fill="#000" opacity="0.12" />
      {inner}
    </svg>
  )

  const stroke = '#1F1108'
  const sw = 3

  switch (id) {
    case 'house':
      return wrap(<>
        <rect x="34" y="58" width="62" height="50" fill={color} stroke={stroke} strokeWidth={sw} />
        <path d="M28 58 L65 28 L102 58 Z" fill="#F97316" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        <rect x="58" y="78" width="14" height="30" fill="#FBBF24" stroke={stroke} strokeWidth={sw} />
        <rect x="40" y="68" width="12" height="12" fill="#FFFBEB" stroke={stroke} strokeWidth={sw} />
        <rect x="78" y="68" width="12" height="12" fill="#FFFBEB" stroke={stroke} strokeWidth={sw} />
      </>)
    case 'park':
      return wrap(<>
        <circle cx="42" cy="62" r="20" fill={color} stroke={stroke} strokeWidth={sw} />
        <rect x="40" y="78" width="4" height="22" fill="#7C3F1B" stroke={stroke} strokeWidth={sw} />
        <circle cx="88" cy="76" r="14" fill="#16A34A" stroke={stroke} strokeWidth={sw} />
        <rect x="86" y="86" width="4" height="14" fill="#7C3F1B" stroke={stroke} strokeWidth={sw} />
        <circle cx="58" cy="100" r="3" fill="#F472B6" />
        <circle cx="72" cy="98" r="3" fill="#FBBF24" />
        <circle cx="32" cy="100" r="3" fill="#A855F7" />
      </>)
    case 'school':
      return wrap(<>
        <rect x="22" y="50" width="86" height="58" fill={color} stroke={stroke} strokeWidth={sw} />
        <path d="M22 50 L65 28 L108 50 Z" fill="#1F1108" />
        <rect x="34" y="62" width="14" height="14" fill="#FFFBEB" stroke={stroke} strokeWidth={sw} />
        <rect x="58" y="62" width="14" height="14" fill="#FFFBEB" stroke={stroke} strokeWidth={sw} />
        <rect x="82" y="62" width="14" height="14" fill="#FFFBEB" stroke={stroke} strokeWidth={sw} />
        <rect x="56" y="84" width="18" height="24" fill="#FBBF24" stroke={stroke} strokeWidth={sw} />
        <circle cx="65" cy="40" r="4" fill="#EF4444" />
      </>)
    case 'bakery':
      return wrap(<>
        <rect x="26" y="46" width="78" height="62" fill={color} stroke={stroke} strokeWidth={sw} />
        <rect x="20" y="40" width="90" height="14" fill="#EF4444" stroke={stroke} strokeWidth={sw} />
        <path d="M20 40 L34 40 M34 40 L48 54 L20 54 Z M48 40 L62 40 M62 40 L76 54 L48 54 Z M76 40 L90 40 M90 40 L104 54 L76 54 Z"
              fill="#FFFBEB" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        <rect x="52" y="74" width="26" height="34" fill="#7C3F1B" stroke={stroke} strokeWidth={sw} />
        <circle cx="40" cy="86" r="4" fill="#FBBF24" />
        <circle cx="90" cy="86" r="4" fill="#FBBF24" />
      </>)
    case 'library':
      return wrap(<>
        <rect x="22" y="42" width="86" height="66" fill={color} stroke={stroke} strokeWidth={sw} />
        <rect x="22" y="42" width="86" height="10" fill="#1F1108" />
        <rect x="32" y="58" width="8" height="40" fill="#FFFBEB" stroke={stroke} strokeWidth={sw} />
        <rect x="50" y="58" width="8" height="40" fill="#FFFBEB" stroke={stroke} strokeWidth={sw} />
        <rect x="72" y="58" width="8" height="40" fill="#FFFBEB" stroke={stroke} strokeWidth={sw} />
        <rect x="90" y="58" width="8" height="40" fill="#FFFBEB" stroke={stroke} strokeWidth={sw} />
        <path d="M58 28 L65 22 L72 28" fill="#FBBF24" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
      </>)
    case 'cinema':
      return wrap(<>
        <rect x="22" y="36" width="86" height="72" fill={color} stroke={stroke} strokeWidth={sw} />
        <circle cx="32" cy="46" r="3" fill="#FBBF24" stroke={stroke} strokeWidth="1.5" />
        <circle cx="48" cy="46" r="3" fill="#FBBF24" stroke={stroke} strokeWidth="1.5" />
        <circle cx="64" cy="46" r="3" fill="#FBBF24" stroke={stroke} strokeWidth="1.5" />
        <circle cx="80" cy="46" r="3" fill="#FBBF24" stroke={stroke} strokeWidth="1.5" />
        <circle cx="96" cy="46" r="3" fill="#FBBF24" stroke={stroke} strokeWidth="1.5" />
        <rect x="34" y="58" width="62" height="22" fill="#FFFBEB" stroke={stroke} strokeWidth={sw} />
        <text x="65" y="74" textAnchor="middle" fontFamily="Fredoka" fontWeight="700" fontSize="12" fill="#1F1108">★ FILM ★</text>
        <rect x="50" y="84" width="30" height="24" fill="#1F1108" />
        <circle cx="65" cy="96" r="2" fill="#FBBF24" />
      </>)
    case 'rocket':
      return wrap(<>
        <path d="M65 22 L82 60 L82 96 L48 96 L48 60 Z" fill={color} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        <circle cx="65" cy="58" r="9" fill="#FFFBEB" stroke={stroke} strokeWidth={sw} />
        <path d="M48 76 L34 96 L48 96 Z" fill="#EF4444" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        <path d="M82 76 L96 96 L82 96 Z" fill="#EF4444" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        <path d="M58 96 L52 110 L65 102 L78 110 L72 96" fill="#FBBF24" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
      </>)
    case 'castle':
      return wrap(<>
        <rect x="22" y="58" width="86" height="50" fill={color} stroke={stroke} strokeWidth={sw} />
        <rect x="22" y="42" width="14" height="20" fill={color} stroke={stroke} strokeWidth={sw} />
        <rect x="58" y="38" width="14" height="24" fill={color} stroke={stroke} strokeWidth={sw} />
        <rect x="94" y="42" width="14" height="20" fill={color} stroke={stroke} strokeWidth={sw} />
        <path d="M58 38 L65 28 L72 38 Z" fill="#EF4444" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        <rect x="58" y="78" width="14" height="30" fill="#1F1108" />
        <path d="M58 78 Q65 70 72 78" fill="#1F1108" />
      </>)
    default:
      return wrap(<rect x="34" y="34" width="62" height="62" fill={color} stroke={stroke} strokeWidth={sw} />)
  }
}

export function MarketItem({ id, color, size = 96 }) {
  const stroke = '#1F1108'
  const sw = 3
  const wrap = (inner) => (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      {inner}
    </svg>
  )
  switch (id) {
    case 'toy':
      return wrap(<>
        <rect x="14" y="46" width="72" height="26" rx="6" fill={color} stroke={stroke} strokeWidth={sw} />
        <rect x="30" y="32" width="40" height="18" rx="4" fill="#3B82F6" stroke={stroke} strokeWidth={sw} />
        <rect x="36" y="38" width="10" height="10" fill="#FFFBEB" stroke={stroke} strokeWidth="2" />
        <rect x="54" y="38" width="10" height="10" fill="#FFFBEB" stroke={stroke} strokeWidth="2" />
        <circle cx="28" cy="76" r="8" fill="#1F1108" />
        <circle cx="28" cy="76" r="3" fill="#FFFBEB" />
        <circle cx="72" cy="76" r="8" fill="#1F1108" />
        <circle cx="72" cy="76" r="3" fill="#FFFBEB" />
      </>)
    case 'book':
      return wrap(<>
        <rect x="20" y="20" width="60" height="60" rx="4" fill={color} stroke={stroke} strokeWidth={sw} />
        <rect x="20" y="20" width="6" height="60" fill="#1E40AF" />
        <rect x="34" y="34" width="36" height="4" fill="#FFFBEB" />
        <rect x="34" y="44" width="28" height="4" fill="#FFFBEB" />
        <circle cx="50" cy="62" r="8" fill="#FBBF24" stroke={stroke} strokeWidth={sw} />
      </>)
    case 'icecream':
      return wrap(<>
        <circle cx="50" cy="32" r="16" fill="#F472B6" stroke={stroke} strokeWidth={sw} />
        <circle cx="40" cy="24" r="10" fill="#FBBF24" stroke={stroke} strokeWidth={sw} />
        <circle cx="60" cy="24" r="10" fill="#FFFFFF" stroke={stroke} strokeWidth={sw} />
        <path d="M34 44 L50 86 L66 44 Z" fill="#D97706" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        <path d="M40 50 L60 50 M44 60 L56 60" stroke={stroke} strokeWidth="2" />
        <circle cx="42" cy="32" r="2" fill="#EF4444" />
        <circle cx="58" cy="36" r="2" fill="#22C55E" />
      </>)
    case 'ball':
      return wrap(<>
        <circle cx="50" cy="50" r="32" fill={color} stroke={stroke} strokeWidth={sw} />
        <path d="M50 18 Q60 50 50 82" stroke={stroke} strokeWidth={sw} fill="none" />
        <path d="M18 50 Q50 40 82 50" stroke={stroke} strokeWidth={sw} fill="none" />
        <circle cx="50" cy="50" r="6" fill="#FBBF24" stroke={stroke} strokeWidth="2" />
      </>)
    case 'puzzle':
      return wrap(<>
        <path d="M18 18 H44 V28 A6 6 0 0 0 56 28 V18 H82 V44 A6 6 0 0 1 82 56 H82 V82 H56 V72 A6 6 0 0 0 44 72 V82 H18 Z"
              fill={color} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        <circle cx="34" cy="34" r="3" fill="#FBBF24" />
        <circle cx="66" cy="66" r="3" fill="#FBBF24" />
      </>)
    case 'stickers':
      return wrap(<>
        <circle cx="32" cy="34" r="14" fill="#FBBF24" stroke={stroke} strokeWidth={sw} />
        <path d="M32 26 L34 32 L40 32 L35 36 L37 42 L32 38 L27 42 L29 36 L24 32 L30 32 Z" fill="#EF4444" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="64" cy="50" r="14" fill="#22C55E" stroke={stroke} strokeWidth={sw} />
        <path d="M58 50 L62 56 L72 44" stroke="#FFFBEB" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="38" cy="70" r="14" fill="#A855F7" stroke={stroke} strokeWidth={sw} />
        <path d="M38 64 L38 76 M32 70 L44 70" stroke="#FFFBEB" strokeWidth="3" strokeLinecap="round" />
      </>)
    default:
      return wrap(<circle cx="50" cy="50" r="32" fill={color} stroke={stroke} strokeWidth={sw} />)
  }
}

export function Scenario({ kind = 'piggy' }) {
  const stroke = '#1F1108'
  const sw = 4
  if (kind === 'piggy') {
    return (
      <svg viewBox="0 0 280 160" width="100%" height="100%">
        <rect x="0" y="0" width="280" height="160" fill="#FEF3C7" />
        <circle cx="240" cy="36" r="20" fill="#FBBF24" stroke={stroke} strokeWidth={sw} />
        <path d="M240 8 L240 0 M240 64 L240 72 M212 36 L204 36 M268 36 L276 36" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <rect x="0" y="120" width="280" height="40" fill="#86EFAC" />
        <ellipse cx="120" cy="100" rx="60" ry="40" fill="#F472B6" stroke={stroke} strokeWidth={sw} />
        <circle cx="170" cy="90" r="18" fill="#F472B6" stroke={stroke} strokeWidth={sw} />
        <circle cx="178" cy="88" r="3" fill={stroke} />
        <circle cx="160" cy="80" r="2.5" fill={stroke} />
        <ellipse cx="178" cy="96" rx="6" ry="4" fill="#EC4899" stroke={stroke} strokeWidth="2" />
        <rect x="100" y="72" width="20" height="6" rx="2" fill={stroke} />
        <path d="M76 130 L74 144 M96 134 L94 148 M144 134 L146 148 M164 130 L166 144" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <circle cx="108" cy="50" r="10" fill="#FBBF24" stroke={stroke} strokeWidth="2.5" />
        <text x="108" y="55" textAnchor="middle" fontFamily="Fredoka" fontWeight="700" fontSize="12" fill={stroke}>$</text>
        <circle cx="88" cy="34" r="8" fill="#FBBF24" stroke={stroke} strokeWidth="2.5" />
      </svg>
    )
  }
  if (kind === 'jar') {
    return (
      <svg viewBox="0 0 280 160" width="100%" height="100%">
        <rect x="0" y="0" width="280" height="160" fill="#DBEAFE" />
        <rect x="0" y="120" width="280" height="40" fill="#86EFAC" />
        <path d="M88 50 L88 36 L192 36 L192 50 L200 60 L200 140 L80 140 L80 60 Z"
              fill="#BFDBFE" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" opacity="0.85" />
        <rect x="84" y="28" width="112" height="14" rx="3" fill="#1F1108" />
        <circle cx="110" cy="110" r="14" fill="#FBBF24" stroke={stroke} strokeWidth={sw} />
        <text x="110" y="116" textAnchor="middle" fontFamily="Fredoka" fontWeight="700" fontSize="15" fill={stroke}>$</text>
        <circle cx="140" cy="120" r="14" fill="#FBBF24" stroke={stroke} strokeWidth={sw} />
        <text x="140" y="126" textAnchor="middle" fontFamily="Fredoka" fontWeight="700" fontSize="15" fill={stroke}>$</text>
        <circle cx="172" cy="112" r="14" fill="#FBBF24" stroke={stroke} strokeWidth={sw} />
        <text x="172" y="118" textAnchor="middle" fontFamily="Fredoka" fontWeight="700" fontSize="15" fill={stroke}>$</text>
        <circle cx="126" cy="86" r="14" fill="#FBBF24" stroke={stroke} strokeWidth={sw} />
        <text x="126" y="92" textAnchor="middle" fontFamily="Fredoka" fontWeight="700" fontSize="15" fill={stroke}>$</text>
        <circle cx="156" cy="92" r="14" fill="#FBBF24" stroke={stroke} strokeWidth={sw} />
        <text x="156" y="98" textAnchor="middle" fontFamily="Fredoka" fontWeight="700" fontSize="15" fill={stroke}>$</text>
        <rect x="106" y="64" width="68" height="14" rx="2" fill="#FFFBEB" stroke={stroke} strokeWidth="2" />
        <text x="140" y="75" textAnchor="middle" fontFamily="Fredoka" fontWeight="700" fontSize="9" fill={stroke}>SAVINGS</text>
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 280 160" width="100%" height="100%">
      <rect x="0" y="0" width="280" height="160" fill="#FCE7F3" />
      <rect x="36" y="44" width="72" height="92" rx="6" fill="#3B82F6" stroke={stroke} strokeWidth={sw} />
      <rect x="36" y="44" width="8" height="92" fill="#1E40AF" />
      <rect x="56" y="64" width="42" height="4" fill="#FFFBEB" />
      <rect x="56" y="76" width="32" height="4" fill="#FFFBEB" />
      <rect x="56" y="88" width="42" height="4" fill="#FFFBEB" />
      <circle cx="72" cy="118" r="8" fill="#FBBF24" stroke={stroke} strokeWidth="2.5" />
      <text x="72" y="123" textAnchor="middle" fontFamily="Fredoka" fontWeight="700" fontSize="9" fill={stroke}>20</text>
      <path d="M126 90 L156 90 M148 82 L156 90 L148 98" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="190" cy="80" r="14" fill="#FBBF24" stroke={stroke} strokeWidth={sw} />
      <text x="190" y="86" textAnchor="middle" fontFamily="Fredoka" fontWeight="700" fontSize="14" fill={stroke}>$</text>
      <circle cx="220" cy="90" r="14" fill="#FBBF24" stroke={stroke} strokeWidth={sw} />
      <text x="220" y="96" textAnchor="middle" fontFamily="Fredoka" fontWeight="700" fontSize="14" fill={stroke}>$</text>
      <circle cx="208" cy="116" r="14" fill="#FBBF24" stroke={stroke} strokeWidth={sw} />
      <text x="208" y="122" textAnchor="middle" fontFamily="Fredoka" fontWeight="700" fontSize="14" fill={stroke}>$</text>
      <text x="218" y="52" textAnchor="middle" fontFamily="Fredoka" fontWeight="800" fontSize="18" fill={stroke}>8</text>
    </svg>
  )
}
