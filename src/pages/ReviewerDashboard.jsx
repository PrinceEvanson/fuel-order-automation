import { useCallback, useEffect, useState } from 'react'
import { api } from '../lib/api.js'
import AppShell from '../components/common/AppShell.jsx'
import StatsBar from '../components/reviewer/StatsBar.jsx'
import SageConnectionCard from '../components/reviewer/SageConnectionCard.jsx'
import DocumentQueue from '../components/reviewer/DocumentQueue.jsx'
import ReviewScreen from '../components/reviewer/ReviewScreen.jsx'

export default function ReviewerDashboard() {
    const [bucket, setBucket] = useState('pending')
    const [items, setItems] = useState([])
    const [counts, setCounts] = useState({})
    const [stats, setStats] = useState(null)
    const [selected, setSelected] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const load = useCallback(async () => {
        try {
            const [q, s] = await Promise.all([api.queue(bucket), api.stats()])
            setItems(q.items); setCounts(q.counts); setStats(s); setError('')
        } catch (e) { setError(e.message) } finally { setLoading(false) }
    }, [bucket])

    useEffect(() => { setLoading(true); load() }, [load])
    useEffect(() => { const t = setInterval(load, 20000); return () => clearInterval(t) }, [load])

    return (
        <AppShell title="Review Desk" subtitle="Check AI-read purchase orders, then post them to Sage" accent="emerald">
            <div className="space-y-4">
                <SageConnectionCard />
                <StatsBar stats={stats} />
                {error && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
                <DocumentQueue bucket={bucket} onBucket={(b) => { setBucket(b); setSelected(null) }} items={items} counts={counts}
                    selectedId={selected} onSelect={setSelected} loading={loading} />
                {selected && <ReviewScreen key={selected} docId={selected} onChanged={load} />}
            </div>
        </AppShell>
    )
}