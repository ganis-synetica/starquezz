import { useChildSession } from '@/contexts/ChildContext'
import { Navigate } from 'react-router-dom'

export function ChildProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isChildAuthed } = useChildSession()

  if (!isChildAuthed) return <Navigate to="/" replace />
  return <>{children}</>
}

