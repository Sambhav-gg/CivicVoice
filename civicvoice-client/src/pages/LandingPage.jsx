import { Link } from 'react-router-dom'

const features = [
    { icon: '📍', title: 'Map-based reporting', desc: 'Drop a pin on the exact location. Leaflet map with category-colored markers and nearby issue detection via PostGIS.' },
    { icon: '🔐', title: 'Role-based access', desc: 'Citizens report and upvote. Admins manage status. JWT auth with bcrypt-hashed credentials and protected routes.' },
    { icon: '⚡', title: 'Redis caching', desc: 'Nearby queries cached with a 30s TTL. Cache auto-invalidated on new reports to keep data fresh.' },
    { icon: '🌍', title: 'Geospatial search', desc: 'PostGIS ST_DWithin finds issues within your radius with precise distance in metres.' },
    { icon: '🔔', title: 'Async notifications', desc: 'BullMQ queues handle NEW_ISSUE, STATUS_UPDATE, and UPVOTE_MILESTONE without blocking threads.' },
    { icon: '📊', title: 'Admin dashboard', desc: 'Live issue list with inline status updates, cursor-based pagination, and rate-limited endpoints.' },
]

const steps = [
    { num: '01', title: 'Spot an issue', desc: 'Citizen notices broken infra — streetlight, pothole, waterlogging.' },
    { num: '02', title: 'Pin & report', desc: 'Drop a pin, choose category, describe it, submit in 30 seconds.' },
    { num: '03', title: 'Community upvotes', desc: 'Others in the area upvote. Milestone alerts fire via BullMQ.' },
    { num: '04', title: 'Admin resolves', desc: 'Admin updates status. Citizen gets notified. Issue closed.' },
]

const tech = [
    { icon: '🟢', name: 'Node.js' }, { icon: '🚂', name: 'Express' },
    { icon: '🐘', name: 'PostgreSQL' }, { icon: '🌍', name: 'PostGIS' },
    { icon: '🔴', name: 'Redis' }, { icon: '🐂', name: 'BullMQ' },
    { icon: '⚛️', name: 'React' }, { icon: '⚡', name: 'Vite' },
    { icon: '🗺️', name: 'Leaflet' }, { icon: '🐳', name: 'Docker' },
    { icon: '🔒', name: 'JWT' }, { icon: '🔁', name: 'nginx' },
]

const cats = [
    { label: 'Roads & Potholes', color: 'bg-red-100 text-red-700' },
    { label: 'Street Lighting', color: 'bg-orange-100 text-orange-700' },
    { label: 'Waterlogging', color: 'bg-yellow-100 text-yellow-700' },
    { label: 'Garbage & Waste', color: 'bg-green-100 text-green-700' },
    { label: 'Water Supply', color: 'bg-blue-100 text-blue-700' },
    { label: 'Sewage & Drainage', color: 'bg-purple-100 text-purple-700' },
    { label: 'Public Safety', color: 'bg-pink-100 text-pink-700' },
    { label: 'Parks & Recreation', color: 'bg-teal-100 text-teal-700' },
    { label: 'Public Transport', color: 'bg-indigo-100 text-indigo-700' },
    { label: 'Encroachment', color: 'bg-amber-100 text-amber-700' },
    { label: 'Tree Hazards', color: 'bg-emerald-100 text-emerald-700' },
    { label: 'Other', color: 'bg-slate-100 text-slate-700' },
]

const mockPins = [
    { top: '15%', left: '10%', label: 'Pothole', dotColor: 'bg-red-500', statusClass: 'bg-red-100 text-red-600' },
    { top: '50%', left: '50%', label: 'Street light', dotColor: 'bg-orange-400', statusClass: 'bg-amber-100 text-amber-600' },
    { top: '65%', left: '20%', label: 'Waterlogging', dotColor: 'bg-blue-500', statusClass: 'bg-red-100 text-red-600' },
    { top: '20%', left: '65%', label: 'Garbage', dotColor: 'bg-green-500', statusClass: 'bg-green-100 text-green-700' },
]
const pinStatuses = ['Open', 'In progress', 'Open', 'Resolved']

