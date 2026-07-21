import { useState } from 'react'
import { DashIcon, DashAvatar } from './Icons'
import './SavedPage.css'

type SavedEdital = {
  id: string
  orgao: string
  local: string
  tag: string
  titulo: string
  prazo: string
  agendado: boolean
}

const INITIAL: SavedEdital[] = [
  { id: '1', orgao: 'Prefeitura de Candido Rodrigues', local: 'Candido Rodrigues / SP', tag: 'Infraestrutura', titulo: 'Reforma do Complexo Esportivo Municipal', prazo: '03 Ago 2026', agendado: true },
  { id: '2', orgao: 'Prefeitura de Candido Rodrigues', local: 'Candido Rodrigues / SP', tag: 'Infraestrutura', titulo: 'Reforma do Complexo Esportivo Municipal', prazo: '03 Ago 2026', agendado: true },
  { id: '3', orgao: 'Prefeitura de Candido Rodrigues', local: 'Candido Rodrigues / SP', tag: 'Infraestrutura', titulo: 'Reforma do Complexo Esportivo Municipal', prazo: '03 Ago 2026', agendado: false },
  { id: '4', orgao: 'Prefeitura de Candido Rodrigues', local: 'Candido Rodrigues / SP', tag: 'Infraestrutura', titulo: 'Reforma do Complexo Esportivo Municipal', prazo: '03 Ago 2026', agendado: false },
]

export default function SavedPage() {
  const [items, setItems] = useState(INITIAL)
  const [removing, setRemoving] = useState<string | null>(null)

  function toggleAgendado(id: string) {
    setItems((list) => list.map((it) => (it.id === id ? { ...it, agendado: true } : it)))
  }

  function remove(id: string) {
    setRemoving(id)
    window.setTimeout(() => {
      setItems((list) => list.filter((it) => it.id !== id))
      setRemoving(null)
    }, 260)
  }

  return (
    <div className="pdd-saved-page">
      <h1 className="pdd-page-title">Editais Salvos</h1>

      <div className="pdd-saved-list">
        {items.map((e, i) => (
          <article
            key={e.id}
            className={`pdd-saved-card ${removing === e.id ? 'is-removing' : ''}`}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <DashAvatar size={48} seed={i} />

            <div className="pdd-saved-card__body">
              <div className="pdd-saved-card__row">
                <span className="pdd-saved-card__org">{e.orgao}</span>
                <span className="pdd-tag pdd-tag--light">{e.tag}</span>
              </div>
              <h2 className="pdd-saved-card__titulo">{e.titulo}</h2>
              <p className="pdd-saved-card__meta">
                <DashIcon name="people" /> {e.local}
                <span className="pdd-saved-card__dot" />
                <DashIcon name="clock" /> Prazo: {e.prazo}
              </p>
            </div>

            <div className="pdd-saved-card__actions">
              <button
                type="button"
                className={`pdd-status-btn ${e.agendado ? 'is-done' : ''}`}
                onClick={() => !e.agendado && toggleAgendado(e.id)}
                disabled={e.agendado}
              >
                <DashIcon name="schedule" /> {e.agendado ? 'Agendado' : 'Agendar'}
              </button>
              <button type="button" className="pdd-remove-btn" onClick={() => remove(e.id)}>
                <DashIcon name="trash" /> Remover
              </button>
            </div>
          </article>
        ))}

        {items.length === 0 && (
          <p className="pdd-saved-empty">Você ainda não tem editais salvos.</p>
        )}
      </div>
    </div>
  )
}
