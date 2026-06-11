// import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
// import L from 'leaflet'
// import { reportIssue } from '../api/issues'
// import { useNavigate, Link } from 'react-router-dom'
// import { useState, useEffect } from 'react'

// delete L.Icon.Default.prototype._getIconUrl
// L.Icon.Default.mergeOptions({
//     iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
//     iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
//     shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
// })

// const CATEGORIES = [
//     { value: 'road', label: 'Roads & Potholes', icon: '🛣️', color: 'border-red-300 bg-red-50 text-red-700 ring-red-400' },
//     { value: 'water', label: 'Water Supply', icon: '💧', color: 'border-blue-300 bg-blue-50 text-blue-700 ring-blue-400' },
//     { value: 'electricity', label: 'Electricity', icon: '⚡', color: 'border-orange-300 bg-orange-50 text-orange-700 ring-orange-400' },
//     { value: 'sanitation', label: 'Sanitation', icon: '🗑️', color: 'border-green-300 bg-green-50 text-green-700 ring-green-400' },
//     { value: 'other', label: 'Other', icon: '📌', color: 'border-stone-300 bg-stone-50 text-stone-600 ring-stone-400' },
// ]

// function PinOnClick({ onPin }) {
//     useMapEvents({ click(e) { onPin(e.latlng) } })
//     return null
// }

// const pinIcon = L.divIcon({
//     className: '',
//     html: `
//         <div style="position:relative;width:24px;height:24px;">
//             <div style="width:24px;height:24px;background:#ef4444;border:3px solid white;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>
//             <div style="position:absolute;top:6px;left:6px;width:8px;height:8px;background:white;border-radius:50%;"></div>
//         </div>
//     `,
//     iconSize: [24, 24],
//     iconAnchor: [12, 24],
// })

// const userIcon = L.divIcon({
//     className: '',
//     html: `<div style="width:16px;height:16px;background:#2563eb;border:3px solid white;border-radius:50%;box-shadow:0 0 0 4px rgba(37,99,235,0.25)"></div>`,
//     iconSize: [16, 16],
//     iconAnchor: [8, 8],
// })

// function CurrentLocation({ onLocationFound }) {
//     const map = useMapEvents({
//         locationfound(e) {
//             map.flyTo(e.latlng, 15)
//             onLocationFound(e.latlng)
//         },
//     })

//     useEffect(() => {
//         map.locate()
//     }, [])

//     return null
// }

// export default function ReportPage() {
//     const [userLocation, setUserLocation] = useState(null)
//     const [form, setForm] = useState({ title: '', description: '', category: 'road', address: '' })
//     const [pin, setPin] = useState(null)
//     const [imageFile, setImageFile] = useState(null)
//     const [imagePreview, setImagePreview] = useState(null)
//     const [error, setError] = useState('')
//     const [loading, setLoading] = useState(false)
//     const navigate = useNavigate()

//     const handleLocationFound = (latlng) => setUserLocation(latlng)

//     const handleSubmit = async () => {
//         setError('')
//         if (!form.title.trim()) return setError('Title is required')
//         if (!pin) return setError('Click on the map to pin the exact location')
//         if (!form.address.trim()) return setError('Address / landmark is required')
//         setLoading(true)
//         try {
//             await reportIssue({ ...form, lat: pin.lat, lng: pin.lng, image: imageFile })
//             navigate('/')
//         } catch (err) {
//             setError(err.message || 'Failed to submit report')
//         } finally {
//             setLoading(false)
//         }
//     }

//     return (
//         <div className="flex" style={{ height: 'calc(100vh - 48px)' }}>

//             {/* ── Left form panel ─────────────────────────────────────── */}
//             <div className="w-80 xl:w-96 flex flex-col bg-white border-r border-stone-200 shadow-md z-10 overflow-y-auto">

//                 {/* Header */}
//                 <div className="px-6 py-5 border-b border-stone-100">
//                     <div className="flex items-center gap-2 mb-1">
//                         <Link to="/map" className="text-stone-300 hover:text-stone-500 transition-colors">
//                             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
//                         </Link>
//                         <h1 className="text-base font-black text-stone-900 tracking-tight">Report an issue</h1>
//                     </div>
//                     <p className="text-xs text-stone-400 font-light ml-6">Pin the location on the map, fill in the details, submit.</p>
//                 </div>

