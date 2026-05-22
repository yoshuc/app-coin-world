import { useState, useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './hooks/useAuth.js'
import { useLang } from './hooks/useLang.js'
import { BUILDINGS } from './constants/buildings.js'
import BottomNav from './components/BottomNav.jsx'
import MonedaOnboarding from './components/MonedaOnboarding.jsx'
import ParentalGate from './components/ParentalGate.jsx'

const ProfileScreen = lazy(() => import('./screens/ProfileScreen.jsx'))

const WelcomeScreen = lazy(() => import('./screens/WelcomeScreen.jsx'))
const LoginScreen = lazy(() => import('./screens/LoginScreen.jsx'))
const RegisterScreen = lazy(() => import('./screens/RegisterScreen.jsx'))
const RegisterChildScreen = lazy(() => import('./screens/RegisterChildScreen.jsx'))
const HomeScreen = lazy(() => import('./screens/HomeScreen.jsx'))
const MarketScreen = lazy(() => import('./screens/MarketScreen.jsx'))
const LessonScreen = lazy(() => import('./screens/LessonScreen.jsx'))

function AuthGuard({ children, auth }) {
  const location = useLocation()
  if (auth.loading) {
    return (
      <div style={{
        height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#FFFBEB', fontFamily: 'Fredoka, sans-serif', fontSize: 22, color: '#1F1108',
      }}>
        🪙
      </div>
    )
  }
  if (!auth.session) {
    return <Navigate to="/" state={{ from: location }} replace />
  }
  return children
}

function AppShell({ lang, setLang, auth }) {
  const [tab, setTab] = useState('town')
  const [points, setPoints] = useState(auth.child?.points ?? 24)
  const [unlocked, setUnlocked] = useState([BUILDINGS[0].id])
  const [todayEarned, setTodayEarned] = useState(0)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showGate, setShowGate] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  useEffect(() => {
    // Session count
    const count = parseInt(localStorage.getItem('cw_session_count') || '0', 10) + 1
    localStorage.setItem('cw_session_count', String(count))
    // Onboarding
    if (!localStorage.getItem('cw_onboarding_seen')) {
      setShowOnboarding(true)
    }
  }, [])

  useEffect(() => {
    if (auth.child) {
      setPoints(auth.child.points || 0)
    }
  }, [auth.child])

  useEffect(() => {
    if (!auth.child) return
    auth.loadUnlockedBuildings().then(ids => {
      const base = ids.length > 0 ? ids : [BUILDINGS[0].id]
      setUnlocked(base)
    })
  }, [auth.child])

  function awardEarn(n) {
    const newPoints = points + n
    setPoints(newPoints)
    setTodayEarned(e => e + n)

    const next = BUILDINGS.find(b => !unlocked.includes(b.id))
    if (next && newPoints >= next.cost) {
      setUnlocked(u => u.includes(next.id) ? u : [...u, next.id])
      auth.unlockBuilding(next.id)
    }
    auth.updateChildPoints(n)
  }

  return (
    <div style={{
      position: 'relative', height: '100%', width: '100%',
      background: '#FFFBEB', overflow: 'hidden',
    }}>
      <style>{`
        @keyframes cwViewIn {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes cwPop {
          0% { opacity: 0; transform: translateY(0) scale(0.3); }
          30% { opacity: 1; transform: translateY(-40px) scale(1.1); }
          100% { opacity: 0; transform: translateY(140px) scale(0.8); }
        }
        @keyframes cwFade {
          0% { opacity: 0; } 15% { opacity: 1; }
          85% { opacity: 1; } 100% { opacity: 0; }
        }
        @keyframes cwPunch {
          0% { transform: rotate(-6deg) scale(0); opacity: 0; }
          50% { transform: rotate(-6deg) scale(1.2); opacity: 1; }
          70% { transform: rotate(-6deg) scale(0.95); }
          100% { transform: rotate(-6deg) scale(1); opacity: 1; }
        }
      `}</style>

      <div key={tab} style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        overflow: 'hidden',
        animation: 'cwViewIn 260ms ease-out',
      }}>
        {tab === 'town' && (
          <HomeScreen
            lang={lang} setLang={setLang} points={points}
            unlocked={unlocked} todayEarned={todayEarned}
            goMarket={() => setTab('market')}
            goLearn={() => setTab('learn')}
            allChildren={auth.allChildren}
            activeChild={auth.child}
            switchChild={auth.switchChild}
            addChild={auth.addChild}
            onProfile={() => setShowGate(true)}
          />
        )}
        {tab === 'market' && (
          <MarketScreen
            lang={lang} setLang={setLang} points={points}
            setPoints={setPoints}
          />
        )}
        {tab === 'learn' && (
          <LessonScreen
            lang={lang} setLang={setLang} points={points}
            setPoints={setPoints} awardEarn={awardEarn} auth={auth}
          />
        )}
      </div>

      <BottomNav tab={tab} onTab={setTab} lang={lang} />

      {showOnboarding && (
        <MonedaOnboarding
          lang={lang}
          onDone={() => {
            localStorage.setItem('cw_onboarding_seen', '1')
            setShowOnboarding(false)
          }}
        />
      )}

      {showGate && (
        <ParentalGate
          lang={lang}
          onPass={() => { setShowGate(false); setShowProfile(true) }}
          onClose={() => setShowGate(false)}
        />
      )}

      {showProfile && (
        <Suspense fallback={null}>
          <ProfileScreen
            lang={lang}
            auth={auth}
            onClose={() => setShowProfile(false)}
          />
        </Suspense>
      )}
    </div>
  )
}

