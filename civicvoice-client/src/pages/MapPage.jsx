
// import { useState, useEffect } from 'react'
// import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
// import L from 'leaflet'
// import { getNearby, upvoteIssue } from '../api/issues'
// import { useNavigate } from 'react-router-dom'

// delete L.Icon.Default.prototype._getIconUrl
// L.Icon.Default.mergeOptions({
//     iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
//     iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
//     shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
// })

// const CATEGORY_META = {
//     all: { color: '#0f172a', label: 'All', bg: 'bg-stone-900', text: 'text-white' },
//     road: { color: '#ef4444', label: 'Roads', bg: 'bg-red-500', text: 'text-white' },
//     water: { color: '#3b82f6', label: 'Water', bg: 'bg-blue-500', text: 'text-white' },
//     electricity: { color: '#f97316', label: 'Electricity', bg: 'bg-orange-400', text: 'text-white' },
//     sanitation: { color: '#22c55e', label: 'Sanitation', bg: 'bg-green-500', text: 'text-white' },
//     other: { color: '#94a3b8', label: 'Other', bg: 'bg-slate-400', text: 'text-white' },
// }

// const STATUS_STYLE = {
//     open: 'bg-red-100 text-red-700',
//     'in progress': 'bg-amber-100 text-amber-700',
//     in_progress: 'bg-amber-100 text-amber-700',
//     resolved: 'bg-green-100 text-green-700',
// }

// const STATUS_LABEL = {
//     open: 'Open',
//     in_progress: 'In Progress',
//     'in progress': 'In Progress',
//     resolved: 'Resolved',
// }

// // ── Icons ──────────────────────────────────────────────────────────────────────

// const createPinIcon = (category) => L.divIcon({
//     className: '',
//     html: `
//         <div style="position:relative;width:24px;height:32px;">
//             <div style="
//                 width:24px;height:24px;
//                 background:${CATEGORY_META[category]?.color ?? '#94a3b8'};
//                 border:3px solid white;
//                 border-radius:50% 50% 50% 0;
//                 transform:rotate(-45deg);
//                 box-shadow:0 2px 8px rgba(0,0,0,0.3);
//             "></div>
//             <div style="
//                 position:absolute;top:6px;left:6px;
//                 width:8px;height:8px;
//                 background:white;border-radius:50%;
//             "></div>
//         </div>
//     `,
//     iconSize: [24, 32],
//     iconAnchor: [12, 32],
// })

// const userIcon = L.divIcon({
//     className: '',
//     html: `<div style="width:16px;height:16px;background:#2563eb;border:3px solid white;border-radius:50%;box-shadow:0 0 0 4px rgba(37,99,235,0.25)"></div>`,
//     iconSize: [16, 16],
//     iconAnchor: [8, 8],
// })

// // ── LocationMarker ─────────────────────────────────────────────────────────────

// function LocationMarker({ onLocationFound }) {
//     const map = useMapEvents({
//         locationfound(e) {
//             map.flyTo(e.latlng, 14)
//             onLocationFound(e.latlng)
//         },
//     })
//     useEffect(() => { map.locate() }, [map])
//     return null
// }

// // ── IssueDetailModal ──────────────────────────────────────────────────────────

// function IssueDetailModal({ issue, onClose, onUpvote }) {
//     if (!issue) return null

//     const catColor = CATEGORY_META[issue.category]?.color ?? '#94a3b8'
//     const statusKey = issue.status?.toLowerCase().replace(' ', '_')

//     return (
//         /* Backdrop */
//         <div
//             className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center"
//             style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(2px)' }}
//             onClick={onClose}
//         >
//             {/* Card */}
//             <div
//                 className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden"
//                 style={{ maxHeight: '90vh' }}
//                 onClick={e => e.stopPropagation()}
//             >
//                 {/* Image */}
//                 <div className="relative w-full bg-stone-100" style={{ height: '220px' }}>
//                     {issue.image_url ? (
//                         <img
//                             src={issue.image_url}
//                             alt={issue.title}
//                             className="w-full h-full object-cover"
//                         />
//                     ) : (
//                         <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-stone-300">
//                             <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
//                                 <rect x="3" y="3" width="18" height="18" rx="2" />
//                                 <circle cx="8.5" cy="8.5" r="1.5" />
//                                 <path d="M21 15l-5-5L5 21" />
//                             </svg>
//                             <span className="text-xs">No image uploaded</span>
//                         </div>
//                     )}

