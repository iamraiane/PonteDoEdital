import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashIcon } from '../dashboard/Icons'
import { getAllUsers, promoteToAdmin, demoteToUser, getTokenPayload } from '../../services/user'
import type { UserData } from '../../services/user'
import './EditaisPage.css'
import './UsuariosPage.css'

function iniciais(nome: string) {
  return nome.split(' ').slice(0, 2).map((p) => p[0]).join('').toUpperCase()
}

export default function UsuariosPage() {
  const navigate = useNavigate()
  const currentUserId = getTokenPayload()?.id
  const [usuarios, setUsuarios] = useState<UserData[]>([])
  const [busca, setBusca] = useState('')
  const [mostrarTodos, setMostrarTodos] = useState(true)
  const [editando, setEditando] = useState<UserData | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    try {
      setLoading(true)
      const data = await getAllUsers()
      setUsuarios(data)
    } catch (err) {
      console.error('Erro ao carregar usuários:', err)
      avisar('Erro ao carregar usuários')
    } finally {
      setLoading(false)
    }
  }

  const termo = busca.toLowerCase()
  const filtrados = usuarios.filter((u) => {
    const bate = u.name.toLowerCase().includes(termo) || u.email.toLowerCase().includes(termo)
    if (!mostrarTodos) return bate && u.role === 'user'
    return bate
  })

  function avisar(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 2200)
  }

  async function salvarStatus(id: number, isAdmin: boolean) {
    try {
      if (isAdmin) {
        await promoteToAdmin(id)
        avisar('Usuário promovido a admin')
      } else {
        await demoteToUser(id)
        if (id === currentUserId) {
          navigate('/dashboard')
          return
        }
        avisar('Usuário removido de admin')
      }
      setUsuarios((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role: isAdmin ? 'admin' : 'user' } : u))
      )
      setEditando(null)
    } catch (err) {
      console.error('Erro ao atualizar status:', err)
      avisar('Erro ao atualizar status')
    }
  }

  function getRoleLabel(role: string) {
    switch (role) {
      case 'admin':
        return 'Admin'
      case 'premium':
        return 'Premium'
      default:
        return 'Ativo'
    }
  }

  if (loading) {
    return (
      <div className="pda-usuarios-page">
        <h1 className="pda-page-title">Gerenciamento de Usuários</h1>
        <p className="pda-page-sub">Carregando usuários...</p>
      </div>
    )
  }

  return (
    <div className="pda-usuarios-page">
      <h1 className="pda-page-title">Gerenciamento de Usuários</h1>
      <p className="pda-page-sub">Controle acessos, planos e permissões</p>

      <div className="pda-toolbar">
        <label className="pda-search">
          <span className="pda-search__glyph"><DashIcon name="search" /></span>
          <input
            type="text"
            placeholder="Buscar por nome ou email"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </label>

        <label className="pda-toggle-label">
          Mostrar todos
          <button
            type="button"
            className={`pda-switch ${mostrarTodos ? 'is-on' : ''}`}
            aria-pressed={mostrarTodos}
            onClick={() => setMostrarTodos((v) => !v)}
          >
            <span className="pda-switch__knob" />
          </button>
        </label>
      </div>

      <div className="pda-table-wrap">
        <table className="pda-table">
          <thead>
            <tr>
              <th>Usuário</th>
              <th>E-mail</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length === 0 && (
              <tr className="pda-empty-row">
                <td colSpan={4}>Nenhum usuário encontrado.</td>
              </tr>
            )}
            {filtrados.map((u, i) => (
              <tr key={u.id} style={{ animationDelay: `${i * 40}ms` }}>
                <td data-label="Usuário">
                  <div className="pda-user-cell">
                    <span className="pda-avatar">{iniciais(u.name)}</span>
                    <span className="pda-cell-title">{u.name}</span>
                  </div>
                </td>
                <td data-label="E-mail">{u.email}</td>
                <td data-label="Status">
                  <span className={`pda-badge pda-badge--${u.role === 'admin' ? 'admin' : u.role === 'premium' ? 'premium' : 'ativo'}`}>
                    {getRoleLabel(u.role)}
                  </span>
                </td>
                <td className="pda-actions-cell pda-actions-cell--single" data-label="Ações">
                  <button
                    type="button"
                    className="pda-adjust-btn"
                    onClick={() => setEditando(u)}
                  >
                    Ajustar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editando && (
        <EditarStatusModal usuario={editando} onCancel={() => setEditando(null)} onSave={salvarStatus} />
      )}

      {toast && <div className="pda-toast">{toast}</div>}
    </div>
  )
}

function EditarStatusModal({
  usuario,
  onCancel,
  onSave,
}: {
  usuario: UserData
  onCancel: () => void
  onSave: (id: number, isAdmin: boolean) => void
}) {
  const [isAdmin, setIsAdmin] = useState(usuario.role === 'admin')

  return (
    <div className="pda-overlay" onClick={onCancel}>
      <div
        className="pda-modal pda-modal--dark pda-modal--left"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="pda-modal-title">Editar Status</h2>
        <p className="pda-modal-note pda-modal-note--tight">{usuario.name}</p>

        <div className="pda-status-row">
          Habilitar para Admin
          <button
            type="button"
            className={`pda-switch ${isAdmin ? 'is-on' : ''}`}
            aria-pressed={isAdmin}
            onClick={() => setIsAdmin((v) => !v)}
          >
            <span className="pda-switch__knob" />
          </button>
        </div>

        <div className="pda-status-row" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
          Desabilitar usuário
          <button
            type="button"
            className="pda-switch"
            disabled
            title="Em breve"
          >
            <span className="pda-switch__knob" />
          </button>
        </div>

        <button
          type="button"
          className="pda-btn pda-btn--teal"
          style={{ marginTop: '1.1rem' }}
          onClick={() => onSave(usuario.id, isAdmin)}
        >
          Salvar
        </button>
      </div>
    </div>
  )
}
