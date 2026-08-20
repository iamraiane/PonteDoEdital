import { useState, useEffect } from 'react'
import SignupFlow from './pages/SignupFlow'
import LoginFlow from './pages/LoginFlow'
import RecoverFlow from './pages/RecoverFlow'
import DashboardApp from './pages/dashboard/DashboardApp'
import AdminApp from './pages/admin/AdminApp'
import { getTokenPayload, getUserById } from './services/user'

type Screen = 'login' | 'signup' | 'recover' | 'dashboard' | 'admin'

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000

function App() {
  const [screen, setScreen] = useState<Screen>('signup')
  const [userName, setUserName] = useState('')
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const loginTime = localStorage.getItem('loginTime')

    if (!token || !loginTime) {
      setChecking(false)
      setScreen('login')
      return
    }

    const elapsed = Date.now() - Number(loginTime)
    if (elapsed > THREE_DAYS_MS) {
      localStorage.removeItem('token')
      localStorage.removeItem('loginTime')
      setChecking(false)
      setScreen('login')
      return
    }

    const payload = getTokenPayload()
    if (!payload?.id) {
      localStorage.removeItem('token')
      localStorage.removeItem('loginTime')
      setChecking(false)
      setScreen('login')
      return
    }

    getUserById(payload.id)
      .then((user) => {
        setUserName(user.name)
        setScreen('dashboard')
      })
      .catch(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('loginTime')
        setScreen('login')
      })
      .finally(() => setChecking(false))
  }, [])

  if (checking) return null

  if (screen === 'login') {
    return (
      <LoginFlow
        onSwitchToSignup={() => setScreen('signup')}
        onSwitchToRecover={() => setScreen('recover')}
        onLoginSuccess={(nome) => {
          setUserName(nome)
          setScreen('dashboard')
        }}
      />
    )
  }

  if (screen === 'recover') {
    return <RecoverFlow onSwitchToLogin={() => setScreen('login')} />
  }

  if (screen === 'admin') {
    return (
      <AdminApp
        onExitAdmin={() => setScreen('dashboard')}
        onLogout={() => {
          localStorage.removeItem('token')
          localStorage.removeItem('loginTime')
          setScreen('login')
        }}
      />
    )
  }

  if (screen === 'dashboard') {
    return (
      <DashboardApp
        userName={userName}
        onLogout={() => {
          localStorage.removeItem('token')
          localStorage.removeItem('loginTime')
          setScreen('login')
        }}
        onOpenAdmin={() => setScreen('admin')}
      />
    )
  }

  return (
    <SignupFlow
      onSwitchToLogin={() => setScreen('login')}
      onFinish={(nome) => {
        setUserName(nome)
        setScreen('dashboard')
      }}
    />
  )
}

export default App
