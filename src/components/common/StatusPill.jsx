const STYLES = {
  passed: 'bg-emerald-100 text-emerald-800',
  flagged: 'bg-amber-100 text-amber-800',
  failed: 'bg-red-100 text-red-800',
  extracted: 'bg-slate-100 text-slate-700',
  submitted: 'bg-blue-100 text-blue-800',
  posting: 'bg-blue-100 text-blue-800',
  posted: 'bg-emerald-100 text-emerald-800',
  post_failed: 'bg-red-100 text-red-800',
  rejected: 'bg-red-100 text-red-800',
}
const LABELS = {
  passed: 'AI check passed', flagged: 'Flagged', failed: 'AI failed', extracted: 'Not sent yet',
  submitted: 'Awaiting review', posting: 'Posting...', posted: 'Posted to Sage', post_failed: 'Sage error', rejected: 'Rejected',
}

export default function StatusPill({ value }) {
  return (
    <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${STYLES[value] || 'bg-slate-100'}`}>
      {LABELS[value] || value}
    </span>
  )
}
