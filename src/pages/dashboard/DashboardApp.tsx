import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import DashboardShell, { type PageKey } from './DashboardShell'
import FeedPage from './FeedPage'
import CalendarPage from './CalendarPage'
import SavedPage from './SavedPage'
import PlansPage from './PlansPage'
import FaqPage from './FaqPage'
import AboutPage from './AboutPage'
import ProfilePage, { type ProfileData } from './ProfilePage'
import { getUserById, updateUser } from '../../services/user'

const ROUTE_MAP: Record<string, PageKey> = {
  feed: 'feed',
  calendar: 'calendar',
  saved: 'saved',
  plans: 'plans',
  faq: 'faq',
  about: 'about',
  profile: 'profile',
}

const KEY_TO_ROUTE: Record<PageKey, string> = {
  feed: '/dashboard/feed',
  calendar: '/dashboard/calendar',
  saved: '/dashboard/saved',
  plans: '/dashboard/plans',
  faq: '/dashboard/faq',
  about: '/dashboard/about',
  profile: '/dashboard/profile',
}

export default function DashboardApp({
  userName = 'Raiane',
  userId,
  userRole,
  onLogout,
  onOpenAdmin,
}: {
  userName?: string
  userId?: number
  userRole?: string
  onLogout?: () => void
  onOpenAdmin?: () => void
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const [hasPremium, setHasPremium] = useState(false)
  const [profile, setProfile] = useState<ProfileData>({
    nome: userName || '',
    email: '',
    cpf: '',
    dataNascimento: '',
    estado: '',
    interesses: [],
    avatarUrl: null,
  })

  useEffect(() => {
    if (!userId) return
    getUserById(userId)
      .then((data) => {
        setProfile({
          nome: data.name || '',
          email: data.email || '',
          cpf: data.cpf || '',
          dataNascimento: data.data_nascimento || '',
          estado: data.state_code || '',
          interesses: data.preferences || [],
          avatarUrl: null,
        })
      })
      .catch(console.error)
  }, [userId])

  const pathSegment = location.pathname.split('/')[2] || 'feed'
  const page: PageKey = ROUTE_MAP[pathSegment] || 'feed'

  useEffect(() => {
    setHasPremium(userRole === 'premium' || userRole === 'admin')
  }, [userRole])

  async function handleSaveProfile() {
    if (!userId) return
    await updateUser(userId, {
      name: profile.nome,
      state_code: profile.estado,
      preferences: profile.interesses,
    })
  }

  function handleNavigate(key: PageKey) {
    navigate(KEY_TO_ROUTE[key])
  }

  const firstName = profile.nome.trim().split(' ')[0] || userName
  const preference = profile.interesses.length > 0 ? profile.interesses.join(' & ') : undefined

  return (
    <DashboardShell
      active={page}
      onNavigate={handleNavigate}
      userName={firstName}
      preference={preference}
      avatarUrl={profile.avatarUrl}
      hasPremium={hasPremium}
      onLogout={onLogout}
      onOpenAdmin={onOpenAdmin}
    >
      <Routes>
        <Route index element={<Navigate to="feed" replace />} />
        <Route path="feed" element={<FeedPage userName={firstName} userId={userId} hasPremium={hasPremium} onNavigate={(p) => navigate(`/dashboard/${p}`)} />} />
        <Route path="calendar" element={<CalendarPage hasPremium={hasPremium} userId={userId} onNavigate={(p) => navigate(`/dashboard/${p}`)} />} />
        <Route path="saved" element={<SavedPage userId={userId} />} />
        <Route path="plans" element={<PlansPage />} />
        <Route path="faq" element={<FaqPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="profile" element={<ProfilePage profile={profile} onChange={setProfile} onSave={handleSaveProfile} />} />
      </Routes>
    </DashboardShell>
  )
}
