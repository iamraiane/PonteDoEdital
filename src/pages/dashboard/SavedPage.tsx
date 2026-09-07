import { useEffect, useState } from 'react'
import { DashIcon, DashAvatar } from './Icons'
import { getFavorites, removeFavorite, type Favorite } from '../../services/favorite'
import './SavedPage.css'

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function SavedPage({ userId }: { userId?: number }) {
  const [items, setItems] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)
  const [removing, setRemoving] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return
    setLoading(true)
    getFavorites()
      .then(setItems)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [userId])

  function remove(id: string) {
    const noticeId = parseInt(id)
    setRemoving(id)
    removeFavorite(noticeId)
      .then(() => {
        setItems((list) => list.filter((it) => String(it.notice_id) !== id))
      })
      .catch(() => {})
      .finally(() => setRemoving(null))
  }

  return (
    <div className="pdd-saved-page">
      <h1 className="pdd-page-title">Editais Salvos</h1>

      {loading && <p>Carregando...</p>}

      <div className="pdd-saved-list">
        {!loading && items.map((fav, i) => {
          const n = fav.notice
          return (
            <article
              key={fav.id}
              className={`pdd-saved-card ${removing === String(fav.notice_id) ? 'is-removing' : ''}`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <DashAvatar size={48} seed={i} />

              <div className="pdd-saved-card__body">
                <div className="pdd-saved-card__row">
                  <span className="pdd-saved-card__org">{n.state_code || n.state || 'Edital'}</span>
                  {n.state && <span className="pdd-tag pdd-tag--light">{n.state}</span>}
                </div>
                <h2 className="pdd-saved-card__titulo">{n.title}</h2>
                <p className="pdd-saved-card__meta">
                  <DashIcon name="clock" /> Prazo: {formatDate(n.publication_date)}
                </p>
              </div>

              <div className="pdd-saved-card__actions">
                <a href={n.link} target="_blank" rel="noopener noreferrer" className="pdd-status-btn">
                  <DashIcon name="arrow" /> Ver detalhes
                </a>
                <button type="button" className="pdd-remove-btn" onClick={() => remove(String(fav.notice_id))}>
                  <DashIcon name="trash" /> Remover
                </button>
              </div>
            </article>
          )
        })}

        {!loading && items.length === 0 && (
          <p className="pdd-saved-empty">Você ainda não tem editais salvos.</p>
        )}
      </div>
    </div>
  )
}