//                 <div className="flex-1 px-6 py-5 space-y-5">

//                     {/* Title */}
//                     <div>
//                         <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">
//                             Title <span className="text-red-400">*</span>
//                         </label>
//                         <input
//                             type="text"
//                             placeholder="e.g. Large pothole near school gate"
//                             value={form.title}
//                             onChange={e => setForm({ ...form, title: e.target.value })}
//                             className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 placeholder-stone-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
//                         />
//                     </div>

//                     {/* Category */}
//                     <div>
//                         <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">
//                             Category <span className="text-red-400">*</span>
//                         </label>
//                         <div className="grid grid-cols-2 gap-2">
//                             {CATEGORIES.map(cat => (
//                                 <button key={cat.value}
//                                     onClick={() => setForm({ ...form, category: cat.value })}
//                                     className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all duration-150 text-left ${form.category === cat.value
//                                         ? `${cat.color} ring-2 ring-offset-1 border-transparent`
//                                         : 'border-stone-200 bg-white text-stone-500 hover:border-stone-300'
//                                         }`}>
//                                     <span className="text-base flex-shrink-0">{cat.icon}</span>
//                                     <span className="leading-tight">{cat.label}</span>
//                                 </button>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Address */}
//                     <div>
//                         <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">
//                             Address / Landmark <span className="text-red-400">*</span>
//                         </label>
//                         <input
//                             type="text"
//                             placeholder="e.g. Near Sector 5 bus stop"
//                             value={form.address}
//                             onChange={e => setForm({ ...form, address: e.target.value })}
//                             className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 placeholder-stone-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
//                         />
//                     </div>

//                     {/* Description */}
//                     <div>
//                         <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Description</label>
//                         <textarea
//                             placeholder="Describe the issue in detail…"
//                             value={form.description}
//                             onChange={e => setForm({ ...form, description: e.target.value })}
//                             rows={3}
//                             className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 placeholder-stone-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
//                         />
//                     </div>

//                     {/* Image Upload */}
//                     <div>
//                         <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">
//                             Photo <span className="text-stone-300">(optional)</span>
//                         </label>
//                         <label className="relative flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-stone-200 rounded-xl cursor-pointer bg-stone-50 hover:border-blue-400 hover:bg-blue-50 transition-all overflow-hidden">
//                             {imagePreview
//                                 ? <img src={imagePreview} alt="preview" className="h-full w-full object-cover" />
//                                 : <>
//                                     <span className="text-2xl mb-1">📷</span>
//                                     <span className="text-xs text-stone-400">Tap to attach a photo</span>
//                                 </>
//                             }
//                             <input
//                                 type="file"
//                                 accept="image/*"
//                                 capture="environment"
//                                 className="hidden"
//                                 onChange={e => {
//                                     const file = e.target.files[0]
//                                     if (!file) return
//                                     setImageFile(file)
//                                     setImagePreview(URL.createObjectURL(file))
//                                 }}
//                             />
//                         </label>
//                         {imagePreview && (
//                             <button
//                                 onClick={() => { setImageFile(null); setImagePreview(null) }}
//                                 className="mt-1.5 text-xs text-red-400 hover:text-red-600 transition-colors">
//                                 ✕ Remove photo
//                             </button>
//                         )}
//                     </div>

//                     {/* Pin status */}
//                     <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${pin
//                         ? 'bg-green-50 border-green-200 text-green-700'
//                         : 'bg-amber-50 border-amber-200 text-amber-700'
//                         }`}>
//                         <span className="text-base">{pin ? '📍' : '👆'}</span>
//                         <span className="text-xs leading-relaxed">
//                             {pin
//                                 ? `Pinned at ${pin.lat.toFixed(5)}, ${pin.lng.toFixed(5)}`
//                                 : 'Click anywhere on the map to drop a pin'}
//                         </span>
//                         {pin && (
//                             <button onClick={() => setPin(null)} className="ml-auto text-green-400 hover:text-green-600 transition-colors text-xs font-bold">✕</button>
//                         )}
//                     </div>

