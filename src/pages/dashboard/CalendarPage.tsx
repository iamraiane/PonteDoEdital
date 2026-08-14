import { useMemo, useState, type CSSProperties } from 'react'
import { DashIcon } from './Icons'
import { type PageKey } from './DashboardShell'
import './CalendarPage.css'

const WEEKDAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

export default function CalendarPage({
  hasPremium = false,
  onNavigate,
}: {
  hasPremium?: boolean
  onNavigate?: (page: PageKey) => void
}) {
  const [cursor, setCursor] = useState({ year: 2026, month: 6 }) // Julho 2026
  const [selected, setSelected] = useState(12)

  const cells = useMemo(() => {
    const firstWeekday = new Date(cursor.year, cursor.month, 1).getDay()
    const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate()
    const arr: (number | null)[] = []
    for (let i = 0; i < firstWeekday; i++) arr.push(null)
    for (let d = 1; d <= daysInMonth; d++) arr.push(d)
    return arr
  }, [cursor])

  function changeMonth(delta: number) {
    setCursor((c) => {
      let month = c.month + delta
      let year = c.year
      if (month < 0) { month = 11; year -= 1 }
      if (month > 11) { month = 0; year += 1 }
      return { year, month }
    })
    setSelected(-1)
  }

  return (
    <div className="pdd-calendar-page pdd-calendar-page--full">
      <h1 className="pdd-page-title">Calendário</h1>

      <div className="pdd-calendar-card">
        {!hasPremium && (
          <div className="pdd-calendar-locked">
            <div className="pdd-calendar-locked__card">
              <span className="pdd-calendar-locked__icon"><DashIcon name="trophy" /></span>
              <p className="pdd-calendar-locked__text">Para acessar:</p>
              <button
                type="button"
                className="pdd-calendar-locked__cta"
                onClick={() => onNavigate?.('plans')}
              >
                Assinar Premium
              </button>
            </div>
          </div>
        )}

        <div className="pdd-calendar-card__head">
          <p>{MONTHS[cursor.month]} {cursor.year}</p>
          <div className="pdd-calendar-nav">
            <button type="button" onClick={() => changeMonth(-1)} aria-label="Mês anterior">
              <DashIcon name="chevron-left" />
            </button>
            <button type="button" onClick={() => changeMonth(1)} aria-label="Próximo mês">
              <DashIcon name="chevron-right" />
            </button>
          </div>
        </div>

        <div className="pdd-calendar-grid pdd-calendar-grid--head">
          {WEEKDAYS.map((w, i) => (
            <span key={i}>{w}</span>
          ))}
        </div>

        <div
          className="pdd-calendar-grid pdd-calendar-grid--body"
          key={`${cursor.year}-${cursor.month}`}
          style={{ '--pdd-cal-rows': Math.ceil(cells.length / 7) } as CSSProperties}
        >
          {cells.map((day, i) => (
            <button
              key={i}
              type="button"
              disabled={day === null}
              className={`pdd-calendar-day ${day === selected ? 'is-selected' : ''} ${day === null ? 'is-empty' : ''}`}
              style={{ animationDelay: `${i * 10}ms` }}
              onClick={() => day !== null && setSelected(day)}
            >
              {day}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}