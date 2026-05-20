import { useState, useEffect, useRef } from 'react'
import ScreenHeader from '../components/ScreenHeader.jsx'
import ChunkyButton, { COLORS } from '../components/ChunkyButton.jsx'
import { Moneda, Scenario } from '../components/Art.jsx'
import { LESSONS, UNITS } from '../constants/questions.js'
import { t } from '../i18n/strings.js'

const FONT = "'Fredoka', system-ui, -apple-system, sans-serif"

// ─── CSS Animations injected once ────────────────────────────────────────────
const CSS = `
  @keyframes cwPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.08); }
  }
  @keyframes cwShake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-8px); }
    40% { transform: translateX(8px); }
    60% { transform: translateX(-8px); }
    80% { transform: translateX(8px); }
  }
  @keyframes cwBounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
`

function SpeechBubble({ children, style }) {
  return (
    <div style={{
      position: 'relative', flex: 1,
      background: '#FFFBEB', border: `3px solid ${COLORS.ink}`,
      borderRadius: 18, padding: '12px 14px',
      fontFamily: FONT, fontWeight: 600, fontSize: 16,
      color: COLORS.ink, lineHeight: 1.25,
      boxShadow: `0 3px 0 ${COLORS.ink}`,
      ...style,
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
      background: 'rgba(31,17,8,0.18)',
      animation: 'cwFade 1.4s ease-out forwards',
    }}>
      <svg width="100%" height="100%" viewBox="0 0 375 600" style={{ position: 'absolute' }}>
        {[...Array(30)].map((_, i) => {
          const x = 30 + (i * 31) % 320
          const y = 80 + (i * 47) % 440
          const c = ['#EF4444','#F97316','#22C55E','#3B82F6','#A855F7','#FBBF24'][i % 6]
          const r = 4 + (i % 4) * 2
          return <circle key={i} cx={x} cy={y} r={r} fill={c}
                   style={{ animation: `cwPop 1.4s ${i*18}ms cubic-bezier(.2,.8,.2,1) forwards`, opacity: 0 }} />
        })}
      </svg>
      <div style={{
        fontFamily: FONT, fontWeight: 800, fontSize: 64,
        color: COLORS.yellow, letterSpacing: '-0.03em',
        textShadow: `4px 4px 0 ${COLORS.ink},-2px -2px 0 ${COLORS.ink},2px -2px 0 ${COLORS.ink},-2px 2px 0 ${COLORS.ink}`,
        transform: 'rotate(-6deg)',
        animation: 'cwPunch 0.5s cubic-bezier(.2,.9,.2,1.3) forwards',
        textAlign: 'center', lineHeight: 0.9,
      }}>{t(lang, 'amazing')}</div>
    </div>
  )
}

