import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login as loginApi, register as registerApi } from '../api/auth'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
    const [mode, setMode] = useState('login')
    const [form, setForm] = useState({ name: '', email: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPass, setShowPass] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async () => {
        setError('')
        setLoading(true)
        try {
            const res = mode === 'login'
                ? await loginApi({ email: form.email, password: form.password })
                : await registerApi({ name: form.name, email: form.email, password: form.password })
            login(res.data.token, res.data.user)
            navigate('/')
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full min-h-screen bg-stone-50 flex">

            {/* ── Left decorative panel ─────────────────────────────── */}
            <div className="hidden lg:flex w-1/2 bg-stone-900 flex-col justify-between p-14 relative overflow-hidden">
                {/* grid texture */}
                <div className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.15) 1px,transparent 1px)',
                        backgroundSize: '32px 32px'
                    }}
                />

                {/* Logo */}
                <Link to="/" className="relative z-10 flex items-center gap-2 text-white text-sm font-black">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    CivicVoice
                </Link>

                {/* Center content */}
                <div className="relative z-10">
                    <div className="flex flex-wrap gap-2 mb-10">
                        {['Roads & Potholes', 'Street Lighting', 'Waterlogging', 'Garbage', 'Public Safety', 'Tree Hazards', 'Encroachment', 'Water Supply'].map((cat, i) => (
                            <span key={cat} className={`px-3 py-1.5 rounded-full text-xs font-medium border border-white/10 ${i % 3 === 0 ? 'bg-blue-600/30 text-blue-300' : i % 3 === 1 ? 'bg-white/5 text-white/50' : 'bg-white/10 text-white/40'}`}>
                                {cat}
                            </span>
                        ))}
                    </div>

                    <h2 className="text-4xl font-black text-white leading-tight tracking-tight mb-4">
                        Your city.<br />
                        <span className="text-blue-400">Your voice.</span><br />
                        Real change.
                    </h2>
                    <p className="text-stone-400 text-sm leading-relaxed max-w-xs font-light">
                        Report broken infrastructure, pin issues to the map, and watch your city improve — one resolved ticket at a time.
                    </p>
                </div>

                {/* Bottom stats */}
                <div className="relative z-10 grid grid-cols-3 gap-3">
                    {[{ n: 'PostGIS', l: 'Geo queries' }, { n: 'Redis', l: '30s cache' }, { n: 'BullMQ', l: 'Async jobs' }].map(s => (
                        <div key={s.n} className="border border-white/10 rounded-xl px-4 py-3 bg-white/5">
                            <div className="text-xs font-bold text-white">{s.n}</div>
                            <div className="text-[10px] text-stone-500 mt-0.5">{s.l}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Right form panel ──────────────────────────────────── */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 py-16">

                {/* Mobile logo */}
                <Link to="/" className="lg:hidden flex items-center gap-2 text-stone-900 text-sm font-black mb-10">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    CivicVoice
                </Link>

                <div className="w-full max-w-sm">

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-black text-stone-900 tracking-tight mb-1">
                            {mode === 'login' ? 'Welcome back' : 'Create account'}
                        </h1>
                        <p className="text-sm text-stone-400 font-light">
                            {mode === 'login'
                                ? 'Sign in to report and track civic issues.'
                                : 'Join to report issues in your neighbourhood.'}
                        </p>
                    </div>

                    {/* Mode toggle */}
                    <div className="flex bg-stone-100 rounded-xl p-1 mb-8">
                        {['login', 'register'].map(m => (
                            <button key={m}
                                onClick={() => { setMode(m); setError('') }}
                                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${mode === m ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}>
                                {m === 'login' ? 'Sign in' : 'Register'}
                            </button>
                        ))}
                    </div>

                    {/* Fields */}
                    <div className="space-y-4">
                        {mode === 'register' && (
                            <div>
                                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Full name</label>
                                <input
                                    type="text"
                                    placeholder="Sambhav Garg"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm text-stone-900 placeholder-stone-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Email</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm text-stone-900 placeholder-stone-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                    onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                                    className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm text-stone-900 placeholder-stone-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(p => !p)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-500 transition-colors text-xs font-semibold">
                                    {showPass ? 'HIDE' : 'SHOW'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mt-4 flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                            <span className="text-red-500 text-sm mt-0.5">⚠</span>
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full mt-6 py-3.5 bg-stone-900 text-white text-sm font-bold rounded-xl hover:bg-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md hover:-translate-y-0.5 disabled:hover:translate-y-0">
                        {loading
                            ? <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
                                Please wait…
                            </span>
                            : mode === 'login' ? 'Sign in →' : 'Create account →'
                        }
                    </button>

                    {/* Switch mode */}
                    <p className="text-center text-sm text-stone-400 mt-6">
                        {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                        <button
                            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
                            className="text-stone-900 font-bold hover:text-blue-600 transition-colors">
                            {mode === 'login' ? 'Register' : 'Sign in'}
                        </button>
                    </p>

                    {/* Back link */}
                    <div className="mt-8 pt-6 border-t border-stone-100 text-center">
                        <Link to="/" className="text-xs text-stone-300 hover:text-stone-500 transition-colors inline-flex items-center gap-1">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                            Back to home
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    )
}