import { useState } from 'react'
import SignupFlow from './pages/SignupFlow'
import LoginFlow from './pages/LoginFlow'
import RecoverFlow from './pages/RecoverFlow'
import DashboardApp from './pages/dashboard/DashboardApp'

type Screen = 'login' | 'signup' | 'recover' | 'dashboard'

function App() {
  const [screen, setScreen] = useState<Screen>('signup')
  const [userName, setUserName] = useState('Raiane')

  if (screen === 'login') {
    return (
      <LoginFlow
        onSwitchToSignup={() => setScreen('signup')}
        onSwitchToRecover={() => setScreen('recover')}
        onLoginSuccess={() => setScreen('dashboard')}
      />
    )
  }

  if (screen === 'recover') {
    return <RecoverFlow onSwitchToLogin={() => setScreen('login')} />
  }

  if (screen === 'dashboard') {
    return <DashboardApp userName={userName} onLogout={() => setScreen('login')} />
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