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

// No celular só cabem alguns atalhos na barra inferior; o restante fica
// dentro do item "Mais" (mesmo padrão do protótipo mobile).
const MOBILE_PRIMARY_KEYS: PageKey[] = ['feed', 'calendar', 'saved', 'plans']
const MOBILE_MORE_ITEMS = NAV_ITEMS.filter((item) => !MOBILE_PRIMARY_KEYS.includes(item.key))

type Notification = {
  id: string
  text: string
}

const NOTIFICATIONS: Notification[] = [
  { id: '1', text: 'Novo edital encontrado' },
  { id: '2', text: 'O prazo termina amanhã' },
  { id: '3', text: 'Edital foi atualizado' },
  { id: '4', text: 'Novo documento disponível' },
  { id: '5', text: 'Resultado publicado' },
]

export default function DashboardShell({
  active,
  onNavigate,
  userName,
  preference,
  avatarUrl,
  onLogout,
  onOpenAdmin,
  children,
}: {
  active: PageKey
  onNavigate: (page: PageKey) => void
  userName: string
  preference?: string
  avatarUrl?: string | null
  onLogout?: () => void
  onOpenAdmin?: () => void
  children: ReactNode
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [unread, setUnread] = useState(NOTIFICATIONS.length)
  const [mounted, setMounted] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)
  const moreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(t)
  }, [])

  useEffect(() => {
    if (!menuOpen && !notifOpen && !moreOpen) return
    function onClickOutside(e: MouseEvent) {
      const target = e.target as Node
      if (menuOpen && menuRef.current && !menuRef.current.contains(target)) {
        setMenuOpen(false)
      }
      if (notifOpen && notifRef.current && !notifRef.current.contains(target)) {
        setNotifOpen(false)
      }
      if (moreOpen && moreRef.current && !moreRef.current.contains(target)) {
        setMoreOpen(false)
      }
    }
    document.addEventListener('click', onClickOutside)
    return () => document.removeEventListener('click', onClickOutside)
  }, [menuOpen, notifOpen, moreOpen])

  function toggleNotif() {
    setNotifOpen((v) => {
      const next = !v
      if (next) setUnread(0)
      return next
    })
    setMenuOpen(false)
  }

  function toggleMenu() {
    setMenuOpen((v) => !v)
    setNotifOpen(false)
  }

  return (
    <div className={`pdd-shell ${mounted ? 'pdd-shell--mounted' : ''}`}>
      <div
        className={`pdd-backdrop ${menuOpen || notifOpen || moreOpen ? 'is-visible' : ''}`}
        onClick={() => {
          setMenuOpen(false)
          setNotifOpen(false)
          setMoreOpen(false)
        }}
        aria-hidden="true"
      />

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
          <div className="pdd-notif-wrap" ref={notifRef}>
            <button
              type="button"
              className="pdd-bell"
              aria-label="Notificações"
              aria-haspopup="menu"
              aria-expanded={notifOpen}
              onClick={toggleNotif}
            >
              <DashIcon name="bell" />
              {unread > 0 && <span className="pdd-bell__dot" />}
            </button>

            <div className={`pdd-notif-panel ${notifOpen ? 'is-open' : ''}`} role="menu">
              {NOTIFICATIONS.map((n, i) => (
                <button
                  key={n.id}
                  type="button"
                  role="menuitem"
                  className="pdd-notif-panel__item"
                  style={{ transitionDelay: notifOpen ? `${i * 45}ms` : '0ms' }}
                >
                  {n.text}
                </button>
              ))}
            </div>
          </div>

          <div className="pdd-avatar-wrap" ref={menuRef}>
            <button
              type="button"
              className="pdd-avatar-btn"
              onClick={toggleMenu}
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
              {onOpenAdmin && (
                <button
                  type="button"
                  className="pdd-menu__item"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false)
                    onOpenAdmin()
                  }}
                >
                  Painel Admin
                </button>
              )}
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

      <nav className="pdd-tabbar" aria-label="Navegação principal (celular)">
        {NAV_ITEMS.filter((item) => MOBILE_PRIMARY_KEYS.includes(item.key)).map((item) => (
          <button
            key={item.key}
            type="button"
            className={`pdd-tabbar__item ${active === item.key ? 'is-active' : ''}`}
            onClick={() => {
              setMoreOpen(false)
              onNavigate(item.key)
            }}
          >
            <span className="pdd-tabbar__icon"><DashIcon name={item.icon} /></span>
            {item.label}
          </button>
        ))}

        <div className="pdd-tabbar__more-wrap" ref={moreRef}>
          <button
            type="button"
            className={`pdd-tabbar__item ${MOBILE_MORE_ITEMS.some((i) => i.key === active) ? 'is-active' : ''}`}
            aria-haspopup="menu"
            aria-expanded={moreOpen}
            onClick={() => setMoreOpen((v) => !v)}
          >
            <span className="pdd-tabbar__icon"><DashIcon name="plus" /></span>
            Mais
          </button>

          <div className={`pdd-tabbar__sheet ${moreOpen ? 'is-open' : ''}`} role="menu">
            {MOBILE_MORE_ITEMS.map((item) => (
              <button
                key={item.key}
                type="button"
                role="menuitem"
                className={`pdd-tabbar__sheet-item ${active === item.key ? 'is-active' : ''}`}
                onClick={() => {
                  setMoreOpen(false)
                  onNavigate(item.key)
                }}
              >
                <span className="pdd-tabbar__icon"><DashIcon name={item.icon} /></span>
                {item.label}
              </button>
            ))}
            <button
              type="button"
              role="menuitem"
              className="pdd-tabbar__sheet-item"
              onClick={() => {
                setMoreOpen(false)
                onNavigate('profile')
              }}
            >
              <span className="pdd-tabbar__icon"><DashIcon name="id-badge" /></span>
              Perfil
            </button>
          </div>
        </div>
      </nav>
    </div>
  )
}

export { NAV_ITEMS }