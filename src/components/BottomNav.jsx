import { t } from '../i18n/strings.js'
import { COLORS } from './ChunkyButton.jsx'

export default function BottomNav({ tab, onTab, lang }) {
  const items = [
    { id: 'town',   icon: '🏘', es: t('es', 'navTown'),   en: t('en', 'navTown'),   color: COLORS.red },
    { id: 'learn',  icon: '📚', es: t('es', 'navLearn'),  en: t('en', 'navLearn'),  color: COLORS.purple },
    { id: 'market', icon: '🛒', es: t('es', 'navMarket'), en: t('en', 'navMarket'), color: COLORS.green },
  ]
  return (
    <div style={{
      position: 'absolute', left: 12, right: 12, bottom: 26,
      background: '#FFFBEB', borderRadius: 22,
      border: `3px solid ${COLORS.ink}`,
      boxShadow: `0 4px 0 ${COLORS.ink}`,
      padding: '8px 10px',
      display: 'flex', justifyContent: 'space-around',
      zIndex: 5,
    }}>
      {items.map(it => {
        const active = tab === it.id
        return (
          <button key={it.id} onClick={() => onTab(it.id)} style={{
            appearance: 'none', cursor: 'pointer',
            background: active ? it.color : 'transparent',
            color: active ? '#FFFBEB' : COLORS.ink,
            border: active ? `2px solid ${COLORS.ink}` : '2px solid transparent',
            borderRadius: 16, padding: '6px 14px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            fontFamily: 'Fredoka', fontWeight: 700, fontSize: 13,
            minWidth: 64,
            transition: 'all 160ms',
            transform: active ? 'translateY(-2px)' : 'none',
            boxShadow: active ? `0 3px 0 ${COLORS.ink}` : 'none',
          }}>
            <span style={{ fontSize: 22, lineHeight: 1, filter: active ? 'none' : 'grayscale(0.4)' }}>{it.icon}</span>
            <span>{lang === 'es' ? it.es : it.en}</span>
          </button>
        )
      })}
    </div>
  )
}
