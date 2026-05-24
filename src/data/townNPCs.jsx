// NPC characters for My Town buildings
// Avatars are 100×100 viewBox SVGs rendered at 80px inside a circular clip

function AnaAvatar() {
  return (
    <svg viewBox="0 0 100 100" width="80" height="80">
      <circle cx="50" cy="50" r="50" fill="#FFF0E6" />
      {/* Hair */}
      <ellipse cx="50" cy="28" rx="24" ry="22" fill="#7C4A1E" />
      <circle cx="74" cy="32" r="10" fill="#7C4A1E" />
      {/* Face */}
      <circle cx="50" cy="58" r="30" fill="#FDDCBA" />
      {/* Eyes */}
      <ellipse cx="41" cy="52" rx="4.5" ry="5" fill="#1F1108" />
      <ellipse cx="59" cy="52" rx="4.5" ry="5" fill="#1F1108" />
      <circle cx="42.5" cy="50.5" r="1.5" fill="#fff" />
      <circle cx="60.5" cy="50.5" r="1.5" fill="#fff" />
      {/* Smile */}
      <path d="M41 65 Q50 73 59 65" stroke="#1F1108" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Blush */}
      <ellipse cx="33" cy="60" rx="5" ry="3.5" fill="#F472B6" opacity="0.5" />
      <ellipse cx="67" cy="60" rx="5" ry="3.5" fill="#F472B6" opacity="0.5" />
      {/* Earring */}
      <circle cx="20" cy="58" r="3" fill="#F97316" stroke="#1F1108" strokeWidth="1.5" />
    </svg>
  )
}

function LeoAvatar() {
  return (
    <svg viewBox="0 0 100 100" width="80" height="80">
      <circle cx="50" cy="50" r="50" fill="#E8F5E9" />
      {/* Hair - curly top */}
      <circle cx="50" cy="24" r="20" fill="#1A1A1A" />
      <circle cx="38" cy="20" r="8" fill="#1A1A1A" />
      <circle cx="62" cy="20" r="8" fill="#1A1A1A" />
      <circle cx="30" cy="26" r="6" fill="#1A1A1A" />
      <circle cx="70" cy="26" r="6" fill="#1A1A1A" />
      {/* Face - warm brown skin */}
      <circle cx="50" cy="58" r="30" fill="#8D5524" />
      {/* Eyes */}
      <ellipse cx="41" cy="52" rx="4.5" ry="5" fill="#1F1108" />
      <ellipse cx="59" cy="52" rx="4.5" ry="5" fill="#1F1108" />
      <circle cx="42.5" cy="50.5" r="1.5" fill="#fff" />
      <circle cx="60.5" cy="50.5" r="1.5" fill="#fff" />
      {/* Big grin */}
      <path d="M38 65 Q50 76 62 65" stroke="#1F1108" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Teeth */}
      <path d="M41 66 Q50 73 59 66 Q50 71 41 66 Z" fill="#fff" />
      {/* Blush */}
      <ellipse cx="32" cy="61" rx="5" ry="3.5" fill="#F97316" opacity="0.35" />
      <ellipse cx="68" cy="61" rx="5" ry="3.5" fill="#F97316" opacity="0.35" />
    </svg>
  )
}

function ClaraAvatar() {
  return (
    <svg viewBox="0 0 100 100" width="80" height="80">
      <circle cx="50" cy="50" r="50" fill="#F3E8FF" />
      {/* Hair - bun */}
      <ellipse cx="50" cy="26" rx="22" ry="20" fill="#2D1A4A" />
      <circle cx="50" cy="14" r="10" fill="#2D1A4A" />
      {/* Face */}
      <circle cx="50" cy="58" r="30" fill="#FDDCBA" />
      {/* Glasses frame */}
      <rect x="30" y="47" width="16" height="11" rx="4" fill="none" stroke="#A855F7" strokeWidth="2.5" />
      <rect x="52" y="47" width="16" height="11" rx="4" fill="none" stroke="#A855F7" strokeWidth="2.5" />
      <line x1="46" y1="52" x2="52" y2="52" stroke="#A855F7" strokeWidth="2.5" />
      <line x1="30" y1="52" x2="26" y2="50" stroke="#A855F7" strokeWidth="2.5" />
      <line x1="68" y1="52" x2="72" y2="50" stroke="#A855F7" strokeWidth="2.5" />
      {/* Eyes (behind glass tint) */}
      <ellipse cx="38" cy="52" rx="3.5" ry="4" fill="#1F1108" />
      <ellipse cx="60" cy="52" rx="3.5" ry="4" fill="#1F1108" />
      <circle cx="39.5" cy="50.8" r="1.2" fill="#fff" />
      <circle cx="61.5" cy="50.8" r="1.2" fill="#fff" />
      {/* Warm smile */}
      <path d="M40 66 Q50 74 60 66" stroke="#1F1108" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Blush */}
      <ellipse cx="31" cy="62" rx="5" ry="3" fill="#F472B6" opacity="0.4" />
      <ellipse cx="69" cy="62" rx="5" ry="3" fill="#F472B6" opacity="0.4" />
    </svg>
  )
}

