import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function VerifySuccessPage() {
    const [params] = useSearchParams()
    const { login } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        const token = params.get('token')
        const name = params.get('name')
        if (token) {
            login(token, { name: decodeURIComponent(name) })
            setTimeout(() => navigate('/'), 2500)
        } else {
            navigate('/login')
        }
    }, [])

    return (
        <div style={{
            minHeight: 'calc(100vh - 48px)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', background: '#f8f9fa'
        }}>
            <div style={{
                textAlign: 'center', padding: '48px 40px', background: 'white',
                borderRadius: '12px', boxShadow: '0 2px 16px rgba(0,0,0,0.1)', maxWidth: '400px'
            }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>✅</div>
                <h2 style={{ color: '#1a1a2e', margin: '0 0 8px' }}>Email Verified!</h2>
                <p style={{ color: '#666', margin: '0 0 4px' }}>Your account is now active.</p>
                <p style={{ color: '#999', fontSize: '0.85rem' }}>Redirecting to the map...</p>
            </div>
        </div>
    )
}