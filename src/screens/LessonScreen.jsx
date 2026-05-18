import { useState } from 'react'
import ScreenHeader from '../components/ScreenHeader.jsx'
import ChunkyButton, { COLORS } from '../components/ChunkyButton.jsx'
import { Moneda, Scenario } from '../components/Art.jsx'
import { QUESTIONS } from '../constants/questions.js'
import { t } from '../i18n/strings.js'

function SpeechBubble({ children }) {
  return (
    <div style={{
      position: 'relative', flex: 1,
      background: '#FFFBEB', border: `3px solid ${COLORS.ink}`,
      borderRadius: 18, padding: '12px 14px',
      fontFamily: 'Fredoka', fontWeight: 600, fontSize: 16,
      color: COLORS.ink, lineHeight: 1.25,
      boxShadow: `0 3px 0 ${COLORS.ink}`,
    }}>
      {children}
      <svg style={{ position: 'absolute', bottom: 12, left: -12 }} width="14" height="16" viewBox="0 0 14 16">
        <path d="M14 0 L0 8 L14 16 Z" fill="#FFFBEB" stroke={COLORS.ink} strokeWidth="3" strokeLinejoin="round" />
        <rect x="11" y="2" width="3" height="12" fill="#FFFBEB" />
      </svg>
    </div>
  )
}

function RewardBurst({ lang }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(31, 17, 8, 0.18)',
      animation: 'cwFade 1.4s ease-out forwards',
    }}>
      <svg width="100%" height="100%" viewBox="0 0 375 600" style={{ position: 'absolute' }}>
        {[...Array(30)].map((_, i) => {
          const x = 30 + (i * 31) % 320
          const y = 80 + (i * 47) % 440
          const c = ['#EF4444', '#F97316', '#22C55E', '#3B82F6', '#A855F7', '#FBBF24'][i % 6]
          const r = 4 + (i % 4) * 2
          return <circle key={i} cx={x} cy={y} r={r} fill={c}
                         style={{ animation: `cwPop 1.4s ${i * 18}ms cubic-bezier(.2,.8,.2,1) forwards`, opacity: 0 }} />
        })}
      </svg>
      <div style={{
        fontFamily: 'Fredoka', fontWeight: 800, fontSize: 64,
        color: COLORS.yellow, letterSpacing: '-0.03em',
        textShadow: `4px 4px 0 ${COLORS.ink}, -2px -2px 0 ${COLORS.ink}, 2px -2px 0 ${COLORS.ink}, -2px 2px 0 ${COLORS.ink}`,
        transform: 'rotate(-6deg)',
        animation: 'cwPunch 0.5s cubic-bezier(.2,.9,.2,1.3) forwards',
        textAlign: 'center', lineHeight: 0.9,
      }}>{t(lang, 'amazing')}</div>
    </div>
  )
}

