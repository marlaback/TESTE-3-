
import { useEffect, useMemo, useState } from 'react'
import {
  Activity,
  AudioLines,
  LayoutDashboard,
  Users,
  Plus,
  Search,
  Trash2,
  HeartPulse,
  Menu,
  X,
  UserRound,
  ClipboardList,
} from 'lucide-react'

const STORAGE_KEY = 'fisiovoice_demo_patients'

function loadPatients() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export default function App() {
  const [patients, setPatients] = useState(loadPatients)
  const [page, setPage] = useState('dashboard')
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [complaint, setComplaint] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(patients))
  }, [patients])

  const filteredPatients = useMemo(() => {
    const query = search.trim().toLowerCase()
    return patients.filter((patient) =>
      patient.name.toLowerCase().includes(query)
    )
  }, [patients, search])

  function addPatient(event) {
    event.preventDefault()

    if (!name.trim()) return

    const patient = {
      id: crypto.randomUUID(),
      name: name.trim(),
      age: age ? Number(age) : null,
      complaint: complaint.trim(),
      createdAt: new Date().toLocaleDateString('pt-BR'),
    }

    setPatients((current) => [patient, ...current])
    setName('')
    setAge('')
    setComplaint('')
    setFormOpen(false)
    setPage('patients')
  }

  function deletePatient(id) {
    const confirmed = window.confirm(
      'Deseja realmente excluir este cadastro?'
    )

    if (confirmed) {
      setPatients((current) =>
        current.filter((patient) => patient.id !== id)
      )
    }
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'patients', label: 'Pacientes', icon: Users },
  ]

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-icon">
            <AudioLines size={25} />
          </div>
          <div>
            <h1>FisioVoice</h1>
            <span>Prontuário Inteligente</span>
          </div>
          <button
            className="icon-button mobile-close"
            onClick={() => setMenuOpen(false)}
            aria-label="Fechar menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="nav-label">MENU PRINCIPAL</div>

        <nav className="navigation">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`nav-item ${page === id ? 'active' : ''}`}
              onClick={() => {
                setPage(id)
                setMenuOpen(false)
              }}
            >
              <Icon size={19} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="professional">
            <div className="professional-avatar">
              <UserRound size={20} />
            </div>
            <div>
              <strong>Profissional</strong>
              <span>Fisioterapia</span>
            </div>
          </div>
          <p>Versão demonstrativa</p>
        </div>
      </aside>

      {menuOpen && (
        <button
          className="backdrop"
          onClick={() => setMenuOpen(false)}
          aria-label="Fechar menu"
        />
      )}

      <main className="main-area">
        <header className="topbar">
          <button
            className="icon-button mobile-menu"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu size={22} />
          </button>

          <div className="breadcrumb">
            <span>FisioVoice</span>
            <span>/</span>
            <strong>
              {page === 'dashboard' ? 'Dashboard' : 'Pacientes'}
            </strong>
          </div>

          <div className="topbar-status">
            <span className="status-dot" />
            Demonstração local
          </div>
        </header>

        <div className="content">
          {page === 'dashboard' ? (
            <>
              <section className="welcome">
                <div>
                  <span className="eyebrow">SEU ESPAÇO DE TRABALHO</span>
                  <h2>Bem-vindo ao FisioVoice</h2>
                  <p>
                    Organize seus cadastros e acompanhe sua rotina
                    de atendimento.
                  </p>
                </div>
                <div className="welcome-icon">
                  <Activity size={38} />
                </div>
              </section>

              <section className="stats-grid">
                <article className="stat-card">
                  <div className="stat-icon teal">
                    <Users size={22} />
                  </div>
                  <span>Pacientes cadastrados</span>
                  <strong>{patients.length}</strong>
                  <small>Total de cadastros neste navegador</small>
                </article>

                <article className="stat-card">
                  <div className="stat-icon purple">
                    <ClipboardList size={22} />
                  </div>
                  <span>Prontuários</span>
                  <strong>0</strong>
                  <small>Não disponíveis nesta demonstração</small>
                </article>

                <article className="stat-card">
                  <div className="stat-icon blue">
                    <HeartPulse size={22} />
                  </div>
                  <span>Atendimentos</span>
                  <strong>0</strong>
                  <small>Integração clínica ainda não configurada</small>
                </article>
              </section>

              <section className="panel">
                <div className="panel-heading">
                  <div>
                    <h3>Pacientes recentes</h3>
                    <p>Cadastros adicionados neste navegador</p>
                  </div>
                  <button
                    className="primary-button"
                    onClick={() => setFormOpen(true)}
                  >
                    <Plus size={18} />
                    Novo paciente
                  </button>
                </div>

                {patients.length === 0 ? (
                  <EmptyState onAdd={() => setFormOpen(true)} />
                ) : (
                  <PatientList
                    patients={patients.slice(0, 5)}
                    onDelete={deletePatient}
                  />
                )}
              </section>
            </>
          ) : (
            <section className="panel patients-panel">
              <div className="panel-heading">
                <div>
                  <span className="eyebrow">GESTÃO DE CADASTROS</span>
                  <h2>Pacientes</h2>
                  <p>Consulte os cadastros desta demonstração.</p>
                </div>
                <button
                  className="primary-button"
                  onClick={() => setFormOpen(true)}
                >
                  <Plus size={18} />
                  Novo paciente
                </button>
              </div>

              <label className="search-box">
                <Search size={19} />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar paciente pelo nome..."
                />
              </label>

              {filteredPatients.length === 0 ? (
                <EmptyState
                  message={
                    search
                      ? 'Nenhum cadastro encontrado para esta busca.'
                      : 'Ainda não há pacientes cadastrados.'
                  }
                  onAdd={() => setFormOpen(true)}
                />
              ) : (
                <PatientList
                  patients={filteredPatients}
                  onDelete={deletePatient}
                />
              )}
            </section>
          )}

          <footer className="footer">
            FisioVoice · Protótipo de interface · Não utilizar com dados
            reais de pacientes
          </footer>
        </div>
      </main>

      {formOpen && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setFormOpen(false)
          }}
        >
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="modal-heading">
              <div>
                <h2 id="modal-title">Novo paciente</h2>
                <p>Preencha os dados para criar um cadastro demonstrativo.</p>
              </div>
              <button
                className="icon-button"
                onClick={() => setFormOpen(false)}
                aria-label="Fechar formulário"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={addPatient} className="patient-form">
              <label>
                Nome *
                <input
                  autoFocus
                  required
                  maxLength={120}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Nome do paciente"
                />
              </label>

              <label>
                Idade
                <input
                  type="number"
                  min="0"
                  max="125"
                  value={age}
                  onChange={(event) => setAge(event.target.value)}
                  placeholder="Idade"
                />
              </label>

              <label>
                Queixa principal (opcional)
                <textarea
                  maxLength={500}
                  value={complaint}
                  onChange={(event) => setComplaint(event.target.value)}
                  placeholder="Descrição demonstrativa"
                  rows={3}
                />
              </label>

              <p className="privacy-note">
                Os dados ficam apenas no armazenamento local deste
                navegador. Não use informações clínicas reais.
              </p>

              <div className="form-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setFormOpen(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="primary-button">
                  Salvar cadastro
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}

function EmptyState({ onAdd, message }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Users size={28} />
      </div>
      <h3>{message || 'Nenhum paciente cadastrado'}</h3>
      <p>Adicione um cadastro para visualizar a lista aqui.</p>
      <button className="secondary-button" onClick={onAdd}>
        <Plus size={17} />
        Adicionar paciente
      </button>
    </div>
  )
}

function PatientList({ patients, onDelete }) {
  return (
    <div className="patient-list">
      {patients.map((patient) => (
        <article className="patient-row" key={patient.id}>
          <div className="patient-avatar">
            <UserRound size={21} />
          </div>
          <div className="patient-details">
            <strong>{patient.name}</strong>
            <span>
              {patient.age !== null ? `${patient.age} anos` : 'Idade não informada'}
              {' · '}
              Cadastro: {patient.createdAt}
            </span>
            {patient.complaint && (
              <p>{patient.complaint}</p>
            )}
          </div>
          <button
            className="icon-button delete-button"
            onClick={() => onDelete(patient.id)}
            aria-label={`Excluir cadastro de ${patient.name}`}
            title="Excluir cadastro"
          >
            <Trash2 size={18} />
          </button>
        </article>
      ))}
    </div>
  )
}
