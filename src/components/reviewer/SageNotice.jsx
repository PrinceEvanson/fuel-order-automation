import { useEffect, useState } from 'react'
import { api } from '../../lib/api.js'

export default function SageNotice() {
  const [status, setStatus] = useState(null)
  const [error, setError] = useState('')
  const flash = new URLSearchParams(window.location.search).get('sage')

  useEffect(() => { api.sageStatus().then(setStatus).catch((e) => setError(e.message)) }, [])

  const connect = async () => {
    try { window.location.assign((await api.sageConnectUrl()).url) } catch (e) { setError(e.message) }
  }

  if (!status && !error) return null

  const connected = status?.connected
  const tone = connected ? 'bg-emerald-500/15 text-emerald-200 ring-emerald-400/40' : 'bg-amber-400/15 text-amber-200 ring-amber-300/40'

  return (
    <div role="status" className={`flex max-w-md items-center gap-2 rounded-full px-3 py-1 text-xs ring-1 ${tone}`}>
      <span className={`h-2 w-2 shrink-0 rounded-full ${connected ? 'bg-emerald-400' : 'bg-amber-300'}`} />
      <span className="truncate">
        {error
          ? error
          : flash === 'error'
            ? 'Sage connection failed'
            : connected
              ? `Sage connected${status.connected_by ? ` by ${status.connected_by}` : ''}`
              : 'Sage not connected - sample data in use'}
      </span>
      <button onClick={connect} className="shrink-0 font-semibold underline underline-offset-2 hover:text-white">
        {connected ? 'Reconnect' : 'Connect'}
      </button>
    </div>
  )
}