export default function LessonScreen({ lang, setLang, points, setPoints, awardEarn }) {
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [showReward, setShowReward] = useState(false)
  const [done, setDone] = useState(false)

  const q = QUESTIONS[idx][lang]
  const correct = q.correct
  const isCorrect = selected === correct

  function choose(i) {
    if (selected !== null) return
    setSelected(i)
    if (i === correct) {
      awardEarn(5)
      setShowReward(true)
      setTimeout(() => setShowReward(false), 1400)
    }
  }

  function next() {
    if (idx + 1 < QUESTIONS.length) {
      setIdx(idx + 1)
      setSelected(null)
    } else {
      setDone(true)
    }
  }

  function restart() {
    setIdx(0)
    setSelected(null)
    setDone(false)
  }

  if (done) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <ScreenHeader color={COLORS.purple} lang={lang} onLang={setLang} points={points}
                      titleEs="Aprender" titleEn="Learn" />
        <div style={{
          flex: 1, padding: '20px 24px 140px', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 18, textAlign: 'center',
        }}>
          <Moneda size={140} mood="cheer" wave />
          <div style={{
            fontFamily: 'Fredoka', fontWeight: 800, fontSize: 36, lineHeight: 1, color: COLORS.purple,
            letterSpacing: '-0.02em', textShadow: `3px 3px 0 ${COLORS.ink}`,
          }}>{t(lang, 'lessonDone')}</div>
          <div style={{ fontFamily: 'Fredoka', fontWeight: 600, fontSize: 18, color: COLORS.ink }}>
            {t(lang, 'rewardPts')} <strong>+15 {t(lang, 'points')}</strong>
          </div>
          <ChunkyButton color={COLORS.purple} style={{ color: '#FFFBEB' }} onClick={restart}>
            {t(lang, 'startOver')}
          </ChunkyButton>
        </div>
      </div>
    )
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <ScreenHeader color={COLORS.purple} lang={lang} onLang={setLang} points={points}
                    titleEs="Aprender" titleEn="Learn"
                    subtitle={`${t(lang, 'questionOf')} ${idx + 1} ${t(lang, 'of')} ${QUESTIONS.length}`} />

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px 140px' }}>
        <div style={{
          background: '#FFFFFF', borderRadius: 20,
          border: `3px solid ${COLORS.ink}`, boxShadow: `0 4px 0 ${COLORS.ink}`,
          overflow: 'hidden', marginBottom: 14, aspectRatio: '280 / 160',
        }}>
          <Scenario kind={QUESTIONS[idx].scenario} />
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 14 }}>
          <div style={{ flexShrink: 0 }}>
            <Moneda size={72} mood="think" />
          </div>
          <SpeechBubble>{q.q}</SpeechBubble>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {q.a.map((ans, i) => {
            const isSel = selected === i
            const showCorrect = selected !== null && i === correct
            const showWrong = isSel && i !== correct
            const bg = showCorrect ? COLORS.green : showWrong ? COLORS.red : ['#FBBF24', '#3B82F6', '#A855F7'][i]
            const txt = (showCorrect || showWrong || isSel || i === 1) && bg !== '#FBBF24' ? '#FFFBEB' : COLORS.ink
            return (
              <ChunkyButton key={i} color={bg} fullWidth onClick={() => choose(i)} style={{
                color: txt, whiteSpace: 'normal', height: 'auto', minHeight: 56,
                padding: '12px 18px', textAlign: 'left', justifyContent: 'flex-start',
                opacity: selected !== null && !isSel && !showCorrect ? 0.6 : 1,
              }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 12,
                  width: '100%', justifyContent: 'flex-start',
                }}>
                  <span style={{
                    width: 28, height: 28, borderRadius: 999,
                    background: 'rgba(255,255,255,0.9)', color: COLORS.ink,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, fontWeight: 800, flexShrink: 0,
                    border: `2px solid ${COLORS.ink}`,
                  }}>{String.fromCharCode(65 + i)}</span>
                  <span style={{ textWrap: 'pretty', flex: 1 }}>{ans}</span>
                </span>
              </ChunkyButton>
            )
          })}
        </div>

        {selected !== null && (
          <div style={{
            marginTop: 14, padding: '12px 14px',
            background: isCorrect ? '#DCFCE7' : '#FEE2E2',
            border: `3px solid ${isCorrect ? COLORS.green : COLORS.red}`,
            borderRadius: 16,
            fontFamily: 'Fredoka', fontWeight: 600, fontSize: 15, color: COLORS.ink,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{ fontSize: 26 }}>{isCorrect ? '🎉' : '🤔'}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 16 }}>
                {isCorrect ? t(lang, 'amazing') : t(lang, 'tryAgain')}
              </div>
              <div style={{ opacity: 0.78 }}>{q.why}</div>
            </div>
            {isCorrect && (
              <ChunkyButton small color={COLORS.green} style={{ color: '#FFFBEB' }} onClick={next}>
                {t(lang, 'next')} →
              </ChunkyButton>
            )}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 18 }}>
          {QUESTIONS.map((_, i) => (
            <div key={i} style={{
              width: i === idx ? 22 : 10, height: 10, borderRadius: 999,
              background: i < idx ? COLORS.green : i === idx ? COLORS.purple : '#E5E7EB',
              border: `2px solid ${COLORS.ink}`,
              transition: 'width 200ms',
            }} />
          ))}
        </div>
      </div>

      {showReward && <RewardBurst lang={lang} />}
    </div>
  )
}
