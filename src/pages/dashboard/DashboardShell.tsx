import { useEffect, useRef, useState, type ReactNode } from 'react'
import logoNome from '../../assets/logo-nome.png'
import logoPonte from '../../assets/logo-ponte.png'
import { DashIcon, DashAvatar } from './Icons'
import './DashboardShell.css'

export type PageKey = 'feed' | 'calendar' | 'saved' | 'plans' | 'faq' | 'about' | 'profile'

const NAV_ITEMS: { key: PageKey; label: string; icon: string }[] = [
  { key: 'feed', label: 'Feed', icon: 'home' },
  { key: 'calendar', label: 'Calendário', icon: 'calendar' },
  { key: 'saved', label: 'Salvos', icon: 'bookmark' },
  { key: 'plans', label: 'Planos', icon: 'filter' },
  { key: 'faq', label: 'Faq e dúvidas', icon: 'question' },
  { key: 'about', label: 'Quem somos', icon: 'people' },
]

export default function DashboardShell({
  active,
  onNavigate,
  userName,
  preference,
  avatarUrl,
  onLogout,
  children,
}: {
  active: PageKey
  onNavigate: (page: PageKey) => void
  userName: string
  preference?: string
  avatarUrl?: string | null
  onLogout?: () => void
  children: ReactNode
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(t)
  }, [])

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <div className={`pdd-shell ${mounted ? 'pdd-shell--mounted' : ''}`}>
      <header className="pdd-header">
        <div className="pdd-brand">
          <img src={logoPonte} alt="" aria-hidden="true" className="pdd-brand__icon" />
          <img src={logoNome} alt="Ponte do Edital" className="pdd-brand__logo" />
        </div>

        <label className="pdd-search">
          <span className="pdd-search__glyph"><DashIcon name="search" /></span>
          <input type="text" placeholder="Buscar editais, órgãos, categorias..." />
        </label>

        <div className="pdd-header__actions">
          <button type="button" className="pdd-bell" aria-label="Notificações">
            <DashIcon name="bell" />
          </button>

          <div className="pdd-avatar-wrap" ref={menuRef}>
            <button
              type="button"
              className="pdd-avatar-btn"
              onClick={() => setMenuOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-label={`Menu de ${userName}`}
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="pdd-avatar-btn__img" />
              ) : (
                <DashAvatar size={36} seed={1} />
              )}
            </button>

            <div className={`pdd-menu ${menuOpen ? 'is-open' : ''}`} role="menu">
              <button
                type="button"
                className="pdd-menu__item"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false)
                  onNavigate('profile')
                }}
              >
                Perfil
              </button>
              <button
                type="button"
                className="pdd-menu__item"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false)
                  if (onLogout) onLogout()
                }}
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="pdd-body">
        <aside className="pdd-sidebar">
          <nav className="pdd-nav" aria-label="Navegação principal">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`pdd-nav__item ${active === item.key ? 'is-active' : ''}`}
                onClick={() => onNavigate(item.key)}
              >
                <span className="pdd-nav__icon"><DashIcon name={item.icon} /></span>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="pdd-pref-card">
            <p className="pdd-pref-card__title">Suas preferências</p>
            <p className="pdd-pref-card__value">{preference || 'Nenhuma preferência definida'}</p>
            <button type="button" className="pdd-pref-card__cta" onClick={() => onNavigate('profile')}>
              Ajustar preferências
            </button>
          </div>
        </aside>

        <main className="pdd-main">
          <div key={active} className="pdd-page-enter">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export { NAV_ITEMS }