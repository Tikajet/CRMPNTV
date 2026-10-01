import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import axios from 'axios'

const API_URL = "https://pinhaisnet-crm-api.onrender.com"

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [usuario, setUsuario] = useState(JSON.parse(localStorage.getItem('usuario') || 'null'))
  const [erro, setErro] = useState('')
  const [aba, setAba] = useState('dashboard')

  // Estados dos Leads e Rotina
  const [leads, setLeads] = useState([])
  const [pontoIniciado, setPontoIniciado] = useState(false)
  const [novoLead, setNovoLead] = useState({ nome_completo: '', telefone_principal: '', bairro: '', origem: 'Prospecção Ativa' })

  useEffect(() => {
    if (token) {
      carregarLeads()
    }
  }, [token])

  const carregarLeads = async () => {
    try {
      const res = await axios.get(`${API_URL}/leads`)
      setLeads(res.data)
    } catch (err) {
      console.error("Erro ao carregar leads", err)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setErro('')
    try {
      const formData = new FormData()
      formData.append('username', email)
      formData.append('password', senha)

      const res = await axios.post(`${API_URL}/auth/login`, formData)
      const { access_token, usuario } = res.data

      localStorage.setItem('token', access_token)
      localStorage.setItem('usuario', JSON.stringify(usuario))
      setToken(access_token)
      setUsuario(usuario)
    } catch (err) {
      setErro('E-mail ou senha inválidos')
    }
  }

  const handleLogout = () => {
    localStorage.clear()
    setToken('')
    setUsuario(null)
  }

  const handleCriarLead = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${API_URL}/leads`, novoLead)
      setNovoLead({ nome_completo: '', telefone_principal: '', bairro: '', origem: 'Prospecção Ativa' })
      carregarLeads()
      setAba('kanban')
    } catch (err) {
      alert('Erro ao criar lead')
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-slate-200 p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-blue-700">PINHAISNET CRM</h1>
            <p className="text-sm text-slate-500 mt-1">Gestão inteligente, vendas eficientes.</p>
          </div>
          {erro && <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg border border-red-200">{erro}</div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="admin@pinhaisnet.com.br" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
              <input type="password" value={senha} onChange={e => setSenha(e.target.value)} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="••••••••" />
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors">Entrar no Sistema</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header Global */}
      <header className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-xl font-bold">PINHAISNET CRM</h1>
            <p className="text-xs text-blue-200">Painel Operacional</p>
          </div>
          <nav className="flex gap-2">
            <button onClick={() => setAba('dashboard')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${aba === 'dashboard' ? 'bg-blue-800 text-white' : 'hover:bg-blue-600 text-blue-100'}`}>Dashboard</button>
            <button onClick={() => setAba('rotina')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${aba === 'rotina' ? 'bg-blue-800 text-white' : 'hover:bg-blue-600 text-blue-100'}`}>Minha Rotina</button>
            <button onClick={() => setAba('kanban')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${aba === 'kanban' ? 'bg-blue-800 text-white' : 'hover:bg-blue-600 text-blue-100'}`}>Pipeline Kanban</button>
            <button onClick={() => setAba('novo-lead')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${aba === 'novo-lead' ? 'bg-blue-800 text-white' : 'hover:bg-blue-600 text-blue-100'}`}>+ Novo Lead</button>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm">Olá, <strong>{usuario?.nome}</strong> ({usuario?.cargo})</span>
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors">Sair</button>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
        {/* ABA 1: DASHBOARD */}
        {aba === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-500 uppercase font-semibold">Total de Leads</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{leads.length}</p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-500 uppercase font-semibold">Vendas Concluídas</p>
                <p className="text-2xl font-bold text-green-600 mt-1">0</p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-500 uppercase font-semibold">Taxa de Conversão</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">0%</p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-500 uppercase font-semibold">Meta Mensal</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">0 / 30</p>
              </div>
            </div>
          </div>
        )}

        {/* ABA 2: MINHA ROTINA */}
        {aba === 'rotina' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center pb-4 border-b">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Controle da Rotina Diária</h2>
                <p className="text-xs text-slate-500">Registe o seu expediente e acompanhe as suas tarefas diárias.</p>
              </div>
              <button onClick={() => setPontoIniciado(!pontoIniciado)} className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${pontoIniciado ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}>
                {pontoIniciado ? 'Encerrar Expediente' : 'Iniciar Expediente'}
              </button>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Checklist Diário Comercial</h3>
              {['Conferir agenda do dia', 'Consultar novos leads sem atendimento', 'Efetuar chamadas de prospecção', 'Realizar follow-ups agendados', 'Atualizar status do pipeline Kanban', 'Preencher relatório final do dia'].map((item, idx) => (
                <label key={idx} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                  <span className="text-sm text-slate-700">{item}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* ABA 3: PIPELINE KANBAN */}
        {aba === 'kanban' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {['NOVO', 'EM_NEGOCIACAO', 'PROPOSTA_ENVIADA', 'VENDA_CONCLUIDA'].map((coluna) => (
              <div key={coluna} className="bg-slate-100 rounded-xl p-4 border border-slate-200 min-h-[500px]">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-600 mb-3 flex justify-between items-center">
                  <span>{coluna.replace('_', ' ')}</span>
                  <span className="bg-slate-200 px-2 py-0.5 rounded-full text-slate-700">{leads.filter(l => l.status === coluna).length}</span>
                </h3>
                <div className="space-y-3">
                  {leads.filter(l => l.status === coluna).map((lead) => (
                    <div key={lead.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-2">
                      <p className="font-semibold text-sm text-slate-800">{lead.nome_completo}</p>
                      <p className="text-xs text-slate-500">📞 {lead.telefone_principal}</p>
                      <p className="text-xs text-slate-500">📍 Bairro: {lead.bairro}</p>
                      <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-semibold rounded">{lead.origem}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ABA 4: NOVO LEAD */}
        {aba === 'novo-lead' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm max-w-xl mx-auto">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Cadastrar Novo Lead</h2>
            <form onSubmit={handleCriarLead} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                <input type="text" value={novoLead.nome_completo} onChange={e => setNovoLead({...novoLead, nome_completo: e.target.value})} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: João Silva" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Telefone Principal</label>
                <input type="text" value={novoLead.telefone_principal} onChange={e => setNovoLead({...novoLead, telefone_principal: e.target.value})} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="(41) 99999-8888" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Bairro</label>
                <input type="text" value={novoLead.bairro} onChange={e => setNovoLead({...novoLead, bairro: e.target.value})} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: Centro" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Origem do Contato</label>
                <select value={novoLead.origem} onChange={e => setNovoLead({...novoLead, origem: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="Prospecção Ativa">Prospecção Ativa</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Indicação">Indicação</option>
                  <option value="Site">Site</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors">Salvar Lead</button>
            </form>
          </div>
        )}
      </main>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
