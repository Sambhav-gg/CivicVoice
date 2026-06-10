import { Link } from 'react-router-dom'

const problems = [
    { icon: '🕳️', label: 'Pothole swallowed your tyre', sub: 'Roads & Potholes' },
    { icon: '💡', label: 'Streetlight out for weeks', sub: 'Street Lighting' },
    { icon: '🌊', label: 'Street floods every monsoon', sub: 'Waterlogging' },
    { icon: '🗑️', label: 'Garbage piling up since days', sub: 'Garbage & Waste' },
    { icon: '🚰', label: 'No water supply since morning', sub: 'Water Supply' },
    { icon: '🚧', label: 'Footpath blocked by encroachment', sub: 'Encroachment' },
]

const steps = [
    {
        num: '1',
        icon: '📍',
        title: 'Pin it on the map',
        desc: 'Open the map, drop a pin on the exact spot. No address guessing — just tap where the problem is.',
        detail: 'Works on phone or desktop',
    },
    {
        num: '2',
        icon: '📝',
        title: 'Describe the issue',
        desc: 'Pick a category, write a short description. Takes under a minute. Attach a photo if you have one.',
        detail: 'Under 60 seconds to report',
    },
    {
        num: '3',
        icon: '👥',
        title: 'Neighbours upvote',
        desc: 'Others in your area see the issue on the map. When they upvote, it rises in priority for the admin team.',
        detail: 'More votes = faster action',
    },
    {
        num: '4',
        icon: '✅',
        title: 'Issue gets resolved',
        desc: 'The admin team picks it up, updates the status, and you get notified when it\'s fixed.',
        detail: 'You\'re kept in the loop',
    },
]

const statuses = [
    {
        label: 'Open',
        color: 'bg-red-50 text-red-600 border-red-200',
        dot: 'bg-red-500',
        desc: 'Reported, waiting to be picked up',
    },
    {
        label: 'In Progress',
        color: 'bg-amber-50 text-amber-600 border-amber-200',
        dot: 'bg-amber-400',
        desc: 'Team is actively working on it',
    },
    {
        label: 'Resolved',
        color: 'bg-green-50 text-green-700 border-green-200',
        dot: 'bg-green-500',
        desc: 'Fixed and verified — issue closed',
    },
]

const mockIssues = [
    { title: 'Deep pothole near school gate', category: 'Roads', status: 'In Progress', votes: 34, dot: 'bg-amber-400', statusStyle: 'bg-amber-50 text-amber-600 border-amber-200', time: '2h ago' },
    { title: 'Street light broken for 3 weeks', category: 'Lighting', status: 'Open', votes: 18, dot: 'bg-red-500', statusStyle: 'bg-red-50 text-red-600 border-red-200', time: '5h ago' },
    { title: 'Waterlogging at main crossing', category: 'Drainage', status: 'Resolved', votes: 52, dot: 'bg-green-500', statusStyle: 'bg-green-50 text-green-700 border-green-200', time: '1d ago' },
]

const faqs = [
    { q: 'Do I need to create an account?', a: 'Yes — a free account lets you report issues, upvote, and track what happens to your reports. It takes 30 seconds to sign up.' },
    { q: 'Who actually sees and fixes the issues?', a: 'Admins from the civic authority review the map. High-upvote issues get prioritised. You\'re notified when status changes.' },
    { q: 'What if my issue stays Open for too long?', a: 'Upvotes help. The more neighbours confirm the same issue, the higher it climbs in the admin queue. Share it with people nearby.' },
    { q: 'Can I report anonymously?', a: 'Not currently — a verified account helps prevent spam and lets us notify you when your issue is resolved.' },
]