function TomasAvatar() {
  return (
    <svg viewBox="0 0 100 100" width="80" height="80">
      <circle cx="50" cy="50" r="50" fill="#FEF2F2" />
      {/* Hair */}
      <ellipse cx="50" cy="26" rx="23" ry="19" fill="#4A2C0A" />
      {/* Face */}
      <circle cx="50" cy="57" r="30" fill="#FDDCBA" />
      {/* Eyebrows - friendly */}
      <path d="M36 46 Q41 42 46 45" stroke="#4A2C0A" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M54 45 Q59 42 64 46" stroke="#4A2C0A" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Eyes */}
      <ellipse cx="41" cy="52" rx="4.5" ry="5" fill="#1F1108" />
      <ellipse cx="59" cy="52" rx="4.5" ry="5" fill="#1F1108" />
      <circle cx="42.5" cy="50.5" r="1.5" fill="#fff" />
      <circle cx="60.5" cy="50.5" r="1.5" fill="#fff" />
      {/* Mustache */}
      <path d="M38 63 Q45 59 50 61 Q55 59 62 63" stroke="#4A2C0A" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* Smile under mustache */}
      <path d="M42 68 Q50 75 58 68" stroke="#1F1108" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Blush */}
      <ellipse cx="32" cy="60" rx="5" ry="3.5" fill="#F472B6" opacity="0.4" />
      <ellipse cx="68" cy="60" rx="5" ry="3.5" fill="#F472B6" opacity="0.4" />
    </svg>
  )
}

export const TOWN_NPCS = {
  house: {
    id: 'ana',
    name: 'Ana',
    buildingLabel: { es: 'Mi Casa', en: 'My Home' },
    buildingColor: '#F97316',
    Avatar: AnaAvatar,
    tipsEs: [
      '¡Ahorré 3 meses para construir mi casa! 🏠',
      '¡Un hogar es lo mejor para lo que puedes ahorrar! ❤️',
    ],
    tipsEn: [
      'I saved up for 3 months to build this house! 🏠',
      'A home is the best thing you can save for! ❤️',
    ],
  },
  park: {
    id: 'leo',
    name: 'Leo',
    buildingLabel: { es: 'El Parque', en: 'The Park' },
    buildingColor: '#22C55E',
    Avatar: LeoAvatar,
    tipsEs: [
      '¡Pequeños ahorros cada día hacen grandes cosas! 🌸',
      '¡Este parque fue construido con los ahorros de todos! 🌳',
    ],
    tipsEn: [
      'Small savings every day make big things happen! 🌸',
      "This park was built with everyone's savings! 🌳",
    ],
  },
  school: {
    id: 'clara',
    name: 'Ms. Clara',
    buildingLabel: { es: 'La Escuela', en: 'The School' },
    buildingColor: '#A855F7',
    Avatar: ClaraAvatar,
    tipsEs: [
      '¡Aprender es la mejor inversión! 📚',
      '¡Cada lección te acerca más a tus sueños! ⭐',
    ],
    tipsEn: [
      'Learning is the best investment you can make! 📚',
      'Every lesson brings you closer to your dreams! ⭐',
    ],
  },
  // Bakery ≈ market in the town layout
  bakery: {
    id: 'tomas',
    name: 'Tomás',
    buildingLabel: { es: 'El Mercado', en: 'The Market' },
    buildingColor: '#EF4444',
    Avatar: TomasAvatar,
    tipsEs: [
      '¿Lo necesito o solo lo quiero? ¡Esa es la pregunta! 🤔',
      '¡Pienso bien antes de gastar! 🛒',
    ],
    tipsEn: [
      "Do I need it or just want it? That's the question! 🤔",
      'I think carefully before I spend! 🛒',
    ],
  },
}