//                     {/* Error */}
//                     {error && (
//                         <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
//                             <span className="text-red-400 text-sm mt-0.5">⚠</span>
//                             <p className="text-sm text-red-600">{error}</p>
//                         </div>
//                     )}
//                 </div>

//                 {/* Submit */}
//                 <div className="px-6 py-4 border-t border-stone-100 bg-white">
//                     <button
//                         onClick={handleSubmit}
//                         disabled={loading}
//                         className="w-full py-3.5 bg-stone-900 text-white text-sm font-bold rounded-xl hover:bg-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 disabled:hover:translate-y-0">
//                         {loading
//                             ? <>
//                                 <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
//                                 Submitting…
//                             </>
//                             : <>
//                                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" /></svg>
//                                 Submit report
//                             </>
//                         }
//                     </button>
//                     <p className="text-center text-xs text-stone-300 mt-3">Your report is visible to others after submission.</p>
//                 </div>
//             </div>

//             {/* ── Map ─────────────────────────────────────────────────── */}
//             <div className="flex-1 relative">
//                 {!pin && (
//                     <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[999] flex items-center gap-2 bg-stone-900/90 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg backdrop-blur-sm pointer-events-none">
//                         <span className="text-sm">👆</span> Click on the map to drop a pin
//                     </div>
//                 )}
//                 {pin && (
//                     <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[999] flex items-center gap-2 bg-green-600/90 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg backdrop-blur-sm pointer-events-none">
//                         <span className="text-sm">📍</span> Location pinned! Fill in the details on the left.
//                     </div>
//                 )}

//                 <MapContainer
//                     center={[28.6139, 77.2090]}
//                     zoom={14}
//                     style={{ height: '100%', width: '100%' }}
//                 >
//                     <TileLayer
//                         attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
//                         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                     />

//                     <CurrentLocation onLocationFound={handleLocationFound} />
//                     <PinOnClick onPin={setPin} />

//                     {userLocation && (
//                         <Marker position={userLocation} icon={userIcon} />
//                     )}
//                     {pin && (
//                         <Marker position={pin} icon={pinIcon} />
//                     )}
//                 </MapContainer>
//             </div>
//         </div>
//     )
// }

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

// Steps for the mobile stepper
const STEPS = ['Location', 'Details', 'Photo']

function PinOnClick({ onPin }) {
    useMapEvents({ click(e) { onPin(e.latlng) } })
    return null
}

const pinIcon = L.divIcon({
    className: '',
    html: `
        <div style="position:relative;width:28px;height:36px;filter:drop-shadow(0 3px 8px rgba(0,0,0,0.25));">
            <div style="width:28px;height:28px;background:#2563eb;border:3px solid white;border-radius:50% 50% 50% 0;transform:rotate(-45deg);"></div>
            <div style="position:absolute;top:7px;left:7px;width:10px;height:10px;background:white;border-radius:50%;opacity:0.9;"></div>
        </div>
    `,
    iconSize: [28, 36],
    iconAnchor: [14, 36],
})

const userIcon = L.divIcon({
    className: '',
    html: `
        <div style="position:relative;width:20px;height:20px;">
            <div style="position:absolute;inset:0;background:rgba(37,99,235,0.2);border-radius:50%;animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
            <div style="position:absolute;inset:3px;background:#2563eb;border:2.5px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(37,99,235,0.5);"></div>
        </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
})

function FormDetails({ form, setForm }) {
    return (
        <div className="space-y-5">
            {/* Title */}
            <div>
                <Label required>Title</Label>
                <input
                    type="text"
                    placeholder="e.g. Large pothole near school gate"
                    value={form.title}
                    onChange={e =>
                        setForm(prev => ({
                            ...prev,
                            title: e.target.value
                        }))
                    }
                    className={inputCls}
                />
            </div>

            {/* Category */}
            <div>
                <Label required>Category</Label>
                <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.value}
                            type="button"
                            onClick={() =>
                                setForm(prev => ({
                                    ...prev,
                                    category: cat.value
                                }))
                            }
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all duration-150 text-left
                                ${form.category === cat.value
                                    ? `${cat.color} ring-2 ring-offset-1 border-transparent`
                                    : 'border-stone-200 bg-white text-stone-500 hover:border-stone-300 hover:bg-stone-50'
                                }`}
                        >
                            <span className="text-base flex-shrink-0">
                                {cat.icon}
                            </span>
                            <span className="leading-tight">
                                {cat.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Address */}
            <div>
                <Label required>Address / Landmark</Label>
                <input
                    type="text"
                    placeholder="e.g. Near Sector 5 bus stop"
                    value={form.address}
                    onChange={e =>
                        setForm(prev => ({
                            ...prev,
                            address: e.target.value
                        }))
                    }
                    className={inputCls}
                />
            </div>

            {/* Description */}
            <div>
                <Label>Description</Label>
                <textarea
                    placeholder="Describe the issue in detail…"
                    value={form.description}
                    onChange={e =>
                        setForm(prev => ({
                            ...prev,
                            description: e.target.value
                        }))
                    }
                    rows={3}
                    className={`${inputCls} resize-none`}
                />
            </div>
        </div>
    )
}


