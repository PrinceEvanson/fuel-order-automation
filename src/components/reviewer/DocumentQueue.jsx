import StatusPill from '../common/StatusPill.jsx'

const TABS = [
  ['pending', 'All pending', 'Pending'],
  ['passed', 'Passed AI check', 'Passed'],
  ['flagged', 'Flagged', 'Flagged'],
  ['posted', 'Posted to Sage', 'Posted'],
  ['rejected', 'Rejected', 'Rejected'],
]

export default function DocumentQueue({ bucket, onBucket, items, counts, selectedId, onSelect, loading, compact }) {
  return (
    <div className="overflow-hidden rounded-xl bg-white ring-1 ring-slate-200">
      <div className="flex flex-wrap gap-1 border-b border-slate-200 bg-slate-50 p-2">
        {TABS.map(([key, label, short]) => (
          <button key={key} onClick={() => onBucket(key)}
            className={`rounded-lg px-3 py-1.5 text-sm ${compact ? 'px-2 py-1 text-xs' : ''} ${bucket === key ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200'}`}>
            {compact ? short : label} <span className="opacity-70">({counts?.[key] ?? 0})</span>
          </button>
        ))}
      </div>
      {loading ? <p className="p-6 text-sm text-slate-500">Loading...</p> : !items.length ? (
        <p className="p-6 text-center text-sm text-slate-500">Nothing here.</p>
      ) : (
        <ul className={`divide-y divide-slate-100 ${compact ? 'max-h-[calc(100vh-14rem)] overflow-y-auto' : ''}`}>
          {items.map((d) => {
            const active = selectedId === d.id
            return (
              <li key={d.id}>
                <button onClick={() => onSelect(d.id)}
                  className={`flex w-full items-center justify-between gap-3 border-l-4 text-left transition hover:bg-emerald-50 ${compact ? 'p-2' : 'p-3'} ${active ? 'border-emerald-600 bg-emerald-50' : 'border-transparent'}`}>
                  <div className="min-w-0">
                    <div className={`truncate font-medium ${compact ? 'text-sm' : ''}`}>{d.customer_name || d.filename}</div>
                    {compact
                      ? <div className="truncate text-xs text-slate-500">{d.filename}</div>
                      : <div className="truncate text-xs text-slate-500">PO {d.po_number || '-'} | from {d.owner} | {d.filename}</div>}
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <StatusPill value={d.status === 'submitted' ? d.ai_status : d.status} />
                    {d.flag_count > 0 && d.status === 'submitted' && <span className="text-xs text-amber-700">{d.flag_count} issue{d.flag_count > 1 ? 's' : ''}</span>}
                  </div>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
