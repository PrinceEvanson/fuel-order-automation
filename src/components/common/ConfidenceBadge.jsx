export default function ConfidenceBadge({ score }) {
    if (score == null) return null
    const pct = Math.round(score * 100)
    const color = pct >= 85 ? 'bg-emerald-100 text-emerald-800' : pct >= 60 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
    return <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${color}`}>{pct}% match</span>
}