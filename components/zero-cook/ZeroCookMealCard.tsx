'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import type { ZeroCookMeal } from '@/lib/zero-cook/types'
import { getProviderLinks } from '@/lib/zero-cook/providers'
import { ProviderButtons, openProviderLink } from './ProviderButtons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface ZeroCookMealCardProps {
  meal: ZeroCookMeal
  index: number
  countryCode?: string
  onProviderSelect: (provider: string, meal: ZeroCookMeal, url: string, source: 'primary' | 'more') => void
  onSave?: (meal: ZeroCookMeal) => void
}

export function ZeroCookMealCard({ meal, index, countryCode, onProviderSelect, onSave }: ZeroCookMealCardProps) {
  const [showMoreProviders, setShowMoreProviders] = useState(false)
  const links = useMemo(() => getProviderLinks(meal.searchQuery, countryCode), [meal.searchQuery, countryCode])
  const primaryLink = links.find((l) => l.provider === meal.bestProvider) ?? links[0]

  const secondaryLabel = meal.secondaryActionLabel || 'See More'

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

      <div className="grid grid-cols-2 gap-2">
        <Button
          size="sm"
          className="w-full"
          onClick={() => {
            if (!primaryLink) return
            openProviderLink(primaryLink, (provider, url) =>
              onProviderSelect(provider, meal, url, 'primary'),
            )
          }}
        >
          {meal.primaryActionLabel || 'Order Now'}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="w-full"
          onClick={() => setShowMoreProviders((v) => !v)}
        >
          {showMoreProviders ? 'Hide Options' : secondaryLabel}
        </Button>
      </div>

      {onSave ? (
        <Button
          size="sm"
          variant="secondary"
          className="w-full"
          onClick={() => onSave(meal)}
        >
          Save meal
        </Button>
      ) : null}

      {showMoreProviders ? (
        <ProviderButtons
          links={links}
          onSelect={(provider, url) => onProviderSelect(provider, meal, url, 'more')}
        />
      ) : null}
    </motion.div>
  )
}
