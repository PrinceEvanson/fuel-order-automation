import { useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'

const field = 'mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200'

export default function LoginForm() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true); setError('')
    try { await login(email, password) } catch (err) { setError(err.message) } finally { setBusy(false) }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block text-sm font-medium text-slate-700">
        Email
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" className={field} />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Password
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" className={field} />
      </label>
      {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <button disabled={busy} className="w-full rounded-lg bg-emerald-600 py-2.5 font-medium text-white hover:bg-emerald-700 disabled:opacity-50">
        {busy ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  )
}
