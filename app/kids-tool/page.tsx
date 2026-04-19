'use client'

import { Suspense, useEffect, useState, useRef, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PaywallDialog } from '@/components/paywall/PaywallDialog'
import { usePaywallStatus } from '@/lib/paywall/use-paywall-status'
import {
  ArrowLeft, RefreshCw, Sparkles, Clock, Flame, ChefHat, Leaf, Star,
} from 'lucide-react'
import posthog from 'posthog-js'
import { Analytics } from '@/lib/analytics'
import type {
  KidsToolIntent,
  KidsToolResult,
  LunchboxResult,
  SnackResult,
  BakeResult,
  PickyResult,
  FastResult,
} from '@/app/api/kids-tool/route'

// ─── Tool metadata ────────────────────────────────────────────────────────────

const TOOL_META: Record<KidsToolIntent, {
  emoji: string
  label: string
  section_title: string
  tagline: string
  primaryCta: string
  loadingSteps: string[]
}> = {
  lunchbox: {
    emoji: '🍱',
    label: 'Lunchbox Help',
    section_title: 'Lunchbox Ideas',
    tagline: 'A packed lunch they\'ll actually eat',
    primaryCta: 'Pack This',
    loadingSteps: [
      'Thinking about what kids love…',
      'Building a balanced lunchbox…',
      'Adding a fun treat…',
      'Your lunchbox plan is ready! 🍱',
    ],
  },
  snack: {
    emoji: '🍎',
    label: 'Snack for Kids',
    section_title: 'Snack Rescue',
    tagline: 'A quick snack they\'ll love',
    primaryCta: 'Make This',
    loadingSteps: [
      'Looking for kid-approved snacks…',
      'Checking for healthy and fast…',
      'Almost there…',
      'Snack idea ready! 🍎',
    ],
  },
  bake: {
    emoji: '🧁',
    label: 'Bake With Kids',
    section_title: 'Bake Together',
    tagline: 'A fun baking project for you and the kids',
    primaryCta: 'Start Baking',
    loadingSteps: [
      'Choosing a fun baking activity…',
      'Checking mess level and age fit…',
      'Preparing simple steps…',
      'Ready to bake together! 🧁',
    ],
  },
  picky: {
    emoji: '🍽',
    label: 'Picky Eater Help',
    section_title: 'Picky Eater Wins',
    tagline: 'A meal even picky eaters will try',
    primaryCta: 'Try This',
    loadingSteps: [
      'Finding something picky eaters accept…',
      'Checking acceptance likelihood…',
      'Adding a serving trick…',
      'A win for picky eaters! 🍽',
    ],
  },
  fast: {
    emoji: '⚡',
    label: 'Need Food in 5 Min',
    section_title: 'Ready in 5 Minutes',
    tagline: 'Food on the table in 5 minutes or less',
    primaryCta: 'Make Now',
    loadingSteps: [
      'Finding the fastest option…',
      'Checking pantry staples…',
      'Locking in the shortcut…',
      'Ready to go! ⚡',
    ],
  },
}

// ─── Loading Phase ────────────────────────────────────────────────────────────

function LoadingPhase({ onComplete, intent }: { onComplete: () => void; intent: KidsToolIntent }) {
  const [step, setStep] = useState(0)
  const meta = TOOL_META[intent]
  const steps = meta.loadingSteps

  useEffect(() => {
    const timers = steps.map((_, i) =>
      setTimeout(() => {
        setStep(i)
        if (i === steps.length - 1) setTimeout(onComplete, 500)
      }, i * 500)
    )
    return () => timers.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-[70vh] flex flex-col items-center justify-center px-4"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="mb-8 text-4xl"
      >
        <span>{meta.emoji}</span>
      </motion.div>
      <div className="space-y-3 text-center">
        {steps.map((text, i) => (
          <motion.p
            key={text}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: i <= step ? 1 : 0.2, x: 0 }}
            transition={{ duration: 0.3 }}
            className={`text-sm sm:text-base transition-colors ${
              i <= step ? 'text-foreground font-medium' : 'text-muted-foreground'
            } ${i === step ? 'text-primary' : ''}`}
          >
            {i < step ? '✓ ' : i === step ? '● ' : '○ '}
            {text}
          </motion.p>
        ))}
      </div>
      <div className="mt-8 w-48 h-1.5 rounded-full bg-muted overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </motion.div>
  )
}

// ─── Result Cards ─────────────────────────────────────────────────────────────

