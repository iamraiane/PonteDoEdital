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
import { getUserSubscription } from '../../services/user'

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
  onLogout,
  onOpenAdmin,
}: {
  userName?: string
  userId?: number
  onLogout?: () => void
  onOpenAdmin?: () => void
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const [hasPremium, setHasPremium] = useState(false)
  const [profile, setProfile] = useState<ProfileData>({
    nome: userName === 'Raiane' ? 'Raiane de Oliveira Cecílio' : userName,
    email: 'pontedoedital@gmail.com',
    telefone: '',
    regiao: 'Sudeste',
    interesses: ['Tecnologia', 'Engenharia'],
    avatarUrl: null,
  })

  const pathSegment = location.pathname.split('/')[2] || 'feed'
  const page: PageKey = ROUTE_MAP[pathSegment] || 'feed'

  useEffect(() => {
    if (!userId) return
    getUserSubscription(userId)
      .then((data) => setHasPremium(data.hasPremium))
      .catch(() => setHasPremium(false))
  }, [userId])

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
        <Route path="feed" element={<FeedPage userName={firstName} hasPremium={hasPremium} onNavigate={(p) => navigate(`/dashboard/${p}`)} />} />
        <Route path="calendar" element={<CalendarPage hasPremium={hasPremium} onNavigate={(p) => navigate(`/dashboard/${p}`)} />} />
        <Route path="saved" element={<SavedPage />} />
        <Route path="plans" element={<PlansPage />} />
        <Route path="faq" element={<FaqPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="profile" element={<ProfilePage profile={profile} onChange={setProfile} />} />
      </Routes>
    </DashboardShell>
  )
}
