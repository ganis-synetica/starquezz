import { createContext, useContext, useEffect, useMemo, useState } from 'react'

type ChildSession = {
  childId: string
  expiresAt: number
}

type ChildContextValue = {
  childId: string | null
  isChildAuthed: boolean
  loginChild: (childId: string) => void
  logoutChild: () => void
}

const STORAGE_KEY = 'starquezz.child_session'
const SESSION_MS = 12 * 60 * 60 * 1000

const ChildContext = createContext<ChildContextValue | undefined>(undefined)

export function ChildProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<ChildSession | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return

    try {
      const parsed = JSON.parse(raw) as ChildSession
      if (typeof parsed.childId !== 'string' || typeof parsed.expiresAt !== 'number') return
      if (Date.now() > parsed.expiresAt) {
        localStorage.removeItem(STORAGE_KEY)
        return
      }
      setSession(parsed)
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  const value = useMemo<ChildContextValue>(() => {
    const loginChild = (childId: string) => {
      const next: ChildSession = { childId, expiresAt: Date.now() + SESSION_MS }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      setSession(next)
    }

    const logoutChild = () => {
      localStorage.removeItem(STORAGE_KEY)
      setSession(null)
    }

    return {
      childId: session?.childId ?? null,
      isChildAuthed: Boolean(session && Date.now() <= session.expiresAt),
      loginChild,
      logoutChild,
    }
  }, [session])

  return <ChildContext.Provider value={value}>{children}</ChildContext.Provider>
}

export function useChildSession() {
  const ctx = useContext(ChildContext)
  if (!ctx) throw new Error('useChildSession must be used within a ChildProvider')
  return ctx
}

