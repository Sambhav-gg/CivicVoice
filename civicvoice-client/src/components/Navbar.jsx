import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/login'); setMenuOpen(false) }
  const isActive = (path) => location.pathname === path

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[200] bg-white/90 backdrop-blur-md border-b border-stone-100 h-14">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-full flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-black text-sm text-stone-900 flex-shrink-0">
            <span className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-black">C</span>
            CivicVoice
          </Link>

          {/* Desktop links */}
          <div className="hidden sm:flex items-center gap-1">
            <Link to="/map"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isActive('/map') ? 'text-stone-900 bg-stone-100' : 'text-stone-500 hover:text-stone-900 hover:bg-stone-50'}`}>
              Map
            </Link>

            {user ? (
              <>
                <Link to="/report"
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isActive('/report') ? 'text-stone-900 bg-stone-100' : 'text-stone-500 hover:text-stone-900 hover:bg-stone-50'}`}>
                  Report issue
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin"
                    className="px-3 py-1.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
                    Admin
                  </Link>
                )}
                <div className="w-px h-4 bg-stone-200 mx-1" />
                <span className="text-xs text-stone-400 max-w-[100px] truncate px-1">{user.name}</span>
                <button onClick={handleLogout}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-stone-500 hover:text-stone-900 hover:bg-stone-50 border border-stone-200 hover:border-stone-300 transition-all">
                  Logout
                </button>
              </>
            ) : (
              <>
                <div className="w-px h-4 bg-stone-200 mx-1" />
                <Link to="/login"
                  className="bg-stone-900 text-white text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-blue-600 transition-colors">
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile: right side */}
          <div className="flex sm:hidden items-center gap-2">
            {!user && (
              <Link to="/login" className="bg-blue-600 text-white text-xs font-semibold px-3.5 py-1.5 rounded-full">
                Get started
              </Link>
            )}
            <button onClick={() => setMenuOpen(o => !o)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-500 hover:bg-stone-100 transition-colors">
              {menuOpen
                ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
                : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
              }
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {menuOpen && (
          <div className="sm:hidden bg-white border-t border-stone-100 px-5 py-3 flex flex-col gap-1 shadow-lg">
            <Link to="/map" onClick={() => setMenuOpen(false)}
              className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive('/map') ? 'bg-stone-100 text-stone-900' : 'text-stone-600 hover:bg-stone-50'}`}>
              Map
            </Link>
            {user ? (
              <>
                <Link to="/report" onClick={() => setMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive('/report') ? 'bg-stone-100 text-stone-900' : 'text-stone-600 hover:bg-stone-50'}`}>
                  Report issue
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" onClick={() => setMenuOpen(false)}
                    className="px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
                    Admin
                  </Link>
                )}
                <div className="border-t border-stone-100 mt-1 pt-2 flex items-center justify-between">
                  <span className="text-xs text-stone-400 px-3">{user.name}</span>
                  <button onClick={handleLogout}
                    className="px-3 py-2 text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors">
                Log in
              </Link>
            )}
          </div>
        )}
      </nav>
      {/* offset */}
      <div className="h-14" />
    </>
  )
}