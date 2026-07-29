import { useState } from 'react'
import AdminShell, { type AdminPageKey } from './AdminShell'
import OverviewPage from './OverviewPage'
import EditaisPage from './EditaisPage'
import UsuariosPage from './UsuariosPage'

export default function AdminApp({
  onExitAdmin,
  onLogout,
}: {
  onExitAdmin?: () => void
  onLogout?: () => void
}) {
  const [page, setPage] = useState<AdminPageKey>('overview')

  return (
    <AdminShell active={page} onNavigate={setPage} onExitAdmin={onExitAdmin} onLogout={onLogout}>
      {page === 'overview' && <OverviewPage />}
      {page === 'editais' && <EditaisPage />}
      {page === 'usuarios' && <UsuariosPage />}
    </AdminShell>
  )
}
