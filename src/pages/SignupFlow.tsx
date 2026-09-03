import { useState, useEffect, type Dispatch, type SetStateAction } from 'react'
import { useNavigate } from 'react-router-dom'
import logoNome from '../assets/logo-nome.png'
import logoPonte from '../assets/logo-ponte.png'
import { register } from '../services/user'
import { sanitizeInput, sanitizeName, sanitizeEmail, validateName, validateEmail, validatePassword } from '../utils/validation'
import './SignupFlow.css'

const ESTADOS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS',
  'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC',
  'SP', 'SE', 'TO',
]

const INTERESSES = [
  'Tecnologia', 'Educação', 'Saúde', 'Infraestrutura',
  'Cultura', 'Serviços', 'Consultoria', 'Engenharia',
]

const FEATURES = [
  { icon: 'clipboard', text: 'Acompanhamento de prazos' },
  { icon: 'search', text: 'Filtros avançados por assunto' },
  { icon: 'bell', text: 'Alertas personalizados por interesse' },
]

type FormData = {
  nome: string
  estado: string
  email: string
  senha: string
  confirmarSenha: string
  interesses: string[]
}

const initialForm: FormData = {
  nome: '',
  estado: 'SP',
  email: '',
  senha: '',
  confirmarSenha: '',
  interesses: [],
}

// ---------- validação de senha ----------

type PasswordChecks = {
  length: boolean
  upper: boolean
  lower: boolean
  special: boolean
}

function getPasswordChecks(senha: string): PasswordChecks {
  return {
    length: senha.length >= 8,
    upper: /[A-Z]/.test(senha),
    lower: /[a-z]/.test(senha),
    special: /[^A-Za-z0-9]/.test(senha),
  }
}

function isPasswordValid(checks: PasswordChecks) {
  return checks.length && checks.upper && checks.lower && checks.special
}

function Icon({ name }: { name: string }) {
  switch (name) {
    case 'clipboard':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="5" y="4.5" width="14" height="16" rx="2" />
            <path d="M9 4.5V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v.5" strokeLinecap="round" />
            <path d="M8.5 11.5h7M8.5 15h4.5" strokeLinecap="round" />
        </svg>
      )
    case 'search':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="11" cy="11" r="6.5" />
          <path d="M20 20l-4.3-4.3" strokeLinecap="round" />
        </svg>
      )
    case 'bell':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 13 6 9Z" strokeLinejoin="round" />
          <path d="M10 18a2 2 0 0 0 4 0" strokeLinecap="round" />
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
    case 'back':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 12H5M11 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'check':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
          <path d="M5 12.5l4.5 4.5L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'dot':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="4" />
        </svg>
      )
    default:
      return null
  }
}

