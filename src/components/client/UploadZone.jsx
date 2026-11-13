import { useEffect, useRef, useState } from 'react'

export default function UploadZone({ onFile, busy }) {
    const input = useRef(null)
    const [over, setOver] = useState(false)
    const [error, setError] = useState('')

    const accept = (file) => {
        setError('')
        if (!file) return
        if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) return setError('Only PDF files are accepted.')
        onFile(file)
    }

    useEffect(() => {
        const onPaste = (e) => {
            const f = [...(e.clipboardData?.files || [])][0]
            if (f && !busy) accept(f)
        }
        window.addEventListener('paste', onPaste)
        return () => window.removeEventListener('paste', onPaste)
    })

    return (
        <div>
            <div
                onClick={() => !busy && input.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setOver(true) }}
                onDragLeave={() => setOver(false)}
                onDrop={(e) => { e.preventDefault(); setOver(false); !busy && accept(e.dataTransfer.files[0]) }}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition
          ${over ? 'border-amber-500 bg-amber-50' : 'border-slate-300 bg-white hover:border-amber-400'} ${busy ? 'pointer-events-none opacity-60' : ''}`}
            >
                <p className="mt-3 font-medium">{busy ? 'Reading your document with AI...' : 'Drop your purchase order PDF here'}</p>
                <p className="mt-1 text-sm text-slate-500">{busy ? 'Scanned and multi-page files can take up to a minute.' : 'or click to browse, or paste a copied PDF (Ctrl/Cmd + V)'}</p>
                <input ref={input} type="file" accept="application/pdf,.pdf" hidden onChange={(e) => { accept(e.target.files[0]); e.target.value = '' }} />
            </div>
            {error && <p role="alert" className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
    )
}