import { useAuth } from '@/contexts/AuthContext'
import { checkParentPinSession } from '@/pages/ParentPinEntry'
import { Navigate } from 'react-router-dom'

export function ParentPinProtectedRoute({ children }: { children: React.ReactNode }) {
  const { status } = useAuth()

  // Wait for auth to load
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-bold">Loading...</p>
      </div>
    )
  }

  // Not logged in
  if (status !== 'authenticated') {
    return <Navigate to="/login" replace />
  }

  // Check PIN session
  if (!checkParentPinSession()) {
    return <Navigate to="/parent/pin" replace />
  }

  return <>{children}</>
}