//                     {/* Close button */}
//                     <button
//                         onClick={onClose}
//                         className="absolute top-3 right-3 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors"
//                     >
//                         <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
//                             <path d="M18 6L6 18M6 6l12 12" />
//                         </svg>
//                     </button>

//                     {/* Category badge over image */}
//                     <span
//                         className="absolute bottom-3 left-3 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full text-white"
//                         style={{ background: catColor }}
//                     >
//                         {issue.category}
//                     </span>
//                 </div>

//                 {/* Body */}
//                 <div className="px-5 py-4 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 220px)' }}>
//                     {/* Title + status */}
//                     <div className="flex items-start justify-between gap-3 mb-3">
//                         <h2 className="text-base font-bold text-stone-900 leading-snug flex-1">
//                             {issue.title}
//                         </h2>
//                         <span className={`flex-shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLE[statusKey] ?? 'bg-stone-100 text-stone-500'}`}>
//                             {STATUS_LABEL[statusKey] ?? issue.status}
//                         </span>
//                     </div>

//                     {/* Description */}
//                     {issue.description && (
//                         <p className="text-sm text-stone-600 leading-relaxed mb-4">
//                             {issue.description}
//                         </p>
//                     )}

//                     {/* Upvote button */}
//                     <button
//                         onClick={() => onUpvote(issue.id)}
//                         className="flex items-center gap-2 mb-4 px-4 py-2 rounded-full border-2 border-stone-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-150 group"
//                     >
//                         <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
//                             className="text-stone-400 group-hover:text-blue-500 transition-colors">
//                             <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
//                             <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
//                         </svg>
//                         <span className="text-sm font-bold text-stone-600 group-hover:text-blue-600 transition-colors">
//                             {issue.upvotes ?? 0}
//                         </span>
//                         <span className="text-xs text-stone-400 group-hover:text-blue-500 transition-colors">upvotes</span>
//                     </button>
//                     <div className="flex flex-wrap gap-3 text-xs text-stone-500 border-t border-stone-100 pt-3">
//                         {issue.address && (
//                             <div className="flex items-center gap-1.5">
//                                 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                                     <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
//                                     <circle cx="12" cy="9" r="2.5" />
//                                 </svg>
//                                 <span className="line-clamp-1">{issue.address}</span>
//                             </div>
//                         )}
//                         {issue.distance_metres != null && (
//                             <div className="flex items-center gap-1.5">
//                                 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                                     <circle cx="12" cy="12" r="10" />
//                                     <path d="M12 8v4l3 3" />
//                                 </svg>
//                                 <span>{issue.distance_metres}m away</span>
//                             </div>
//                         )}
//                         <div className="flex items-center gap-1.5">
//                             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                                 <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
//                                 <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
//                             </svg>
//                             <span>{issue.upvotes ?? 0} upvotes</span>
//                         </div>
//                         {issue.created_at && (
//                             <div className="flex items-center gap-1.5">
//                                 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                                     <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
//                                 </svg>
//                                 <span>{new Date(issue.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// // ── MapPage ────────────────────────────────────────────────────────────────────

// export default function MapPage() {
//     const [issues, setIssues] = useState([])
//     const [userPos, setUserPos] = useState(null)
//     const [loading, setLoading] = useState(false)
//     const [filter, setFilter] = useState('all')
//     const [selected, setSelected] = useState(null)
//     const [upvoting, setUpvoting] = useState(false)
//     const navigate = useNavigate()

//     const handleUpvote = async (id) => {
//         if (upvoting) return
//         setUpvoting(true)
//         try {
//             const res = await upvoteIssue(id)
//             const { upvotes } = res.data
//             // update count in issues list and in selected
//             setIssues(prev => prev.map(i => i.id === id ? { ...i, upvotes } : i))
//             setSelected(prev => prev?.id === id ? { ...prev, upvotes } : prev)
//         } catch {
//             // silently fail — could add a toast here
//         } finally {
//             setUpvoting(false)
//         }
//     }

