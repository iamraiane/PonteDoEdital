import { useState } from 'react'
import DashboardShell, { type PageKey } from './DashboardShell'
import FeedPage from './FeedPage'
import CalendarPage from './CalendarPage'
import SavedPage from './SavedPage'
import PlansPage from './PlansPage'
import FaqPage from './FaqPage'
import AboutPage from './AboutPage'
import ProfilePage, { type ProfileData } from './ProfilePage'

export default function DashboardApp({
  userName = 'Raiane',
  onLogout,
}: {
  userName?: string
  onLogout?: () => void
}) {
  const [page, setPage] = useState<PageKey>('feed')
  const [profile, setProfile] = useState<ProfileData>({
    nome: userName === 'Raiane' ? 'Raiane de Oliveira Cecílio' : userName,
    email: 'pontedoedital@gmail.com',
    telefone: '',
    regiao: 'Sudeste',
    interesses: ['Tecnologia', 'Engenharia'],
    avatarUrl: null,
  })

  const firstName = profile.nome.trim().split(' ')[0] || userName
  const preference = profile.interesses.length > 0 ? profile.interesses.join(' & ') : undefined

  return (
    <DashboardShell
      active={page}
      onNavigate={setPage}
      userName={firstName}
      preference={preference}
      avatarUrl={profile.avatarUrl}
      onLogout={onLogout}
    >
      {page === 'feed' && <FeedPage userName={firstName} />}
      {page === 'calendar' && <CalendarPage />}
      {page === 'saved' && <SavedPage />}
      {page === 'plans' && <PlansPage />}
      {page === 'faq' && <FaqPage />}
      {page === 'about' && <AboutPage />}
      {page === 'profile' && <ProfilePage profile={profile} onChange={setProfile} />}
    </DashboardShell>
  )
}