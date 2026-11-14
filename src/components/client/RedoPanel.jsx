import { useState } from 'react'

const ISSUES = [
  ['wrong_customer', 'Wrong customer / buyer'],
  ['wrong_po_number', 'Wrong PO number or date'],
  ['wrong_quantity_or_price', 'Wrong quantity or price'],
  ['wrong_product', 'Wrong product / fuel type'],
  ['missing_lines', 'Some order lines are missing'],
  ['wrong_total', 'Wrong total'],
  ['wrong_document_section', 'It read the wrong part of the document'],
  ['unreadable_scan', 'My scan is blurry / hard to read'],
  ['other', 'Something else'],
]

export default function RedoPanel({ onSubmit, onCancel, busy }) {
  const [picked, setPicked] = useState([])
  const [comment, setComment] = useState('')
  const toggle = (k) => setPicked((p) => (p.includes(k) ? p.filter((x) => x !== k) : [...p, k]))
  const ready = picked.length > 0 || comment.trim().length > 0

  return (
    <div className="rounded-xl border border-amber-300 bg-amber-50 p-4">
      <h3 className="font-semibold">What went wrong with the scan?</h3>
      <p className="mb-3 text-sm text-slate-600">Your answer is passed to the AI so it reads the document again with it in mind.</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {ISSUES.map(([k, label]) => (
          <label key={k} className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={picked.includes(k)} onChange={() => toggle(k)} /> {label}
          </label>
        ))}
      </div>
      <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} maxLength={1000}
        placeholder="Add detail, for example: PO number is M760006, not M760005"
        className="mt-3 w-full rounded-lg border border-slate-300 p-2 text-sm" />
      <div className="mt-3 flex gap-2">
        <button disabled={!ready || busy} onClick={() => onSubmit(picked, comment)}
          className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50">
          {busy ? 'Re-reading...' : 'Redo the scan'}
        </button>
        <button onClick={onCancel} disabled={busy} className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-white">Cancel</button>
      </div>
    </div>
  )
}
