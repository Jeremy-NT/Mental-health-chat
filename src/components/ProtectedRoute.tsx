import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: '#f7f5f0',
        fontFamily: 'DM Sans, Segoe UI, sans-serif', color: '#2d6a4f',
        fontSize: '1rem', gap: '0.75rem'
      }}>
        <div style={{
          width: 20, height: 20, border: '2px solid #d8f3dc',
          borderTop: '2px solid #2d6a4f', borderRadius: '50%',
          animation: 'spin 0.7s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        Loading...
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  return <>{children}</>
}
