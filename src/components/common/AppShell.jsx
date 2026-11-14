import { useAuth } from '../../context/AuthContext.jsx'

export default function AppShell({ title, subtitle, notice, wide = false, children }) {
  const { user, logout } = useAuth()
  const width = wide ? 'max-w-[1600px]' : 'max-w-7xl'
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
      <header className="bg-slate-950 text-white">
        <div className={`mx-auto flex ${width} items-start justify-between gap-4 px-4 py-4`}>
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-emerald-400">Fuel Order Desk</div>
            <h1 className="text-lg font-semibold">{title}</h1>
            {subtitle && <p className="text-xs text-slate-300">{subtitle}</p>}
          </div>
          <div className="flex flex-col items-end gap-2 text-sm">
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <div className="font-medium">{user?.name}</div>
                <div className="text-xs capitalize text-emerald-300">{user?.role}</div>
              </div>
              <button onClick={logout} className="rounded-lg border border-slate-600 px-3 py-1.5 hover:bg-slate-800">Sign out</button>
            </div>
            {notice}
          </div>
        </div>
        <div className="h-1 bg-emerald-600" />
      </header>
      <main className={`mx-auto ${width} px-4 py-6`}>{children}</main>
    </div>
  )
}
