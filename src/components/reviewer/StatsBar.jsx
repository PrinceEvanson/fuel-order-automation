export default function StatsBar({ stats }) {
    const tiles = [
        ['Waiting for review', stats?.waiting ?? '-'],
        ['Approved today', stats?.approved_today ?? '-'],
        ['Avg. upload to PFI', stats?.avg_upload_to_pfi_minutes != null ? `${stats.avg_upload_to_pfi_minutes} min` : '-'],
    ]
    return (
        <div className="grid grid-cols-3 gap-3">
            {tiles.map(([label, value]) => (
                <div key={label} className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
                    <div className="text-2xl font-semibold">{value}</div>
                    <div className="text-xs text-slate-500">{label}</div>
                </div>
            ))}
        </div>
    )
}