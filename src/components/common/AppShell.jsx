import { useAuth } from '../../context/AuthContext.jsx'

export default function AppShell({ title, subtitle, accent = 'amber', children }) {
    const { user, logout } = useAuth()
    return (
        <div className="min-h-screen">
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                    <div>
                        <h1 className="text-lg font-semibold">
                            {title}
                        </h1>
                        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <span className="text-slate-600">{user?.name}</span>
                        <button onClick={logout} className="rounded-lg border border-slate-300 px-3 py-1.5 hover:bg-slate-100">Sign out</button>
                    </div>
                </div>
            </header>
            <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
        </div>
    )
}