import { useState, useEffect, useCallback } from 'react'
import { getIssues, updateStatus } from '../api/issues'

// ── Constants ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
    open: {
        label: 'Open',
        dot: 'bg-red-500',
        badge: 'bg-red-50 text-red-600 border-red-200',
        bar: 'bg-red-500',
    },
    in_progress: {
        label: 'In Progress',
        dot: 'bg-amber-400',
        badge: 'bg-amber-50 text-amber-600 border-amber-200',
        bar: 'bg-amber-400',
    },
    resolved: {
        label: 'Resolved',
        dot: 'bg-green-500',
        badge: 'bg-green-50 text-green-700 border-green-200',
        bar: 'bg-green-500',
    },
}

const CATEGORY_CONFIG = {
    road: { icon: '🛣️', label: 'Roads & Potholes' },
    water: { icon: '💧', label: 'Water Supply' },
    electricity: { icon: '⚡', label: 'Electricity' },
    sanitation: { icon: '🗑️', label: 'Sanitation' },
    other: { icon: '📌', label: 'Other' },
}

const FILTERS = ['all', 'open', 'in_progress', 'resolved']

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatDate(iso) {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
    })
}

function timeAgo(iso) {
    if (!iso) return ''
    const diff = (Date.now() - new Date(iso)) / 1000
    if (diff < 60) return 'just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.open
    return (
        <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border ${cfg.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
            {cfg.label}
        </span>
    )
}

function CategoryChip({ category }) {
    const cfg = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.other
    return (
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-stone-200 bg-stone-50 text-stone-600">
            <span>{cfg.icon}</span>
            {cfg.label}
        </span>
    )
}

function StatCard({ label, value, sub, dot }) {
    return (
        <div className="bg-white border border-stone-200 rounded-2xl px-5 py-4 flex items-start gap-3">
            <span className={`mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0 ${dot}`} />
            <div>
                <div className="text-2xl font-black text-stone-900 leading-none">{value}</div>
                <div className="text-xs font-bold text-stone-500 mt-1">{label}</div>
                {sub && <div className="text-[10px] text-stone-300 mt-0.5">{sub}</div>}
            </div>
        </div>
    )
}

// ── Issue Detail Drawer ────────────────────────────────────────────────────────

function IssueDrawer({ issue, onClose, onStatusChange, updating }) {
    if (!issue) return null

    const cat = CATEGORY_CONFIG[issue.category] || CATEGORY_CONFIG.other
    const mapsUrl = issue.lat && issue.lng
        ? `https://www.google.com/maps?q=${issue.lat},${issue.lng}`
        : null

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-stone-900/40 backdrop-blur-[2px] z-40 transition-opacity duration-200"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white shadow-2xl flex flex-col overflow-hidden">

                {/* Header */}
                <div className="px-6 pt-5 pb-4 border-b border-stone-100 flex-shrink-0">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">
                                    #{issue.id}
                                </span>
                                <CategoryChip category={issue.category} />
                                <StatusBadge status={issue.status} />
                            </div>
                            <h2 className="text-lg font-black text-stone-900 leading-snug">
                                {issue.title}
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200 flex items-center justify-center flex-shrink-0 transition-colors"
                        >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto">

                    {/* Photo */}
                    {issue.image_url ? (
                        <div className="relative bg-stone-100 overflow-hidden" style={{ height: '200px' }}>
                            <img
                                src={issue.image_url}
                                alt="Issue photo"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/30 to-transparent" />
                        </div>
                    ) : (
                        <div className="bg-stone-50 border-b border-stone-100 flex items-center justify-center gap-2 text-stone-300" style={{ height: '120px' }}>
                            <span className="text-3xl">📷</span>
                            <span className="text-xs font-semibold">No photo attached</span>
                        </div>
                    )}

                    <div className="px-6 py-5 space-y-6">

                        {/* Quick stats row */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-stone-50 rounded-xl px-3 py-3 text-center">
                                <div className="text-xl font-black text-stone-900">{issue.upvotes ?? 0}</div>
                                <div className="text-[10px] font-bold text-stone-400 mt-0.5 uppercase tracking-wider">Upvotes</div>
                            </div>
                            <div className="bg-stone-50 rounded-xl px-3 py-3 text-center">
                                <div className="text-sm font-black text-stone-900 leading-tight">{formatDate(issue.created_at)}</div>
                                <div className="text-[10px] font-bold text-stone-400 mt-0.5 uppercase tracking-wider">Reported</div>
                            </div>
                            <div className="bg-stone-50 rounded-xl px-3 py-3 text-center">
                                <div className="text-sm font-black text-stone-900 leading-tight truncate">{timeAgo(issue.created_at)}</div>
                                <div className="text-[10px] font-bold text-stone-400 mt-0.5 uppercase tracking-wider">Age</div>
                            </div>
                        </div>

                        {/* Description */}
                        {issue.description && (
                            <div>
                                <SectionLabel>Description</SectionLabel>
                                <p className="text-sm text-stone-600 leading-relaxed bg-stone-50 rounded-xl px-4 py-3">
                                    {issue.description}
                                </p>
                            </div>
                        )}

                        {/* Location */}
                        <div>
                            <SectionLabel>Location</SectionLabel>
                            <div className="bg-stone-50 rounded-xl overflow-hidden border border-stone-200">
                                <div className="px-4 py-3 flex items-start gap-3">
                                    <span className="text-lg mt-0.5 flex-shrink-0">📍</span>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-semibold text-stone-800 leading-snug">
                                            {issue.address || 'No address provided'}
                                        </div>
                                        {issue.lat && issue.lng && (
                                            <div className="text-[11px] text-stone-400 mt-0.5 font-mono">
                                                {Number(issue.lat).toFixed(5)}, {Number(issue.lng).toFixed(5)}
                                            </div>
                                        )}
                                    </div>
                                    {mapsUrl && (
                                        <a
                                            href={mapsUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex-shrink-0 flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                                        >
                                            Open
                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                <path d="M7 17L17 7M17 7H7M17 7v10" />
                                            </svg>
                                        </a>
                                    )}
                                </div>

                                {/* Static map tile */}
                                {issue.lat && issue.lng && (
                                    <div className="relative bg-stone-200 overflow-hidden" style={{ height: '140px' }}>
                                        <img
                                            src={`https://staticmap.openstreetmap.de/staticmap.php?center=${issue.lat},${issue.lng}&zoom=16&size=480x160&markers=${issue.lat},${issue.lng},red`}
                                            alt="Map"
                                            className="w-full h-full object-cover"
                                            onError={e => { e.target.style.display = 'none' }}
                                        />
                                        <a
                                            href={mapsUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="absolute inset-0 flex items-end justify-end p-3"
                                        >
                                            <span className="text-[11px] font-bold text-white bg-stone-900/70 px-2.5 py-1 rounded-lg backdrop-blur-sm">
                                                View on Maps →
                                            </span>
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Reporter info */}
                        {(issue.user_name || issue.user_email || issue.reporter) && (
                            <div>
                                <SectionLabel>Reported by</SectionLabel>
                                <div className="flex items-center gap-3 bg-stone-50 rounded-xl px-4 py-3 border border-stone-200">
                                    <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-black flex-shrink-0">
                                        {(issue.user_name || issue.reporter || '?')[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-stone-800">
                                            {issue.user_name || issue.reporter || 'Anonymous'}
                                        </div>
                                        {issue.user_email && (
                                            <div className="text-xs text-stone-400">{issue.user_email}</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Status history */}
                        <div>
                            <SectionLabel>Issue lifecycle</SectionLabel>
                            <div className="space-y-2">
                                {[
                                    { label: 'Reported', icon: '📍', done: true, time: timeAgo(issue.created_at) },
                                    { label: 'Work in progress', icon: '🔧', done: issue.status === 'in_progress' || issue.status === 'resolved' },
                                    { label: 'Resolved', icon: '✅', done: issue.status === 'resolved' },
                                ].map((step, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0 transition-all
                                            ${step.done ? 'bg-blue-600' : 'bg-stone-100 border border-stone-200'}`}>
                                            {step.done ? step.icon : <span className="text-[10px] text-stone-300">{i + 1}</span>}
                                        </div>
                                        <span className={`text-xs font-semibold flex-1 ${step.done ? 'text-stone-700' : 'text-stone-300'}`}>
                                            {step.label}
                                        </span>
                                        {step.time && <span className="text-[10px] text-stone-400">{step.time}</span>}
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

                {/* Footer — status changer */}
                <div className="px-6 py-4 border-t border-stone-100 bg-white flex-shrink-0">
                    <SectionLabel>Update status</SectionLabel>
                    <div className="flex items-center gap-2">
                        {Object.entries(STATUS_CONFIG).map(([val, cfg]) => (
                            <button
                                key={val}
                                disabled={updating === issue.id || issue.status === val}
                                onClick={() => onStatusChange(issue.id, val)}
                                className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all duration-150
                                    ${issue.status === val
                                        ? `${cfg.badge} border-transparent ring-2 ring-offset-1 ring-current`
                                        : 'bg-stone-50 border-stone-200 text-stone-500 hover:border-stone-400 hover:bg-stone-100'
                                    }
                                    disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {updating === issue.id && issue.status !== val
                                    ? '…'
                                    : cfg.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

function SectionLabel({ children }) {
    return (
        <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-2">
            {children}
        </p>
    )
}

// ── Main AdminPage ─────────────────────────────────────────────────────────────

export default function AdminPage() {
    const [issues, setIssues] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')
    const [search, setSearch] = useState('')
    const [updating, setUpdating] = useState(null)
    const [selected, setSelected] = useState(null) // issue for drawer
    const [sortBy, setSortBy] = useState('newest') // newest | upvotes

    const fetchIssues = useCallback(async () => {
        setLoading(true)
        try {
            const params = filter !== 'all' ? { status: filter } : {}
            const res = await getIssues(params)
            setIssues(res.data.issues)
        } catch (err) {
            console.error('Failed to fetch issues', err)
        } finally {
            setLoading(false)
        }
    }, [filter])

    useEffect(() => { fetchIssues() }, [fetchIssues])

    const handleStatusChange = async (id, status) => {
        setUpdating(id)
        try {
            await updateStatus(id, status)
            setIssues(prev => prev.map(i => i.id === id ? { ...i, status } : i))
            // also update drawer if open
            setSelected(prev => prev?.id === id ? { ...prev, status } : prev)
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update status')
        } finally {
            setUpdating(null)
        }
    }

    // Derived counts
    const counts = issues.reduce((acc, i) => {
        acc[i.status] = (acc[i.status] || 0) + 1
        return acc
    }, {})

    // Filtered + searched + sorted list
    const visible = issues
        .filter(i => filter === 'all' || i.status === filter)
        .filter(i => {
            if (!search.trim()) return true
            const q = search.toLowerCase()
            return (
                i.title?.toLowerCase().includes(q) ||
                i.address?.toLowerCase().includes(q) ||
                i.category?.toLowerCase().includes(q) ||
                String(i.id).includes(q)
            )
        })
        .sort((a, b) =>
            sortBy === 'upvotes'
                ? (b.upvotes ?? 0) - (a.upvotes ?? 0)
                : new Date(b.created_at) - new Date(a.created_at)
        )

    return (
        <div className="w-full min-h-screen bg-stone-50 text-stone-900 font-sans">

            <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 sm:py-10">

                {/* ── Page header ───────────────────────────────────────── */}
                <div className="mb-8">
                    <p className="text-xs font-black uppercase tracking-widest text-stone-400 mb-2">Dashboard</p>
                    <h1 className="text-3xl sm:text-4xl font-black text-stone-900 leading-tight mb-1">
                        Issue management
                    </h1>
                    <p className="text-stone-500 text-sm">
                        Review reports, update statuses, and keep the city moving.
                    </p>
                </div>

                {/* ── Stats row ──────────────────────────────────────────── */}
                {!loading && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                        <StatCard label="Total issues" value={issues.length} dot="bg-blue-600" />
                        <StatCard label="Open" value={counts.open ?? 0} dot="bg-red-500" sub="Need attention" />
                        <StatCard label="In Progress" value={counts.in_progress ?? 0} dot="bg-amber-400" sub="Being worked on" />
                        <StatCard label="Resolved" value={counts.resolved ?? 0} dot="bg-green-500" sub="Closed" />
                    </div>
                )}

                {/* ── Controls ───────────────────────────────────────────── */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-5">

                    {/* Filter tabs */}
                    <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-full p-1 flex-shrink-0">
                        {FILTERS.map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-150 capitalize
                                    ${filter === f
                                        ? 'bg-stone-900 text-white shadow-sm'
                                        : 'text-stone-500 hover:text-stone-900'
                                    }`}
                            >
                                {f.replace('_', ' ')}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="flex-1 relative w-full sm:w-auto min-w-0">
                        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by title, address, category…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-white border border-stone-200 rounded-full text-sm text-stone-900 placeholder-stone-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-600 transition-colors"
                            >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Sort */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Sort</span>
                        <div className="flex items-center gap-1 bg-white border border-stone-200 rounded-full p-1">
                            {[['newest', 'Newest'], ['upvotes', 'Most voted']].map(([val, lbl]) => (
                                <button
                                    key={val}
                                    onClick={() => setSortBy(val)}
                                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-150
                                        ${sortBy === val ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-500 hover:text-stone-900'}`}
                                >
                                    {lbl}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Result count ───────────────────────────────────────── */}
                {!loading && (
                    <p className="text-xs text-stone-400 mb-3">
                        Showing <span className="font-bold text-stone-600">{visible.length}</span> issue{visible.length !== 1 ? 's' : ''}
                        {search && <span> matching "<span className="font-bold text-stone-700">{search}</span>"</span>}
                    </p>
                )}

                {/* ── Issue list ─────────────────────────────────────────── */}
                {loading ? (
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="bg-white border border-stone-200 rounded-2xl h-20 animate-pulse" />
                        ))}
                    </div>
                ) : visible.length === 0 ? (
                    <div className="bg-white border border-stone-200 rounded-2xl flex flex-col items-center justify-center py-20 text-center">
                        <span className="text-4xl mb-4">🗺️</span>
                        <h3 className="text-sm font-bold text-stone-600 mb-1">No issues found</h3>
                        <p className="text-xs text-stone-400 max-w-xs">
                            {search ? 'Try a different search term.' : 'No issues match the current filter.'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {visible.map(issue => {
                            const scfg = STATUS_CONFIG[issue.status] || STATUS_CONFIG.open
                            const isUpdating = updating === issue.id
                            return (
                                <div
                                    key={issue.id}
                                    onClick={() => setSelected(issue)}
                                    className={`bg-white border border-stone-200 rounded-2xl overflow-hidden flex items-stretch cursor-pointer hover:border-stone-400 hover:shadow-sm transition-all duration-150 group
                                        ${selected?.id === issue.id ? 'border-blue-400 ring-2 ring-blue-100' : ''}`}
                                >
                                    {/* Status bar */}
                                    <div className={`w-1 flex-shrink-0 ${scfg.bar}`} />

                                    {/* Content */}
                                    <div className="flex-1 min-w-0 px-4 py-3.5 flex items-center gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                                <span className="text-[10px] font-bold text-stone-400">#{issue.id}</span>
                                                <span className="text-sm font-bold text-stone-900 truncate">{issue.title}</span>
                                            </div>
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <CategoryChip category={issue.category} />
                                                <span className="text-xs text-stone-400 flex items-center gap-1">
                                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                                                    </svg>
                                                    {issue.address || '—'}
                                                </span>
                                                <span className="text-xs text-stone-400 flex items-center gap-1">
                                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z" /><path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
                                                    </svg>
                                                    {issue.upvotes ?? 0} upvotes
                                                </span>
                                                <span className="text-xs text-stone-300">{timeAgo(issue.created_at)}</span>
                                            </div>
                                        </div>

                                        {/* Right controls */}
                                        <div className="flex items-center gap-3 flex-shrink-0" onClick={e => e.stopPropagation()}>
                                            <StatusBadge status={issue.status} />

                                            <select
                                                value={issue.status}
                                                disabled={isUpdating}
                                                onChange={e => handleStatusChange(issue.id, e.target.value)}
                                                className={`hidden sm:block text-xs font-semibold px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-700 cursor-pointer focus:outline-none focus:border-blue-500 transition-all
                                                    ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'hover:border-stone-400'}`}
                                            >
                                                <option value="open">Open</option>
                                                <option value="in_progress">In Progress</option>
                                                <option value="resolved">Resolved</option>
                                            </select>

                                            <svg className="text-stone-300 group-hover:text-stone-500 transition-colors hidden sm:block" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                <path d="M9 18l6-6-6-6" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* ── Issue drawer ───────────────────────────────────────────── */}
            {selected && (
                <IssueDrawer
                    issue={selected}
                    onClose={() => setSelected(null)}
                    onStatusChange={handleStatusChange}
                    updating={updating}
                />
            )}
        </div>
    )
}