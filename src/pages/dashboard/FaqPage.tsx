import { useState } from 'react'
import { DashIcon } from './Icons'
import './FaqPage.css'

const FAQS = [
  {
    id: '1',
    pergunta: 'Como funciona o agendamento de prazos?',
    resposta: 'Ao salvar um edital, você pode marcar o prazo no calendário e receber lembretes por e-mail.',
  },
  {
    id: '2',
    pergunta: 'Posso mudar de plano quando quiser?',
    resposta: 'Sim. Você pode fazer upgrade ou cancelar o plano Premium a qualquer momento, sem multa.',
  },
  {
    id: '3',
    pergunta: 'Como escolho minhas áreas de interesse?',
    resposta: 'Em "Ajustar preferências", na barra lateral, você pode selecionar ou alterar seus interesses quando quiser.',
  },
]

export default function FaqPage() {
  const [openId, setOpenId] = useState<string | null>('1')

  return (
    <div className="pdd-faq-page">
      <div className="pdd-faq-header">
        <div>
          <h1 className="pdd-page-title">Perguntas Frequentes</h1>
          <p className="pdd-faq-sub">
            Respostas sobre a plataforma, planos, editais e muito mais. Se não encontrar o que
            precisa, nossa equipe está pronta para ajudar.
          </p>
        </div>
        <button type="button" className="pdd-faq-new">
          <DashIcon name="plus" /> Nova pergunta
        </button>
      </div>

      <div className="pdd-faq-list">
        {FAQS.map((f, i) => {
          const open = openId === f.id
          return (
            <div
              key={f.id}
              className="pdd-faq-item"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <button
                type="button"
                className={`pdd-faq-question ${open ? 'is-open' : ''}`}
                onClick={() => setOpenId(open ? null : f.id)}
                aria-expanded={open}
              >
                <span className="pdd-faq-question__icon"><DashIcon name="question" /></span>
                {f.pergunta}
              </button>

              <div className={`pdd-faq-answer-wrap ${open ? 'is-open' : ''}`}>
                <p className="pdd-faq-answer">{f.resposta}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
