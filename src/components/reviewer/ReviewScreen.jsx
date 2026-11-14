import { useEffect, useState } from 'react'
import { api } from '../../lib/api.js'
import PdfViewer from '../common/PdfViewer.jsx'
import FlagList from '../common/FlagList.jsx'
import StatusPill from '../common/StatusPill.jsx'
import ExtractedForm from './ExtractedForm.jsx'
import RejectDialog from './RejectDialog.jsx'
import AuditTrail from './AuditTrail.jsx'

export default function ReviewScreen({ docId, onChanged, onClose }) {
  const [doc, setDoc] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [blockers, setBlockers] = useState([])
  const [ack, setAck] = useState(false)
  const [rejecting, setRejecting] = useState(false)
  const [auditKey, setAuditKey] = useState(0)

  useEffect(() => {
    setDoc(null); setError(''); setBlockers([]); setAck(false)
    api.reviewDoc(docId).then(setDoc).catch((e) => setError(e.message))
  }, [docId])

  if (error && !doc) return <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p>
  if (!doc) return <p className="p-6 text-sm text-slate-500">Loading...</p>

  const actionable = doc.status === 'submitted' || doc.status === 'post_failed'
  const warns = doc.flags.filter((f) => f.severity === 'warn')
  const hasErrors = doc.flags.some((f) => f.severity === 'error')

  const run = async (fn) => {
    setBusy(true); setError(''); setBlockers([])
    try { return await fn() } catch (e) {
      setError(e.message); setBlockers(e.detail?.blockers || [])
    } finally { setBusy(false); setAuditKey((k) => k + 1) }
  }

  const save = (body) => run(async () => { setDoc(await api.edit(doc.id, body)); setAck(false); onChanged() })
  const approve = () => run(async () => { setDoc(await api.approve(doc.id, ack)); onChanged() })
  const reject = (reason) => run(async () => { setDoc(await api.reject(doc.id, reason)); setRejecting(false); onChanged() })

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="font-semibold">{doc.filename}</h2>
          <p className="text-xs text-slate-500">From {doc.owner} | uploaded {new Date(doc.created_at).toLocaleString()} | scan attempt #{doc.attempts}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusPill value={doc.ai_status} /><StatusPill value={doc.status} />
          <button onClick={onClose} aria-label="Close preview" className="ml-1 rounded-lg border border-slate-300 px-3 py-1 text-sm text-slate-700 hover:bg-slate-100">Close</button>
        </div>
      </div>

      {doc.feedback?.length > 0 && (
        <p className="mb-3 rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-700">
          The client redid this scan {doc.feedback.length}x - last issue reported: {doc.feedback.at(-1).error_types.join(', ').replaceAll('_', ' ') || '-'}
          {doc.feedback.at(-1).comment && ` - "${doc.feedback.at(-1).comment}"`}
        </p>
      )}

      <div className="grid gap-4 xl:grid-cols-2">
        <PdfViewer docId={doc.id} className="h-[75vh]" />
        <div className="max-h-[75vh] space-y-4 overflow-y-auto pr-1">
          <FlagList flags={doc.flags} />
          <ExtractedForm doc={doc} onSave={save} saving={busy} readOnly={!actionable} />
          <AuditTrail docId={doc.id} refreshKey={auditKey} />
        </div>
      </div>

      {doc.status === 'posted' && (
        <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Sage quote <b>{doc.sage_quote_number}</b> created by {doc.reviewed_by}.{' '}
          {doc.sage_url && <a className="underline" href={doc.sage_url} target="_blank" rel="noreferrer">Open in Sage</a>}
        </p>
      )}
      {doc.status === 'rejected' && <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">Rejected by {doc.reviewed_by}: {doc.reject_reason}</p>}
      {doc.status === 'post_failed' && doc.sage_error && <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">Sage error: {doc.sage_error}</p>}

      {error && (
        <div role="alert" className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
          <p className="font-medium">{error}</p>
          {blockers.length > 0 && <ul className="mt-1 list-disc pl-5">{blockers.map((b, i) => <li key={i}>{b.message}</li>)}</ul>}
        </div>
      )}

      {actionable && (
        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-4">
          {warns.length > 0 && !hasErrors && (
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} /> I have reviewed the {warns.length} warning{warns.length > 1 ? 's' : ''}
            </label>
          )}
          <button onClick={approve} disabled={busy || hasErrors || (warns.length > 0 && !ack)}
            className="rounded-lg bg-emerald-600 px-5 py-2 font-medium text-white hover:bg-emerald-700 disabled:opacity-50">
            {busy ? 'Working...' : 'Approve & post to Sage'}
          </button>
          <button onClick={() => setRejecting(true)} disabled={busy} className="rounded-lg border border-red-400 px-5 py-2 font-medium text-red-700 hover:bg-red-50">Reject...</button>
          {hasErrors && <span className="text-xs text-slate-500">Resolve the red flags (edit fields or pick a match) or reject.</span>}
        </div>
      )}

      {rejecting && <RejectDialog busy={busy} onConfirm={reject} onCancel={() => setRejecting(false)} />}
    </section>
  )
}
