import { useState } from 'react'
import { api } from '../../lib/api.js'
import PdfViewer from '../common/PdfViewer.jsx'
import ExtractedSummary from '../common/ExtractedSummary.jsx'
import FlagList from '../common/FlagList.jsx'
import StatusPill from '../common/StatusPill.jsx'
import RedoPanel from './RedoPanel.jsx'

export default function ScanPreview({ doc, onChange, onDone }) {
    const [redoing, setRedoing] = useState(false)
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState('')

    const run = async (fn) => {
        setBusy(true); setError('')
        try { return await fn() } catch (e) { setError(e.message) } finally { setBusy(false) }
    }

    const redo = (types, comment) => run(async () => { onChange(await api.redo(doc.id, types, comment)); setRedoing(false) })
    const send = () => run(async () => { await api.submit(doc.id); onDone('sent') })
    const discard = () => run(async () => { await api.discard(doc.id); onDone('discarded') })

    const isDuplicate = doc.flags.some((f) => f.code === 'DUPLICATE')

    return (
        <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                    <h2 className="font-semibold">{doc.filename}</h2>
                    <p className="text-xs text-slate-500">Scan attempt #{doc.attempts} - check it matches your document</p>
                </div>
                <StatusPill value={doc.ai_status} />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <PdfViewer docId={doc.id} />
                <div className="space-y-4">
                    <FlagList flags={doc.flags} />
                    <ExtractedSummary doc={doc} />
                </div>
            </div>

            {error && <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

            <div className="mt-4">
                {redoing ? (
                    <RedoPanel busy={busy} onSubmit={redo} onCancel={() => setRedoing(false)} />
                ) : (
                    <div className="flex flex-wrap gap-2">
                        <button onClick={send} disabled={busy || isDuplicate || doc.ai_status === 'failed'}
                            className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700 disabled:opacity-50">
                            {busy ? 'Working...' : 'Looks right - send to review team'}
                        </button>
                        <button onClick={() => setRedoing(true)} disabled={busy}
                            className="rounded-lg border border-amber-500 px-4 py-2 font-medium text-amber-700 hover:bg-amber-50">Something is wrong - redo scan</button>
                        <button onClick={discard} disabled={busy} className="rounded-lg px-4 py-2 text-slate-500 hover:bg-slate-100">Discard</button>
                    </div>
                )}
                {!redoing && doc.ai_status === 'flagged' && !isDuplicate && (
                    <p className="mt-2 text-xs text-slate-500">Flagged items are still sent, but the review team will look at them closely.</p>
                )}
            </div>
        </section>
    )
}