import { useEffect, useState } from 'react'
import ConfidenceBadge from '../common/ConfidenceBadge.jsx'

const input = 'w-full rounded-md border border-slate-300 px-2 py-1 text-sm focus:border-amber-500 focus:outline-none'
const numOrNull = (v) => (v === '' || v == null ? null : Number(v))

export default function ExtractedForm({ doc, onSave, saving, readOnly }) {
    const [d, setD] = useState(doc.data)
    const [customerCode, setCustomerCode] = useState(doc.match?.customer?.manual ? doc.match.customer.selected?.code : '')
    const [productCodes, setProductCodes] = useState(() => Object.fromEntries((doc.match?.lines || []).map((m, i) => [i, m.manual ? m.selected?.code : '']).filter(([, v]) => v)))

    useEffect(() => {
        setD(doc.data)
        setCustomerCode(doc.match?.customer?.manual ? doc.match.customer.selected?.code : '')
        setProductCodes(Object.fromEntries((doc.match?.lines || []).map((m, i) => [i, m.manual ? m.selected?.code : '']).filter(([, v]) => v)))
    }, [doc])

    const set = (k, v) => setD((p) => ({ ...p, [k]: v }))
    const setLine = (i, k, v) => setD((p) => ({ ...p, lines: p.lines.map((l, j) => (j === i ? { ...l, [k]: v } : l)) }))
    const cust = doc.match?.customer
    const dirty = JSON.stringify(d) !== JSON.stringify(doc.data)

    const save = () => onSave({
        customer_name: d.customer_name, po_number: d.po_number, po_date: d.po_date, delivery_address: d.delivery_address,
        currency: d.currency, document_total: numOrNull(d.document_total),
        lines: d.lines.map((l) => ({ ...l, quantity: numOrNull(l.quantity), unit_price: numOrNull(l.unit_price), line_total: numOrNull(l.line_total) })),
        customer_code: customerCode || null, product_codes: productCodes,
    })

    return (
        <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
                <label className="col-span-2">Customer on document
                    <input disabled={readOnly} className={input} value={d.customer_name || ''} onChange={(e) => set('customer_name', e.target.value)} /></label>
                <label className="col-span-2">Sage customer {cust?.selected && <ConfidenceBadge score={cust.selected.score} />}
                    <select disabled={readOnly} className={input} value={customerCode || cust?.selected?.code || ''} onChange={(e) => setCustomerCode(e.target.value)}>
                        {!cust?.selected && <option value="">- no match, choose one -</option>}
                        {(cust?.candidates || []).map((c) => <option key={c.code} value={c.code}>{c.name} ({Math.round(c.score * 100)}%)</option>)}
                    </select></label>
                <label>PO number<input disabled={readOnly} className={input} value={d.po_number || ''} onChange={(e) => set('po_number', e.target.value)} /></label>
                <label>PO date<input disabled={readOnly} className={input} value={d.po_date || ''} onChange={(e) => set('po_date', e.target.value)} /></label>
                <label className="col-span-2">Delivery address<input disabled={readOnly} className={input} value={d.delivery_address || ''} onChange={(e) => set('delivery_address', e.target.value)} /></label>
                <label>Currency<input disabled={readOnly} className={input} value={d.currency || ''} onChange={(e) => set('currency', e.target.value)} /></label>
                <label>Document total<input disabled={readOnly} type="number" step="any" className={input} value={d.document_total ?? ''} onChange={(e) => set('document_total', e.target.value)} /></label>
            </div>

            <div className="space-y-2">
                {(d.lines || []).map((ln, i) => {
                    const m = doc.match?.lines?.[i]
                    return (
                        <div key={i} className="rounded-lg border border-slate-200 p-2">
                            <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                                <span>Line {i + 1}</span>
                                <span>Sage product {m?.selected && <ConfidenceBadge score={m.selected.score} />}</span>
                            </div>
                            <input disabled={readOnly} className={`${input} mb-1`} value={ln.description || ''} onChange={(e) => setLine(i, 'description', e.target.value)} />
                            <select disabled={readOnly} className={`${input} mb-1`} value={productCodes[i] || m?.selected?.code || ''} onChange={(e) => setProductCodes((p) => ({ ...p, [i]: e.target.value }))}>
                                {!m?.selected && <option value="">- not a product we sell -</option>}
                                {(m?.candidates || []).map((c) => <option key={c.code} value={c.code}>{c.code} | {c.description} ({Math.round(c.score * 100)}%)</option>)}
                            </select>
                            <div className="grid grid-cols-4 gap-1">
                                {[['quantity', 'Qty'], ['unit', 'Unit'], ['unit_price', 'Price'], ['line_total', 'Total']].map(([k, label]) => (
                                    <label key={k} className="text-xs text-slate-500">{label}
                                        <input disabled={readOnly} type={k === 'unit' ? 'text' : 'number'} step="any" className={input} value={ln[k] ?? ''} onChange={(e) => setLine(i, k, e.target.value)} />
                                    </label>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>

            {!readOnly && (
                <button onClick={save} disabled={saving || (!dirty && !customerCode && !Object.keys(productCodes).length)}
                    className="rounded-lg border border-slate-400 px-3 py-1.5 font-medium hover:bg-slate-100 disabled:opacity-50">
                    {saving ? 'Saving...' : 'Save changes & re-check'}
                </button>
            )}
        </div>
    )
}