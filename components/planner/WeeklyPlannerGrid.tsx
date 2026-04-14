'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { DAY_LABELS, DAY_FULL, GROCERY_ICONS } from '@/lib/planner/types'
import type { SmartMealResult } from '@/lib/engine/types'
import {
  Clock,
  ChefHat,
  Users,
  DollarSign,
  RefreshCw,
  Loader2,
  ChevronDown,
  ChevronUp,
  Leaf,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// ── Cuisine visual map ────────────────────────────────────────

const CUISINE_STYLE: Record<string, { bg: string; emoji: string }> = {
  italian:       { bg: 'bg-rose-50 border-rose-200',          emoji: '🍝' },
  mexican:       { bg: 'bg-amber-50 border-amber-200',         emoji: '🌮' },
  asian:         { bg: 'bg-teal-50 border-teal-200',           emoji: '🥢' },
  american:      { bg: 'bg-orange-50 border-orange-200',       emoji: '🍔' },
  indian:        { bg: 'bg-orange-50 border-orange-200',       emoji: '🍛' },
  mediterranean: { bg: 'bg-sky-50 border-sky-200',              emoji: '🥗' },
  comfort:       { bg: 'bg-emerald-50 border-emerald-200',      emoji: '🫕' },
  global:        { bg: 'bg-violet-50 border-violet-200',        emoji: '🌏' },
}

function getStyle(cuisine?: string) {
  const key = (cuisine?.toLowerCase().split(' ')[0] ?? '')
  return CUISINE_STYLE[key] ?? CUISINE_STYLE.comfort
}

// ── Stage labels ──────────────────────────────────────────────

const STAGE_LABEL: Record<string, string> = {
  adult: '🧑 Adult',
  kid: '🧒 Kid',
  toddler: '🐣 Toddler',
  baby: '🍼 Baby',
}

// ── Meal card ─────────────────────────────────────────────────

interface MealDayCardProps {
  meal: SmartMealResult
  dayLabel: string
  date: string
  onRegenerate: () => void
  isRegenerating: boolean
}

function MealDayCard({ meal, dayLabel, date, onRegenerate, isRegenerating }: MealDayCardProps) {
  const [showVariations, setShowVariations] = useState(false)
  const [showIngredients, setShowIngredients] = useState(false)
  const style = getStyle(meal.cuisineType)
  const pantryItems = meal.ingredients.filter((i) => i.fromPantry)
  const toBuyItems = meal.ingredients.filter((i) => !i.fromPantry)

  return (
    <div className={cn('rounded-2xl border-2 overflow-hidden', style.bg)}>
      {/* Header */}
      <div className="flex items-start gap-3 p-4">
        <span className="text-4xl flex-shrink-0 leading-none mt-1">{getStyle(meal.cuisineType).emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Badge variant="secondary" className="text-xs font-medium">{dayLabel} · {date}</Badge>
            <Badge variant="outline" className="text-xs capitalize">{meal.cuisineType}</Badge>
            <Badge variant="outline" className="text-xs capitalize">{meal.difficulty}</Badge>
          </div>
          <h3 className="font-bold text-base leading-snug">{meal.title}</h3>
          <p className="text-muted-foreground text-sm mt-0.5 line-clamp-2">{meal.tagline}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="flex-shrink-0 h-8 w-8"
          onClick={onRegenerate}
          disabled={isRegenerating}
          title="Regenerate this day"
        >
          {isRegenerating
            ? <Loader2 className="h-4 w-4 animate-spin" />
            : <RefreshCw className="h-4 w-4" />
          }
        </Button>
      </div>

      {/* Stats row */}
      <div className="flex gap-4 px-4 pb-3 text-sm text-muted-foreground">
        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{meal.totalTime}m</span>
        <span className="flex items-center gap-1"><ChefHat className="h-3.5 w-3.5" />{meal.prepTime}m prep</span>
        <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{meal.servings} servings</span>
        {meal.estimatedCost > 0 && (
          <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" />${meal.estimatedCost.toFixed(2)}</span>
        )}
      </div>

      {/* Pantry usage hint */}
      {pantryItems.length > 0 && (
        <div className="flex items-center gap-1.5 px-4 pb-2 text-xs text-emerald-700 font-medium">
          <Leaf className="h-3 w-3" />
          Uses {pantryItems.length} pantry item{pantryItems.length > 1 ? 's' : ''}:{' '}
          {pantryItems.slice(0, 3).map((i) => i.name).join(', ')}
          {pantryItems.length > 3 && ` +${pantryItems.length - 3} more`}
        </div>
      )}

      {/* Toggle: Ingredients */}
      <div className="border-t border-current/10">
        <button
          onClick={() => setShowIngredients((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium hover:bg-black/5 transition-colors"
        >
          <span>{GROCERY_ICONS['produce']} {toBuyItems.length} ingredient{toBuyItems.length !== 1 ? 's' : ''} to buy</span>
          {showIngredients ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {showIngredients && (
          <div className="px-4 pb-3 flex flex-wrap gap-1.5">
            {toBuyItems.map((i, idx) => (
              <span key={idx} className="text-xs bg-white/70 border border-white/60 rounded-full px-2 py-0.5">
                {i.quantity} {i.unit} {i.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Toggle: Family variations */}
      {meal.variations && meal.variations.length > 0 && (
        <div className="border-t border-current/10">
          <button
            onClick={() => setShowVariations((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium hover:bg-black/5 transition-colors"
          >
            <span>👨‍👩‍👧 {meal.variations.length} family variation{meal.variations.length !== 1 ? 's' : ''}</span>
            {showVariations ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {showVariations && (
            <div className="px-4 pb-4 space-y-3">
              {meal.variations.map((v, idx) => (
                <div key={idx} className="rounded-xl bg-white/60 border border-white/80 p-3">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      {STAGE_LABEL[v.stage] ?? v.label}
                    </span>
                    <span className="font-medium text-sm">{v.title}</span>
                    {v.allergyWarnings.length > 0 && (
                      <Badge variant="destructive" className="text-xs">⚠ Allergy note</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{v.description}</p>
                  {v.modifications.length > 0 && (
                    <ul className="space-y-0.5">
                      {v.modifications.map((m, mi) => (
                        <li key={mi} className="text-xs flex gap-1.5">
                          <span className="text-primary flex-shrink-0">•</span>
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {v.safetyNotes.length > 0 && (
                    <div className="mt-2 text-xs text-amber-700 bg-amber-50 rounded-lg px-2 py-1.5">
                      {v.safetyNotes.join(' · ')}
                    </div>
                  )}
                  {v.textureNotes && (
                    <div className="mt-1 text-xs text-sky-700">Texture: {v.textureNotes}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Selection reason */}
      {meal.meta?.selectionReason && (
        <div className="border-t border-current/10 px-4 py-2 text-xs text-muted-foreground italic">
          {meal.meta.selectionReason}
        </div>
      )}
    </div>
  )
}

// ── Empty day slot ────────────────────────────────────────────

function EmptyDay({
  dayLabel,
  date,
  isGenerating,
}: {
  dayLabel: string
  date: string
  isGenerating: boolean
}) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-border/60 py-10 flex flex-col items-center text-center text-muted-foreground gap-2">
      {isGenerating ? (
        <>
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm font-medium">Generating {dayLabel}…</p>
        </>
      ) : (
        <>
          <span className="text-3xl">🍽️</span>
          <p className="text-sm font-medium">{dayLabel} · {date}</p>
          <p className="text-xs">No meal planned yet</p>
        </>
      )}
    </div>
  )
}

// ── Main grid ─────────────────────────────────────────────────

export interface WeeklyPlannerGridProps {
  days: Array<{ dayIndex: number; date: string; meal: SmartMealResult | null }>
  selectedDayIndex: number
  generatingDayIndex: number | null
  onSelectDay: (i: number) => void
  onRegenerate: (dayIndex: number) => void
}

export function WeeklyPlannerGrid({
  days,
  selectedDayIndex,
  generatingDayIndex,
  onSelectDay,
  onRegenerate,
}: WeeklyPlannerGridProps) {
  return (
    <div className="space-y-4">
      {/* Day tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {days.map((day) => {
          const today = new Date().toISOString().split('T')[0]
          const isToday = day.date === today
          const hasMeal = day.meal !== null
          return (
            <button
              key={day.dayIndex}
              type="button"
              onClick={() => onSelectDay(day.dayIndex)}
              className={cn(
                'flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-xl text-sm font-medium transition-colors border min-w-[52px]',
                selectedDayIndex === day.dayIndex
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'border-border/60 hover:border-primary/40 bg-card',
              )}
            >
              <span className="text-[10px] uppercase tracking-wide opacity-70">{DAY_LABELS[day.dayIndex]}</span>
              <span className={cn('text-base font-bold', isToday && selectedDayIndex !== day.dayIndex && 'text-primary')}>
                {new Date(day.date + 'T00:00:00').getDate()}
              </span>
              <span className={cn('w-1.5 h-1.5 rounded-full mt-0.5', hasMeal ? 'bg-emerald-400' : 'bg-transparent')} />
            </button>
          )
        })}
      </div>

      {/* Selected day */}
      {days[selectedDayIndex] && (() => {
        const day = days[selectedDayIndex]
        const dateLabel = new Date(day.date + 'T00:00:00').toLocaleDateString('en-US', {
          month: 'short', day: 'numeric',
        })
        return day.meal ? (
          <MealDayCard
            key={day.dayIndex}
            meal={day.meal}
            dayLabel={DAY_FULL[day.dayIndex]}
            date={dateLabel}
            onRegenerate={() => onRegenerate(day.dayIndex)}
            isRegenerating={generatingDayIndex === day.dayIndex}
          />
        ) : (
          <EmptyDay
            dayLabel={DAY_FULL[day.dayIndex]}
            date={dateLabel}
            isGenerating={generatingDayIndex === day.dayIndex}
          />
        )
      })()}
    </div>
  )
}
