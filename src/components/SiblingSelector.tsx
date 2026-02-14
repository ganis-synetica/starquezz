import { supabase } from '@/lib/supabase'
import type { Child } from '@/types'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type SiblingChild = Pick<Child, 'id' | 'name' | 'avatar' | 'stars'>

interface SiblingSelectorProps {
  currentChildId: string
  className?: string
}

export function SiblingSelector({ currentChildId, className = '' }: SiblingSelectorProps) {
  const navigate = useNavigate()
  const [siblings, setSiblings] = useState<SiblingChild[]>([])

  useEffect(() => {
    void (async () => {
      const { data } = await supabase
        .from('children')
        .select('id,name,avatar,stars')
        .order('created_at', { ascending: true })

      if (data && data.length > 1) {
        setSiblings(data as SiblingChild[])
      }
    })()
  }, [])

  // Don't show if there's only one child
  if (siblings.length <= 1) return null

  return (
    <div className={`flex justify-center gap-2 ${className}`}>
      {siblings.map((sibling) => (
        <button
          key={sibling.id}
          onClick={() => {
            if (sibling.id !== currentChildId) {
              navigate(`/child/${sibling.id}`)
            }
          }}
          className={`relative p-1 rounded-full transition-all ${
            sibling.id === currentChildId
              ? 'ring-4 ring-gold scale-110'
              : 'opacity-60 hover:opacity-100 hover:scale-105'
          }`}
          title={sibling.name}
        >
          <span className="text-3xl">{sibling.avatar || '🧒'}</span>
          {sibling.id !== currentChildId && (
            <span className="absolute -bottom-1 -right-1 text-xs bg-gold text-charcoal font-bold px-1 rounded-full">
              {sibling.stars}⭐
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