function CurrentLocation({ onLocationFound }) {
    console.log('CurrentLocation render')

    const map = useMapEvents({
        locationfound(e) {
            console.log('FOUND')
            onLocationFound(e.latlng)
            map.flyTo(e.latlng, 15)
        }
    })

    useEffect(() => {
        console.log('MOUNT')
        map.locate()

        return () => console.log('UNMOUNT')
    }, [])

    return null
}

// ── Shared input classes ───────────────────────────────────────────────────────
const inputCls = 'w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 placeholder-stone-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all'

// ── Field label ────────────────────────────────────────────────────────────────
function Label({ children, required, optional }) {
    return (
        <label className="block text-[10px] font-black uppercase tracking-widest text-stone-400 mb-2">
            {children}
            {required && <span className="text-red-400 ml-1">*</span>}
            {optional && <span className="text-stone-300 ml-1 normal-case font-medium tracking-normal">(optional)</span>}
        </label>
    )
}

function MapEl({
    pin,
    setPin,
    userLocation,
    setUserLocation,
}) {
    return (
        <div className="relative w-full h-full">
            <MapContainer
                center={[28.6139, 77.2090]}
                zoom={14}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; OpenStreetMap'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <CurrentLocation
                    onLocationFound={setUserLocation}
                />

                <PinOnClick onPin={setPin} />

                {userLocation && (
                    <Marker position={userLocation} icon={userIcon} />
                )}

                {pin && (
                    <Marker position={pin} icon={pinIcon} />
                )}
            </MapContainer>
        </div>
    )
}

