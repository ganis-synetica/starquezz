import { useParams, Navigate } from 'react-router-dom'
import { useChildSession } from '@/contexts/ChildContext'
import { useEffect } from 'react'

export function ChildProtectedRoute({ children }: { children: React.ReactNode }) {
  const { id } = useParams()
  const { setActiveChild } = useChildSession()

  // Set active child when route is accessed
  useEffect(() => {
    if (id) {
      setActiveChild(id)
    }
    return () => setActiveChild(null)
  }, [id, setActiveChild])

  // If no child ID in URL, redirect home
  if (!id) return <Navigate to="/" replace />
  
  return <>{children}</>
}
