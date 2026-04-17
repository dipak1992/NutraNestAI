'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, ChefHat, Users, ShieldCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { SmartMealResult, SmartVariation } from '@/lib/engine/types'

function MemberVariation({ variation }: { variation: SmartVariation }) {
  const stageColors: Record<string, string> = {
    baby: 'bg-purple-100 text-purple-700',
    toddler: 'bg-amber-100 text-amber-700',
    kid: 'bg-emerald-100 text-emerald-700',
    teen: 'bg-cyan-100 text-cyan-700',
    adult: 'bg-blue-100 text-blue-700',
    senior: 'bg-slate-100 text-slate-700',
    pregnant: 'bg-pink-100 text-pink-700',
    breastfeeding: 'bg-rose-100 text-rose-700',
  }
  const colorClass = stageColors[variation.stage] ?? 'bg-gray-100 text-gray-700'
  return (
    <div className="rounded-xl border border-border/60 bg-white p-5 space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-lg">{variation.emoji}</span>
        <span className="font-semibold">{variation.label}</span>
        <Badge className={`${colorClass} border-0 text-xs capitalize`}>{variation.stage}</Badge>
        {variation.allergyWarnings.length === 0 && (
          <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs">
            <ShieldCheck className="h-3 w-3 mr-1" />Safe
          </Badge>
        )}
      </div>
      {variation.description && <p className="text-sm text-muted-foreground">{variation.description}</p>}
      {variation.modifications && variation.modifications.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1.5">Modifications:</p>
          <ul className="space-y-1">
            {variation.modifications.map((mod, i) => <li key={i} className="text-sm">• {mod}</li>)}
          </ul>
        </div>
      )}
      {variation.allergyWarnings.length > 0 && (
        <p className="text-xs text-amber-600">⚠️ {variation.allergyWarnings.join(', ')}</p>
      )}
      {variation.safetyNotes.length > 0 && (
        <p className="text-xs text-blue-600 mt-0.5">💊 {variation.safetyNotes.join(', ')}</p>
      )}
    </div>
  )
}

export default function TonightRecipePage() {
  const router = useRouter()
  const [meal, setMeal] = useState<SmartMealResult | null>(null)

  useEffect(() => {
    const raw = sessionStorage.getItem('tonight-meal')
    if (raw) {
      try {
        setMeal(JSON.parse(raw) as SmartMealResult)
      } catch {
        router.replace('/tonight')
      }
    } else {
      router.replace('/tonight')
    }
  }, [router])

  if (!meal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading recipe…</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/40 to-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/tonight"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tonight&apos;s Pick
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {meal.difficulty && <Badge variant="secondary" className="capitalize">{meal.difficulty}</Badge>}
            {meal.cuisineType && <Badge variant="outline" className="capitalize">{meal.cuisineType}</Badge>}
            {meal.tags?.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
            ))}
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{meal.title}</h1>
          {meal.tagline && <p className="text-muted-foreground mt-1">{meal.tagline}</p>}
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
            {meal.totalTime && (
              <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {meal.totalTime} min</span>
            )}
            {meal.servings && (
              <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {meal.servings} servings</span>
            )}
            {meal.estimatedCost != null && (
              <span className="flex items-center gap-1">~${meal.estimatedCost.toFixed(2)}</span>
            )}
          </div>
        </div>

        {/* Meal image */}
        <div className="relative w-full h-64 rounded-2xl overflow-hidden mb-8 bg-muted">
          <img
            src={`https://source.unsplash.com/800x400/?${encodeURIComponent(meal.title)},food`}
            alt={meal.title}
            className="w-full h-full object-cover"
          />
        </div>

        {meal.description && (
          <p className="text-foreground/80 leading-relaxed mb-8">{meal.description}</p>
        )}

        {/* Ingredients */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <ChefHat className="h-5 w-5 text-emerald-600" />
            Ingredients
          </h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {meal.ingredients.map((ing, i) => (
              <div key={i} className="flex items-start gap-2 rounded-lg bg-white border border-border/60 px-4 py-2.5">
                <span className="text-emerald-600 mt-0.5">•</span>
                <span className="text-sm">
                  <span className="font-medium">{ing.quantity} {ing.unit}</span>{' '}
                  {ing.name}
                  {ing.note && <span className="text-muted-foreground ml-1">({ing.note})</span>}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Steps */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <ol className="space-y-4">
            {meal.steps.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </span>
                <div className="pt-1">
                  <p className="text-sm leading-relaxed">{step}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Leftover tip */}
        {meal.leftoverTip && (
          <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 mb-8">
            <p className="text-sm text-blue-900">🥡 <span className="font-semibold">Leftover tip:</span> {meal.leftoverTip}</p>
          </div>
        )}

        {/* Variations */}
        {meal.variations && meal.variations.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Family Variations</h2>
            <div className="space-y-3">
              {meal.variations.map((v, i) => (
                <MemberVariation key={i} variation={v} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