//     const fetchNearby = async (latlng) => {
//         setLoading(true)
//         try {
//             const res = await getNearby(latlng.lat, latlng.lng, 5000)
//             setIssues(res.data.issues)
//         } catch {
//             setIssues([])
//         } finally {
//             setLoading(false)
//         }
//     }

//     const handleLocationFound = (latlng) => {
//         setUserPos(latlng)
//         fetchNearby(latlng)
//     }

//     const filtered = filter === 'all' ? issues : issues.filter(i => i.category === filter)

//     return (
//         <>
//             <div className="flex flex-col" style={{ height: 'calc(100vh - 48px)' }}>

//                 {/* ── Filter bar ──────────────────────────────────────── */}
//                 <div className="flex items-center gap-2 flex-wrap px-5 py-3 bg-white border-b border-stone-200 shadow-sm z-10">
//                     <span className="text-xs font-bold uppercase tracking-widest text-stone-400 mr-1">Filter</span>
//                     {Object.entries(CATEGORY_META).map(([cat, meta]) => (
//                         <button key={cat}
//                             onClick={() => setFilter(cat)}
//                             className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 border ${filter === cat
//                                 ? `${meta.bg} ${meta.text} border-transparent shadow-sm`
//                                 : 'bg-stone-50 text-stone-500 border-stone-200 hover:border-stone-400'
//                                 }`}>
//                             {meta.label}
//                         </button>
//                     ))}

//                     <div className="ml-auto flex items-center gap-3">
//                         <span className="text-xs text-stone-400 font-medium">
//                             {loading
//                                 ? <span className="flex items-center gap-1.5">
//                                     <svg className="animate-spin w-3 h-3 text-blue-500" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
//                                     Locating…
//                                 </span>
//                                 : <span><span className="font-bold text-stone-700">{filtered?.length ?? 0}</span> issues nearby</span>
//                             }
//                         </span>
//                         <button
//                             onClick={() => navigate('/report')}
//                             className="flex items-center gap-1.5 bg-stone-900 text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-blue-600 transition-all duration-200 shadow-sm hover:-translate-y-px">
//                             <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M5 12h14" /></svg>
//                             Report issue
//                         </button>
//                     </div>
//                 </div>

//                 {/* ── Map + sidebar ────────────────────────────────────── */}
//                 <div className="flex flex-1 overflow-hidden">

//                     {/* Map */}
//                     <MapContainer center={[28.4595, 77.0266]} zoom={13} style={{ flex: 1, zIndex: 0 }}>
//                         <TileLayer
//                             attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
//                             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                         />
//                         <LocationMarker onLocationFound={handleLocationFound} />

//                         {userPos && (
//                             <Marker position={userPos} icon={userIcon}>
//                                 <Popup><span className="text-sm font-semibold">You are here</span></Popup>
//                             </Marker>
//                         )}

//                         {filtered.map(issue => (
//                             <Marker
//                                 key={issue.id}
//                                 position={[issue.geojson.coordinates[1], issue.geojson.coordinates[0]]}
//                                 icon={createPinIcon(issue.category)}
//                                 eventHandlers={{ click: () => setSelected(issue) }}
//                             >
//                                 {/* Minimal popup — just a hint to open the card */}
//                                 <Popup>
//                                     <div
//                                         className="min-w-[160px] cursor-pointer py-0.5"
//                                         onClick={() => setSelected(issue)}
//                                     >
//                                         <p className="font-bold text-stone-900 text-sm mb-1 line-clamp-2">{issue.title}</p>
//                                         <p className="text-xs text-blue-600 font-medium">Tap to view details →</p>
//                                     </div>
//                                 </Popup>
//                             </Marker>
//                         ))}
//                     </MapContainer>

//                     {/* Issue list sidebar */}
//                     <div className="hidden lg:flex flex-col w-72 bg-white border-l border-stone-200 overflow-y-auto">
//                         <div className="px-4 py-3 border-b border-stone-100 flex items-center justify-between sticky top-0 bg-white z-10">
//                             <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Nearby issues</span>
//                             <span className="text-xs font-bold text-stone-700">{filtered?.length ?? 0}</span>
//                         </div>

