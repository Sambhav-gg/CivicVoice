import { useState } from 'react'
import { Link } from 'react-router-dom'
import { forgotPassword } from '../api/auth'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState('')
    const [error, setError] = useState(null)

    const handleSubmit = async () => {
        if (!email) return setError({ text: 'Email is required' })
        setError(null)
        setSuccess('')
        setLoading(true)
        try {
            await forgotPassword({ email })
            setSuccess('If that email exists, a reset link has been sent. Check your inbox.')
        } catch {
            setError({ text: 'Something went wrong — please try again' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full min-h-screen bg-stone-50 flex">

            {/* ── Left panel ── */}
            <div className="hidden lg:flex w-1/2 bg-stone-900 flex-col justify-between p-14 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.15) 1px,transparent 1px)',
                        backgroundSize: '32px 32px'
                    }}
                />
                <Link to="/" className="relative z-10 flex items-center gap-2 text-white text-sm font-black">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    CivicVoice
                </Link>
                <div className="relative z-10">
                    <h2 className="text-4xl font-black text-white leading-tight tracking-tight mb-4">
                        Forgot your<br />
                        <span className="text-blue-400">password?</span>
                    </h2>
                    <p className="text-stone-400 text-sm leading-relaxed max-w-xs font-light">
                        No worries — enter your email and we'll send you a reset link valid for 10 minutes.
                    </p>
                </div>
                <div className="relative z-10 grid grid-cols-3 gap-3">
                    {[{ n: 'PostGIS', l: 'Geo queries' }, { n: 'Redis', l: '30s cache' }, { n: 'BullMQ', l: 'Async jobs' }].map(s => (
                        <div key={s.n} className="border border-white/10 rounded-xl px-4 py-3 bg-white/5">
                            <div className="text-xs font-bold text-white">{s.n}</div>
                            <div className="text-[10px] text-stone-500 mt-0.5">{s.l}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Right form panel ── */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 py-16">

                <Link to="/" className="lg:hidden flex items-center gap-2 text-stone-900 text-sm font-black mb-10">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    CivicVoice
                </Link>

                <div className="w-full max-w-sm">
                    <div className="mb-8">
                        <h1 className="text-3xl font-black text-stone-900 tracking-tight mb-1">Reset password</h1>
                        <p className="text-sm text-stone-400 font-light">
                            Enter your account email and we'll send a reset link.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Email</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                                className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm text-stone-900 placeholder-stone-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                            />
                        </div>
                    </div>

                    {success && (
                        <div className="mt-4 flex items-start gap-2.5 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                            <span className="text-green-500 text-sm mt-0.5">✓</span>
                            <p className="text-sm text-green-700">{success}</p>
                        </div>
                    )}

                    {error && (
                        <div className="mt-4 flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                            <span className="text-red-500 text-sm mt-0.5">⚠</span>
                            <p className="text-sm text-red-600">{error.text}</p>
                        </div>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={loading || !!success}
                        className="w-full mt-6 py-3.5 bg-stone-900 text-white text-sm font-bold rounded-xl hover:bg-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md hover:-translate-y-0.5 disabled:hover:translate-y-0">
                        {loading
                            ? <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
                                Sending…
                            </span>
                            : 'Send reset link →'
                        }
                    </button>

                    <p className="text-center text-sm text-stone-400 mt-6">
                        Remembered it?{' '}
                        <Link to="/login" className="text-stone-900 font-bold hover:text-blue-600 transition-colors">
                            Sign in
                        </Link>
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