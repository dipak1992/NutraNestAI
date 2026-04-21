'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { ArrowLeft, Clock, ChefHat, RefreshCw, Share2, Flame, Star } from 'lucide-react'
import posthog from 'posthog-js'
import { Analytics } from '@/lib/analytics'
import { getKidsResultTitle, buildSavableKidsMeal } from '@/lib/kids-tool-utils'
import type {
  KidsToolIntent,
  KidsToolResult,
  LunchboxResult,
  SnackResult,
  BakeResult,
  PickyResult,
  FastResult,
} from '@/app/api/kids-tool/route'

// ─── Section meta ─────────────────────────────────────────────────────────────

const INTENT_META: Record<KidsToolIntent, { emoji: string; label: string; secondaryCta: string }> = {
  lunchbox: { emoji: '🍱', label: 'Lunchbox Builder', secondaryCta: 'Swap Lunchbox' },
  snack:    { emoji: '🍎', label: 'Snack Helper',     secondaryCta: 'Try Another Snack' },
  bake:     { emoji: '🧁', label: 'Bake With Kids',   secondaryCta: 'Try Easier Activity' },
  picky:    { emoji: '🍽', label: 'Picky Eater Win',  secondaryCta: 'Find Safer Option' },
  fast:     { emoji: '⚡', label: '5-Minute Food',    secondaryCta: 'Even Faster Option' },
}

// ─── Intent detail sections ────────────────────────────────────────────────────

