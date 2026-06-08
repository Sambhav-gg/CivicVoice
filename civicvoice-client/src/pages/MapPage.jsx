import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { getNearby } from '../api/issues'
import { useNavigate } from 'react-router-dom'

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
    'in progress': 'bg-amber-100 text-amber-700',
    resolved: 'bg-green-100 text-green-700',
}

const createColoredIcon = (category) => L.divIcon({
    className: '',
    html: `<div style="width:13px;height:13px;background:${CATEGORY_META[category]?.color ?? '#94a3b8'};border:2.5px solid white;border-radius:50%;box-shadow:0 1px 5px rgba(0,0,0,0.35)"></div>`,
    iconSize: [13, 13],
    iconAnchor: [6, 6],
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

export default function MapPage() {
    const [issues, setIssues] = useState([])
    const [userPos, setUserPos] = useState(null)
    const [loading, setLoading] = useState(false)
    const [filter, setFilter] = useState('all')
    const [selected, setSelected] = useState(null)
    const navigate = useNavigate()

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

    const filtered = filter === 'all' ? issues : issues.filter(i => i.category === filter)

    return (
        <div className="flex flex-col" style={{ height: 'calc(100vh - 48px)' }}>

            {/* ── Filter bar ─────────────────────────────────────────── */}
            <div className="flex items-center gap-2 flex-wrap px-5 py-3 bg-white border-b border-stone-200 shadow-sm z-10">
                <span className="text-xs font-bold uppercase tracking-widest text-stone-400 mr-1">Filter</span>
                {Object.entries(CATEGORY_META).map(([cat, meta]) => (
                    <button key={cat}
                        onClick={() => setFilter(cat)}
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
                                <svg className="animate-spin w-3 h-3 text-blue-500" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
                                Locating…
                            </span>
                            : <span><span className="font-bold text-stone-700">{filtered?.length ?? 0}</span> issues nearby</span>
                        }
                    </span>
                    <button
                        onClick={() => navigate('/report')}
                        className="flex items-center gap-1.5 bg-stone-900 text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-blue-600 transition-all duration-200 shadow-sm hover:-translate-y-px">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M5 12h14" /></svg>
                        Report issue
                    </button>
                </div>
            </div>

            {/* ── Map + sidebar ───────────────────────────────────────── */}
            <div className="flex flex-1 overflow-hidden">

                {/* Map */}
                <MapContainer center={[28.4595, 77.0266]} zoom={13} style={{ flex: 1, zIndex: 0 }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker onLocationFound={handleLocationFound} />

                    {userPos && (
                        <Marker position={userPos} icon={L.divIcon({
                            className: '',
                            html: `<div style="width:16px;height:16px;background:#2563eb;border:3px solid white;border-radius:50%;box-shadow:0 0 0 4px rgba(37,99,235,0.25)"></div>`,
                            iconSize: [16, 16], iconAnchor: [8, 8]
                        })}>
                            <Popup><span className="text-sm font-semibold">You are here</span></Popup>
                        </Marker>
                    )}

                    {filtered.map(issue => (
                        <Marker
                            key={issue.id}
                            position={[issue.geojson.coordinates[1], issue.geojson.coordinates[0]]}
                            icon={createColoredIcon(issue.category)}
                            eventHandlers={{ click: () => setSelected(issue) }}
                        >
                            <Popup>
                                <div className="min-w-[190px] py-0.5">
                                    <p className="font-bold text-stone-900 text-sm mb-1">{issue.title}</p>
                                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                                        <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full"
                                            style={{ background: CATEGORY_META[issue.category]?.color + '20', color: CATEGORY_META[issue.category]?.color }}>
                                            {issue.category}
                                        </span>
                                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_STYLE[issue.status?.toLowerCase()] ?? 'bg-stone-100 text-stone-500'}`}>
                                            {issue.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-stone-500">{issue.address}</p>
                                    <p className="text-xs text-stone-400 mt-0.5">{issue.distance_metres}m away · {issue.upvotes} upvotes</p>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>

                {/* Issue list sidebar */}
                <div className="hidden lg:flex flex-col w-72 bg-white border-l border-stone-200 overflow-y-auto">
                    <div className="px-4 py-3 border-b border-stone-100 flex items-center justify-between sticky top-0 bg-white z-10">
                        <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Nearby issues</span>
                        <span className="text-xs font-bold text-stone-700">{filtered?.length ?? 0}</span>
                    </div>

                    {loading && (
                        <div className="flex flex-col items-center justify-center flex-1 gap-2 text-stone-300 py-16">
                            <svg className="animate-spin w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
                            <span className="text-xs">Loading issues…</span>
                        </div>
                    )}

                    {!loading && filtered.length === 0 && (
                        <div className="flex flex-col items-center justify-center flex-1 gap-2 text-stone-300 py-16 px-6 text-center">
                            <span className="text-3xl">📍</span>
                            <span className="text-xs text-stone-400">No issues found nearby. Allow location access or try a different filter.</span>
                        </div>
                    )}

                    {!loading && filtered.map(issue => (
                        <div key={issue.id}
                            onClick={() => setSelected(issue)}
                            className={`px-4 py-3.5 border-b border-stone-100 cursor-pointer transition-colors hover:bg-stone-50 ${selected?.id === issue.id ? 'bg-blue-50 border-l-2 border-l-blue-500' : ''}`}>
                            <div className="flex items-start justify-between gap-2 mb-1">
                                <p className="text-sm font-semibold text-stone-800 leading-snug line-clamp-1">{issue.title}</p>
                                <span className={`flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${STATUS_STYLE[issue.status?.toLowerCase()] ?? 'bg-stone-100 text-stone-500'}`}>
                                    {issue.status}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full"
                                    style={{ background: CATEGORY_META[issue.category]?.color + '18', color: CATEGORY_META[issue.category]?.color }}>
                                    {issue.category}
                                </span>
                                <span className="text-[10px] text-stone-400">{issue.distance_metres}m · {issue.upvotes} ↑</span>
                            </div>
                            {issue.address && <p className="text-[11px] text-stone-400 mt-1 line-clamp-1">{issue.address}</p>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}