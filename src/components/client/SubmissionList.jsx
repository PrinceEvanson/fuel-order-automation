import StatusPill from '../common/StatusPill.jsx'

const when = (iso) => (iso ? new Date(iso).toLocaleString() : '-')

export default function SubmissionList({ items, onOpen }) {
  if (!items.length) return <p className="rounded-xl bg-white p-6 text-center text-sm text-slate-500 ring-1 ring-slate-200">Nothing uploaded yet.</p>
  return (
    <div className="overflow-x-auto rounded-xl bg-white ring-1 ring-slate-200">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr><th className="p-3">File</th><th className="p-3">PO</th><th className="p-3">Status</th><th className="p-3">Uploaded</th><th className="p-3">Result</th></tr>
        </thead>
        <tbody>
          {items.map((d) => (
            <tr key={d.id} className="border-t border-slate-100">
              <td className="p-3 font-medium">{d.filename}</td>
              <td className="p-3">{d.po_number || '-'}</td>
              <td className="p-3"><StatusPill value={d.status} /></td>
              <td className="p-3 text-slate-500">{when(d.created_at)}</td>
              <td className="p-3">
                {d.status === 'rejected' && <span className="text-red-700">Rejected: {d.reject_reason}</span>}
                {d.status === 'posted' && <span className="text-emerald-700">Quote {d.sage_quote_number} created</span>}
                {d.status === 'extracted' && <button onClick={() => onOpen(d.id)} className="text-emerald-700 underline">Continue</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
