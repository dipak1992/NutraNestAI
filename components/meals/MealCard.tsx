'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, ChevronDown, ChevronUp, Clock, Users } from 'lucide-react'
import type { Meal } from '@/types'
import { cn } from '@/lib/utils'

interface MealCardProps {
  meal: Meal
  onRegenerate?: (mealId: string) => void
  isRegenerating?: boolean
  compact?: boolean
}

export function MealCard({ meal, onRegenerate, isRegenerating, compact }: MealCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={cn('glass-card rounded-xl border border-border/60 hover:border-primary/25 transition-colors', compact ? 'p-3' : 'p-5')}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <Badge variant="secondary" className="text-xs capitalize">{meal.meal_type}</Badge>
            {meal.prep_time_minutes && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" />{meal.prep_time_minutes} min</span>
            )}
          </div>
          <h3 className={cn('font-semibold leading-snug', compact ? 'text-sm' : 'text-base')}>{meal.name}</h3>
          {!compact && meal.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{meal.description}</p>}
        </div>
        {onRegenerate && (
          <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" disabled={isRegenerating} onClick={() => onRegenerate(meal.id)}><RefreshCw className={cn('h-3.5 w-3.5', isRegenerating && 'animate-spin')} /></Button>
        )}
      </div>
      {!compact && meal.variations && meal.variations.length > 0 && (
        <div className="mt-3">
          <button type="button" onClick={() => setExpanded(!expanded)} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <Users className="h-3.5 w-3.5" />
            {meal.variations.length} member variation{meal.variations.length !== 1 ? 's' : ''}
            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
          {expanded && (
            <div className="mt-2 space-y-1.5">
              {meal.variations.map((v) => (
                <div key={v.id} className="text-xs rounded-lg bg-muted/50 px-3 py-2">
                  <span className="font-medium">{v.member_name}</span>
                  {v.modifications && v.modifications.length > 0 && (
                    <p className="text-muted-foreground mt-0.5">{v.modifications.join(' · ')}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