function PublicScreenWrapper({ children }) {
  return (
    <div style={{
      position: 'relative', height: '100%', width: '100%',
      background: '#FAFAF7', overflow: 'hidden',
      animation: 'proViewIn 260ms ease-out',
    }}>
      <style>{`
        @keyframes proViewIn {
          0% { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      {children}
    </div>
  )
}

export default function App() {
  const auth = useAuth()
  const { lang, setLang } = useLang()
  const [authError, setAuthError] = useState(null)

  useEffect(() => {
    const hash = window.location.hash
    if (hash.includes('error=access_denied') && hash.includes('error_code=otp_expired')) {
      window.history.replaceState(null, '', window.location.pathname)
      setAuthError('confirmation_expired')
    }
  }, [])

  return (
    <BrowserRouter>
      <div style={{
        width: '100%', height: '100dvh',
        display: 'flex', flexDirection: 'column',
        fontFamily: 'Fredoka, sans-serif',
        maxWidth: 430, margin: '0 auto',
        position: 'relative', overflow: 'hidden',
      }}>
        <Suspense fallback={null}>
        <main style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={
            <PublicScreenWrapper>
              <WelcomeScreen lang={lang} setLang={setLang} />
            </PublicScreenWrapper>
          } />
          <Route path="/login" element={
            <PublicScreenWrapper>
              <LoginScreen lang={lang} setLang={setLang} auth={auth} initialError={authError} />
            </PublicScreenWrapper>
          } />
          <Route path="/register" element={
            <PublicScreenWrapper>
              <RegisterScreen mode="adult" lang={lang} setLang={setLang} auth={auth} />
            </PublicScreenWrapper>
          } />
          <Route path="/register/tutor" element={
            <PublicScreenWrapper>
              <RegisterScreen mode="tutor" lang={lang} setLang={setLang} auth={auth} />
            </PublicScreenWrapper>
          } />
          <Route path="/register/child" element={
            <PublicScreenWrapper>
              <RegisterChildScreen lang={lang} setLang={setLang} auth={auth} />
            </PublicScreenWrapper>
          } />
          <Route path="/app" element={
            <AuthGuard auth={auth}>
              <AppShell lang={lang} setLang={setLang} auth={auth} />
            </AuthGuard>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </main>
        </Suspense>
      </div>
    </BrowserRouter>
  )
}