//                         {loading && (
//                             <div className="flex flex-col items-center justify-center flex-1 gap-2 text-stone-300 py-16">
//                                 <svg className="animate-spin w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
//                                 <span className="text-xs">Loading issues…</span>
//                             </div>
//                         )}

//                         {!loading && filtered.length === 0 && (
//                             <div className="flex flex-col items-center justify-center flex-1 gap-2 text-stone-300 py-16 px-6 text-center">
//                                 <span className="text-3xl">📍</span>
//                                 <span className="text-xs text-stone-400">No issues found nearby. Allow location access or try a different filter.</span>
//                             </div>
//                         )}

//                         {!loading && filtered.map(issue => (
//                             <div key={issue.id}
//                                 onClick={() => setSelected(issue)}
//                                 className={`px-4 py-3.5 border-b border-stone-100 cursor-pointer transition-colors hover:bg-stone-50 ${selected?.id === issue.id ? 'bg-blue-50 border-l-2 border-l-blue-500' : ''}`}>

//                                 {/* Thumbnail */}
//                                 {issue.image_url && (
//                                     <div className="w-full h-28 rounded-lg overflow-hidden mb-2.5 bg-stone-100">
//                                         <img src={issue.image_url} alt={issue.title} className="w-full h-full object-cover" />
//                                     </div>
//                                 )}

//                                 <div className="flex items-start justify-between gap-2 mb-1">
//                                     <p className="text-sm font-semibold text-stone-800 leading-snug line-clamp-1">{issue.title}</p>
//                                     <span className={`flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${STATUS_STYLE[issue.status?.toLowerCase().replace(' ', '_')] ?? 'bg-stone-100 text-stone-500'}`}>
//                                         {STATUS_LABEL[issue.status?.toLowerCase().replace(' ', '_')] ?? issue.status}
//                                     </span>
//                                 </div>
//                                 <div className="flex items-center gap-2">
//                                     <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full"
//                                         style={{ background: CATEGORY_META[issue.category]?.color + '18', color: CATEGORY_META[issue.category]?.color }}>
//                                         {issue.category}
//                                     </span>
//                                     <span className="text-[10px] text-stone-400">{issue.distance_metres}m · {issue.upvotes} ↑</span>
//                                 </div>
//                                 {issue.address && <p className="text-[11px] text-stone-400 mt-1 line-clamp-1">{issue.address}</p>}
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>

//             {/* ── Detail modal (rendered outside map layout to avoid z-index issues) ── */}
//             {selected && (
//                 <IssueDetailModal issue={selected} onClose={() => setSelected(null)} onUpvote={handleUpvote} />
//             )}
//         </>
//     )
// }

import { getMyVotes } from '../api/issues'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { getNearby, upvoteIssue } from '../api/issues'
import { useNavigate } from 'react-router-dom'
import { useSocket } from '../hooks/useSocket'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const CATEGORY_META = {
    all: { color: '#0f172a', label: 'All', bg: 'bg-stone-900', text: 'text-white' },
    road: { color: '#ef4444', label: 'Roads', bg: 'bg-red-500', text: 'text-white' },
    water: { color: '#3b82f6', label: 'Water', bg: 'bg-blue-500', text: 'text-white' },
    electricity: { color: '#f97316', label: 'Electricity', bg: 'bg-orange-400', text: 'text-white' },
    sanitation: { color: '#22c55e', label: 'Sanitation', bg: 'bg-green-500', text: 'text-white' },
    other: { color: '#94a3b8', label: 'Other', bg: 'bg-slate-400', text: 'text-white' },
}

const STATUS_STYLE = {
    open: 'bg-red-100 text-red-700',
    in_progress: 'bg-amber-100 text-amber-700',
    'in progress': 'bg-amber-100 text-amber-700',
    resolved: 'bg-green-100 text-green-700',
}

const STATUS_LABEL = {
    open: 'Open',
    in_progress: 'In Progress',
    'in progress': 'In Progress',
    resolved: 'Resolved',
}

const createPinIcon = (category) => L.divIcon({
    className: '',
    html: `
        <div style="position:relative;width:24px;height:32px;">
            <div style="
                width:24px;height:24px;
                background:${CATEGORY_META[category]?.color ?? '#94a3b8'};
                border:3px solid white;
                border-radius:50% 50% 50% 0;
                transform:rotate(-45deg);
                box-shadow:0 2px 8px rgba(0,0,0,0.3);
            "></div>
            <div style="
                position:absolute;top:6px;left:6px;
                width:8px;height:8px;
                background:white;border-radius:50%;
            "></div>
        </div>
    `,
    iconSize: [24, 32],
    iconAnchor: [12, 32],
})

