import { useState } from 'react'
import { DashIcon } from '../dashboard/Icons'
import './EditaisPage.css'
import './UsuariosPage.css'

type StatusUsuario = 'Admin' | 'Ativo' | 'Inativo'
type PlanoUsuario = 'Premium' | 'Grátis'

type Usuario = {
  id: string
  nome: string
  email: string
  status: StatusUsuario
  plano: PlanoUsuario
}

const INITIAL_USUARIOS: Usuario[] = [
  { id: 'u1', nome: 'Raiane Cecílio', email: 'pontedoedital@gmail.com', status: 'Admin', plano: 'Premium' },
  { id: 'u2', nome: 'Gustavo Nori', email: 'gustavonori@gmail.com', status: 'Admin', plano: 'Premium' },
  { id: 'u3', nome: 'Vitor Mapeli', email: 'vitormapeli@gmail.com', status: 'Admin', plano: 'Premium' },
  { id: 'u4', nome: 'Gustavo Del Vechio', email: 'gustavovechio@gmail.com', status: 'Ativo', plano: 'Premium' },
  { id: 'u5', nome: 'Luciano Barros', email: 'lucianobarros@gmail.com', status: 'Ativo', plano: 'Grátis' },
  { id: 'u6', nome: 'Carlos Filho', email: 'carlosfilho@gmail.com', status: 'Ativo', plano: 'Grátis' },
]

function iniciais(nome: string) {
  return nome.split(' ').slice(0, 2).map((p) => p[0]).join('').toUpperCase()
}

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>(INITIAL_USUARIOS)
  const [busca, setBusca] = useState('')
  const [mostrarTodos, setMostrarTodos] = useState(true)
  const [editando, setEditando] = useState<Usuario | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const termo = busca.toLowerCase()
  const filtrados = usuarios.filter((u) => {
    const bate = u.nome.toLowerCase().includes(termo) || u.email.toLowerCase().includes(termo)
    if (!mostrarTodos) return bate && u.status === 'Ativo'
    return bate
  })

  function avisar(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 2200)
  }

  function salvarStatus(id: string, isAdmin: boolean, desabilitado: boolean) {
    setUsuarios((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: desabilitado ? 'Inativo' : isAdmin ? 'Admin' : 'Ativo' } : u
      )
    )
    setEditando(null)
    avisar('Status atualizado')
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
              <th>Plano</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length === 0 && (
              <tr className="pda-empty-row">
                <td colSpan={5}>Nenhum usuário encontrado.</td>
              </tr>
            )}
            {filtrados.map((u, i) => (
              <tr key={u.id} style={{ animationDelay: `${i * 40}ms` }}>
                <td data-label="Usuário">
                  <div className="pda-user-cell">
                    <span className="pda-avatar">{iniciais(u.nome)}</span>
                    <span className="pda-cell-title">{u.nome}</span>
                  </div>
                </td>
                <td data-label="E-mail">{u.email}</td>
                <td data-label="Status">
                  <span className={`pda-badge pda-badge--${u.status.toLowerCase()}`}>{u.status}</span>
                </td>
                <td data-label="Plano">{u.plano}</td>
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
  usuario: Usuario
  onCancel: () => void
  onSave: (id: string, isAdmin: boolean, desabilitado: boolean) => void
}) {
  const [isAdmin, setIsAdmin] = useState(usuario.status === 'Admin')
  const [desabilitado, setDesabilitado] = useState(usuario.status === 'Inativo')

  return (
    <div className="pda-overlay" onClick={onCancel}>
      <div
        className="pda-modal pda-modal--dark pda-modal--left"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="pda-modal-title">Editar Status</h2>
        <p className="pda-modal-note pda-modal-note--tight">{usuario.nome}</p>

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

        <div className="pda-status-row">
          Desabilitar usuário
          <button
            type="button"
            className={`pda-switch ${desabilitado ? 'is-on' : ''}`}
            aria-pressed={desabilitado}
            onClick={() => setDesabilitado((v) => !v)}
          >
            <span className="pda-switch__knob" />
          </button>
        </div>

        <button
          type="button"
          className="pda-btn pda-btn--teal"
          style={{ marginTop: '1.1rem' }}
          onClick={() => onSave(usuario.id, isAdmin, desabilitado)}
        >
          Salvar
        </button>
      </div>
    </div>
  )
}
