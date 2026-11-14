import { useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'

const field = 'mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200'

export default function SignupForm() {
  const { signup } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'client', invite_code: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }))
  const mismatch = form.confirm.length > 0 && form.password !== form.confirm

  const submit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) {
      setError('The two passwords do not match.')
      return
    }
    setBusy(true); setError('')
    const { confirm, ...body } = form
    try { await signup(body) } catch (err) { setError(err.message) } finally { setBusy(false) }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block text-sm font-medium text-slate-700">
        Full name
        <input required value={form.name} onChange={set('name')} autoComplete="name" className={field} />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Email
        <input type="email" required value={form.email} onChange={set('email')} autoComplete="username" className={field} />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Password
        <input type="password" required minLength={8} value={form.password} onChange={set('password')} autoComplete="new-password" className={field} />
        <span className="mt-1 block text-xs font-normal text-slate-500">At least 8 characters.</span>
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Confirm password
        <input type="password" required value={form.confirm} onChange={set('confirm')} autoComplete="new-password"
          className={`${field} ${mismatch ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : ''}`} />
        {mismatch && <span className="mt-1 block text-xs font-normal text-red-600">Passwords do not match.</span>}
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Account type
        <select value={form.role} onChange={set('role')} className={field}>
          <option value="client">Client - upload purchase orders</option>
          <option value="reviewer">Reviewer - check and post orders (invite code needed)</option>
        </select>
      </label>
      {form.role === 'reviewer' && (
        <label className="block text-sm font-medium text-slate-700">
          Reviewer invite code
          <input required value={form.invite_code} onChange={set('invite_code')} className={field} />
        </label>
      )}
      {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <button disabled={busy} className="w-full rounded-lg bg-emerald-600 py-2.5 font-medium text-white hover:bg-emerald-700 disabled:opacity-50">
        {busy ? 'Creating account...' : 'Create account'}
      </button>
    </form>
  )
}