const userIcon = L.divIcon({
    className: '',
    html: `<div style="width:16px;height:16px;background:#2563eb;border:3px solid white;border-radius:50%;box-shadow:0 0 0 4px rgba(37,99,235,0.25)"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
})

function LocationMarker({ onLocationFound }) {
    const map = useMapEvents({
        locationfound(e) {
            map.flyTo(e.latlng, 14)
            onLocationFound(e.latlng)
        },
    })
    useEffect(() => { map.locate() }, [map])
    return null
}



function IssueDetailModal({ issue, onClose, onUpvote, voted, upvoting }) {


    if (!issue) return null

    const catColor = CATEGORY_META[issue.category]?.color ?? '#94a3b8'
    const statusKey = issue.status?.toLowerCase().replace(' ', '_')
    const hasVoted = voted.has(issue.id)

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(2px)' }}
            onClick={onClose}
        >
            <div
                className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden"
                style={{ maxHeight: '90vh' }}
                onClick={e => e.stopPropagation()}
            >
                {/* Image */}
                <div className="relative w-full bg-stone-100" style={{ height: '220px' }}>
                    {issue.image_url ? (
                        <img src={issue.image_url} alt={issue.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-stone-300">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <path d="M21 15l-5-5L5 21" />
                            </svg>
                            <span className="text-xs">No image uploaded</span>
                        </div>
                    )}

                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>

                    <span
                        className="absolute bottom-3 left-3 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full text-white"
                        style={{ background: catColor }}
                    >
                        {issue.category}
                    </span>
                </div>

                {/* Body */}
                <div className="px-5 py-4 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 220px)' }}>
                    <div className="flex items-start justify-between gap-3 mb-3">
                        <h2 className="text-base font-bold text-stone-900 leading-snug flex-1">{issue.title}</h2>
                        <span className={`flex-shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLE[statusKey] ?? 'bg-stone-100 text-stone-500'}`}>
                            {STATUS_LABEL[statusKey] ?? issue.status}
                        </span>
                    </div>

                    {issue.description && (
                        <p className="text-sm text-stone-600 leading-relaxed mb-4">{issue.description}</p>
                    )}

                    {/* Upvote button */}
                    <button
                        onClick={() => !hasVoted && onUpvote(issue.id)}
                        disabled={hasVoted || upvoting}
                        className={`flex items-center gap-2 mb-4 px-4 py-2 rounded-full border-2 transition-all duration-150 group
                            ${hasVoted
                                ? 'border-blue-300 bg-blue-50 cursor-not-allowed'
                                : 'border-stone-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer'
                            }`}
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill={hasVoted ? '#3b82f6' : 'none'}
                            stroke={hasVoted ? '#3b82f6' : 'currentColor'} strokeWidth="2.5"
                            className={hasVoted ? 'text-blue-500' : 'text-stone-400 group-hover:text-blue-500 transition-colors'}>
                            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
                            <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                        </svg>
                        <span className={`text-sm font-bold transition-colors ${hasVoted ? 'text-blue-600' : 'text-stone-600 group-hover:text-blue-600'}`}>
                            {issue.upvotes ?? 0}
                        </span>
                        <span className={`text-xs transition-colors ${hasVoted ? 'text-blue-500' : 'text-stone-400 group-hover:text-blue-500'}`}>
                            {hasVoted ? 'voted' : 'upvotes'}
                        </span>
                    </button>

                    {/* Meta */}
                    <div className="flex flex-wrap gap-3 text-xs text-stone-500 border-t border-stone-100 pt-3">
                        {issue.address && (
                            <div className="flex items-center gap-1.5">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                                    <circle cx="12" cy="9" r="2.5" />
                                </svg>
                                <span className="line-clamp-1">{issue.address}</span>
                            </div>
                        )}
                        {issue.distance_metres != null && (
                            <div className="flex items-center gap-1.5">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
                                </svg>
                                <span>{issue.distance_metres}m away</span>
                            </div>
                        )}
                        {issue.created_at && (
                            <div className="flex items-center gap-1.5">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
                                </svg>
                                <span>{new Date(issue.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function MapPage() {
    const [issues, setIssues] = useState([])
    const [userPos, setUserPos] = useState(null)
    const [loading, setLoading] = useState(false)
    const [filter, setFilter] = useState('all')
    const [selected, setSelected] = useState(null)
    const [upvoting, setUpvoting] = useState(false)
    const [votedIssues, setVotedIssues] = useState(new Set())
    const navigate = useNavigate()
    const { user } = useAuth()

    // Load user's existing votes on mount
    useEffect(() => {
        if (!user) return
        getMyVotes()
            .then(res => setVotedIssues(new Set(res.data.votedIds)))
            .catch(() => { })
    }, [user])

    // Real-time new issue broadcast
    useSocket('new_issue', (issue) => {
        setIssues(prev => {
            const exists = prev.find(i => i.id === issue.id)
            if (exists) return prev
            return [issue, ...prev]
        })
    })

    // ── Real-time socket updates ───────────────────────────────────────────────
    useSocket('upvote_updated', ({ issueId, upvotes }) => {
        console.log(issueId, upvotes)
        setIssues(prev => prev.map(i => i.id === issueId ? { ...i, upvotes } : i))
        setSelected(prev => prev?.id === issueId ? { ...prev, upvotes } : prev)
    })

    useSocket('status_updated', ({ issueId, status }) => {
        setIssues(prev => prev.map(i => i.id === issueId ? { ...i, status } : i))
        setSelected(prev => prev?.id === issueId ? { ...prev, status } : prev)
    })

    // ── Upvote handler ────────────────────────────────────────────────────────
    const handleUpvote = async (id) => {
        if (upvoting || votedIssues.has(id)) return
        setUpvoting(true)
        try {
            await upvoteIssue(id)
            setVotedIssues(prev => new Set([...prev, id]))
            // socket broadcast will update the count for everyone including us
        } catch (err) {
            if (err.response?.status === 409) {
                // already voted — mark locally
                setVotedIssues(prev => new Set([...prev, id]))
            }
            if (err.response?.status === 401) {
                navigate('/login')
            }
        } finally {
            setUpvoting(false)
        }
    }

    // ── Fetch nearby ──────────────────────────────────────────────────────────
    const fetchNearby = async (latlng) => {
        setLoading(true)
        try {
            const res = await getNearby(latlng.lat, latlng.lng, 5000)
            setIssues(res.data.issues)
        } catch {
            setIssues([])
        } finally {
            setLoading(false)
        }
    }

    const handleLocationFound = (latlng) => {
        setUserPos(latlng)
        fetchNearby(latlng)
    }

    useEffect(() => {
        fetchNearby({ lat: 24.2297, lng: 83.0493 })
    }, [])

    const filtered = filter === 'all' ? issues : issues.filter(i => i.category === filter)

    return (
        <>
            <div className="flex flex-col" style={{ height: 'calc(100vh - 48px)' }}>

                {/* Filter bar */}
                <div className="flex items-center gap-2 flex-wrap px-5 py-3 bg-white border-b border-stone-200 shadow-sm z-10">
                    <span className="text-xs font-bold uppercase tracking-widest text-stone-400 mr-1">Filter</span>
                    {Object.entries(CATEGORY_META).map(([cat, meta]) => (
                        <button key={cat} onClick={() => setFilter(cat)}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 border ${filter === cat
                                ? `${meta.bg} ${meta.text} border-transparent shadow-sm`
                                : 'bg-stone-50 text-stone-500 border-stone-200 hover:border-stone-400'
                                }`}>
                            {meta.label}
                        </button>
                    ))}

                    <div className="ml-auto flex items-center gap-3">
                        <span className="text-xs text-stone-400 font-medium">
                            {loading
                                ? <span className="flex items-center gap-1.5">
                                    <svg className="animate-spin w-3 h-3 text-blue-500" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                    Locating…
                                </span>
                                : <span><span className="font-bold text-stone-700">{filtered?.length ?? 0}</span> issues nearby</span>
                            }
                        </span>
                        <button onClick={() => navigate('/report')}
                            className="flex items-center gap-1.5 bg-stone-900 text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-blue-600 transition-all duration-200 shadow-sm hover:-translate-y-px">
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                            Report issue
                        </button>
                    </div>
                </div>

                {/* Map + sidebar */}
                <div className="flex flex-1 overflow-hidden">

                    <MapContainer center={[24.2297, 83.0493]} zoom={13} style={{ flex: 1, zIndex: 0 }}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <LocationMarker onLocationFound={handleLocationFound} />

                        {userPos && (
                            <Marker position={userPos} icon={userIcon}>
                                <Popup><span className="text-sm font-semibold">You are here</span></Popup>
                            </Marker>
                        )}

                        {filtered.map(issue => (
                            <Marker
                                key={issue.id}
                                position={[issue.geojson.coordinates[1], issue.geojson.coordinates[0]]}
                                icon={createPinIcon(issue.category)}
                                eventHandlers={{ click: () => setSelected(issue) }}
                            >
                                <Popup>
                                    <div className="min-w-[160px] cursor-pointer py-0.5" onClick={() => setSelected(issue)}>
                                        <p className="font-bold text-stone-900 text-sm mb-1 line-clamp-2">{issue.title}</p>
                                        <p className="text-xs text-blue-600 font-medium">Tap to view details →</p>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>

                    {/* Sidebar */}
                    <div className="hidden lg:flex flex-col w-72 bg-white border-l border-stone-200 overflow-y-auto">
                        <div className="px-4 py-3 border-b border-stone-100 flex items-center justify-between sticky top-0 bg-white z-10">
                            <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Nearby issues</span>
                            <span className="text-xs font-bold text-stone-700">{filtered?.length ?? 0}</span>
                        </div>

                        {loading && (
                            <div className="flex flex-col items-center justify-center flex-1 gap-2 py-16">
                                <svg className="animate-spin w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                                <span className="text-xs text-stone-400">Loading issues…</span>
                            </div>
                        )}

                        {!loading && filtered.length === 0 && (
                            <div className="flex flex-col items-center justify-center flex-1 gap-2 py-16 px-6 text-center">
                                <span className="text-3xl">📍</span>
                                <span className="text-xs text-stone-400">No issues found nearby. Allow location access or try a different filter.</span>
                            </div>
                        )}

                        {!loading && filtered.map(issue => (
                            <div key={issue.id} onClick={() => setSelected(issue)}
                                className={`px-4 py-3.5 border-b border-stone-100 cursor-pointer transition-colors hover:bg-stone-50 ${selected?.id === issue.id ? 'bg-blue-50 border-l-2 border-l-blue-500' : ''
                                    }`}>

                                {issue.image_url && (
                                    <div className="w-full h-28 rounded-lg overflow-hidden mb-2.5 bg-stone-100">
                                        <img src={issue.image_url} alt={issue.title} className="w-full h-full object-cover" />
                                    </div>
                                )}

                                <div className="flex items-start justify-between gap-2 mb-1">
                                    <p className="text-sm font-semibold text-stone-800 leading-snug line-clamp-1">{issue.title}</p>
                                    <span className={`flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${STATUS_STYLE[issue.status?.toLowerCase().replace(' ', '_')] ?? 'bg-stone-100 text-stone-500'
                                        }`}>
                                        {STATUS_LABEL[issue.status?.toLowerCase().replace(' ', '_')] ?? issue.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full"
                                        style={{ background: CATEGORY_META[issue.category]?.color + '18', color: CATEGORY_META[issue.category]?.color }}>
                                        {issue.category}
                                    </span>
                                    <span className="text-[10px] text-stone-400">
                                        {issue.distance_metres}m · {issue.upvotes} ↑
                                        {votedIssues.has(issue.id) && <span className="ml-1 text-blue-500">✓</span>}
                                    </span>
                                </div>
                                {issue.address && <p className="text-[11px] text-stone-400 mt-1 line-clamp-1">{issue.address}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {selected && (
                <IssueDetailModal
                    issue={selected}
                    onClose={() => setSelected(null)}
                    onUpvote={handleUpvote}
                    voted={votedIssues}
                    upvoting={upvoting}
                />
            )}
        </>
    )
}