export default function ReportPage() {
    const [userLocation, setUserLocation] = useState(null)
    const [form, setForm] = useState({ title: '', description: '', category: 'road', address: '' })
    const [pin, setPin] = useState(null)
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [duplicateModal, setDuplicateModal] = useState(null)

    // Mobile: 0=map, 1=details, 2=photo
    const [mobileStep, setMobileStep] = useState(0)

    const navigate = useNavigate()

    const handleSubmit = async () => {
        setError('')
        if (!form.title.trim()) return setError('Title is required')
        if (!pin) return setError('Pin the location on the map first')
        if (!form.address.trim()) return setError('Address / landmark is required')
        setLoading(true)
        try {
            const result = await reportIssue({ ...form, lat: pin.lat, lng: pin.lng, image: imageFile })

            if (result?.duplicate && result?.nearby?.length) {
                setDuplicateModal({ nearby: result.nearby })
                return
            }

            setShowSuccess(true)
            setTimeout(() => navigate('/map'), 2200)
        } catch (err) {
            setError(err.message || 'Failed to submit report')
        } finally {
            setLoading(false)
        }
    }

    const FormPhoto = () => (
        <div>
            <Label optional>Photo</Label>
            <label className="relative flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-stone-200 rounded-xl cursor-pointer bg-stone-50 hover:border-blue-400 hover:bg-blue-50 transition-all overflow-hidden group">
                {imagePreview
                    ? <img src={imagePreview} alt="preview" className="h-full w-full object-cover" />
                    : <div className="flex flex-col items-center gap-1.5">
                        <div className="w-10 h-10 rounded-2xl bg-stone-100 group-hover:bg-blue-100 flex items-center justify-center text-xl transition-colors">📷</div>
                        <span className="text-xs font-semibold text-stone-400 group-hover:text-blue-500 transition-colors">Tap to attach a photo</span>
                        <span className="text-[10px] text-stone-300">JPG, PNG up to 10MB</span>
                    </div>
                }
                <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={e => {
                        const file = e.target.files[0]
                        if (!file) return
                        setImageFile(file)
                        setImagePreview(URL.createObjectURL(file))
                    }}
                />
            </label>
            {imagePreview && (
                <button
                    onClick={() => { setImageFile(null); setImagePreview(null) }}
                    className="mt-2 text-xs font-bold text-red-400 hover:text-red-600 transition-colors flex items-center gap-1"
                >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12" /></svg>
                    Remove photo
                </button>
            )}
        </div>
    )

    const PinStatus = () => (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-xs font-medium transition-all ${pin ? 'bg-green-50 border-green-200 text-green-700' : 'bg-amber-50 border-amber-200 text-amber-700'
            }`}>
            <span className="text-base flex-shrink-0">{pin ? '📍' : '👆'}</span>
            <span className="leading-relaxed flex-1">
                {pin
                    ? `Pinned · ${pin.lat.toFixed(5)}, ${pin.lng.toFixed(5)}`
                    : 'Click anywhere on the map to drop a pin'}
            </span>
            {pin && (
                <button onClick={() => setPin(null)} className="text-green-400 hover:text-green-600 transition-colors font-bold">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
            )}
        </div>
    )

    const ErrorBanner = () => error ? (
        <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <svg className="text-red-400 flex-shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
            </svg>
            <p className="text-sm text-red-600">{error}</p>
        </div>
    ) : null

    const SubmitButton = ({ fullWidth = true }) => (
        <button
            onClick={handleSubmit}
            disabled={loading}
            className={`${fullWidth ? 'w-full' : ''} py-3.5 bg-stone-900 text-white text-sm font-bold rounded-full hover:bg-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 disabled:hover:translate-y-0`}
        >
            {loading
                ? <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Submitting…
                </>
                : <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
                    </svg>
                    Submit report
                </>
            }
        </button>
    )

    // ── The map element (shared) ───────────────────────────────────────────────
    const SuccessToast = () => showSuccess ? (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
            <div className="bg-white border border-green-200 shadow-2xl rounded-2xl px-8 py-6 flex flex-col items-center gap-3"
                style={{ animation: 'fadeInUp 0.3s ease-out' }}>
                <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                        <path d="M5 12l5 5L20 7" />
                    </svg>
                </div>
                <div className="text-center">
                    <p className="text-base font-black text-stone-900">Issue reported successfully!</p>
                    <p className="text-xs text-stone-400 mt-1">Redirecting to map…</p>
                </div>
                <button
                    className="pointer-events-auto mt-1 text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    onClick={() => navigate('/map')}
                >
                    View on map
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    ) : null

    const DuplicateModal = () => {
        if (!duplicateModal) return null
        const { nearby } = duplicateModal

        const submitAnyway = async () => {
            setDuplicateModal(null)
            setLoading(true)
            try {
                await reportIssue({ ...form, lat: pin.lat, lng: pin.lng, image: imageFile, force: true })
                setShowSuccess(true)
                setTimeout(() => navigate('/map'), 2200)
            } catch (err) {
                setError(err.message || 'Failed to submit report')
            } finally {
                setLoading(false)
            }
        }

        return (
            <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/40 p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">

                    <div className="px-5 pt-5 pb-4 border-b border-stone-100">
                        <div className="flex items-start gap-3">
                            <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.2">
                                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                    <line x1="12" y1="9" x2="12" y2="13" />
                                    <line x1="12" y1="17" x2="12.01" y2="17" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-sm font-black text-stone-900 leading-tight">Similar issue already reported</h2>
                                <p className="text-xs text-stone-400 mt-0.5 leading-relaxed">
                                    A nearby issue looks similar to yours. Upvote it instead, or submit yours anyway.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="px-5 py-3 space-y-2 max-h-52 overflow-y-auto">
                        {nearby.map(issue => {
                            const c = CATEGORIES.find(x => x.value === issue.category)
                            return (
                                <div key={issue.id} className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-100">
                                    <span className="text-base flex-shrink-0">{c?.icon ?? '📌'}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-stone-900 truncate">{issue.title}</p>
                                        <p className="text-[10px] text-stone-400 truncate mt-0.5">{issue.address}</p>
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] font-bold text-stone-400 flex-shrink-0">
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <path d="M12 19V5M5 12l7-7 7 7" />
                                        </svg>
                                        {issue.upvotes ?? 0}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className="px-5 pb-5 pt-3 flex flex-col gap-2">
                        <button
                            onClick={() => navigate('/map')}
                            className="w-full py-3 bg-blue-600 text-white text-sm font-bold rounded-full flex items-center justify-center gap-2 hover:bg-blue-700 transition-all"
                        >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M12 19V5M5 12l7-7 7 7" />
                            </svg>
                            Go to map to upvote
                        </button>
                        <button
                            onClick={submitAnyway}
                            className="w-full py-3 border border-stone-200 text-stone-600 text-sm font-bold rounded-full hover:bg-stone-50 transition-all"
                        >
                            Submit my issue anyway
                        </button>
                        <button
                            onClick={() => setDuplicateModal(null)}
                            className="text-xs text-stone-400 hover:text-stone-600 transition-colors py-1"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>

            <SuccessToast />
            <DuplicateModal />
            {/* ════════════════════════════════════════════════════════════
                DESKTOP LAYOUT  (lg+)
            ════════════════════════════════════════════════════════════ */}
            <div className="hidden lg:flex" style={{ height: 'calc(100vh - 48px)' }}>

                {/* Left panel */}
                <div className="w-80 xl:w-96 flex flex-col bg-white border-r border-stone-200 shadow-sm z-10 overflow-y-auto">

                    {/* Header */}
                    <div className="px-6 pt-6 pb-5 border-b border-stone-100">
                        <Link to="/map" className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-stone-700 transition-colors mb-4">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                            Back to map
                        </Link>
                        <h1 className="text-xl font-black text-stone-900 tracking-tight leading-tight mb-1">Report an issue</h1>
                        <p className="text-xs text-stone-400 leading-relaxed">
                            Pin the exact spot on the map, fill in the details, and submit. Takes under a minute.
                        </p>
                    </div>

                    {/* Progress indicator */}
                    <div className="px-6 py-4 border-b border-stone-100">
                        <div className="flex items-center gap-2">
                            {[
                                { label: 'Pin location', done: !!pin },
                                { label: 'Fill details', done: !!(form.title && form.address) },
                                { label: 'Submit', done: false },
                            ].map((s, i) => (
                                <div key={i} className="flex items-center gap-2 flex-1">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200
                                        ${s.done ? 'bg-blue-600' : 'bg-stone-100 border border-stone-200'}`}>
                                        {s.done
                                            ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M5 12l5 5L20 7" /></svg>
                                            : <span className="text-[9px] font-black text-stone-400">{i + 1}</span>
                                        }
                                    </div>
                                    <span className={`text-[10px] font-bold transition-colors ${s.done ? 'text-blue-600' : 'text-stone-400'}`}>{s.label}</span>
                                    {i < 2 && <div className="flex-1 h-px bg-stone-100 mx-1" />}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Fields */}
                    <div className="flex-1 px-6 py-5 space-y-5">
                        <PinStatus />
                        <FormDetails form={form}
                            setForm={setForm} />
                        <FormPhoto />
                        <ErrorBanner />
                    </div>

                    {/* Submit */}
                    <div className="px-6 py-4 border-t border-stone-100 bg-white sticky bottom-0">
                        <SubmitButton />
                        <p className="text-center text-[11px] text-stone-300 mt-2.5">
                            Your report is visible to others after submission.
                        </p>
                    </div>
                </div>

                {/* Map */}
                <div className="flex-1">
                    <MapEl
                        pin={pin}
                        setPin={setPin}
                        userLocation={userLocation}
                        setUserLocation={setUserLocation}
                    />
                </div>
            </div>


            {/* ════════════════════════════════════════════════════════════
                MOBILE LAYOUT  (< lg) — full-screen map + bottom sheet stepper
            ════════════════════════════════════════════════════════════ */}
            <div className="lg:hidden flex flex-col" style={{ height: 'calc(100vh - 48px)' }}>

                {/* Full-screen map always visible */}
                <div className="flex-1 relative">
                    <MapEl
                        pin={pin}
                        setPin={setPin}
                        userLocation={userLocation}
                        setUserLocation={setUserLocation}
                    />

                    {/* Back button overlay */}
                    <Link to="/map"
                        className="absolute top-4 left-4 z-[999] w-9 h-9 bg-white rounded-full shadow-md border border-stone-200 flex items-center justify-center text-stone-500 hover:text-stone-900 transition-colors">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                    </Link>

                    {/* Pin confirmation nudge — shown on step 0 only */}
                    {mobileStep === 0 && pin && (
                        <button
                            onClick={() => setMobileStep(1)}
                            className="absolute bottom-56 left-1/2 -translate-x-1/2 z-[999] flex items-center gap-2 bg-blue-600 text-white text-xs font-bold px-5 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-all hover:-translate-y-0.5 hover:shadow-xl"
                        >
                            Location pinned — continue
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </button>
                    )}
                </div>

                {/* Bottom sheet */}
                <div className="bg-white border-t border-stone-200 shadow-2xl flex flex-col"
                    style={{ maxHeight: mobileStep === 0 ? '56px' : '75vh', minHeight: '56px', transition: 'max-height 0.35s cubic-bezier(0.4,0,0.2,1)' }}>

                    {/* Step tabs / handle */}
                    <div
                        className="flex items-center px-4 py-3.5 cursor-pointer select-none border-b border-stone-100 flex-shrink-0"
                        onClick={() => setMobileStep(s => s === 0 ? 1 : 0)}
                    >
                        {/* Drag handle */}
                        <div className="w-8 h-1 rounded-full bg-stone-200 absolute left-1/2 -translate-x-1/2 top-2" />

                        {/* Step pills */}
                        <div className="flex items-center gap-2 mt-1 w-full">
                            {STEPS.map((label, i) => (
                                <button
                                    key={i}
                                    onClick={e => { e.stopPropagation(); setMobileStep(i) }}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all border
                                        ${mobileStep === i
                                            ? 'bg-stone-900 text-white border-transparent shadow-sm'
                                            : 'bg-stone-50 text-stone-400 border-stone-200'
                                        }`}
                                >
                                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black flex-shrink-0
                                        ${mobileStep === i ? 'bg-white/20' : 'bg-stone-200 text-stone-500'}`}>
                                        {i + 1}
                                    </span>
                                    {label}
                                </button>
                            ))}

                            <div className="ml-auto">
                                <svg
                                    className={`text-stone-400 transition-transform duration-300 ${mobileStep > 0 ? 'rotate-180' : ''}`}
                                    width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M18 15l-6-6-6 6" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Step content */}
                    {mobileStep > 0 && (
                        <div className="overflow-y-auto flex-1 px-5 py-4">

                            {/* Step 0: location — shown inline as status */}
                            {mobileStep >= 1 && (
                                <div className="mb-4">
                                    <PinStatus />
                                    {!pin && (
                                        <button
                                            onClick={() => setMobileStep(0)}
                                            className="mt-2 text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                        >
                                            ← Go back to map to pin location
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Step 1: details */}
                            {mobileStep === 1 && <FormDetails form={form}
                                setForm={setForm} />}

                            {/* Step 2: photo + submit */}
                            {mobileStep === 2 && (
                                <div className="space-y-5">
                                    <FormPhoto />
                                    <ErrorBanner />
                                    <SubmitButton />
                                    <p className="text-center text-[11px] text-stone-300">
                                        Your report is visible to others after submission.
                                    </p>
                                </div>
                            )}

                            {/* Nav buttons for step 1 */}
                            {mobileStep === 1 && (
                                <div className="mt-6 flex items-center gap-3">
                                    <ErrorBanner />
                                    <button
                                        onClick={() => setMobileStep(2)}
                                        className="flex-1 py-3.5 bg-stone-900 text-white text-sm font-bold rounded-full hover:bg-blue-600 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                                    >
                                        Next: Photo & submit
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}