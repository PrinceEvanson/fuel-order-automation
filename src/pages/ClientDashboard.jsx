import { useCallback, useEffect, useState } from 'react'
import { api } from '../lib/api.js'
import AppShell from '../components/common/AppShell.jsx'
import UploadZone from '../components/client/UploadZone.jsx'
import ScanPreview from '../components/client/ScanPreview.jsx'
import SubmissionList from '../components/client/SubmissionList.jsx'

export default function ClientDashboard() {
  const [current, setCurrent] = useState(null)
  const [items, setItems] = useState([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const refresh = useCallback(() => api.myDocs().then(setItems).catch((e) => setError(e.message)), [])
  useEffect(() => { refresh() }, [refresh])

  const upload = async (file) => {
    setBusy(true); setError(''); setNotice('')
    try { setCurrent(await api.upload(file)); await refresh() } catch (e) { setError(e.message) } finally { setBusy(false) }
  }

  const open = async (id) => { try { setCurrent(await api.myDoc(id)); window.scrollTo({ top: 0, behavior: 'smooth' }) } catch (e) { setError(e.message) } }

  const done = (kind) => {
    setCurrent(null)
    setNotice(kind === 'sent' ? 'Sent to the review team. You can follow its status below.' : 'Document discarded.')
    refresh()
  }

  return (
    <AppShell title="Client Portal" subtitle="Upload purchase orders and send them to the team">
      <div className="space-y-6">
        {notice && <p role="status" className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</p>}
        {error && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        {current
          ? <ScanPreview doc={current} onChange={(d) => { setCurrent(d); refresh() }} onDone={done} />
          : <UploadZone onFile={upload} busy={busy} />}

        <div>
          <h2 className="mb-2 font-semibold text-white">Your documents</h2>
          <SubmissionList items={items} onOpen={open} />
        </div>
      </div>
    </AppShell>
  )
}
