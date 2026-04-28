'use client'

import Link from 'next/link'
import { Clock, Users, ChevronRight, Recycle, Sparkles, Leaf, DollarSign, Heart } from 'lucide-react'
import { CardShell } from './shared/CardShell'
import { useDashboardStore } from '@/stores/dashboardStore'
import { cn } from '@/lib/utils'
import type { TonightState } from '@/lib/dashboard/types'

type Props = {
  state: TonightState
}

/** Map recipe tags to visual badges */
function getTagBadges(tags?: string[]) {
  if (!tags || tags.length === 0) return []
  const tagMap: Record<string, { label: string; icon: typeof Clock; color: string }> = {
    'quick': { label: 'Quick', icon: Clock, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
    'family-friendly': { label: 'Family', icon: Users, color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' },
    'budget': { label: 'Budget', icon: DollarSign, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
    'healthy': { label: 'Healthy', icon: Heart, color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' },
    'high-protein': { label: 'High Protein', icon: Leaf, color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
    'vegetarian': { label: 'Vegetarian', icon: Leaf, color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' },
  }
  return tags
    .map((t) => tagMap[t])
    .filter(Boolean)
    .slice(0, 3)
}

export function TonightCard({ state }: Props) {
  const regenerate = useDashboardStore((s) => s.regenerateTonight)
  const isRegenerating = useDashboardStore((s) => s.isRegeneratingTonight)

  // --- EMPTY STATE ---
  if (!state.recipe) {
    return (
      <CardShell
        ariaLabel="Tonight's dinner"
        className="p-8 md:p-10 min-h-[420px] flex flex-col items-center justify-center text-center bg-gradient-to-br from-[#FDF6F1] to-white dark:from-neutral-900 dark:to-neutral-950"
      >
        <div className="text-5xl mb-4" aria-hidden>
          🍽️
        </div>
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
          Let&rsquo;s plan your first dinner
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 max-w-sm mb-6">
          Tell us about your household and we&rsquo;ll have tonight&rsquo;s dinner ready in seconds.
        </p>
        <Link
          href="/onboarding"
          className="inline-flex items-center gap-2 bg-[#D97757] hover:bg-[#C86646] text-white font-medium rounded-full px-6 py-3 min-h-[48px] transition-colors"
        >
          Get started
          <ChevronRight className="w-4 h-4" />
        </Link>
      </CardShell>
    )
  }

  const { recipe, reason, usesLeftover } = state
  const badges = getTagBadges(recipe.tags)

  return (
    <CardShell ariaLabel="Tonight's dinner" className="flex flex-col min-h-[420px]">
      {/* Premium recipe card — no generic image, clean info-first design */}
      <div className="relative bg-gradient-to-br from-[#FDF6F1] to-white dark:from-neutral-900 dark:to-neutral-950 px-6 pt-6 pb-5 md:px-8 md:pt-8 md:pb-6">
        {/* Top row: Tonight badge + context badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D97757]/10 text-[#D97757] text-xs font-semibold px-3 py-1.5">
            <Sparkles className="w-3 h-3" />
            Tonight&rsquo;s Pick
          </span>
          {usesLeftover && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-medium px-3 py-1.5">
              <Recycle className="w-3 h-3" />
              Uses {usesLeftover.leftoverName}
            </span>
          )}
          {state.isFromPantry && !usesLeftover && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-medium px-3 py-1.5">
              From your fridge
            </span>
          )}
        </div>

        {/* Meal name */}
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-50 leading-tight">
          {recipe.name}
        </h2>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-neutral-600 dark:text-neutral-400">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {recipe.cookTimeMin} min
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            {recipe.servings} servings
          </span>
          <span className="capitalize">{recipe.difficulty}</span>
          <span className="font-medium text-neutral-800 dark:text-neutral-200">
            ~${recipe.costPerServing.toFixed(2)}/serving
          </span>
        </div>

        {/* Benefit tags */}
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {badges.map((badge, i) => {
              const Icon = badge.icon
              return (
                <span
                  key={i}
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full text-xs font-medium px-2.5 py-1',
                    badge.color
                  )}
                >
                  <Icon className="w-3 h-3" />
                  {badge.label}
                </span>
              )
            })}
          </div>
        )}

        {/* Regenerating overlay */}
        {isRegenerating && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-neutral-950/60 backdrop-blur-sm rounded-t-2xl">
            <div className="flex items-center gap-2 bg-white dark:bg-neutral-900 px-4 py-2 rounded-full shadow-lg">
              <div className="w-2 h-2 rounded-full bg-[#D97757] animate-pulse" />
              <span className="text-sm font-medium">Finding another…</span>
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 px-6 pb-6 md:px-8 md:pb-7 flex flex-col">
        {/* Reason */}
        <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
          <span className="font-medium text-neutral-800 dark:text-neutral-200">Why this?</span>{' '}
          {reason}
        </p>

        {/* CTAs — only Cook This + Show Another */}
        <div className="mt-auto pt-6 flex flex-col sm:flex-row gap-2.5">
          <Link
            href={`/meal/${recipe.id}`}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-[#D97757] hover:bg-[#C86646] text-white font-medium rounded-full px-5 py-3 min-h-[48px] transition-colors"
          >
            Cook this
            <ChevronRight className="w-4 h-4" />
          </Link>

          <button
            onClick={() => regenerate()}
            disabled={isRegenerating || state.alternativesAvailable === 0}
            className="inline-flex items-center justify-center gap-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100 font-medium rounded-full px-5 py-3 min-h-[48px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRegenerating ? 'Finding…' : 'Show another'}
          </button>
        </div>
      </div>
    </CardShell>
  )
}
