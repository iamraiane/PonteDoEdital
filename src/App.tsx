import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import SignupFlow from './pages/SignupFlow'
import LoginFlow from './pages/LoginFlow'
import RecoverFlow from './pages/RecoverFlow'
import ResetPasswordPage from './pages/ResetPasswordPage'
import DashboardApp from './pages/dashboard/DashboardApp'
import AdminApp from './pages/admin/AdminApp'
import CommercialPage from './pages/CommercialPage'
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'
import { getTokenPayload, getUserById } from './services/user'

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token')
  const loginTime = localStorage.getItem('loginTime')

  if (!token || !loginTime) return <Navigate to="/login" replace />
  if (Date.now() - Number(loginTime) > THREE_DAYS_MS) {
    localStorage.removeItem('token')
    localStorage.removeItem('loginTime')
    return <Navigate to="/login" replace />
  }
  const payload = getTokenPayload()
  if (!payload?.id) {
    localStorage.removeItem('token')
    localStorage.removeItem('loginTime')
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function App() {
  const [userName, setUserName] = useState('')
  const [userId, setUserId] = useState<number | undefined>()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const loginTime = localStorage.getItem('loginTime')

    if (!token || !loginTime) {
      setChecking(false)
      return
    }

    if (Date.now() - Number(loginTime) > THREE_DAYS_MS) {
      localStorage.removeItem('token')
      localStorage.removeItem('loginTime')
      setChecking(false)
      return
    }

    const payload = getTokenPayload()
    if (!payload?.id) {
      localStorage.removeItem('token')
      localStorage.removeItem('loginTime')
      setChecking(false)
      return
    }

    getUserById(payload.id)
      .then((user) => {
        setUserName(user.name)
        setUserId(user.id)
      })
      .catch(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('loginTime')
      })
      .finally(() => setChecking(false))
  }, [])

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('loginTime')
    window.location.href = '/login'
  }

  if (checking) return null

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginFlow />} />
        <Route path="/signup" element={<SignupFlow />} />
        <Route path="/recover" element={<RecoverFlow />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/commercial" element={<CommercialPage />} />
        <Route index element={<Navigate to="/commercial" replace />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardApp
                userName={userName}
                userId={userId}
                onLogout={handleLogout}
                onOpenAdmin={() => window.location.href = '/admin'}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminApp
                onExitAdmin={() => window.location.href = '/dashboard'}
                onLogout={handleLogout}
              />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
