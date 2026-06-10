import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login as loginApi, register as registerApi, resendVerification } from '../api/auth'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
    const [mode, setMode] = useState('login')
    const [form, setForm] = useState({ name: '', email: '', password: '' })
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPass, setShowPass] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async () => {
        setError(null)
        setSuccess('')
        setLoading(true)
        try {
            if (mode === 'login') {
                const res = await loginApi({ email: form.email, password: form.password })
                login(res.data.token, res.data.user)
                navigate('/')
            } else {
                await registerApi({ name: form.name, email: form.email, password: form.password })
                setSuccess('Account created! Check your email to verify before signing in.')
                setMode('login')
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Something went wrong'
            const unverified = err.response?.data?.unverified || false
            setError({ text: msg, unverified })
        } finally {
            setLoading(false)
        }
    }

    const handleResend = async () => {
        setError(null)
        try {
            await resendVerification({ email: form.email })
            setSuccess('Verification email resent — check your inbox')
        } catch {
            setError({ text: 'Failed to resend — try again' })
        }
    }

    const switchMode = (m) => { setMode(m); setError(null); setSuccess('') }

    return (
        <div className="w-full min-h-screen bg-white flex">

            {/* ── Left panel ─────────────────────────────────────────────── */}
            <div className="hidden lg:flex w-1/2 bg-stone-900 flex-col justify-between p-12 xl:p-16 relative overflow-hidden flex-shrink-0">
                {/* subtle grid */}
                <div className="absolute inset-0 opacity-[0.07]"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)',
                        backgroundSize: '32px 32px'
                    }}
                />

                {/* top: wordmark */}
                <div className="relative z-10 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-black">C</span>
                    <span className="text-white text-sm font-black">CivicVoice</span>
                </div>

                {/* middle: copy */}
                <div className="relative z-10">
                    {/* issue lifecycle preview */}
                    <div className="flex items-center gap-2 mb-8">
                        {[
                            { label: 'Open', dot: 'bg-red-400', pill: 'bg-red-900/40 text-red-300' },
                            { label: 'In Progress', dot: 'bg-amber-400', pill: 'bg-amber-900/40 text-amber-300' },
                            { label: 'Resolved', dot: 'bg-green-400', pill: 'bg-green-900/40 text-green-300' },
                        ].map((s, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${s.pill}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                                    {s.label}
                                </span>
                                {i < 2 && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-stone-600"><path d="M5 12h14M12 5l7 7-7 7" /></svg>}
                            </div>
                        ))}
                    </div>

                    <h2 className="text-3xl xl:text-4xl font-black text-white leading-tight tracking-tight mb-4">
                        Spot a problem.<br />
                        <span className="text-blue-400">Report it in 60s.</span><br />
                        Track until fixed.
                    </h2>
                    <p className="text-stone-400 text-sm leading-relaxed max-w-xs">
                        Pin issues to the map, let your neighbours upvote, and watch the admin team close them one by one.
                    </p>
                </div>

                {/* bottom: sample issue card */}
                <div className="relative z-10">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                        <div className="flex items-start justify-between gap-3 mb-2">
                            <div>
                                <p className="text-xs font-bold text-white/80 mb-0.5">Deep pothole near school gate</p>
                                <p className="text-[11px] text-stone-500">Roads · 34 upvotes · 2h ago</p>
                            </div>
                            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-900/40 text-amber-300 flex-shrink-0">
                                In Progress
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></svg>
                            MG Road, Sector 4
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Right form panel ────────────────────────────────────────── */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-5 sm:px-8 py-12 min-h-screen">

                <div className="w-full max-w-sm">

                    {/* Mobile logo */}
                    <div className="flex items-center gap-2 mb-10 lg:hidden">
                        <span className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-black">C</span>
                        <span className="text-stone-900 text-sm font-black">CivicVoice</span>
                    </div>

                    <div className="mb-7">
                        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight mb-1">
                            {mode === 'login' ? 'Welcome back' : 'Create account'}
                        </h1>
                        <p className="text-sm text-stone-400">
                            {mode === 'login'
                                ? 'Sign in to report and track civic issues.'
                                : 'Join to report issues in your neighbourhood.'}
                        </p>
                    </div>

                    {/* Tab toggle */}
                    <div className="flex bg-stone-100 rounded-xl p-1 mb-7">
                        {['login', 'register'].map(m => (
                            <button key={m} onClick={() => switchMode(m)}
                                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${mode === m ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}>
                                {m === 'login' ? 'Sign in' : 'Register'}
                            </button>
                        ))}
                    </div>

                    {/* Fields */}
                    <div className="space-y-4">
                        {mode === 'register' && (
                            <div>
                                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">Full name</label>
                                <input
                                    type="text"
                                    placeholder="Your name"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 placeholder-stone-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">Email</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 placeholder-stone-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider">Password</label>
                                {mode === 'login' && (
                                    <Link to="/forgot-password" className="text-xs text-stone-400 hover:text-blue-600 transition-colors font-medium">
                                        Forgot password?
                                    </Link>
                                )}
                            </div>
                            <div className="relative">
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                    onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 placeholder-stone-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all pr-16"
                                />
                                <button type="button" onClick={() => setShowPass(p => !p)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-stone-400 hover:text-stone-600 transition-colors tracking-wider">
                                    {showPass ? 'HIDE' : 'SHOW'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Success */}
                    {success && (
                        <div className="mt-4 flex items-start gap-2.5 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-500 flex-shrink-0 mt-0.5"><path d="M20 6L9 17l-5-5" /></svg>
                            <p className="text-sm text-green-700">{success}</p>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="mt-4 flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-red-500 flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
                            <div className="text-sm text-red-600">
                                <p>{error.text}</p>
                                {error.unverified && (
                                    <button onClick={handleResend}
                                        className="mt-1 underline font-semibold hover:text-red-800 transition-colors">
                                        Resend verification email
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Submit */}
                    <button onClick={handleSubmit} disabled={loading}
                        className="w-full mt-6 py-3.5 bg-stone-900 text-white text-sm font-bold rounded-xl hover:bg-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md hover:-translate-y-0.5 disabled:hover:translate-y-0 flex items-center justify-center gap-2">
                        {loading
                            ? <>
                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
                                Please wait…
                            </>
                            : mode === 'login' ? 'Sign in →' : 'Create account →'
                        }
                    </button>

                    <p className="text-center text-sm text-stone-400 mt-5">
                        {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                        <button onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
                            className="text-stone-900 font-bold hover:text-blue-600 transition-colors">
                            {mode === 'login' ? 'Register' : 'Sign in'}
                        </button>
                    </p>

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