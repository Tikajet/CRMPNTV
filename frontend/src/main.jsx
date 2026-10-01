import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import axios from 'axios'

const API_URL = "https://pinhaisnet-crm-api.onrender.com"

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [usuario, setUsuario] = useState(JSON.parse(localStorage.getItem('usuario') || 'null'))
  const [erro, setErro] = useState('')

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

  if (!token) {
    return (
      <div class="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <div class="max-w-md w-full bg-white rounded-xl shadow-lg border border-slate-200 p-8">
          <div class="text-center mb-6">
            <h1 class="text-2xl font-bold text-blue-700">PINHAISNET CRM</h1>
            <p class="text-sm text-slate-500 mt-1">Gestão inteligente, vendas eficientes.</p>
          </div>
          {erro && <div class="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg border border-red-200">{erro}</div>}
          <form onSubmit={handleLogin} class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="admin@pinhaisnet.com.br" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Senha</label>
              <input type="password" value={senha} onChange={e => setSenha(e.target.value)} required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="••••••••" />
            </div>
            <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors">Entrar no Sistema</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div class="min-h-screen bg-slate-50 flex flex-col">
      <header class="bg-blue-700 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <div>
          <h1 class="text-xl font-bold">PINHAISNET CRM</h1>
          <p class="text-xs text-blue-200">Painel Principal</p>
        </div>
        <div class="flex items-center gap-4">
          <span class="text-sm">Olá, <strong>{usuario?.nome}</strong> ({usuario?.cargo})</span>
          <button onClick={handleLogout} class="bg-red-500 hover:bg-red-600 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors">Sair</button>
        </div>
      </header>
      <main class="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <p class="text-xs text-slate-500 uppercase font-semibold">Vendas do Dia</p>
            <p class="text-2xl font-bold text-slate-800 mt-1">0</p>
          </div>
          <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <p class="text-xs text-slate-500 uppercase font-semibold">Novos Leads</p>
            <p class="text-2xl font-bold text-slate-800 mt-1">0</p>
          </div>
          <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <p class="text-xs text-slate-500 uppercase font-semibold">Taxa de Conversão</p>
            <p class="text-2xl font-bold text-blue-600 mt-1">0%</p>
          </div>
          <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <p class="text-xs text-slate-500 uppercase font-semibold">Meta Mensal</p>
            <p class="text-2xl font-bold text-slate-800 mt-1">0 / 30</p>
          </div>
        </div>
      </main>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