export default function LandingPage() {
    return (
        <div className="w-full min-h-screen bg-white text-stone-900 font-sans overflow-x-hidden">



            {/* ── HERO ─────────────────────────────────────────────────────── */}
            <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 pb-12 sm:pt-24 sm:pb-16">
                <div className="inline-flex items-center gap-2 border border-stone-200 rounded-full px-3.5 py-1.5 text-xs font-medium text-stone-500 mb-6">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Civic issue reporting — free for citizens
                </div>

                <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                    <div>
                        <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black leading-[1.05] tracking-tight mb-5">
                            Broken city?<br />
                            <span className="text-blue-600">Report it.</span><br />
                            Get it fixed.
                        </h1>
                        <p className="text-base sm:text-lg text-stone-500 leading-relaxed mb-8 max-w-lg">
                            CivicVoice lets you report potholes, broken streetlights, garbage pileups, and other civic problems — pinned exactly on a map, visible to your neighbours, and tracked until resolved.
                        </p>
                        <div className="flex flex-wrap items-center gap-3">
                            <Link to="/report"
                                className="bg-blue-600 text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-blue-700 transition-all duration-200 inline-flex items-center gap-2 shadow-sm hover:shadow-md hover:-translate-y-0.5">
                                Report a problem
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7v10" /></svg>
                            </Link>
                            <Link to="/map"
                                className="border border-stone-200 text-stone-700 px-6 py-3 rounded-full text-sm font-semibold hover:border-stone-400 transition-colors inline-flex items-center gap-2">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                See issues near me
                            </Link>
                        </div>
                    </div>

                    {/* Live issues preview card */}
                    <div className="bg-stone-50 border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
                        <div className="px-4 py-3 border-b border-stone-200 flex items-center justify-between bg-white">
                            <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">Recent issues near you</span>
                            <span className="text-xs text-stone-400">Live</span>
                        </div>
                        <div className="divide-y divide-stone-100">
                            {mockIssues.map((issue, i) => (
                                <div key={i} className="bg-white px-4 py-3.5 flex items-start gap-3 hover:bg-stone-50 transition-colors">
                                    <span className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${issue.dot}`} />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-semibold text-stone-800 truncate">{issue.title}</div>
                                        <div className="text-xs text-stone-400 mt-0.5 flex items-center gap-2">
                                            <span>{issue.category}</span>
                                            <span>·</span>
                                            <span>{issue.votes} upvotes</span>
                                            <span>·</span>
                                            <span>{issue.time}</span>
                                        </div>
                                    </div>
                                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border flex-shrink-0 ${issue.statusStyle}`}>
                                        {issue.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="px-4 py-3 border-t border-stone-100 bg-white">
                            <Link to="/map" className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                Open full map →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── PROBLEM ─────────────────────────────────────────────────── */}
            <section className="bg-stone-900 py-16 sm:py-20">
                <div className="max-w-6xl mx-auto px-5 sm:px-8">
                    <p className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-3">Sound familiar?</p>
                    <h2 className="text-3xl sm:text-4xl font-black text-white mb-3 leading-tight">
                        We've all been there.
                    </h2>
                    <p className="text-stone-400 text-sm sm:text-base mb-10 max-w-xl">
                        You notice a problem. You don't know who to call. Nothing happens. CivicVoice gives you one place to report it — and a way to hold the system accountable.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {problems.map((p, i) => (
                            <div key={i} className="bg-stone-800 border border-stone-700 rounded-xl px-4 py-4 flex items-center gap-3 hover:border-stone-500 transition-colors">
                                <span className="text-xl flex-shrink-0">{p.icon}</span>
                                <div>
                                    <div className="text-sm font-semibold text-white leading-snug">{p.label}</div>
                                    <div className="text-xs text-stone-500 mt-0.5">{p.sub}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
            <section className="py-16 sm:py-24 max-w-6xl mx-auto px-5 sm:px-8">
                <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-3">How it works</p>
                <h2 className="text-3xl sm:text-4xl font-black text-stone-900 mb-3 leading-tight">
                    Report in under a minute.
                </h2>
                <p className="text-stone-500 text-sm sm:text-base mb-12 max-w-lg">
                    Four simple steps from spotting a problem to seeing it resolved.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {steps.map((s, i) => (
                        <div key={i} className="relative">
                            {/* connector line on desktop */}
                            {i < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-5 left-[calc(50%+24px)] right-[-50%] h-px bg-stone-200 z-0" />
                            )}
                            <div className="relative z-10 flex flex-col">
                                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-lg mb-4 shadow-sm">
                                    {s.icon}
                                </div>
                                <div className="text-xs font-bold text-stone-400 mb-1">Step {s.num}</div>
                                <h3 className="text-base font-bold text-stone-900 mb-2 leading-snug">{s.title}</h3>
                                <p className="text-sm text-stone-500 leading-relaxed mb-3">{s.desc}</p>
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                    {s.detail}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-10 sm:mt-12 flex flex-wrap gap-3">
                    <Link to="/report"
                        className="bg-stone-900 text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-blue-600 transition-colors inline-flex items-center gap-2">
                        Try reporting now
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7v10" /></svg>
                    </Link>
                </div>
            </section>

            {/* ── STATUS EXPLAINER ─────────────────────────────────────────── */}
            <section className="bg-stone-50 border-y border-stone-100 py-16 sm:py-20">
                <div className="max-w-6xl mx-auto px-5 sm:px-8">
                    <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-3">Issue tracking</p>
                    <h2 className="text-3xl sm:text-4xl font-black text-stone-900 mb-3 leading-tight">
                        Every issue has a status.
                    </h2>
                    <p className="text-stone-500 text-sm sm:text-base mb-10 max-w-lg">
                        You're never left wondering. Once you report, you can follow exactly where things stand.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {statuses.map((s, i) => (
                            <div key={i} className="bg-white border border-stone-200 rounded-2xl p-6">
                                <div className={`inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full border mb-4 ${s.color}`}>
                                    <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                                    {s.label}
                                </div>
                                <p className="text-sm text-stone-600 leading-relaxed">{s.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* mini flow diagram */}
                    <div className="mt-8 bg-white border border-stone-200 rounded-2xl p-5 sm:p-6">
                        <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-4">Typical lifecycle</p>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            {[
                                { label: 'You report', icon: '📍' },
                                { label: 'Neighbours upvote', icon: '👥' },
                                { label: 'Admin reviews', icon: '👁️' },
                                { label: 'Work begins', icon: '🔧' },
                                { label: 'You\'re notified', icon: '🔔' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="w-9 h-9 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-center text-base">
                                            {item.icon}
                                        </div>
                                        <span className="text-[11px] text-stone-500 font-medium whitespace-nowrap">{item.label}</span>
                                    </div>
                                    {i < 4 && (
                                        <svg className="text-stone-300 flex-shrink-0 mb-3.5 hidden sm:block" width="20" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                    )}
                                    {i < 4 && (
                                        <svg className="text-stone-300 flex-shrink-0 rotate-90 sm:hidden" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FAQ ──────────────────────────────────────────────────────── */}
            <section className="py-16 sm:py-24 max-w-6xl mx-auto px-5 sm:px-8">
                <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-3">Questions</p>
                <h2 className="text-3xl sm:text-4xl font-black text-stone-900 mb-10 leading-tight">
                    Common questions
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-stone-200 border border-stone-200 rounded-2xl overflow-hidden">
                    {faqs.map((faq, i) => (
                        <div key={i} className="bg-white p-6 hover:bg-stone-50 transition-colors">
                            <h3 className="text-sm font-bold text-stone-900 mb-2">{faq.q}</h3>
                            <p className="text-sm text-stone-500 leading-relaxed">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA ──────────────────────────────────────────────────────── */}
            <div className="max-w-6xl mx-auto px-5 sm:px-8 pb-16 sm:pb-24">
                <div className="bg-blue-600 rounded-2xl px-8 py-12 sm:px-12 sm:py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-2">
                            See a problem?<br />Report it today.
                        </h2>
                        <p className="text-blue-200 text-sm sm:text-base max-w-sm">
                            It takes under a minute. Your report goes on the map and your neighbours can back it up.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-shrink-0">
                        <Link to="/login"
                            className="bg-white text-blue-700 px-6 py-3 rounded-full text-sm font-bold hover:bg-blue-50 transition-colors shadow-sm whitespace-nowrap">
                            Create free account
                        </Link>
                        <Link to="/map"
                            className="text-white/70 text-sm font-medium hover:text-white transition-colors whitespace-nowrap inline-flex items-center gap-1">
                            Browse the map →
                        </Link>
                    </div>
                </div>
            </div>

            {/* ── FOOTER ───────────────────────────────────────────────────── */}
            <footer className="border-t border-stone-100 py-8">
                <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <Link to="/" className="flex items-center gap-2 text-sm font-black text-stone-900">
                        <span className="w-5 h-5 rounded-md bg-blue-600 flex items-center justify-center text-white text-[10px] font-black">C</span>
                        CivicVoice
                    </Link>
                    <p className="text-xs text-stone-400">Built by Sambhav Garg · Bennett University CSE 2027</p>
                    <div className="flex items-center gap-5">
                        {[['Login', '/login'], ['Report', '/report'], ['Map', '/map']].map(([label, href]) => (
                            <Link key={label} to={href} className="text-xs text-stone-400 hover:text-stone-900 transition-colors font-medium">{label}</Link>
                        ))}
                    </div>
                </div>
            </footer>

        </div>
    )
}