// ─── Lesson Map (View A) ──────────────────────────────────────────────────────
function LessonMap({ lang, progress, onSelect, onLockedMsg }) {
  const completedIds = new Set(progress.filter(p => p.completed).map(p => p.lesson_id))
  const currentLessonId = (() => {
    for (const l of LESSONS) {
      if (!completedIds.has(l.id)) return l.id
    }
    return LESSONS[LESSONS.length - 1].id
  })()

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px 140px' }}>
      {UNITS.map(unit => {
        const lessons = LESSONS.filter(l => unit.lessonIds.includes(l.id))
        const completedInUnit = lessons.filter(l => completedIds.has(l.id)).length
        const pct = completedInUnit / lessons.length

        return (
          <div key={unit.id} style={{ marginBottom: 24 }}>
            {/* Unit header */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12,
              borderLeft: `4px solid ${unit.color}`, paddingLeft: 10,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 15, color: COLORS.ink }}>
                  {lang === 'es' ? unit.titleEs : unit.titleEn}
                </div>
              </div>
              <div style={{
                background: unit.color + '22', border: `2px solid ${unit.color}`,
                borderRadius: 999, padding: '2px 10px',
                fontFamily: FONT, fontWeight: 700, fontSize: 13, color: COLORS.ink,
              }}>
                {completedInUnit}/{lessons.length}
              </div>
            </div>

            {/* Lesson bubbles */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 8 }}>
              {lessons.map(lesson => {
                const done = completedIds.has(lesson.id)
                const isCurrent = lesson.id === currentLessonId
                const locked = !done && !isCurrent && lesson.id > currentLessonId
                const size = lesson.isUnitChallenge ? 80 : 64

                let bg, border, color, cursor
                if (done) {
                  bg = unit.color; border = 'none'; color = '#FFFBEB'; cursor = 'pointer'
                } else if (isCurrent) {
                  bg = unit.color + '33'; border = `3px solid ${unit.color}`; color = COLORS.ink; cursor = 'pointer'
                } else if (locked) {
                  bg = '#F3F4F6'; border = '2px solid #D1D5DB'; color = '#9CA3AF'; cursor = 'default'
                } else {
                  bg = unit.color + '22'; border = `2px solid ${unit.color}`; color = COLORS.ink; cursor = 'pointer'
                }

                return (
                  <div
                    key={lesson.id}
                    onClick={() => {
                      if (locked) {
                        onLockedMsg(lang === 'es' ? lesson.titleEs : lesson.titleEn)
                      } else {
                        onSelect(lesson)
                      }
                    }}
                    style={{
                      width: size, height: size, borderRadius: '50%',
                      background: bg, border, color,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      cursor,
                      position: 'relative',
                      boxShadow: lesson.isUnitChallenge && !locked ? `0 0 0 3px #F59E0B` : 'none',
                      animation: isCurrent ? 'cwPulse 1.8s ease-in-out infinite' : 'none',
                      transition: 'transform 120ms',
                      flexShrink: 0,
                    }}
                  >
                    {done ? (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                           stroke="#FFFBEB" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12l5 5 9-11" />
                      </svg>
                    ) : locked ? (
                      <>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                             stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="11" width="18" height="11" rx="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      </>
                    ) : (
                      <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: lesson.isUnitChallenge ? 18 : 16 }}>
                        {lesson.id}
                      </span>
                    )}
                    {lesson.isUnitChallenge && !locked && (
                      <span style={{
                        position: 'absolute', top: -6, right: -4,
                        fontSize: 14, lineHeight: 1,
                      }}>⭐</span>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Unit progress bar */}
            <div style={{ height: 6, borderRadius: 999, background: '#E5E7EB', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 999,
                background: unit.color,
                width: `${pct * 100}%`,
                transition: 'width 400ms ease',
              }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Active Lesson (View B) ───────────────────────────────────────────────────
function ActiveLesson({ lesson, lang, awardEarn, auth, onBack }) {
  const questions = lesson.questions
  const [qIdx, setQIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [wrongCount, setWrongCount] = useState(0)
  const [showReward, setShowReward] = useState(false)
  const [shakeOption, setShakeOption] = useState(null)
  const [wrongBubble, setWrongBubble] = useState(false)
  const [totalScore, setTotalScore] = useState(0)
  const [done, setDone] = useState(false)
  const shakeTimer = useRef(null)

  const q = questions[qIdx]
  const optionColors = ['#FBBF24', '#3B82F6', '#A855F7']

  function choose(optId) {
    if (selected !== null) return
    setSelected(optId)
    const isCorrect = optId === q.correct

    if (isCorrect) {
      const newScore = totalScore + q.coinsIfCorrect
      setTotalScore(newScore)
      setShowReward(true)
      awardEarn(q.coinsIfCorrect)
      if (auth?.saveProgress) {
        auth.saveProgress(lesson.id, newScore)
      }
      setTimeout(() => {
        setShowReward(false)
        // advance
        if (qIdx + 1 < questions.length) {
          setQIdx(i => i + 1)
          setSelected(null)
          setWrongCount(0)
        } else {
          // lesson complete
          awardEarn(lesson.coinReward)
          if (auth?.saveProgress) {
            auth.saveProgress(lesson.id, newScore + lesson.coinReward)
          }
          setDone(true)
        }
      }, 400)
    } else {
      const newWrong = wrongCount + 1
      setWrongCount(newWrong)
      setShakeOption(optId)
      setWrongBubble(true)
      shakeTimer.current = setTimeout(() => {
        setShakeOption(null)
        setTimeout(() => {
          setSelected(null)
          setWrongBubble(false)
        }, 1100)
      }, 400)
    }
  }

  useEffect(() => () => clearTimeout(shakeTimer.current), [])

  if (done) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, padding: '20px 24px 140px', textAlign: 'center' }}>
        <Moneda size={140} mood="cheer" wave />
        <div style={{
          fontFamily: FONT, fontWeight: 800, fontSize: 36, lineHeight: 1,
          color: COLORS.purple, letterSpacing: '-0.02em',
          textShadow: `3px 3px 0 ${COLORS.ink}`,
        }}>{t(lang, 'lessonDone')}</div>
        <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 18, color: COLORS.ink }}>
          {t(lang, 'rewardPts')} <strong>+{lesson.coinReward} {t(lang, 'points')}</strong>
        </div>
        {lesson.unlocksBuilding && (
          <div style={{
            fontFamily: FONT, fontWeight: 700, fontSize: 16, color: COLORS.yellow,
            background: COLORS.ink, borderRadius: 12, padding: '8px 16px',
          }}>
            🏗️ {lang === 'es' ? '¡Edificio desbloqueado!' : 'Building unlocked!'}
          </div>
        )}
        <ChunkyButton color={COLORS.purple} style={{ color: '#FFFBEB' }} onClick={onBack}>
          {lang === 'es' ? '← Volver al mapa' : '← Back to map'}
        </ChunkyButton>
      </div>
    )
  }

  const bubbleText = wrongBubble
    ? (lang === 'es' ? '¡Casi! Intenta otra vez 💪' : 'Almost! Try again 💪')
    : (q.text[lang])

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px 140px', position: 'relative' }}>
      {/* Scenario panel */}
      <div style={{
        background: '#FFFFFF', borderRadius: 20,
        border: `3px solid ${COLORS.ink}`, boxShadow: `0 4px 0 ${COLORS.ink}`,
        overflow: 'hidden', marginBottom: 14, aspectRatio: '280 / 160',
      }}>
        <Scenario kind={q.scenario} />
      </div>

      {/* Moneda + bubble */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 14 }}>
        <div style={{ flexShrink: 0 }}>
          <Moneda size={72} mood={wrongBubble ? 'sad' : 'think'} />
        </div>
        <SpeechBubble>{bubbleText}</SpeechBubble>
      </div>

      {/* Answer options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {q.options.map((opt, i) => {
          const isSelected = selected === opt.id
          const isCorrect = opt.id === q.correct
          const isWrong = isSelected && !isCorrect
          const showHint = wrongCount >= 2 && isCorrect && selected === null
          const isShaking = shakeOption === opt.id

          const bg = isSelected
            ? (isCorrect ? COLORS.green : COLORS.red)
            : optionColors[i % 3]

          const boxShadow = showHint
            ? '0 0 0 4px rgba(34,197,94,0.5)'
            : undefined

          return (
            <div
              key={opt.id}
              onClick={() => choose(opt.id)}
              style={{
                animation: isShaking ? 'cwShake 400ms ease-in-out' : 'none',
                boxShadow,
                borderRadius: 16,
              }}
            >
              <ChunkyButton
                color={bg}
                fullWidth
                style={{
                  color: (isSelected || i > 0) ? '#FFFBEB' : COLORS.ink,
                  whiteSpace: 'normal', height: 'auto', minHeight: 56,
                  padding: '12px 18px', textAlign: 'left', justifyContent: 'flex-start',
                  opacity: selected !== null && !isSelected && !isCorrect ? 0.6 : 1,
                  borderRadius: 16,
                }}
                onClick={undefined}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12, width: '100%' }}>
                  <span style={{
                    width: 28, height: 28, borderRadius: 999,
                    background: 'rgba(255,255,255,0.9)', color: COLORS.ink,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, fontWeight: 800, flexShrink: 0,
                    border: `2px solid ${COLORS.ink}`,
                  }}>{opt.id}</span>
                  <span style={{ textWrap: 'pretty', flex: 1 }}>{opt.text[lang]}</span>
                </span>
              </ChunkyButton>
            </div>
          )
        })}
      </div>

      {/* Progress dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 18 }}>
        {questions.map((_, i) => (
          <div key={i} style={{
            width: i === qIdx ? 22 : 10, height: 10, borderRadius: 999,
            background: i < qIdx ? COLORS.green : i === qIdx ? COLORS.purple : '#E5E7EB',
            border: `2px solid ${COLORS.ink}`,
            transition: 'width 200ms',
          }} />
        ))}
      </div>

      {showReward && <RewardBurst lang={lang} />}
    </div>
  )
}

// ─── Main LessonScreen ────────────────────────────────────────────────────────
export default function LessonScreen({ lang, setLang, points, setPoints, awardEarn, auth }) {
  const [activeLesson, setActiveLesson] = useState(null)
  const [lockedMsg, setLockedMsg] = useState(null)
  const [progress, setProgress] = useState([])

  useEffect(() => {
    if (auth?.loadProgress) {
      auth.loadProgress().then(p => setProgress(p || []))
    }
  }, [auth])

  function handleLockedMsg(msg) {
    setLockedMsg(msg)
    setTimeout(() => setLockedMsg(null), 1500)
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <style>{CSS}</style>

      {activeLesson === null ? (
        <>
          <ScreenHeader
            color={COLORS.purple} lang={lang} onLang={setLang} points={points}
            titleEs="Aprender" titleEn="Learn"
          />
          <LessonMap
            lang={lang}
            progress={progress}
            onSelect={lesson => setActiveLesson(lesson)}
            onLockedMsg={handleLockedMsg}
          />

          {/* Moneda with locked message */}
          <div style={{
            position: 'absolute', bottom: 80, left: 0, right: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            pointerEvents: 'none', zIndex: 5,
          }}>
            {lockedMsg && (
              <div style={{
                background: '#FFFBEB', border: `3px solid ${COLORS.ink}`,
                borderRadius: 14, padding: '8px 14px', marginBottom: 8,
                fontFamily: FONT, fontWeight: 600, fontSize: 14, color: COLORS.ink,
                maxWidth: 200, textAlign: 'center',
                boxShadow: `0 3px 0 ${COLORS.ink}`,
              }}>
                🔒 {lang === 'es' ? 'Completa las lecciones anteriores primero' : 'Complete previous lessons first'}
              </div>
            )}
            <Moneda size={64} mood={lockedMsg ? 'sad' : 'cheer'} wave={!lockedMsg} />
          </div>
        </>
      ) : (
        <>
          {/* Custom header for active lesson */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
            background: COLORS.purple,
            boxShadow: 'inset 0 -4px 0 rgba(0,0,0,0.15)',
          }}>
            <button
              onClick={() => setActiveLesson(null)}
              style={{
                appearance: 'none', border: 'none', cursor: 'pointer',
                background: 'rgba(255,255,255,0.2)', color: '#FFFBEB',
                borderRadius: 999, width: 36, height: 36, flexShrink: 0,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </button>
            <div style={{ flex: 1, fontFamily: FONT, fontWeight: 700, fontSize: 16, color: '#FFFBEB' }}>
              {lang === 'es' ? activeLesson.titleEs : activeLesson.titleEn}
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 4,
              background: 'rgba(255,255,255,0.2)', borderRadius: 999, padding: '4px 10px',
              fontFamily: FONT, fontWeight: 700, fontSize: 14, color: '#FFFBEB',
            }}>
              🪙 {points}
            </div>
          </div>
          <ActiveLesson
            lesson={activeLesson}
            lang={lang}
            awardEarn={awardEarn}
            auth={auth}
            onBack={() => {
              setActiveLesson(null)
              // reload progress
              if (auth?.loadProgress) {
                auth.loadProgress().then(p => setProgress(p || []))
              }
            }}
          />
        </>
      )}
    </div>
  )
}
