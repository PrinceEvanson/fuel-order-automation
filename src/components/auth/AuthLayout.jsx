const POINTS = [
  'Upload a PDF and see exactly what was read from it',
  'Problems are flagged, never silently fixed',
  'A person approves every order before it is posted',
]

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-slate-900 p-12 text-white lg:flex">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-emerald-600/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="relative text-sm font-semibold uppercase tracking-widest text-emerald-400">Fuel Order Desk</div>
        <div className="relative space-y-8">
          <h2 className="max-w-md text-4xl font-semibold leading-tight">
            From purchase order to pro-forma invoice, without the retyping.
          </h2>
          <ul className="space-y-3 text-slate-300">
            {POINTS.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                {p}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs text-slate-400">Built for fuel orders across Kenya, Uganda and Tanzania.</p>
      </div>
      <div className="flex items-center justify-center bg-white p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-sm font-semibold uppercase tracking-widest text-emerald-700 lg:hidden">Fuel Order Desk</div>
          <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          <div className="mt-6">{children}</div>
          {footer}
        </div>
      </div>
    </div>
  )
}