function LunchboxCard({ result }: { result: LunchboxResult }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      <div className="glass-card rounded-xl border border-border/60 divide-y divide-border/40">
        <div className="flex items-center gap-3 px-4 py-3">
          <span className="text-xl">🥪</span>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Main item</p>
            <p className="font-semibold text-sm">{result.main_item}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3">
          <span className="text-xl">🍓</span>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Fruit</p>
            <p className="font-semibold text-sm">{result.fruit}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3">
          <span className="text-xl">🥕</span>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Side snack</p>
            <p className="font-semibold text-sm">{result.side_snack}</p>
          </div>
        </div>
        {result.optional_treat && (
          <div className="flex items-center gap-3 px-4 py-3">
            <span className="text-xl">🍪</span>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Treat (optional)</p>
              <p className="font-semibold text-sm">{result.optional_treat}</p>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground px-1">
        <Clock className="h-4 w-4 text-primary" />
        Prep time: <span className="font-medium text-foreground">{result.prep_time}</span>
      </div>
      {result.tip && (
        <div className="rounded-lg bg-primary/5 border border-primary/20 px-4 py-3 text-sm text-muted-foreground">
          💡 {result.tip}
        </div>
      )}
    </motion.div>
  )
}

function SnackCard({ result }: { result: SnackResult }) {
  const categoryLabel: Record<string, string> = {
    after_school: 'After school',
    healthy: 'Healthy',
    quick: 'Quick',
    filling: 'Filling',
    light: 'Light pre-dinner',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      <div className="glass-card rounded-xl border border-border/60 p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <h2 className="text-xl font-bold leading-tight">{result.name}</h2>
          {result.category && (
            <Badge variant="secondary" className="text-xs shrink-0">
              {categoryLabel[result.category] ?? result.category}
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground mb-4">{result.why_kids_love_it}</p>
        <div className="border-t border-border/40 pt-4">
          <p className="text-xs font-medium text-muted-foreground mb-2">Ingredients</p>
          <div className="flex flex-wrap gap-1.5">
            {result.ingredients.map((ing) => (
              <span key={ing} className="text-xs bg-muted rounded-full px-2.5 py-0.5">{ing}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground px-1">
        <Clock className="h-4 w-4 text-primary" />
        Prep time: <span className="font-medium text-foreground">{result.prep_time}</span>
      </div>
    </motion.div>
  )
}

function BakeCard({ result }: { result: BakeResult }) {
  const messColors: Record<string, string> = {
    low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    medium: 'bg-amber-50 text-amber-700 border-amber-200',
    high: 'bg-red-50 text-red-700 border-red-200',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      <div className="glass-card rounded-xl border border-border/60 p-5">
        <h2 className="text-xl font-bold mb-1">{result.activity_name}</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" /> {result.prep_time}
          </span>
          <span className="text-xs text-muted-foreground">· Ages {result.kid_age_fit}</span>
          <Badge
            variant="outline"
            className={`text-xs ${messColors[result.mess_level] ?? ''}`}
          >
            {result.mess_level === 'low' ? '🧹 Low mess' : result.mess_level === 'medium' ? '🧹 Medium mess' : '🧹 High mess'}
          </Badge>
        </div>

        <div className="mb-4">
          <p className="text-xs font-medium text-muted-foreground mb-2">Ingredients</p>
          <div className="flex flex-wrap gap-1.5">
            {result.ingredients.map((ing) => (
              <span key={ing} className="text-xs bg-muted rounded-full px-2.5 py-0.5">{ing}</span>
            ))}
          </div>
        </div>

        <div className="border-t border-border/40 pt-4">
          <p className="text-xs font-medium text-muted-foreground mb-2">Steps</p>
          <ol className="space-y-2">
            {result.steps.map((step, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm">
                <span className="flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>

      {result.fun_tip && (
        <div className="rounded-lg bg-primary/5 border border-primary/20 px-4 py-3 text-sm text-muted-foreground">
          🎉 Fun tip: {result.fun_tip}
        </div>
      )}
    </motion.div>
  )
}

function PickyCard({ result }: { result: PickyResult }) {
  const score = Math.min(10, Math.max(1, Math.round(result.acceptance_score)))
  const scoreColor = score >= 8 ? 'text-emerald-600' : score >= 5 ? 'text-amber-600' : 'text-red-500'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      <div className="glass-card rounded-xl border border-border/60 p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <h2 className="text-xl font-bold leading-tight">{result.meal_name}</h2>
          <div className={`text-right shrink-0 ${scoreColor}`}>
            <div className="flex items-center gap-1 justify-end">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-lg font-bold">{score}/10</span>
            </div>
            <p className="text-xs font-medium">acceptance</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Why it may work</p>
            <p className="text-sm leading-relaxed">{result.why_it_may_work}</p>
          </div>

          {result.serving_tip && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
              <p className="text-xs font-medium text-amber-700 mb-0.5">Serving tip</p>
              <p className="text-sm text-amber-800">{result.serving_tip}</p>
            </div>
          )}

          {result.optional_upgrade_path && (
            <div className="border-t border-border/40 pt-3">
              <p className="text-xs font-medium text-muted-foreground mb-1">When they&apos;re ready to expand</p>
              <p className="text-sm text-muted-foreground">{result.optional_upgrade_path}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function FastCard({ result }: { result: FastResult }) {
  const urgency = Math.min(10, Math.max(1, Math.round(result.urgency_score)))

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      <div className="glass-card rounded-xl border border-border/60 p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <h2 className="text-xl font-bold leading-tight">{result.meal_name}</h2>
          <div className="shrink-0 text-right">
            <div className="flex items-center gap-1 justify-end text-orange-500">
              <Flame className="h-4 w-4" />
              <span className="text-lg font-bold">{result.ready_in_minutes}min</span>
            </div>
            <p className="text-xs text-muted-foreground">urgency {urgency}/10</p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-xs font-medium text-muted-foreground mb-2">You&apos;ll need</p>
          <div className="flex flex-wrap gap-1.5">
            {result.ingredients_needed.map((ing) => (
              <span key={ing} className="text-xs bg-muted rounded-full px-2.5 py-0.5">{ing}</span>
            ))}
          </div>
        </div>

        {result.shortcut_tip && (
          <div className="rounded-lg bg-orange-50 border border-orange-200 px-4 py-3">
            <p className="text-xs font-medium text-orange-700 mb-0.5 flex items-center gap-1">
              <ChefHat className="h-3.5 w-3.5" /> Shortcut
            </p>
            <p className="text-sm text-orange-800">{result.shortcut_tip}</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

function ResultCard({ result, onSwap }: { result: KidsToolResult; onSwap: () => void }) {
  const meta = TOOL_META[result.intent as KidsToolIntent] ?? TOOL_META.lunchbox

  return (
    <motion.div
      key="result"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <Badge variant="outline" className="mb-3">
          {meta.emoji} {meta.section_title}
        </Badge>
        <p className="text-sm text-muted-foreground">{meta.tagline}</p>
      </motion.div>

      {/* Tool-specific card */}
      {result.intent === 'lunchbox' && <LunchboxCard result={result as LunchboxResult} />}
      {result.intent === 'snack' && <SnackCard result={result as SnackResult} />}
      {result.intent === 'bake' && <BakeCard result={result as BakeResult} />}
      {result.intent === 'picky' && <PickyCard result={result as PickyResult} />}
      {result.intent === 'fast' && <FastCard result={result as FastResult} />}

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 flex flex-col sm:flex-row gap-3"
      >
        <Button size="lg" className="flex-1 shadow-md">
          {meta.primaryCta}
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={onSwap}
          className="flex-1 gap-2"
        >
          <RefreshCw className="h-4 w-4" /> Swap
        </Button>
      </motion.div>

      {/* Back to dashboard */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-6 text-center"
      >
        <Link
          href="/dashboard"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to dashboard
        </Link>
      </motion.div>
    </motion.div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

function KidsToolPageInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const rawMode = searchParams.get('mode') ?? 'lunchbox'
  const intent: KidsToolIntent = (['lunchbox', 'snack', 'bake', 'picky', 'fast'] as KidsToolIntent[]).includes(rawMode as KidsToolIntent)
    ? (rawMode as KidsToolIntent)
    : 'lunchbox'

  const [loading, setLoading] = useState(true)
  const [result, setResult] = useState<KidsToolResult | null>(null)
  const [error, setError] = useState(false)
  const [paywallOpen, setPaywallOpen] = useState(false)
  const [target, setTarget] = useState<string>('whole_family')
  const [memberTargets, setMemberTargets] = useState<Array<{ id: string; label: string }>>([])
  const { status, loading: paywallLoading } = usePaywallStatus()
  const animationDoneRef = useRef(false)
  const fetchPendingRef = useRef(false)

  const meta = TOOL_META[intent]

  const fetchResult = useCallback(async () => {
    setLoading(true)
    setError(false)
    animationDoneRef.current = false
    fetchPendingRef.current = true
    try {
      const res = await fetch('/api/kids-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          intent,
          targetMode: target === 'whole_family' || target === 'adults_only' ? target : undefined,
          targetMemberId: target !== 'whole_family' && target !== 'adults_only' ? target : undefined,
        }),
      })

      if (res.status === 401) {
        router.replace(`/login?redirect=/kids-tool%3Fmode%3D${intent}`)
        return
      }

      if (res.ok) {
        const data = (await res.json()) as KidsToolResult
        setResult(data)

        if (intent === 'lunchbox') {
          posthog.capture(Analytics.LUNCHBOX_GENERATED, { target })
        }
        if (intent === 'picky') {
          posthog.capture(Analytics.PICKY_EATER_TOOL_USED, { target })
        }

        fetchPendingRef.current = false
        if (animationDoneRef.current) setLoading(false)
      } else {
        fetchPendingRef.current = false
        setError(true)
        setLoading(false)
      }
    } catch {
      fetchPendingRef.current = false
      setError(true)
      setLoading(false)
    }
  }, [intent, router])

  useEffect(() => {
    if (!paywallLoading) {
      if (!status.isAuthenticated) {
        router.replace(`/login?redirect=/kids-tool%3Fmode%3D${intent}`)
        return
      }
      if (!status.isFamily) {
        setPaywallOpen(true)
        return
      }

      fetch('/api/family/members', { cache: 'no-store' })
        .then(async (res) => {
          if (!res.ok) return null
          return res.json()
        })
        .then((data) => {
          const children = (data?.members ?? [])
            .filter((m: any) => ['child', 'toddler', 'baby'].includes(m.role))
            .map((m: any) => ({ id: m.id as string, label: `${m.first_name} (${m.role})` }))
          setMemberTargets(children)
        })
        .catch(() => null)

      fetchResult()
    }
  }, [paywallLoading]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSwap = useCallback(() => {
    setResult(null)
    fetchResult()
  }, [fetchResult])

  return (
    <div className="min-h-dvh bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Dashboard
          </Link>
          <div className="flex items-center gap-2 font-bold text-sm">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white">
              <Leaf className="h-3.5 w-3.5" />
            </span>
            <span className="text-gradient-sage">MealEase</span>
          </div>
          <div className="w-16" />
        </div>
      </header>

      <main className="mx-auto max-w-xl px-4 py-8 sm:py-12">
        <div className="mb-4 rounded-xl border border-border/60 bg-card p-3">
          <p className="text-xs font-medium text-muted-foreground mb-2">Help for</p>
          <select
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          >
            <option value="whole_family">Whole family dinner</option>
            <option value="adults_only">Adults only tonight</option>
            {memberTargets.map((m) => (
              <option key={m.id} value={m.id}>{m.label}</option>
            ))}
          </select>
        </div>

        <AnimatePresence mode="sync">
          {loading ? (
            <LoadingPhase
              key="loading"
              intent={intent}
              onComplete={() => {
                animationDoneRef.current = true
                if (!fetchPendingRef.current) setLoading(false)
              }}
            />
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4"
            >
              <p className="text-muted-foreground mb-4">
                Something went wrong. Please try again.
              </p>
              <Button variant="outline" size="sm" onClick={handleSwap} className="gap-2">
                <RefreshCw className="h-3.5 w-3.5" /> Try again
              </Button>
            </motion.div>
          ) : result ? (
            <ResultCard key="result" result={result} onSwap={handleSwap} />
          ) : null}
        </AnimatePresence>

        <PaywallDialog
          open={paywallOpen}
          onOpenChange={setPaywallOpen}
          title={`Unlock ${meta.section_title}`}
          description="Kids tools are part of the Pro family plan. Upgrade to unlock all 5 kids tools plus weekly meal planning."
          isAuthenticated={status.isAuthenticated}
          redirectPath={`/kids-tool?mode=${intent}`}
        />
      </main>
    </div>
  )
}

export default function KidsToolPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center gap-3">
          <Sparkles className="h-10 w-10 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Loading…</p>
        </div>
      }
    >
      <KidsToolPageInner />
    </Suspense>
  )
}
