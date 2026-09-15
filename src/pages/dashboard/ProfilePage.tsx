import { useRef, useState, type ChangeEvent } from 'react'
import { DashIcon, DashAvatar } from './Icons'
import { sanitizeName, validateName, formatCpf } from '../../utils/validation'
import './ProfilePage.css'

const INTERESSES = [
  'Tecnologia', 'Educação', 'Saúde', 'Infraestrutura',
  'Cultura', 'Serviços', 'Consultoria', 'Engenharia',
]

const ESTADOS = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' },
]

export type ProfileData = {
  nome: string
  email: string
  cpf: string
  dataNascimento: string
  estado: string
  interesses: string[]
  avatarUrl: string | null
}

export default function ProfilePage({
  profile,
  onChange,
  onSave,
}: {
  profile: ProfileData
  onChange: (next: ProfileData) => void
  onSave: () => Promise<void>
}) {
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [nameError, setNameError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function set<K extends keyof ProfileData>(key: K, value: ProfileData[K]) {
    onChange({ ...profile, [key]: value })
    setSaved(false)
  }

  function handleNomeChange(e: ChangeEvent<HTMLInputElement>) {
    const sanitized = sanitizeName(e.target.value)
    set('nome', sanitized)
    const error = validateName(sanitized)
    setNameError(error)
  }

  function toggleInteresse(item: string) {
    const has = profile.interesses.includes(item)
    set(
      'interesses',
      has ? profile.interesses.filter((i) => i !== item) : [...profile.interesses, item],
    )
  }

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    set('avatarUrl', url)
  }

  async function handleSave() {
    const error = validateName(profile.nome)
    if (error) {
      setNameError(error)
      return
    }
    setSaving(true)
    try {
      await onSave()
      setSaved(true)
      setNameError(null)
      window.setTimeout(() => setSaved(false), 2200)
    } catch {
    } finally {
      setSaving(false)
    }
  }

  const formattedCpf = profile.cpf ? formatCpf(profile.cpf) : ''

  return (
    <div className="pdd-profile-page">
      <h1 className="pdd-page-title">Meu perfil</h1>
      <p className="pdd-profile-sub">Mantenha suas informações e preferências atualizadas.</p>

      <section className="pdd-profile-card">
        <h2>Dados Pessoais</h2>

        <div className="pdd-profile-photo-row">
          <button
            type="button"
            className="pdd-profile-avatar"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Alterar foto de perfil"
          >
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt="" />
            ) : (
              <DashAvatar size={64} seed={2} />
            )}
            <span className="pdd-profile-avatar__badge">
              <DashIcon name="camera" />
            </span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg"
            className="pdd-profile-photo-input"
            onChange={handleFile}
          />
          <div>
            <p className="pdd-profile-photo-label">Foto de Perfil</p>
            <p className="pdd-profile-photo-hint">JPG ou PNG</p>
          </div>
        </div>

        <div className="pdd-profile-grid">
          <label className="pdd-profile-field">
            <span>Nome completo</span>
            <input
              type="text"
              value={profile.nome}
              onChange={handleNomeChange}
            />
            {nameError && <span className="pdd-profile-field__error">{nameError}</span>}
          </label>
          <label className="pdd-profile-field">
            <span>E-mail</span>
            <input
              type="email"
              value={profile.email}
              disabled
              className="pdd-profile-field--readonly"
            />
          </label>
          <label className="pdd-profile-field">
            <span>CPF</span>
            <input
              type="text"
              value={formattedCpf}
              disabled
              className="pdd-profile-field--readonly"
            />
          </label>
          <label className="pdd-profile-field">
            <span>Data de nascimento</span>
            <input
              type="text"
              value={profile.dataNascimento ? new Date(profile.dataNascimento + 'T00:00:00').toLocaleDateString('pt-BR') : ''}
              disabled
              className="pdd-profile-field--readonly"
            />
          </label>
          <label className="pdd-profile-field">
            <span>Estado</span>
            <select value={profile.estado} onChange={(e) => set('estado', e.target.value)}>
              <option value="">Selecione</option>
              {ESTADOS.map((uf) => (
                <option key={uf.value} value={uf.value}>{uf.label} ({uf.value})</option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="pdd-profile-card">
        <h2>Preferências</h2>
        <p className="pdd-profile-card__hint">Escolha as áreas que você quer acompanhar de perto.</p>

        <div className="pdd-profile-tags">
          {INTERESSES.map((item, i) => {
            const active = profile.interesses.includes(item)
            return (
              <button
                key={item}
                type="button"
                className={`pdd-profile-tag ${active ? 'is-active' : ''}`}
                style={{ animationDelay: `${i * 40}ms` }}
                onClick={() => toggleInteresse(item)}
                aria-pressed={active}
              >
                {item}
              </button>
            )
          })}
        </div>
      </section>

      <div className="pdd-profile-save-row">
        <button
          type="button"
          className="pdd-profile-save"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            'Salvando...'
          ) : saved ? (
            <>
              <DashIcon name="check" /> Salvo!
            </>
          ) : (
            'Salvar alterações'
          )}
        </button>
      </div>
    </div>
  )
}