export default function SignupFlow() {
  const navigate = useNavigate()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [form, setForm] = useState<FormData>(initialForm)
  const [showPassword, setShowPassword] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [shake, setShake] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [senhaTouched, setSenhaTouched] = useState(false)
  const [confirmarSenhaTouched, setConfirmarSenhaTouched] = useState(false)
  const [nomeError, setNomeError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [senhaErrorMsg, setSenhaErrorMsg] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)

  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(t)
  }, [])

  const passwordChecks = getPasswordChecks(form.senha)
  const senhaValid = isPasswordValid(passwordChecks)
  const senhasCoincidem = form.confirmarSenha.length > 0 && form.confirmarSenha === form.senha

  const step1Valid =
    validateName(form.nome) === null &&
    form.estado !== '' &&
    validateEmail(form.email) === null &&
    senhaValid &&
    senhasCoincidem &&
    acceptTerms
  const step2Valid = form.interesses.length > 0

  function goTo(next: 1 | 2 | 3, dir: 1 | -1) {
    setDirection(dir)
    setStep(next)
  }

  function handleContinueStep1() {
    if (!step1Valid) {
      setNomeError(validateName(form.nome) || '')
      setEmailError(validateEmail(form.email) || '')
      setSenhaTouched(true)
      setConfirmarSenhaTouched(true)
      triggerShake()
      return
    }
    goTo(2, 1)
  }

  function handleContinueStep2() {
    if (!step2Valid) {
      triggerShake()
      return
    }
    goTo(3, 1)
  }

  function handleNomeChange(value: string) {
    const sanitized = sanitizeName(value)
    setForm((f) => ({ ...f, nome: sanitized }))
    setNomeError(validateName(sanitized) || '')
  }

  function handleEmailChange(value: string) {
    const sanitized = sanitizeEmail(value)
    setForm((f) => ({ ...f, email: sanitized }))
    setEmailError(validateEmail(sanitized) || '')
  }

  function handleSenhaChange(value: string) {
    const sanitized = sanitizeInput(value)
    setForm((f) => ({ ...f, senha: sanitized }))
    setSenhaErrorMsg(validatePassword(sanitized) || '')
  }

  function handleConfirmarSenhaChange(value: string) {
    const sanitized = sanitizeInput(value)
    setForm((f) => ({ ...f, confirmarSenha: sanitized }))
  }

  function triggerShake() {
    setShake(true)
    window.setTimeout(() => setShake(false), 420)
  }

  function toggleInteresse(item: string) {
    setForm((f) => ({
      ...f,
      interesses: f.interesses.includes(item)
        ? f.interesses.filter((i) => i !== item)
        : [...f.interesses, item],
    }))
  }

  function handleFinish() {
    if (status === 'loading') return
    setStatus('loading')
    setErrorMessage('')

    register(form.nome, form.email, form.senha)
      .then(() => {
        navigate('/login')
      })
      .catch((err) => {
        setStatus('error')
        setErrorMessage(err.message || 'Erro ao criar conta')
        triggerShake()
      })
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
            <p className="pde-eyebrow"><span className="pde-eyebrow__line" />Plataforma de editais</p>
            <h1 className="pde-headline">
              Encontre os editais<br />
              <span className="pde-accent">certos</span> para você.
            </h1>
            <p className="pde-sub">
              Faça parte da plataforma para ficar por dentro dos seus editais
              favoritos e não perder nenhum prazo despercebido.
            </p>

            <ul className="pde-features">
              {FEATURES.map((f, i) => (
                <li
                  key={f.text}
                  className="pde-features__item"
                  style={{ transitionDelay: `${420 + i * 110}ms` }}
                >
                  <span className="pde-features__icon"><Icon name={f.icon} /></span>
                  {f.text}
                </li>
              ))}
            </ul>
          </div>

          <p className="pde-copyright">© 2026 Todos os direitos reservados a Projeto Integrador Fatec</p>
        </div>
      </aside>

      <main className="pde-form-panel">
        <div className="pde-form-panel__inner">
          <header className="pde-form-header">
            <h2>Vamos criar sua conta</h2>
            <p><span>no Ponte do Edital</span></p>
          </header>

          <Stepper step={step} />

          <div className={`pde-stage ${shake ? 'pde-stage--shake' : ''}`}>
            <div
              key={step}
              className={`pde-panel pde-panel--enter-${direction === 1 ? 'right' : 'left'}`}
            >
              {step === 1 && (
                <StepAccount
                  form={form}
                  setForm={setForm}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  onContinue={handleContinueStep1}
                  passwordChecks={passwordChecks}
                  senhaTouched={senhaTouched}
                  onSenhaTouched={() => setSenhaTouched(true)}
                  senhasCoincidem={senhasCoincidem}
                  confirmarSenhaTouched={confirmarSenhaTouched}
                  onConfirmarSenhaTouched={() => setConfirmarSenhaTouched(true)}
                  onNomeChange={handleNomeChange}
                  onEmailChange={handleEmailChange}
                  onSenhaChange={handleSenhaChange}
                  onConfirmarSenhaChange={handleConfirmarSenhaChange}
                  nomeError={nomeError}
                  emailError={emailError}
                  senhaErrorMsg={senhaErrorMsg}
                  acceptTerms={acceptTerms}
                  onAcceptTermsChange={setAcceptTerms}
                />
              )}
              {step === 2 && (
                <StepInterests
                  selected={form.interesses}
                  onToggle={toggleInteresse}
                  onBack={() => goTo(1, -1)}
                  onContinue={handleContinueStep2}
                />
              )}
              {step === 3 && (
                <StepDone
                  firstName={form.nome.trim().split(' ')[0] || 'visitante'}
                  onBack={() => goTo(2, -1)}
                  onFinish={handleFinish}
                  status={status}
                  errorMessage={errorMessage}
                />
              )}
            </div>
          </div>

          <p className="pde-login-hint">
            Já tem conta?{' '}
            <a
              href="#entrar"
              onClick={(e) => {
                e.preventDefault()
                navigate('/login')
              }}
            >
              Entrar na plataforma <Icon name="arrow" />
            </a>
          </p>
        </div>
      </main>
    </div>
  )
}

