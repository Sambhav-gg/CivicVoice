import { useState, useEffect } from 'react'
import { getIssues, updateStatus } from '../api/issues'

const statusColors = {
    open: { bg: '#fff3cd', color: '#856404' },
    in_progress: { bg: '#cce5ff', color: '#004085' },
    resolved: { bg: '#d4edda', color: '#155724' },
}

export default function AdminPage() {
    const [issues, setIssues] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')
    const [updating, setUpdating] = useState(null) // issue id being updated

    const fetchIssues = async () => {
        setLoading(true)
        try {
            const params = filter !== 'all' ? { status: filter } : {}
            const res = await getIssues(params)
            console.log("SETTING ISSUES:", res.data)
            setIssues(res.data.issues)
        } catch (err) {
            console.error('Failed to fetch issues', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchIssues() }, [filter])

    const handleStatusChange = async (id, status) => {
        setUpdating(id)
        try {
            await updateStatus(id, status)
            setIssues(prev => prev.map(i => i.id === id ? { ...i, status } : i))
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update status')
        } finally {
            setUpdating(null)
        }
    }

    return (
        <div style={{ padding: '24px', maxWidth: '1100px', margin: '0 auto' }}>

            <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: '24px'
            }}>
                <h2 style={{ margin: 0, color: '#1a1a2e' }}>🛠 Admin Dashboard</h2>
                <span style={{ color: '#666', fontSize: '0.9rem' }}>{issues.length} issues</span>
            </div>

            {/* Status filter tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                {['all', 'open', 'in_progress', 'resolved'].map(s => (
                    <button key={s} onClick={() => setFilter(s)} style={{
                        padding: '6px 16px', borderRadius: '20px', border: 'none',
                        cursor: 'pointer', fontWeight: filter === s ? 600 : 400,
                        background: filter === s ? '#1a1a2e' : '#dee2e6',
                        color: filter === s ? 'white' : '#333', fontSize: '0.9rem'
                    }}>{s.replace('_', ' ')}</button>
                ))}
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>Loading...</div>
            ) : issues.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>No issues found</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {issues.map(issue => (
                        <div key={issue.id} style={{
                            background: 'white', borderRadius: '10px', padding: '16px 20px',
                            boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            borderLeft: `4px solid ${statusColors[issue.status]?.bg || '#dee2e6'}`
                        }}>
                            {/* Left — issue info */}
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                                    <span style={{ fontWeight: 600, fontSize: '1rem' }}>#{issue.id} {issue.title}</span>
                                    <span style={{
                                        padding: '2px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600,
                                        background: statusColors[issue.status]?.bg,
                                        color: statusColors[issue.status]?.color
                                    }}>{issue.status.replace('_', ' ')}</span>
                                    <span style={{
                                        padding: '2px 10px', borderRadius: '12px', fontSize: '0.75rem',
                                        background: '#f0f0f0', color: '#555'
                                    }}>{issue.category}</span>
                                </div>
                                <div style={{ fontSize: '0.85rem', color: '#666' }}>
                                    📍 {issue.address} &nbsp;•&nbsp;
                                    👍 {issue.upvotes} upvotes &nbsp;•&nbsp;
                                    🕐 {new Date(issue.created_at).toLocaleDateString()}
                                </div>
                            </div>

                            {/* Right — status changer */}
                            <select
                                value={issue.status}
                                disabled={updating === issue.id}
                                onChange={e => handleStatusChange(issue.id, e.target.value)}
                                style={{
                                    padding: '8px 12px', borderRadius: '6px', border: '1px solid #ced4da',
                                    fontSize: '0.9rem', cursor: 'pointer', marginLeft: '16px',
                                    opacity: updating === issue.id ? 0.5 : 1
                                }}
                            >
                                <option value="open">Open</option>
                                <option value="in_progress">In Progress</option>
                                <option value="resolved">Resolved</option>
                            </select>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}