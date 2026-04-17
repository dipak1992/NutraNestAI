'use client'

import { motion } from 'framer-motion'
import type { ZeroCookMeal } from '@/lib/zero-cook/types'
import { getProviderLinks } from '@/lib/zero-cook/providers'
import { ProviderButtons } from './ProviderButtons'
import { Badge } from '@/components/ui/badge'

interface ZeroCookMealCardProps {
  meal: ZeroCookMeal
  index: number
  onProviderSelect: (provider: string, meal: ZeroCookMeal, url: string) => void
}

export function ZeroCookMealCard({ meal, index, onProviderSelect }: ZeroCookMealCardProps) {
  const links = getProviderLinks(meal.searchQuery)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="rounded-2xl border bg-card p-4 space-y-3"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <h3 className="font-semibold text-base leading-tight">{meal.name}</h3>
          <p className="text-sm text-muted-foreground">{meal.reason}</p>
        </div>
        <Badge variant="secondary" className="shrink-0 text-xs">
          {meal.popularityLabel}
        </Badge>
      </div>

      {/* Meta row */}
      <div className="flex gap-3 text-xs text-muted-foreground">
        <span>⏱ {meal.etaRange}</span>
        <span>💰 {meal.priceRange}</span>
        <span className="capitalize">🍽 {meal.cuisineType}</span>
      </div>

      {/* Provider buttons */}
      <ProviderButtons
        links={links}
        onSelect={(provider, url) => onProviderSelect(provider, meal, url)}
      />
    </motion.div>
  )
}
