import { useEffect, useState } from 'react'
import { api } from '../../lib/api.js'

export default function PdfViewer({ docId, className = 'h-[70vh]' }) {
    const [url, setUrl] = useState(null)
    const [error, setError] = useState('')

    useEffect(() => {
        let revoke
        setUrl(null); setError('')
        api.pdfBlobUrl(docId).then((u) => { revoke = u; setUrl(u) }).catch((e) => setError(e.message))
        return () => { if (revoke) URL.revokeObjectURL(revoke) }
    }, [docId])

    if (error) return <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">Could not load the PDF: {error}</div>
    if (!url) return <div className={`${className} animate-pulse rounded-lg bg-slate-200`} />
    return <iframe title="Original document" src={url} className={`${className} w-full rounded-lg border border-slate-300 bg-white`} />
}