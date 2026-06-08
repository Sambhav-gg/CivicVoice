import { useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

  .cvnav {
    --ink: #0f1117;
    --ink2: #3a3d4a;
    --ink3: #7a7f94;
    --bg: #f5f4f0;
    --accent: #2563eb;
    --white: #ffffff;
    --border: rgba(15,17,23,0.10);
    --red: #e63946;

    position: fixed; top: 0; left: 0; right: 0; z-index: 200;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 3rem; height: 60px;
    background: rgba(245,244,240,0.92);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border);
    font-family: 'DM Sans', sans-serif;
  }

  .cvnav-logo {
    font-family: 'Syne', sans-serif;
    font-weight: 800; font-size: 1.1rem;
    color: var(--ink); letter-spacing: -0.5px;
    display: flex; align-items: center; gap: 7px;
    text-decoration: none; flex-shrink: 0;
  }
  .cvnav-logo-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--accent); flex-shrink: 0;
  }

  .cvnav-links {
    display: flex; align-items: center; gap: 0.25rem;
  }

  .cvnav-link {
    font-size: 0.875rem; color: var(--ink2); text-decoration: none;
    font-weight: 400; padding: 0.35rem 0.75rem; border-radius: 6px;
    transition: all 0.15s; white-space: nowrap;
  }
  .cvnav-link:hover { color: var(--ink); background: rgba(15,17,23,0.05); }
  .cvnav-link.active { color: var(--ink); font-weight: 500; }

  .cvnav-link-admin {
    font-size: 0.875rem; color: var(--red); text-decoration: none;
    font-weight: 500; padding: 0.35rem 0.75rem; border-radius: 6px;
    transition: all 0.15s;
  }
  .cvnav-link-admin:hover { background: rgba(230,57,70,0.08); }

  .cvnav-divider {
    width: 1px; height: 18px; background: var(--border);
    margin: 0 0.5rem; flex-shrink: 0;
  }

  .cvnav-user {
    font-size: 0.8rem; color: var(--ink3); font-weight: 400;
    padding: 0.35rem 0.5rem; max-width: 120px;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }

  .cvnav-btn-ghost {
    background: none; border: 1px solid var(--border);
    color: var(--ink2); padding: 0.35rem 0.9rem;
    border-radius: 6px; font-size: 0.875rem; font-weight: 400;
    cursor: pointer; transition: all 0.15s;
    font-family: 'DM Sans', sans-serif;
    white-space: nowrap;
  }
  .cvnav-btn-ghost:hover { border-color: rgba(15,17,23,0.25); color: var(--ink); background: rgba(15,17,23,0.04); }

  .cvnav-btn-primary {
    background: var(--ink); color: var(--white);
    padding: 0.4rem 1.1rem; border-radius: 999px;
    font-size: 0.875rem; font-weight: 500;
    text-decoration: none; transition: all 0.15s;
    white-space: nowrap; font-family: 'DM Sans', sans-serif;
    border: none; cursor: pointer;
  }
  .cvnav-btn-primary:hover { background: var(--accent); }

  .cvnav-spacer { flex: 1; }

  /* push page content below fixed nav */
  .cvnav-offset { height: 60px; }

  @media (max-width: 640px) {
    .cvnav { padding: 0 1.25rem; }
    .cvnav-user { display: none; }
    .cvnav-link-label { display: none; }
  }
`

export default function Navbar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const injected = useRef(false)

    useEffect(() => {
        if (!injected.current && !document.getElementById('cvnav-styles')) {
            const tag = document.createElement('style')
            tag.id = 'cvnav-styles'
            tag.textContent = navStyles
            document.head.appendChild(tag)
            injected.current = true
        }
    }, [])

    const handleLogout = () => { logout(); navigate('/login') }
    const isActive = (path) => location.pathname === path ? 'cvnav-link active' : 'cvnav-link'

    return (
        <>
            <nav className="cvnav">
                <Link to="/" className="cvnav-logo">
                    <span className="cvnav-logo-dot" />
                    CivicVoice
                </Link>

                <div className="cvnav-spacer" />

                <div className="cvnav-links">
                    <Link to="/map" className={isActive('/map')}>Map</Link>

                    {user ? (
                        <>
                            <Link to="/report" className={isActive('/report')}>Report issue</Link>
                            {user.role === 'admin' && (
                                <Link to="/admin" className="cvnav-link-admin">Admin</Link>
                            )}
                            <div className="cvnav-divider" />
                            <span className="cvnav-user">{user.name}</span>
                            <button className="cvnav-btn-ghost" onClick={handleLogout}>Logout</button>
                        </>
                    ) : (
                        <>
                            <div className="cvnav-divider" />
                            <Link to="/login" className="cvnav-btn-primary">Get started</Link>
                        </>
                    )}
                </div>
            </nav>
            <div className="cvnav-offset" />
        </>
    )
}