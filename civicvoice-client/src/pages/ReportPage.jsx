// import { useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { reportIssue } from '../api/issues'
import { useNavigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const CATEGORIES = [
    { value: 'road', label: 'Roads & Potholes', icon: '🛣️', color: 'border-red-300 bg-red-50 text-red-700 ring-red-400' },
    { value: 'water', label: 'Water Supply', icon: '💧', color: 'border-blue-300 bg-blue-50 text-blue-700 ring-blue-400' },
    { value: 'electricity', label: 'Electricity', icon: '⚡', color: 'border-orange-300 bg-orange-50 text-orange-700 ring-orange-400' },
    { value: 'sanitation', label: 'Sanitation', icon: '🗑️', color: 'border-green-300 bg-green-50 text-green-700 ring-green-400' },
    { value: 'other', label: 'Other', icon: '📌', color: 'border-stone-300 bg-stone-50 text-stone-600 ring-stone-400' },
]
// const [userLocation, setUserLocation] = useState(null)
function PinOnClick({ onPin }) {
    useMapEvents({ click(e) { onPin(e.latlng) } })
    return null
}
// useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//         (position) => {
//             setUserLocation({
//                 lat: position.coords.latitude,
//                 lng: position.coords.longitude
//             })
//         },
//         (err) => {
//             console.log(err)
//         }
//     )
// }, [])
const pinIcon = L.divIcon({
    className: '',
    html: `
        <div style="
            position:relative;
            width:24px;
            height:24px;
        ">
            <div style="
                width:24px;
                height:24px;
                background:#ef4444;
                border:3px solid white;
                border-radius:50% 50% 50% 0;
                transform:rotate(-45deg);
                box-shadow:0 2px 8px rgba(0,0,0,0.3);
            "></div>

            <div style="
                position:absolute;
                top:6px;
                left:6px;
                width:8px;
                height:8px;
                background:white;
                border-radius:50%;
            "></div>
        </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
})
const userIcon = L.divIcon({
    className: '',
    html: `<div style="width:16px;height:16px;background:#2563eb;border:3px solid white;border-radius:50%;box-shadow:0 0 0 4px rgba(37,99,235,0.25)"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
})

function CurrentLocation({ onLocationFound }) {
    const map = useMapEvents({
        locationfound(e) {
            map.flyTo(e.latlng, 15)
            onLocationFound(e.latlng)
        },
    })

    useEffect(() => {
        map.locate()
    }, [])

    return null
}


export default function ReportPage() {
    const [userLocation, setUserLocation] = useState(null)
    const handleLocationFound = (latlng) => {
        setUserLocation(latlng)
    }
    const [form, setForm] = useState({ title: '', description: '', category: 'road', address: '' })
    const [pin, setPin] = useState(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState(1) // 1 = details, 2 = confirm
    const navigate = useNavigate()


    const handleSubmit = async () => {
        setError('')
        if (!form.title.trim()) return setError('Title is required')
        if (!pin) return setError('Click on the map to pin the exact location')
        if (!form.address.trim()) return setError('Address / landmark is required')
        setLoading(true)
        try {
            await reportIssue({ ...form, lat: pin.lat, lng: pin.lng })
            navigate('/')
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit report')
        } finally {
            setLoading(false)
        }
    }

    const selectedCat = CATEGORIES.find(c => c.value === form.category)

    return (
        <div className="flex" style={{ height: 'calc(100vh - 48px)' }}>

            {/* ── Left form panel ─────────────────────────────────────── */}
            <div className="w-80 xl:w-96 flex flex-col bg-white border-r border-stone-200 shadow-md z-10 overflow-y-auto">

                {/* Header */}
                <div className="px-6 py-5 border-b border-stone-100">
                    <div className="flex items-center gap-2 mb-1">
                        <Link to="/map" className="text-stone-300 hover:text-stone-500 transition-colors">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                        </Link>
                        <h1 className="text-base font-black text-stone-900 tracking-tight">Report an issue</h1>
                    </div>
                    <p className="text-xs text-stone-400 font-light ml-6">Pin the location on the map, fill in the details, submit.</p>
                </div>

                <div className="flex-1 px-6 py-5 space-y-5">

                    {/* Title */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">
                            Title <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Large pothole near school gate"
                            value={form.title}
                            onChange={e => setForm({ ...form, title: e.target.value })}
                            className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 placeholder-stone-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">
                            Category <span className="text-red-400">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {CATEGORIES.map(cat => (
                                <button key={cat.value}
                                    onClick={() => setForm({ ...form, category: cat.value })}
                                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all duration-150 text-left ${form.category === cat.value
                                        ? `${cat.color} ring-2 ring-offset-1 border-transparent`
                                        : 'border-stone-200 bg-white text-stone-500 hover:border-stone-300'
                                        }`}>
                                    <span className="text-base flex-shrink-0">{cat.icon}</span>
                                    <span className="leading-tight">{cat.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">
                            Address / Landmark <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Near Sector 5 bus stop"
                            value={form.address}
                            onChange={e => setForm({ ...form, address: e.target.value })}
                            className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 placeholder-stone-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Description</label>
                        <textarea
                            placeholder="Describe the issue in detail…"
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 placeholder-stone-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                        />
                    </div>

                    {/* Pin status */}
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${pin
                        ? 'bg-green-50 border-green-200 text-green-700'
                        : 'bg-amber-50 border-amber-200 text-amber-700'
                        }`}>
                        <span className="text-base">{pin ? '📍' : '👆'}</span>
                        <span className="text-xs leading-relaxed">
                            {pin
                                ? `Pinned at ${pin.lat.toFixed(5)}, ${pin.lng.toFixed(5)}`
                                : 'Click anywhere on the map to drop a pin'}
                        </span>
                        {pin && (
                            <button onClick={() => setPin(null)} className="ml-auto text-green-400 hover:text-green-600 transition-colors text-xs font-bold">✕</button>
                        )}
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                            <span className="text-red-400 text-sm mt-0.5">⚠</span>
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}
                </div>

                {/* Submit */}
                <div className="px-6 py-4 border-t border-stone-100 bg-white">
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full py-3.5 bg-stone-900 text-white text-sm font-bold rounded-xl hover:bg-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 disabled:hover:translate-y-0">
                        {loading
                            ? <>
                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
                                Submitting…
                            </>
                            : <>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" /></svg>
                                Submit report
                            </>
                        }
                    </button>
                    <p className="text-center text-xs text-stone-300 mt-3">Your report is visible to others after submission.</p>
                </div>
            </div>

            {/* ── Map ─────────────────────────────────────────────────── */}
            <div className="flex-1 relative">
                {!pin && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[999] flex items-center gap-2 bg-stone-900/90 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg backdrop-blur-sm pointer-events-none">
                        <span className="text-sm">👆</span> Click on the map to drop a pin
                    </div>
                )}
                {pin && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[999] flex items-center gap-2 bg-green-600/90 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg backdrop-blur-sm pointer-events-none">
                        <span className="text-sm">📍</span> Location pinned! Fill in the details on the left.
                    </div>
                )}

                <MapContainer
                    center={[28.6139, 77.2090]}
                    zoom={14}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Auto detect user location + fly to it */}
                    <CurrentLocation onLocationFound={handleLocationFound} />

                    {/* Click anywhere to place issue pin */}
                    <PinOnClick onPin={setPin} />

                    {/* User current location */}
                    {userLocation && (
                        <Marker
                            position={userLocation}
                            icon={userIcon}
                        />
                    )}

                    {/* Issue location */}
                    {pin && (
                        <Marker
                            position={pin}
                            icon={pinIcon}
                        />
                    )}
                </MapContainer>
            </div>
        </div>
    )
}