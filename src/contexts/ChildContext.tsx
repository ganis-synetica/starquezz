import { createContext, useContext, useMemo, useState } from 'react'

type ChildContextValue = {
  childId: string | null
  setActiveChild: (childId: string | null) => void
}

const ChildContext = createContext<ChildContextValue | undefined>(undefined)

export function ChildProvider({ children }: { children: React.ReactNode }) {
  const [childId, setChildId] = useState<string | null>(null)

  const value = useMemo<ChildContextValue>(() => ({
    childId,
    setActiveChild: setChildId,
  }), [childId])

  return <ChildContext.Provider value={value}>{children}</ChildContext.Provider>
}

export function useChildSession() {
  const ctx = useContext(ChildContext)
  if (!ctx) throw new Error('useChildSession must be used within a ChildProvider')
  return ctx
}
