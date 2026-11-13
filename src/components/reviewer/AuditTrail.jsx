import { useEffect, useState } from 'react'
import { api } from '../../lib/api.js'

const LABEL = {
    uploaded: 'Uploaded', redo_requested: 'Client asked for a redo', submitted: 'Sent to review', discarded: 'Discarded by client',
    edited: 'Edited by reviewer', rejected: 'Rejected', approved_and_posted: 'Approved and posted to Sage', post_failed: 'Sage rejected the post',
}

export default function AuditTrail({ docId, refreshKey }) {
    const [rows, setRows] = useState([])
    useEffect(() => { api.audit(docId).then(setRows).catch(() => setRows([])) }, [docId, refreshKey])
    return (
        <div>
            <h3 className="mb-2 text-sm font-semibold">Audit log</h3>
            <ol className="space-y-1.5 border-l-2 border-slate-200 pl-3 text-xs">
                {rows.map((r) => (
                    <li key={r.id}>
                        <b>{LABEL[r.action] || r.action}</b> | {r.actor} | <span className="text-slate-500">{new Date(r.at).toLocaleString()}</span>
                        {r.detail?.reason && <div className="text-slate-600">Reason: {r.detail.reason}</div>}
                        {r.detail?.error && <div className="text-red-700">{r.detail.error}</div>}
                        {r.detail?.sage_quote_number && <div className="text-emerald-700">Sage quote {r.detail.sage_quote_number}</div>}
                        {r.detail?.comment && <div className="text-slate-600">"{r.detail.comment}"</div>}
                        {r.detail?.changed?.length > 0 && <div className="text-slate-600">Changed: {r.detail.changed.join(', ')}</div>}
                    </li>
                ))}
            </ol>
        </div>
    )
}