import ConfidenceBadge from './ConfidenceBadge.jsx'

const fmt = (n) => (n == null ? <span className="text-red-600">missing</span> : Number(n).toLocaleString(undefined, { maximumFractionDigits: 4 }))

export default function ExtractedSummary({ doc }) {
    const d = doc.data || {}
    const cust = doc.match?.customer?.selected
    return (
        <div className="space-y-4 text-sm">
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
                <Field label="Customer on document" value={d.customer_name} />
                <div>
                    <dt className="text-xs uppercase text-slate-500">Matched Sage customer</dt>
                    <dd className="font-medium">{cust ? <>{cust.name} <ConfidenceBadge score={cust.score} /></> : <span className="text-red-600">No match</span>}</dd>
                </div>
                <Field label="PO number" value={d.po_number} />
                <Field label="PO date" value={d.po_date} />
                <Field label="Delivery address" value={d.delivery_address} />
                <Field label="Currency" value={d.currency} />
            </dl>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                        <tr><th className="p-2">Product</th><th className="p-2">Qty</th><th className="p-2">Unit</th><th className="p-2">Price</th><th className="p-2">Total</th></tr>
                    </thead>
                    <tbody>
                        {(d.lines || []).map((ln, i) => {
                            const m = doc.match?.lines?.[i]?.selected
                            return (
                                <tr key={i} className="border-t border-slate-100 align-top">
                                    <td className="p-2">{ln.description}
                                        <div className="text-xs text-slate-500">{m ? <>to {m.code} <ConfidenceBadge score={m.score} /></> : <span className="text-red-600">no Sage product</span>}</div>
                                    </td>
                                    <td className="p-2">{fmt(ln.quantity)}</td><td className="p-2">{ln.unit || '-'}</td>
                                    <td className="p-2">{fmt(ln.unit_price)}</td><td className="p-2">{fmt(ln.line_total)}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                    <tfoot><tr className="border-t border-slate-200 bg-slate-50 font-medium"><td className="p-2" colSpan={4}>Document total</td><td className="p-2">{fmt(d.document_total)}</td></tr></tfoot>
                </table>
            </div>
            {d.notes && <p className="rounded-lg bg-slate-100 p-2 text-xs text-slate-600">AI note: {d.notes}</p>}
        </div>
    )
}

function Field({ label, value }) {
    return (
        <div>
            <dt className="text-xs uppercase text-slate-500">{label}</dt>
            <dd className="font-medium">{value || <span className="text-slate-400">-</span>}</dd>
        </div>
    )
}