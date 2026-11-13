import { useState } from 'react'

const QUICK = ['Not a purchase order', 'Duplicate order', 'Price not agreed', 'Customer not recognised', 'Document unreadable', 'Product not supplied']

export default function RejectDialog({ onConfirm, onCancel, busy }) {
    const [reason, setReason] = useState('')
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
            <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
                <h3 className="text-lg font-semibold">Reject this document</h3>
                <p className="mb-3 text-sm text-slate-500">The client will see this reason.</p>
                <div className="mb-2 flex flex-wrap gap-1.5">
                    {QUICK.map((q) => (
                        <button key={q} type="button" onClick={() => setReason(q)} className="rounded-full border border-slate-300 px-2.5 py-1 text-xs hover:bg-slate-100">{q}</button>
                    ))}
                </div>
                <textarea autoFocus value={reason} onChange={(e) => setReason(e.target.value)} rows={4} placeholder="Reason for rejection (required)"
                    className="w-full rounded-lg border border-slate-300 p-2 text-sm" />
                <div className="mt-3 flex justify-end gap-2">
                    <button onClick={onCancel} disabled={busy} className="rounded-lg border border-slate-300 px-4 py-2 text-sm">Cancel</button>
                    <button onClick={() => onConfirm(reason.trim())} disabled={busy || reason.trim().length < 3}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50">
                        {busy ? 'Rejecting...' : 'Reject'}
                    </button>
                </div>
            </div>
        </div>
    )
}