import { useEffect, useState } from 'react'
import { DashIcon, DashAvatar } from './Icons'
import './FeedPage.css'
import { getNotices, type NoticeApi } from '../../services/notice'

const ESTADOS = [
  'Todos', 'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS',
  'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
]

type Edital = {
  id: string
  orgao: string
  local: string
  tempo: string
  tag: string
  tipo: string
  titulo: string
  descricao: string
  prazo: string
  link: string
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour >= 12 && hour < 18) return 'Boa tarde'
  if (hour >= 18 || hour < 5) return 'Boa noite'
  return 'Bom dia'
}

function formatTimeAgo(dateStr: string | null): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 60) return `há ${diffMin} min`
  const diffH = Math.floor(diffMin / 60)
  if (diffH < 24) return `há ${diffH}h`
  const diffD = Math.floor(diffH / 24)
  return `há ${diffD} dias`
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'Sem prazo'
  const date = new Date(dateStr)
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function mapNoticeToEdital(n: NoticeApi): Edital {
  return {
    id: String(n.id),
    orgao: n.title,
    local: n.state ?? 'Local não informado',
    tempo: formatTimeAgo(n.created_at),
    tag: n.state_code ?? n.state ?? '',
    tipo: 'Edital Público',
    titulo: n.description?.split('\n')[0]?.substring(0, 80) ?? n.title,
    descricao: n.description ?? '',
    prazo: formatDate(n.publication_date),
    link: n.link,
  }
}

export default function FeedPage({ userName, userId, hasPremium = false, onNavigate }: { userName: string; userId?: number; hasPremium?: boolean; onNavigate?: (page: string) => void }) {
  const [estado, setEstado] = useState('Todos')
  const [salvos, setSalvos] = useState<Record<string, boolean>>({})
  const [agendados, setAgendados] = useState<Record<string, boolean>>({})
  const [editais, setEditais] = useState<Edital[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return
    setLoading(true)
    getNotices(userId)
      .then((data) => setEditais(data.map(mapNoticeToEdital)))
      .catch(() => setError('Erro ao carregar editais'))
      .finally(() => setLoading(false))
  }, [userId])

  function toggleSalvo(id: string) {
    setSalvos((s) => ({ ...s, [id]: !s[id] }))
  }

  function agendar(id: string) {
    setAgendados((s) => ({ ...s, [id]: true }))
  }

  const filteredEditais =
    estado === 'Todos' ? editais : editais.filter((e) => e.tag === estado)

  return (
    <div className="pdd-feed">
      <h1 className="pdd-greeting">
        {getGreeting()}, <span>{userName}</span>
      </h1>

      <div className="pdd-filters">
        {ESTADOS.map((e) => (
          <button
            key={e}
            type="button"
            className={`pdd-pill ${estado === e ? 'is-active' : ''}`}
            onClick={() => setEstado(e)}
          >
            {e}
          </button>
        ))}
      </div>

      {loading && <p>Carregando editais...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="pdd-edital-list">
        {!loading && filteredEditais.length === 0 && <p>Nenhum edital encontrado.</p>}
        {filteredEditais.map((e, i) => (
          <article
            key={e.id}
            className="pdd-edital-card"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="pdd-edital-card__head">
              <div className="pdd-edital-card__org">
                <DashAvatar size={34} seed={i} />
                <div>
                  <p className="pdd-edital-card__org-name">{e.orgao}</p>
                  <p className="pdd-edital-card__org-meta">
                    <DashIcon name="pin" /> {e.local} · {e.tempo}
                  </p>
                </div>
              </div>
              <span className="pdd-tag">{e.tag}</span>
            </div>

            <p className="pdd-edital-card__tipo">
              <DashIcon name="building" /> {e.tipo}
            </p>

            <div className="pdd-edital-card__panel">
              <h2 className="pdd-edital-card__titulo">{e.titulo}</h2>
              <p className="pdd-edital-card__desc">{e.descricao}</p>
            </div>

            <div className="pdd-edital-card__actions">
              <button
                type="button"
                className={`pdd-btn-outline ${agendados[e.id] ? 'is-done' : ''}`}
                onClick={() => hasPremium ? agendar(e.id) : onNavigate?.('plans')}
              >
                <DashIcon name="schedule" />
                {agendados[e.id] ? 'Agendado' : 'Agendar prazo'}
                {!hasPremium && <span className="pdd-btn-outline__trophy"><DashIcon name="trophy" /></span>}
              </button>
              <button
                type="button"
                className={`pdd-bookmark-btn ${salvos[e.id] ? 'is-active' : ''}`}
                onClick={() => toggleSalvo(e.id)}
                aria-label={salvos[e.id] ? 'Remover dos salvos' : 'Salvar edital'}
              >
                <DashIcon name={salvos[e.id] ? 'bookmark-filled' : 'bookmark'} />
              </button>
            </div>

            <div className="pdd-edital-card__footer">
              <span><DashIcon name="clock" /> Prazo: {e.prazo}</span>
              <a href={e.link} target="_blank" rel="noopener noreferrer">Ver detalhes <DashIcon name="arrow" /></a>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
