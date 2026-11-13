import { useEffect, useState } from 'react'
import { api } from '../../lib/api.js'

export default function SageConnectionCard() {
    const [status, setStatus] = useState(null)
    const [error, setError] = useState('')
    const flash = new URLSearchParams(window.location.search).get('sage')

    useEffect(() => { api.sageStatus().then(setStatus).catch((e) => setError(e.message)) }, [])

    const connect = async () => {
        try { window.location.assign((await api.sageConnectUrl()).url) } catch (e) { setError(e.message) }
    }

    return (
        <div className={`flex flex-wrap items-center justify-between gap-2 rounded-xl px-4 py-3 text-sm ring-1 ${status?.connected ? 'bg-emerald-50 ring-emerald-200' : 'bg-amber-50 ring-amber-300'}`}>
            <div>
                {status?.connected
                    ? <>Sage Accounting connected{status.connected_by ? ` by ${status.connected_by}` : ''}. Customers and products are read live from Sage.</>
                    : <>Sage is not connected - matching uses the built-in sample data and nothing can be posted.</>}
                {flash === 'connected' && <span className="ml-2 font-medium text-emerald-700">Connected just now.</span>}
                {flash === 'error' && <span className="ml-2 font-medium text-red-700">Connection failed - try again.</span>}
                {error && <span className="ml-2 text-red-700">{error}</span>}
            </div>
            <button onClick={connect} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 hover:bg-slate-100">
                {status?.connected ? 'Reconnect' : 'Connect Sage'}
            </button>
        </div>
    )
}