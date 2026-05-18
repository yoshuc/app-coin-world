import ScreenHeader from '../components/ScreenHeader.jsx'
import ChunkyButton, { COLORS } from '../components/ChunkyButton.jsx'
import { Building, Moneda } from '../components/Art.jsx'
import { BUILDINGS } from '../constants/buildings.js'
import { t } from '../i18n/strings.js'

export default function HomeScreen({ lang, setLang, points, unlocked, goMarket, goLearn, todayEarned }) {
  const unlockedCount = unlocked.length
  const total = BUILDINGS.length
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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
              fontFamily: 'Fredoka', fontWeight: 700, fontSize: 13,
              color: COLORS.ink, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>{t(lang, 'todayEarned')}</div>
            <div style={{
              fontFamily: 'Fredoka', fontWeight: 800, fontSize: 28, lineHeight: 1.05,
              color: COLORS.ink, letterSpacing: '-0.02em',
            }}>+{todayEarned} {t(lang, 'points')}</div>
          </div>
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
                  fontFamily: 'Fredoka', fontWeight: 700, fontSize: 13,
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
          borderRadius: 16, padding: '12px', fontFamily: 'Fredoka', fontWeight: 700, fontSize: 16,
        }}>
          📚  {lang === 'es' ? '¡Aprende y gana monedas!' : 'Learn & earn coins!'}
        </button>
      </div>
    </div>
  )
}
