import { useState, type FormEvent } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import logoNome from '../assets/logo-nome.png'
import logoPonte from '../assets/logo-ponte.png'
import './RecoverFlow.css'

type Step = 'email' | 'reset' | 'done'

function Icon({ name }: { name: string }) {
  switch (name) {
    case 'check':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M4 12.5 9.5 18 20 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'mail':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="5" width="18" height="14" rx="2.5" />
          <path d="m4 6.5 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'eye':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="2.7" />
        </svg>
      )
    case 'eyeOff':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 3l18 18" strokeLinecap="round" />
          <path d="M10.6 5.7A10.6 10.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a15 15 0 0 1-3.2 3.9M6.6 6.9C4 8.7 2.5 12 2.5 12S6 18.5 12 18.5c1.2 0 2.3-.2 3.3-.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9.9 10c-.3.5-.4 1-.4 1.6 0 1.5 1.2 2.7 2.7 2.7.6 0 1.1-.2 1.6-.5" strokeLinecap="round" />
        </svg>
      )
    case 'arrow':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 12h15M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    default:
      return null
  }
}

export default function RecoverFlow() {
  const navigate = useNavigate()
  const [mounted, setMounted] = useState(false)
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading'>('idle')
  const [touched, setTouched] = useState(false)
  const [shake, setShake] = useState(false)

  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(t)
  }, [])

  const emailValid = email.includes('@') && email.includes('.')
  const senhaValid = senha.length >= 8

  function triggerShake() {
    setShake(true)
    window.setTimeout(() => setShake(false), 420)
  }

  function handleSendEmail(e: FormEvent) {
    e.preventDefault()
    setTouched(true)
    if (!emailValid) {
      triggerShake()
      return
    }
    setStatus('loading')
    window.setTimeout(() => {
      setStatus('idle')
      setTouched(false)
      setStep('reset')
    }, 1000)
  }

  function handleResetPassword(e: FormEvent) {
    e.preventDefault()
    setTouched(true)
    if (!senhaValid) {
      triggerShake()
      return
    }
    setStatus('loading')
    window.setTimeout(() => {
      setStatus('idle')
      setStep('done')
    }, 1000)
  }

  return (
    <div className={`pde-shell ${mounted ? 'pde-shell--mounted' : ''}`}>
      <aside className="pde-side">
        <div className="pde-side__inner">
          <div className="pde-brand">
            <img src={logoPonte} alt="" aria-hidden="true" className="pde-brand__icon" />
            <img src={logoNome} alt="Ponte do Edital" className="pde-brand__logo" />
          </div>

          <div className="pde-side__body">
            <p className="pde-eyebrow"><span className="pde-eyebrow__line" />Recuperação de acesso</p>
            <h1 className="pde-headline">
              Recupere a sua<br />
              <span className="pde-accent">senha</span>.
            </h1>
            <p className="pde-sub">
              Um processo simples, seguro e rápido. Você estará de volta à
              plataforma em poucos minutos.
            </p>

            <div className="pde-note">
              <span className="pde-note__icon"><Icon name="check" /></span>
              <p>Informe seu e-mail e enviaremos um link para você criar uma nova senha.</p>
            </div>
          </div>

          <p className="pde-copyright">© 2026 Todos os direitos reservados a Projeto Integrador Fatec</p>
        </div>
      </aside>

      <main className="pde-form-panel">
        <div className="pde-form-panel__inner">
          <header className="pde-form-header">
            <h2>Recupere sua</h2>
            <p><span>senha</span></p>
          </header>

          <div className={`pde-stage ${shake ? 'pde-stage--shake' : ''}`}>
            {step === 'email' && (
              <div key="email" className="pde-panel pde-panel--enter-right">
                <form className="pde-fields" onSubmit={handleSendEmail} noValidate>
                  <div className="pde-step-heading">
                    <p className="pde-step-title">Qual é seu e-mail?</p>
                    <p className="pde-step-sub">
                      Digite seu e-mail cadastrado. Enviaremos a liberação para redefinir a senha
                    </p>
                  </div>

                  <label className="pde-field">
                    <span>E-mail</span>
                    <div className={`pde-input-icon ${touched && !emailValid ? 'is-invalid' : ''}`}>
                      <input
                        type="email"
                        placeholder="Digite seu e-mail"
                        value={email}
                        onChange={(ev) => setEmail(ev.target.value)}
                        autoComplete="email"
                      />
                      <span className="pde-input-icon__glyph"><Icon name="mail" /></span>
                    </div>
                  </label>

                  <div className="pde-actions pde-actions--center">
                    <button
                      type="submit"
                      className={`pde-btn pde-btn--primary ${status === 'loading' ? 'is-loading' : ''}`}
                      disabled={status === 'loading'}
                    >
                      <span className="pde-btn__label">Enviar</span>
                      <Icon name="arrow" />
                      <span className="pde-btn__spinner" aria-hidden="true" />
                    </button>
                  </div>
                </form>

                <p className="pde-login-hint">
                  Lembrou a senha?{' '}
                  <a
                    href="#entrar"
                    onClick={(ev) => {
                      ev.preventDefault()
                      navigate('/login')
                    }}
                  >
                    Entrar na plataforma <Icon name="arrow" />
                  </a>
                </p>
              </div>
            )}

            {step === 'reset' && (
              <div key="reset" className="pde-panel pde-panel--enter-right">
                <form className="pde-fields" onSubmit={handleResetPassword} noValidate>
                  <div className="pde-step-heading">
                    <p className="pde-step-title">Redefina sua senha</p>
                    <p className="pde-step-sub">
                      Digite sua nova senha para ter acesso à plataforma novamente
                    </p>
                  </div>

                  <label className="pde-field">
                    <span>Senha</span>
                    <div className={`pde-input-icon ${touched && !senhaValid ? 'is-invalid' : ''}`}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Digite sua senha"
                        value={senha}
                        onChange={(ev) => setSenha(ev.target.value)}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="pde-input-icon__glyph pde-input-icon__glyph--btn"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                      >
                        <Icon name={showPassword ? 'eyeOff' : 'eye'} />
                      </button>
                    </div>
                  </label>

                  <div className="pde-actions pde-actions--center">
                    <button
                      type="submit"
                      className={`pde-btn pde-btn--primary ${status === 'loading' ? 'is-loading' : ''}`}
                      disabled={status === 'loading'}
                    >
                      <span className="pde-btn__label">Redefinir</span>
                      <Icon name="arrow" />
                      <span className="pde-btn__spinner" aria-hidden="true" />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {step === 'done' && (
              <div key="done" className="pde-panel pde-panel--enter-right">
                <div className="pde-login-success">
                  <span className="pde-login-success__ring">
                    <Icon name="check" />
                  </span>
                  <p className="pde-done__title">
                    Senha <span>redefinida!</span>
                  </p>
                  <p className="pde-login-success__sub">
                    Sua senha foi alterada com sucesso. Você já pode entrar na plataforma.
                  </p>
                  <div className="pde-actions pde-actions--center">
                    <button
                      type="button"
                      className="pde-btn pde-btn--primary"
                      onClick={() => navigate('/login')}
                    >
                      Entrar na plataforma <Icon name="arrow" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}