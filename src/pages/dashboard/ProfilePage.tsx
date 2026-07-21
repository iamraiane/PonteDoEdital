import { useRef, useState, type ChangeEvent } from 'react'
import { DashIcon, DashAvatar } from './Icons'
import './ProfilePage.css'

const INTERESSES = [
  'Tecnologia', 'Educação', 'Saúde', 'Infraestrutura',
  'Cultura', 'Serviços', 'Consultoria', 'Engenharia',
]

export type ProfileData = {
  nome: string
  email: string
  telefone: string
  regiao: string
  interesses: string[]
  avatarUrl: string | null
}

export default function ProfilePage({
  profile,
  onChange,
}: {
  profile: ProfileData
  onChange: (next: ProfileData) => void
}) {
  const [saved, setSaved] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function set<K extends keyof ProfileData>(key: K, value: ProfileData[K]) {
    onChange({ ...profile, [key]: value })
    setSaved(false)
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

  function handleSave() {
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2200)
  }

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
              onChange={(e) => set('nome', e.target.value)}
            />
          </label>
          <label className="pdd-profile-field">
            <span>E-mail</span>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => set('email', e.target.value)}
            />
          </label>
          <label className="pdd-profile-field">
            <span>Telefone</span>
            <input
              type="tel"
              placeholder="(99) 99999-9999"
              value={profile.telefone}
              onChange={(e) => set('telefone', e.target.value)}
            />
          </label>
          <label className="pdd-profile-field">
            <span>Região</span>
            <select value={profile.regiao} onChange={(e) => set('regiao', e.target.value)}>
              <option value="Norte">Norte</option>
              <option value="Nordeste">Nordeste</option>
              <option value="Centro-Oeste">Centro-Oeste</option>
              <option value="Sudeste">Sudeste</option>
              <option value="Sul">Sul</option>
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
        <button type="button" className="pdd-profile-save" onClick={handleSave}>
          {saved ? (
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