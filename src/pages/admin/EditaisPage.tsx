import { useState } from 'react'
import { DashIcon } from '../dashboard/Icons'
import './EditaisPage.css'

type Edital = {
  id: string
  titulo: string
  orgao: string
  categoria: string
  modalidade: string
  prazo: string
}

const CATEGORIAS = ['Infraestrutura', 'Saúde', 'Educação', 'Tecnologia', 'Serviços']
const MODALIDADES = ['Concorrência', 'Pregão', 'Tomada de Preços', 'Convite']

const INITIAL_EDITAIS: Edital[] = Array.from({ length: 6 }).map((_, i) => ({
  id: `edital-${i + 1}`,
  titulo: 'Reforma do Complexo Esportivo Municipal',
  orgao: 'Candido Rodrigues / SP',
  categoria: 'Infraestrutura',
  modalidade: 'Concorrência',
  prazo: '03 Ago 2026',
}))

export default function EditaisPage() {
  const [editais, setEditais] = useState<Edital[]>(INITIAL_EDITAIS)
  const [busca, setBusca] = useState('')
  const [menuAberto, setMenuAberto] = useState<string | null>(null)
  const [editando, setEditando] = useState<Edital | null>(null)
  const [excluindo, setExcluindo] = useState<Edital | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const termo = busca.toLowerCase()
  const filtrados = editais.filter(
    (e) => e.titulo.toLowerCase().includes(termo) || e.orgao.toLowerCase().includes(termo)
  )

  function avisar(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 2200)
  }

  function salvarEdicao(atualizado: Edital) {
    setEditais((prev) => prev.map((e) => (e.id === atualizado.id ? atualizado : e)))
    setEditando(null)
    avisar('Edital atualizado com sucesso')
  }

  function excluir() {
    if (!excluindo) return
    setEditais((prev) => prev.filter((e) => e.id !== excluindo.id))
    setExcluindo(null)
    avisar('Edital excluído')
  }

  return (
    <div className="pda-editais-page">
      <h1 className="pda-page-title">Gerenciamento de Editais</h1>
      <p className="pda-page-sub">Acompanhe e edite os editais cadastrados</p>

      <div className="pda-toolbar">
        <label className="pda-search">
          <span className="pda-search__glyph"><DashIcon name="search" /></span>
          <input
            type="text"
            placeholder="Buscar por título ou órgão"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </label>
      </div>

      <div className="pda-table-wrap">
        <table className="pda-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Categoria</th>
              <th>Modalidade</th>
              <th>Prazo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length === 0 && (
              <tr className="pda-empty-row">
                <td colSpan={5}>Nenhum edital encontrado.</td>
              </tr>
            )}
            {filtrados.map((edital, i) => (
              <tr key={edital.id} style={{ animationDelay: `${i * 40}ms` }}>
                <td data-label="Título">
                  <span className="pda-cell-title">{edital.titulo}</span>
                  <span className="pda-cell-sub">{edital.orgao}</span>
                </td>
                <td data-label="Categoria">{edital.categoria}</td>
                <td data-label="Modalidade">{edital.modalidade}</td>
                <td className="pda-cell-prazo" data-label="Prazo">{edital.prazo}</td>
                <td className="pda-actions-cell" data-label="Ações">
                  <button
                    type="button"
                    className="pda-dots-btn"
                    aria-label="Ações"
                    onClick={() => setMenuAberto(menuAberto === edital.id ? null : edital.id)}
                  >
                    <DashIcon name="dots" />
                  </button>
                  {menuAberto === edital.id && (
                    <div className="pda-row-menu" role="menu">
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setEditando(edital)
                          setMenuAberto(null)
                        }}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        role="menuitem"
                        className="is-danger"
                        onClick={() => {
                          setExcluindo(edital)
                          setMenuAberto(null)
                        }}
                      >
                        Excluir
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editando && (
        <EditarEditalModal
          edital={editando}
          onCancel={() => setEditando(null)}
          onSave={salvarEdicao}
        />
      )}

      {excluindo && (
        <ConfirmarExclusaoModal
          titulo={excluindo.titulo}
          onCancel={() => setExcluindo(null)}
          onConfirm={excluir}
        />
      )}

      {toast && <div className="pda-toast">{toast}</div>}
    </div>
  )
}

function EditarEditalModal({
  edital,
  onCancel,
  onSave,
}: {
  edital: Edital
  onCancel: () => void
  onSave: (e: Edital) => void
}) {
  const [form, setForm] = useState<Edital>(edital)

  return (
    <div className="pda-overlay" onClick={onCancel}>
      <div className="pda-modal pda-modal--light" onClick={(e) => e.stopPropagation()}>
        <h2 className="pda-modal-title">Editar edital</h2>

        <div className="pda-field">
          <label>Título</label>
          <textarea
            rows={2}
            value={form.titulo}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
          />
        </div>

        <div className="pda-field-row">
          <div className="pda-field">
            <label>Prazo</label>
            <input
              type="text"
              value={form.prazo}
              onChange={(e) => setForm({ ...form, prazo: e.target.value })}
              placeholder="Ex: 03 Ago 2026"
            />
          </div>
          <div className="pda-field">
            <label>Categoria</label>
            <select
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value })}
            >
              {CATEGORIAS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="pda-field">
          <label>Modalidade</label>
          <select
            value={form.modalidade}
            onChange={(e) => setForm({ ...form, modalidade: e.target.value })}
          >
            {MODALIDADES.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </div>

        <button type="button" className="pda-btn pda-btn--primary" onClick={() => onSave(form)}>
          Salvar Alterações
        </button>
      </div>
    </div>
  )
}

function ConfirmarExclusaoModal({
  titulo,
  onCancel,
  onConfirm,
}: {
  titulo: string
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <div className="pda-overlay" onClick={onCancel}>
      <div className="pda-modal pda-modal--dark" onClick={(e) => e.stopPropagation()}>
        <h2 className="pda-modal-title">Tem certeza que deseja excluir esse edital?</h2>
        <p className="pda-modal-note">{titulo}</p>
        <div className="pda-modal-actions">
          <button type="button" className="pda-btn pda-btn--outline" onClick={onCancel}>
            Não
          </button>
          <button type="button" className="pda-btn pda-btn--teal" onClick={onConfirm}>
            Sim
          </button>
        </div>
      </div>
    </div>
  )
}
