import { useAuth } from '@/contexts/AuthContext'
import { Navigate } from 'react-router-dom'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { status } = useAuth()

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-card border-4 border-charcoal shadow-[6px_6px_0px_0px_rgba(74,68,83,0.6)] rounded-xl p-6">
          <p className="text-xl font-black text-charcoal">Loading your parent portal...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