export default function LandingPage() {
    return (
        <div className="w-full min-h-screen bg-stone-50 text-stone-900 font-sans overflow-x-hidden">

            {/* ── HERO ─────────────────────────────────────────────────────── */}
            <section className="relative w-full min-h-screen flex flex-col lg:flex-row items-stretch">

                {/* Left panel */}
                <div className="relative z-10 flex flex-col justify-center w-full lg:w-1/2 px-8 md:px-16 py-24 bg-stone-50">
                    {/* grid texture */}
                    <div className="absolute inset-0 opacity-40"
                        style={{
                            backgroundImage: 'linear-gradient(rgba(0,0,0,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.06) 1px,transparent 1px)',
                            backgroundSize: '32px 32px'
                        }}
                    />
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 border border-stone-200 bg-white rounded-full px-4 py-1.5 text-xs font-medium text-stone-500 mb-8 shadow-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            Civic issue reporting platform
                        </div>

                        <h1 className="text-6xl md:text-7xl xl:text-8xl font-black leading-[0.92] tracking-tight mb-8">
                            Your city.<br />
                            <span className="text-blue-600">Your voice.</span><br />
                            Real change.
                        </h1>

                        <p className="text-base md:text-lg text-stone-500 font-light max-w-md leading-relaxed mb-10">
                            Report broken infrastructure, unsafe roads, and civic issues — pinned to a map, routed to the right people, resolved faster.
                        </p>

                        <div className="flex items-center gap-4 flex-wrap">
                            <Link to="/report"
                                className="bg-stone-900 text-white px-7 py-3.5 rounded-full text-sm font-semibold hover:bg-blue-600 transition-all duration-200 inline-flex items-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5">
                                Report an issue
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7v10" /></svg>
                            </Link>
                            <Link to="/map"
                                className="text-stone-500 text-sm font-medium hover:text-stone-900 transition-colors inline-flex items-center gap-1.5">
                                Explore the map
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                            </Link>
                        </div>

                        {/* stat strip */}
                        <div className="mt-14 grid grid-cols-3 gap-3">
                            {[
                                { n: 'PostGIS', l: 'Geo queries' },
                                { n: 'Redis', l: '30s TTL cache' },
                                { n: 'BullMQ', l: 'Async jobs' },
                            ].map(s => (
                                <div key={s.n} className="bg-white border border-stone-200 rounded-xl px-4 py-3 shadow-sm">
                                    <div className="text-sm font-bold text-stone-900">{s.n}</div>
                                    <div className="text-xs text-stone-400 mt-0.5">{s.l}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right panel — map card */}
                <div className="hidden lg:flex w-full lg:w-1/2 bg-stone-100 items-center justify-center p-12 border-l border-stone-200">
                    <div className="w-full max-w-lg bg-white rounded-2xl overflow-hidden shadow-xl border border-stone-200">
                        {/* map preview */}
                        <div className="relative h-72 bg-[#e8efe4] overflow-hidden">
                            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 560 288" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                                <rect width="560" height="288" fill="#e8efe4" />
                                {/* buildings */}
                                {[[20, 20, 90, 70], [130, 20, 110, 45], [230, 20, 80, 90], [330, 40, 100, 55], [450, 18, 90, 100], [20, 110, 70, 90], [110, 100, 90, 70], [230, 145, 110, 70], [360, 130, 90, 85], [470, 150, 72, 75]].map(([x, y, w, h], i) => (
                                    <rect key={i} x={x} y={y} width={w} height={h} rx="3" fill="#d4e0ce" opacity="0.9" />
                                ))}
                                {/* roads */}
                                <line x1="0" y1="100" x2="560" y2="100" stroke="#fff" strokeWidth="10" />
                                <line x1="0" y1="135" x2="560" y2="135" stroke="#f5f4f0" strokeWidth="4" />
                                <line x1="130" y1="0" x2="130" y2="288" stroke="#fff" strokeWidth="10" />
                                <line x1="225" y1="0" x2="225" y2="288" stroke="#f5f4f0" strokeWidth="4" />
                                <line x1="340" y1="0" x2="340" y2="288" stroke="#fff" strokeWidth="10" />
                                <line x1="460" y1="0" x2="460" y2="288" stroke="#f5f4f0" strokeWidth="4" />
                                <line x1="0" y1="200" x2="560" y2="200" stroke="#f5f4f0" strokeWidth="4" />
                                {/* pins */}
                                {[[65, 55, '#ef4444'], [280, 185, '#f97316'], [55, 165, '#3b82f6'], [395, 70, '#22c55e']].map(([cx, cy, fill], i) => (
                                    <g key={i}>
                                        <circle cx={cx} cy={cy} r="13" fill={fill} opacity="0.2" />
                                        <circle cx={cx} cy={cy} r="7" fill={fill} />
                                    </g>
                                ))}
                            </svg>
                            {/* floating pin labels */}
                            {mockPins.map((p, i) => (
                                <div key={i} className="absolute flex items-center gap-1.5 bg-white border border-stone-200 rounded-full px-2.5 py-1 text-xs font-medium text-stone-700 shadow-md whitespace-nowrap"
                                    style={{ top: p.top, left: p.left }}>
                                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${p.dotColor}`} />
                                    {p.label}
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${p.statusClass}`}>
                                        {pinStatuses[i]}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="px-5 py-4 flex items-center justify-between border-t border-stone-100">
                            <div>
                                <div className="text-sm font-bold text-stone-900">Live issue map</div>
                                <div className="text-xs text-stone-400 mt-0.5">check active issues nearby</div>
                            </div>
                            <Link to="/map" className="text-sm text-blue-600 font-semibold hover:gap-2 transition-all flex items-center gap-1">
                                Open map →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── STRIP ────────────────────────────────────────────────────── */}
            <div className="w-full border-y border-stone-200 bg-white overflow-x-auto">
                <div className="flex min-w-max">
                    {[
                        { icon: '📍', text: 'Pin exact location' },
                        { icon: '🗳️', text: 'Community upvotes' },
                        { icon: '🔔', text: 'Async notifications' },
                        { icon: '🛡️', text: 'Role-based access' },
                        { icon: '⚡', text: 'Redis-cached queries' },
                        { icon: '🐳', text: 'Docker ready' },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2.5 px-8 py-4 border-r border-stone-100 flex-shrink-0">
                            <span className="text-base">{item.icon}</span>
                            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider whitespace-nowrap">{item.text}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── FEATURES ─────────────────────────────────────────────────── */}
            <section className="w-full px-8 md:px-16 py-24">
                <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-3">Features</p>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-stone-900 mb-14 max-w-xl leading-tight">
                    Everything a city needs to listen
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-stone-200 border border-stone-200 rounded-2xl overflow-hidden">
                    {features.map(f => (
                        <div key={f.title} className="bg-white hover:bg-stone-50 transition-colors p-8 group">
                            <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-lg mb-5 group-hover:bg-blue-50 transition-colors">
                                {f.icon}
                            </div>
                            <h3 className="text-sm font-bold text-stone-900 mb-2">{f.title}</h3>
                            <p className="text-sm text-stone-500 leading-relaxed font-light">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
            <section className="w-full bg-stone-900 px-8 md:px-16 py-24">
                <p className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-3">How it works</p>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-14 max-w-xl leading-tight">
                    From pothole to resolved
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((s, i) => (
                        <div key={s.num} className="relative">
                            {i < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-4 left-10 right-0 h-px bg-stone-700" />
                            )}
                            <div className="relative z-10 w-8 h-8 rounded-full border border-stone-600 flex items-center justify-center text-xs font-bold text-stone-500 bg-stone-900 mb-5">
                                {s.num}
                            </div>
                            <div className="text-sm font-bold text-white mb-2">{s.title}</div>
                            <div className="text-sm text-stone-500 leading-relaxed font-light">{s.desc}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── TECH STACK ───────────────────────────────────────────────── */}
            <section className="w-full bg-stone-100 px-8 md:px-16 py-24">
                <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-3">Tech stack</p>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-stone-900 mb-14 max-w-xl leading-tight">
                    Built for scale, not just demos
                </h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3">
                    {tech.map(t => (
                        <div key={t.name}
                            className="bg-white border border-stone-200 rounded-xl py-4 px-2 flex flex-col items-center gap-2 hover:border-blue-400 hover:-translate-y-0.5 transition-all cursor-default shadow-sm">
                            <span className="text-xl">{t.icon}</span>
                            <span className="text-[11px] font-semibold text-stone-500">{t.name}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CATEGORIES ───────────────────────────────────────────────── */}
            <section className="w-full px-8 md:px-16 py-24">
                <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-3">Issue categories</p>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-stone-900 mb-14 max-w-xl leading-tight">
                    Every civic problem, covered
                </h2>
                <div className="flex flex-wrap gap-2.5">
                    {cats.map(c => (
                        <span key={c.label}
                            className={`${c.color} px-4 py-2 rounded-full text-sm font-medium cursor-default hover:opacity-80 transition-opacity`}>
                            {c.label}
                        </span>
                    ))}
                </div>
            </section>

            {/* ── CTA ──────────────────────────────────────────────────────── */}
            <div className="w-full px-8 md:px-16 pb-24">
                <div className="w-full bg-blue-600 rounded-2xl px-10 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
                    <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight max-w-md">
                        Ready to make your city better?
                    </h2>
                    <div className="flex items-center gap-4 flex-wrap">
                        <Link to="/login"
                            className="bg-white text-blue-700 px-7 py-3.5 rounded-full text-sm font-bold hover:bg-blue-50 transition-colors shadow-md whitespace-nowrap">
                            Get started →
                        </Link>
                        <Link to="/map"
                            className="text-white/70 text-sm font-medium hover:text-white transition-colors whitespace-nowrap inline-flex items-center gap-1">
                            View the map ↗
                        </Link>
                    </div>
                </div>
            </div>

            {/* ── FOOTER ───────────────────────────────────────────────────── */}
            <footer className="w-full border-t border-stone-200 px-8 md:px-16 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <Link to="/" className="flex items-center gap-2 text-sm font-black text-stone-900">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    CivicVoice
                </Link>
                <p className="text-xs text-stone-400">Built by Sambhav Garg · Bennett University CSE 2027</p>
                <div className="flex items-center gap-6">
                    {[['Login', '/login'], ['Report', '/report'], ['Map', '/map']].map(([label, href]) => (
                        <Link key={label} to={href} className="text-xs text-stone-400 hover:text-stone-900 transition-colors font-medium">{label}</Link>
                    ))}
                </div>
            </footer>

        </div>
    )
}