function Stepper({ step }: { step: 1 | 2 | 3 }) {
  return (
    <div className="pde-stepper" role="list" aria-label="Progresso do cadastro">
      {[1, 2, 3].map((n, i) => (
        <div className="pde-stepper__group" key={n}>
          <div className={`pde-stepper__dot ${step === n ? 'is-current' : ''}`}>
            {n}
          </div>
          {i < 2 && <span className="pde-stepper__dash" aria-hidden="true" />}
        </div>
      ))}
    </div>
  )
}

function StepAccount({
  form,
  setForm,
  showPassword,
  setShowPassword,
  onContinue,
  passwordChecks,
  senhaTouched,
  onSenhaTouched,
  senhasCoincidem,
  confirmarSenhaTouched,
  onConfirmarSenhaTouched,
  onNomeChange,
  onEmailChange,
  onSenhaChange,
  onConfirmarSenhaChange,
  nomeError,
  emailError,
  senhaErrorMsg,
  acceptTerms,
  onAcceptTermsChange,
}: {
  form: FormData
  setForm: Dispatch<SetStateAction<FormData>>
  showPassword: boolean
  setShowPassword: (v: boolean) => void
  onContinue: () => void
  passwordChecks: PasswordChecks
  senhaTouched: boolean
  onSenhaTouched: () => void
  senhasCoincidem: boolean
  confirmarSenhaTouched: boolean
  onConfirmarSenhaTouched: () => void
  onNomeChange: (value: string) => void
  onEmailChange: (value: string) => void
  onSenhaChange: (value: string) => void
  onConfirmarSenhaChange: (value: string) => void
  nomeError: string
  emailError: string
  senhaErrorMsg: string

}) {
  const navigate = useNavigate()
  const showConfirmInvalid = confirmarSenhaTouched && form.confirmarSenha.length > 0 && !senhasCoincidem

  return (
    <form
      className="pde-fields"
      onSubmit={(e) => {
        e.preventDefault()
        onContinue()
      }}
    >
      {showConfirmInvalid && (
        <p className="pde-error">As senhas não coincidem</p>
      )}
      <div className="pde-row">
        <label className="pde-field pde-field--grow">
          <span>Nome Completo</span>
          <input
            type="text"
            placeholder="Digite seu nome"
            value={form.nome}
            onChange={(e) => onNomeChange(e.target.value)}
            autoComplete="name"
          />
          {nomeError && <span className="pde-field-error">{nomeError}</span>}
        </label>

        <label className="pde-field pde-field--estado">
          <span>Estado</span>
          <select
            value={form.estado}
            onChange={(e) => setForm((f) => ({ ...f, estado: e.target.value }))}
          >
            {ESTADOS.map((uf) => (
              <option key={uf} value={uf}>{uf}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="pde-field">
        <span>E-mail</span>
        <div className="pde-input-icon">
          <input
            type="email"
            placeholder="pontedoedital@gmail.com"
            value={form.email}
            onChange={(e) => onEmailChange(e.target.value)}
            autoComplete="email"
          />
          <span className="pde-input-icon__glyph"><Icon name="mail" /></span>
        </div>
        {emailError && <span className="pde-field-error">{emailError}</span>}
      </label>

      <div className="pde-password-block">
        <div className="pde-row">
          <label className="pde-field pde-field--grow">
            <span>Senha</span>
            <div className="pde-input-icon">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Mínimo 8 caracteres"
                value={form.senha}
                onChange={(e) => onSenhaChange(e.target.value)}
                onBlur={onSenhaTouched}
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
            {senhaTouched && senhaErrorMsg && <span className="pde-field-error">{senhaErrorMsg}</span>}
          </label>

          <label className="pde-field pde-field--grow">
            <span>Confirmar Senha</span>
            <div className={`pde-input-icon ${showConfirmInvalid ? 'has-error' : ''}`}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Repita a senha"
                value={form.confirmarSenha}
                onChange={(e) => onConfirmarSenhaChange(e.target.value)}
                onBlur={onConfirmarSenhaTouched}
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
        </div>

        <PasswordRequirements checks={passwordChecks} touched={senhaTouched} />
      </div>

      <div className="pde-terms">
        <label className="pde-terms__item">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => onAcceptTermsChange(e.target.checked)}
          />
          <span>
            Concordo com os{' '}
            <a href="/terms" onClick={(e) => { e.preventDefault(); navigate('/terms'); }}>Termos de Uso</a>{' '}
            e a{' '}
            <a href="/privacy" onClick={(e) => { e.preventDefault(); navigate('/privacy'); }}>Política de Privacidade</a>
          </span>
        </label>
      </div>

      <div className="pde-actions pde-actions--center">
        <button type="submit" className="pde-btn pde-btn--primary">
          Continuar <Icon name="arrow" />
        </button>
      </div>
    </form>
  )
}

function PasswordRequirements({
  checks,
  touched,
}: {
  checks: PasswordChecks
  touched: boolean
}) {
  const items: { key: keyof PasswordChecks; label: string }[] = [
    { key: 'length', label: 'Mínimo de 8 caracteres' },
    { key: 'upper', label: '1 letra maiúscula' },
    { key: 'lower', label: '1 letra minúscula' },
    { key: 'special', label: '1 caractere especial' },
  ]

  return (
    <ul className="pde-pw-reqs" aria-live="polite">
      {items.map((item) => {
        const met = checks[item.key]
        const showInvalid = touched && !met
        return (
          <li
            key={item.key}
            className={`pde-pw-reqs__item ${met ? 'is-met' : ''} ${showInvalid ? 'is-invalid' : ''}`}
          >
            <span className="pde-pw-reqs__icon">
              <Icon name={met ? 'check' : 'dot'} />
            </span>
            {item.label}
          </li>
        )
      })}
    </ul>
  )
}

function StepInterests({
  selected,
  onToggle,
  onBack,
  onContinue,
}: {
  selected: string[]
  onToggle: (item: string) => void
  onBack: () => void
  onContinue: () => void
}) {
  return (
    <div className="pde-fields">
      <p className="pde-question">Quais são suas áreas de interesse?</p>

      <div className="pde-tags">
        {INTERESSES.map((item, i) => {
          const active = selected.includes(item)
          return (
            <button
              key={item}
              type="button"
              className={`pde-tag ${active ? 'is-active' : ''}`}
              style={{ animationDelay: `${i * 45}ms` }}
              onClick={() => onToggle(item)}
              aria-pressed={active}
            >
              {item}
            </button>
          )
        })}
      </div>

      <div className="pde-actions">
        <button type="button" className="pde-btn pde-btn--ghost" onClick={onBack}>
          <Icon name="back" /> Voltar
        </button>
        <button type="button" className="pde-btn pde-btn--primary" onClick={onContinue}>
          Continuar <Icon name="arrow" />
        </button>
      </div>
    </div>
  )
}

function StepDone({
  firstName,
  onBack,
  onFinish,
  status,
  errorMessage,
}: {
  firstName: string
  onBack: () => void
  onFinish?: () => void
  status?: 'idle' | 'loading' | 'error'
  errorMessage?: string
}) {
  return (
    <div className="pde-done">
      {status === 'error' && errorMessage && (
        <p className="pde-error">{errorMessage}</p>
      )}
      <p className="pde-done__title">
        Tudo pronto, <span>{firstName}</span>!
      </p>

      <div className="pde-actions">
        <button type="button" className="pde-btn pde-btn--ghost" onClick={onBack}>
          <Icon name="back" /> Voltar
        </button>
        <button
          type="button"
          className={`pde-btn pde-btn--primary ${status === 'loading' ? 'is-loading' : ''}`}
          onClick={onFinish}
          disabled={status === 'loading'}
        >
          <span className="pde-btn__label">Criar conta</span>
          <Icon name="arrow" />
          <span className="pde-btn__spinner" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}