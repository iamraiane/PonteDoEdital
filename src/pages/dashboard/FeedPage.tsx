import { useState } from 'react'
import { DashIcon, DashAvatar } from './Icons'
import './FeedPage.css'

const CATEGORIAS = ['Todos', 'Infraestrutura', 'Tecnologia', 'Saúde', 'Cultura', 'Serviços']

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
}

const EDITAIS: Edital[] = [
  {
    id: '1',
    orgao: 'Prefeitura de Candido Rodrigues',
    local: 'Candido Rodrigues / SP',
    tempo: 'há 2 horas',
    tag: 'Infraestrutura',
    tipo: 'Concurso Público',
    titulo: 'Reforma do Complexo Esportivo Municipal',
    descricao:
      'Contratação de empresa especializada para execução de obras de infraestrutura, iluminação LED e recuperação de arquibancadas do complexo esportivo municipal.',
    prazo: '03 Ago 2026',
  },
]

export default function FeedPage({ userName }: { userName: string }) {
  const [categoria, setCategoria] = useState('Todos')
  const [salvos, setSalvos] = useState<Record<string, boolean>>({})
  const [agendados, setAgendados] = useState<Record<string, boolean>>({})

  function toggleSalvo(id: string) {
    setSalvos((s) => ({ ...s, [id]: !s[id] }))
  }

  function agendar(id: string) {
    setAgendados((s) => ({ ...s, [id]: true }))
  }

  return (
    <div className="pdd-feed">
      <h1 className="pdd-greeting">
        Bom dia, <span>{userName}</span>
      </h1>

      <div className="pdd-filters">
        {CATEGORIAS.map((c) => (
          <button
            key={c}
            type="button"
            className={`pdd-pill ${categoria === c ? 'is-active' : ''}`}
            onClick={() => setCategoria(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="pdd-edital-list">
        {EDITAIS.map((e, i) => (
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
                onClick={() => agendar(e.id)}
              >
                <DashIcon name="schedule" />
                {agendados[e.id] ? 'Agendado' : 'Agendar prazo'}
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
              <a href="#detalhes">Ver detalhes <DashIcon name="arrow" /></a>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}