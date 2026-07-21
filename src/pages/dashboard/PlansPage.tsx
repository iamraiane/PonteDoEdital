import { useState } from 'react'
import { DashIcon } from './Icons'
import './PlansPage.css'

const PLANS = [
  {
    id: 'free',
    nome: 'Grátis',
    preco: 'R$ 0',
    destaque: false,
    features: ['Até 5 editais salvos', 'Feed personalizado básico', 'Notificações por e-mail'],
    cta: 'Continuar',
  },
  {
    id: 'premium',
    nome: 'Premium',
    preco: 'R$ 39,90',
    destaque: true,
    features: [
      'Editais ilimitados',
      'Calendário com lembretes',
      'Filtro avançado',
      'Alertas em tempo real',
      'Painel de acompanhamento',
    ],
    cta: 'Assinar',
  },
]

export default function PlansPage() {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="pdd-plans-page">
      <h1 className="pdd-page-title">Planos</h1>
      <p className="pdd-plans-sub">Escolha o plano ideal para você</p>

      <div className="pdd-plans-grid">
        {PLANS.map((p, i) => (
          <div
            key={p.id}
            className={`pdd-plan-card ${p.destaque ? 'is-featured' : ''} ${selected === p.id ? 'is-selected' : ''}`}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {p.destaque && <span className="pdd-plan-badge">mais popular</span>}

            <p className="pdd-plan-card__nome">{p.nome}</p>
            <p className="pdd-plan-card__preco">
              {p.preco}<span>/mês</span>
            </p>

            <ul className="pdd-plan-card__features">
              {p.features.map((f) => (
                <li key={f}>
                  <span className="pdd-plan-check"><DashIcon name="check" /></span>
                  {f}
                </li>
              ))}
            </ul>

            <button
              type="button"
              className={`pdd-plan-cta ${p.destaque ? 'is-primary' : ''}`}
              onClick={() => setSelected(p.id)}
            >
              {p.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