function BakeDetail({ result }: { result: BakeResult }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const toggle = (item: string) => setChecked((p) => ({ ...p, [item]: !p[item] }))

  const messColour: Record<BakeResult['mess_level'], string> = {
    low: 'text-green-700 bg-green-50 border-green-200',
    medium: 'text-amber-700 bg-amber-50 border-amber-200',
    high: 'text-red-700 bg-red-50 border-red-200',
  }

  return (
    <div className="space-y-5">
      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="gap-1">
          <Clock className="h-3 w-3" /> {result.prep_time}
        </Badge>
        <Badge variant="outline" className="gap-1">
          👧 Ages {result.kid_age_fit}
        </Badge>
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${messColour[result.mess_level]}`}>
          Mess: {result.mess_level}
        </span>
      </div>

      {/* Ingredients checklist */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Ingredients</p>
        <ul className="space-y-1.5">
          {result.ingredients.map((ing) => (
            <li key={ing} className="flex items-center gap-2.5 cursor-pointer" onClick={() => toggle(ing)}>
              <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px] transition-colors ${
                checked[ing] ? 'bg-primary border-primary text-white' : 'border-border'
              }`}>
                {checked[ing] ? '✓' : ''}
              </span>
              <span className={`text-sm transition-colors ${checked[ing] ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                {ing}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Steps */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Steps</p>
        <ol className="space-y-3">
          {result.steps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed pt-0.5">{step}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* Fun tip */}
      {result.fun_tip && (
        <div className="rounded-lg border border-purple-200 bg-purple-50 px-4 py-3">
          <p className="text-xs font-medium text-purple-700 mb-0.5 flex items-center gap-1">
            <Star className="h-3 w-3" /> Fun Tip
          </p>
          <p className="text-sm text-purple-800">{result.fun_tip}</p>
        </div>
      )}

      {/* Kid helper ideas */}
      <div className="rounded-lg border border-border/60 bg-muted/40 px-4 py-3">
        <p className="text-xs font-medium text-foreground mb-2">🧒 Kid Helper Tasks</p>
        <ul className="space-y-1">
          {['Pour and mix dry ingredients', 'Stir the batter', 'Add toppings', 'Press the timer'].map((task) => (
            <li key={task} className="text-xs text-muted-foreground flex items-center gap-1.5">
              <span className="text-primary">•</span> {task}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function PickyDetail({ result }: { result: PickyResult }) {
  const score = result.acceptance_score
  const scoreColour = score >= 8 ? 'text-green-600' : score >= 6 ? 'text-amber-600' : 'text-red-500'

  return (
    <div className="space-y-5">
      {/* Acceptance score */}
      <div className="flex items-center gap-4 rounded-xl border border-border/60 bg-card p-4">
        <div className="text-center">
          <p className={`text-4xl font-black ${scoreColour}`}>{score}</p>
          <p className="text-[10px] text-muted-foreground">/ 10</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">Acceptance Score</p>
          <p className="text-sm text-foreground">
            {score >= 8 ? 'High chance they\'ll eat it ✅' : score >= 6 ? 'Good chance — worth trying 👍' : 'Tricky, but possible 🤞'}
          </p>
        </div>
      </div>

      {/* Why it may work */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Why It May Work</p>
        <p className="text-sm text-foreground leading-relaxed">{result.why_it_may_work}</p>
      </div>

      {/* Serving trick */}
      {result.serving_tip && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-xs font-medium text-amber-700 mb-0.5 flex items-center gap-1">
            <ChefHat className="h-3 w-3" /> Serving Trick
          </p>
          <p className="text-sm text-amber-800">{result.serving_tip}</p>
        </div>
      )}

      {/* Upgrade path */}
      {result.optional_upgrade_path && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">What to Try Next</p>
          <p className="text-sm text-foreground leading-relaxed">{result.optional_upgrade_path}</p>
        </div>
      )}

      {/* Small portion tip */}
      <div className="rounded-lg border border-border/60 bg-muted/40 px-4 py-3">
        <p className="text-xs font-medium text-foreground mb-1">🍽 Small Portion Tip</p>
        <p className="text-xs text-muted-foreground">Start with a tiny portion alongside a familiar food. No pressure — just exposure builds acceptance over time.</p>
      </div>
    </div>
  )
}

function SnackDetail({ result }: { result: SnackResult }) {
  return (
    <div className="space-y-5">
      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="gap-1">
          <Clock className="h-3 w-3" /> {result.prep_time}
        </Badge>
        <Badge variant="outline">{result.category}</Badge>
      </div>

      {/* Why kids love it */}
      <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3">
        <p className="text-xs font-medium text-green-700 mb-0.5">💚 Why Kids Love It</p>
        <p className="text-sm text-green-800">{result.why_kids_love_it}</p>
      </div>

      {/* Ingredients */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Ingredients</p>
        <div className="flex flex-wrap gap-1.5">
          {result.ingredients.map((ing) => (
            <span key={ing} className="text-xs bg-muted rounded-full px-2.5 py-1">{ing}</span>
          ))}
        </div>
      </div>

      {/* Quick prep steps (static) */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Quick Prep</p>
        <ol className="space-y-2">
          {['Gather all ingredients', 'Prepare and portion out', 'Serve and enjoy'].map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed pt-0.5">{step}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* Allergy note */}
      <div className="rounded-lg border border-border/60 bg-muted/40 px-4 py-3">
        <p className="text-xs font-medium text-foreground mb-1">⚠️ Allergy Note</p>
        <p className="text-xs text-muted-foreground">Always check ingredients against your child's known allergies before serving.</p>
      </div>
    </div>
  )
}

function LunchboxDetail({ result }: { result: LunchboxResult }) {
  const items = [
    { label: 'Main', value: result.main_item },
    { label: 'Fruit', value: result.fruit },
    { label: 'Side', value: result.side_snack },
    ...(result.optional_treat ? [{ label: 'Treat', value: result.optional_treat }] : []),
  ]
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const toggle = (key: string) => setChecked((p) => ({ ...p, [key]: !p[key] }))

  return (
    <div className="space-y-5">
      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="gap-1">
          <Clock className="h-3 w-3" /> {result.prep_time}
        </Badge>
      </div>

      {/* Pack list */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Pack This</p>
        <ul className="space-y-2">
          {items.map(({ label, value }) => (
            <li
              key={label}
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => toggle(label)}
            >
              <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px] transition-colors ${
                checked[label] ? 'bg-primary border-primary text-white' : 'border-border'
              }`}>
                {checked[label] ? '✓' : ''}
              </span>
              <span className="text-xs text-muted-foreground w-10 shrink-0">{label}</span>
              <span className={`text-sm transition-colors ${checked[label] ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                {value}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Tip */}
      {result.tip && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
          <p className="text-xs font-medium text-blue-700 mb-0.5 flex items-center gap-1">
            <ChefHat className="h-3 w-3" /> Tip
          </p>
          <p className="text-sm text-blue-800">{result.tip}</p>
        </div>
      )}

      {/* Night-before prep */}
      <div className="rounded-lg border border-border/60 bg-muted/40 px-4 py-3">
        <p className="text-xs font-medium text-foreground mb-2">🌙 Prep Tonight</p>
        <ul className="space-y-1">
          {['Wash and chop fruit', 'Pack dry items in containers', 'Prepare the main item if possible', 'Refrigerate overnight'].map((task) => (
            <li key={task} className="text-xs text-muted-foreground flex items-center gap-1.5">
              <span className="text-primary">•</span> {task}
            </li>
          ))}
        </ul>
      </div>

      {/* Freshness note */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <p className="text-xs font-medium text-amber-700 mb-0.5">🌡 Freshness Note</p>
        <p className="text-xs text-amber-800">Keep perishables in an insulated bag with an ice pack to stay fresh until lunchtime.</p>
      </div>
    </div>
  )
}

function FastDetail({ result }: { result: FastResult }) {
  const urgency = Math.min(10, Math.max(1, result.urgency_score ?? 8))

  return (
    <div className="space-y-5">
      {/* Timer badge */}
      <div className="flex items-center gap-3 rounded-xl border border-orange-200 bg-orange-50 p-4">
        <Flame className="h-8 w-8 text-orange-500 shrink-0" />
        <div>
          <p className="text-2xl font-black text-orange-600">{result.ready_in_minutes} min</p>
          <p className="text-xs text-orange-700">Urgency {urgency}/10</p>
        </div>
      </div>

      {/* Ingredients */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">You Need</p>
        <div className="flex flex-wrap gap-1.5">
          {result.ingredients_needed.map((ing) => (
            <span key={ing} className="text-xs bg-muted rounded-full px-2.5 py-1">{ing}</span>
          ))}
        </div>
      </div>

      {/* Shortcut tip */}
      {result.shortcut_tip && (
        <div className="rounded-lg border border-orange-200 bg-orange-50 px-4 py-3">
          <p className="text-xs font-medium text-orange-700 mb-0.5 flex items-center gap-1">
            <ChefHat className="h-3 w-3" /> Shortcut
          </p>
          <p className="text-sm text-orange-800">{result.shortcut_tip}</p>
        </div>
      )}

      {/* 5-minute plan */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">⚡ The Plan</p>
        <ol className="space-y-2">
          {['Grab everything from the fridge/pantry', 'Use shortcuts: pre-cut, frozen, or canned', 'Plate and serve — done'].map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600 text-[10px] font-bold">
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed pt-0.5">{step}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* Substitution note */}
      <div className="rounded-lg border border-border/60 bg-muted/40 px-4 py-3">
        <p className="text-xs font-medium text-foreground mb-1">🔄 Missing an ingredient?</p>
        <p className="text-xs text-muted-foreground">Swap any ingredient for whatever you have on hand — this meal is flexible by design.</p>
      </div>
    </div>
  )
}

// ─── Result page inner ─────────────────────────────────────────────────────────

function KidsToolResultInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const rawIntent = searchParams.get('intent') ?? 'lunchbox'
  const intent: KidsToolIntent = (['lunchbox', 'snack', 'bake', 'picky', 'fast'] as KidsToolIntent[]).includes(rawIntent as KidsToolIntent)
    ? (rawIntent as KidsToolIntent)
    : 'lunchbox'

  const [result, setResult] = useState<KidsToolResult | null>(null)
  const [saving, setSaving] = useState(false)
  const meta = INTENT_META[intent]

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('kids-tool-result')
      if (raw) {
        const parsed = JSON.parse(raw) as KidsToolResult
        setResult(parsed)
      }
    } catch {
      // no-op
    }
  }, [])

  async function handleSave() {
    if (!result) return
    setSaving(true)
    try {
      const meal = buildSavableKidsMeal(result)
      const res = await fetch('/api/content/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meal }),
      })
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null
        throw new Error(data?.error ?? 'Could not save right now')
      }
      posthog.capture(Analytics.KIDS_SAVE_CLICKED, { intent, source: 'result_page' })
      toast.success('Saved!', { description: 'Find it in Saved Meals.' })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not save')
    } finally {
      setSaving(false)
    }
  }

  async function handleShare() {
    if (!result) return
    const title = getKidsResultTitle(result)
    const text = `MealEase picked this for the kids: ${title} 🍽️\n\nTry it at mealease.app`
    try {
      if (navigator.share) {
        await navigator.share({ title, text })
      } else {
        await navigator.clipboard.writeText(text)
        toast.success('Copied to clipboard!')
      }
      posthog.capture(Analytics.KIDS_SHARE_CLICKED, { intent, source: 'result_page' })
    } catch (e) {
      if (e instanceof Error && e.name !== 'AbortError') toast.error('Could not share')
    }
  }

  function handleSwap() {
    posthog.capture(Analytics.KIDS_SWAP_CLICKED, { intent, source: 'result_page' })
    router.push(`/kids-tool?mode=${intent}`)
  }

  if (!result) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <p className="text-muted-foreground mb-4">No result found. Head back and try again.</p>
        <Button variant="outline" size="sm" onClick={() => router.push(`/kids-tool?mode=${intent}`)}>
          Go back
        </Button>
      </div>
    )
  }

  const title = getKidsResultTitle(result)

  return (
    <div className="min-h-dvh bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-xl items-center gap-3 px-4">
          <button
            type="button"
            onClick={() => router.push(`/kids-tool?mode=${intent}`)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Kids Tools
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-xl px-4 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="space-y-6"
        >
          {/* Title */}
          <div className="text-center">
            <Badge variant="outline" className="mb-3">
              {meta.emoji} {meta.label}
            </Badge>
            <h1 className="text-2xl font-bold leading-tight">{title}</h1>
          </div>

          {/* Intent-specific content */}
          <div className="glass-card rounded-xl border border-border/60 p-5">
            {intent === 'bake'     && <BakeDetail    result={result as BakeResult} />}
            {intent === 'picky'    && <PickyDetail   result={result as PickyResult} />}
            {intent === 'snack'    && <SnackDetail   result={result as SnackResult} />}
            {intent === 'lunchbox' && <LunchboxDetail result={result as LunchboxResult} />}
            {intent === 'fast'     && <FastDetail    result={result as FastResult} />}
          </div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col gap-3"
          >
            {/* Primary: Save */}
            <Button
              size="lg"
              className="w-full shadow-md"
              onClick={handleSave}
              disabled={saving}
            >
              ❤️ {saving ? 'Saving…' : 'Save This Meal'}
            </Button>

            {/* Secondary row */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSwap}
                className="flex-1 gap-1.5"
              >
                <RefreshCw className="h-3.5 w-3.5" /> {meta.secondaryCta}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="flex-1 gap-1.5"
              >
                <Share2 className="h-3.5 w-3.5" /> Share
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}

export default function KidsToolResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Loading…</p>
        </div>
      }
    >
      <KidsToolResultInner />
    </Suspense>
  )
}
