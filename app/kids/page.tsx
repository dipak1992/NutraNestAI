'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Baby,
  ShieldCheck,
  ChevronRight,
  Clock,
  Users,
  ChefHat,
  DollarSign,
  Sparkles,
  Lock,
  RefreshCw,
  Calendar,
  AlertTriangle,
  Leaf,
  Star,
  Camera,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { PaywallDialog } from '@/components/paywall/PaywallDialog'
import { usePaywallStatus } from '@/lib/paywall/use-paywall-status'
import { ShareMealButton } from '@/components/content/ShareMealButton'
import type { SmartMealResult, SmartVariation } from '@/lib/engine/types'

// ── Constants ──

type AgeStage = 'baby' | 'toddler' | 'kid'

const AGE_STAGES: { id: AgeStage; label: string; emoji: string; ageRange: string; description: string }[] = [
  { id: 'baby', label: 'Baby', emoji: '🍼', ageRange: '6–12 months', description: 'Purées & soft first foods' },
  { id: 'toddler', label: 'Toddler', emoji: '🧒', ageRange: '1–3 years', description: 'Finger foods & simple meals' },
  { id: 'kid', label: 'Kid', emoji: '👦', ageRange: '4–12 years', description: 'Family meals with tweaks' },
]

const COMMON_ALLERGIES = [
  { id: 'dairy', label: 'Dairy' },
  { id: 'eggs', label: 'Eggs' },
  { id: 'peanuts', label: 'Peanuts' },
  { id: 'tree_nuts', label: 'Tree nuts' },
  { id: 'wheat', label: 'Wheat/Gluten' },
  { id: 'soy', label: 'Soy' },
  { id: 'fish', label: 'Fish' },
  { id: 'shellfish', label: 'Shellfish' },
]

const TEXTURE_OPTIONS: { id: string; label: string; description: string }[] = [
  { id: 'pureed', label: 'Puréed', description: 'Smooth, no lumps' },
  { id: 'soft', label: 'Soft', description: 'Mashable with a fork' },
  { id: 'finger_foods', label: 'Finger foods', description: 'Bite-sized, easy to grab' },
  { id: 'normal', label: 'Regular', description: 'Standard family textures' },
]

const KIDS_RECIPE_STORAGE_KEY = 'mealease-kids-recipes'
const KIDS_WEEKLY_PREVIEW = [
  { day: 'Monday', meal: 'Veggie Mac & Cheese Bites', emoji: '🧀' },
  { day: 'Tuesday', meal: 'Mini Chicken Meatballs', emoji: '🍗' },
  { day: 'Wednesday', meal: 'Sweet Potato Pancakes', emoji: '🥞' },
  { day: 'Thursday', meal: 'Fish Finger Wraps', emoji: '🐟' },
  { day: 'Friday', meal: 'Hidden Veggie Pasta Sauce', emoji: '🍝' },
  { day: 'Saturday', meal: 'Banana Oat Cookies', emoji: '🍌' },
  { day: 'Sunday', meal: 'One-Pot Lentil Stew', emoji: '🥣' },
]

const LOADING_STEPS = [
  { text: 'Analyzing age-appropriate ingredients…', icon: '🥕' },
  { text: 'Checking allergens and safety rules…', icon: '🛡️' },
  { text: 'Adapting textures and portions…', icon: '🍽️' },
  { text: 'Generating your recipe…', icon: '✨' },
]

// ── Helpers ──

function readKidsRecipeCount(): number {
  try {
    const raw = localStorage.getItem(KIDS_RECIPE_STORAGE_KEY)
    if (!raw) return 0
    const data = JSON.parse(raw) as { date: string; count: number }
    if (data.date !== new Date().toDateString()) return 0
    return data.count
  } catch {
    return 0
  }
}

function writeKidsRecipeCount(count: number) {
  try {
    localStorage.setItem(
      KIDS_RECIPE_STORAGE_KEY,
      JSON.stringify({ date: new Date().toDateString(), count }),
    )
  } catch {}
}

// ── Loading Phase ──

function LoadingPhase({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const timers = LOADING_STEPS.map((_, i) =>
      setTimeout(() => setStep(i + 1), (i + 1) * 900),
    )
    const done = setTimeout(onComplete, LOADING_STEPS.length * 900 + 400)
    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(done)
    }
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
        className="mb-6"
      >
        <Baby className="h-10 w-10 text-primary" />
      </motion.div>
      <h2 className="text-xl font-bold mb-6">Preparing your recipe…</h2>
      <div className="space-y-3 max-w-xs w-full">
        {LOADING_STEPS.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: step > i ? 1 : 0.3, x: 0 }}
            transition={{ delay: i * 0.15 }}
            className="flex items-center gap-3 text-sm"
          >
            <span className="text-lg">{s.icon}</span>
            <span className={step > i ? 'text-foreground' : 'text-muted-foreground'}>{s.text}</span>
            {step > i && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-primary ml-auto">
                ✓
              </motion.span>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// ── Blurred Recipe Gate (for logged-out users) ──

function BlurredRecipeGate() {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/60 rounded-xl">
      <Lock className="h-8 w-8 text-primary mb-3" />
      <h4 className="font-bold text-lg mb-1">Sign in to see the full recipe</h4>
      <p className="text-sm text-muted-foreground mb-4 text-center max-w-sm px-4">
        Create a free account to unlock 3 kids recipes per day — with safety checks, allergen alerts, and age-appropriate guidance.
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button asChild size="lg" className="shadow-lg">
          <Link href="/signup">
            Create free account <ChevronRight className="ml-1.5 h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/login">Sign in</Link>
        </Button>
      </div>
    </div>
  )
}

// ── Weekly Plan Preview (Pro locked) ──

function WeeklyPlanPreview({ isPro }: { isPro: boolean }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-12 relative"
    >
      <div className="text-center mb-6">
        <Badge variant="outline" className="mb-3 border-purple-300 text-purple-700 bg-purple-50">
          <Calendar className="mr-1.5 h-3 w-3" /> Weekly Meal Plan
        </Badge>
        <h3 className="text-xl sm:text-2xl font-bold">
          A full week of{' '}
          <span className="text-gradient-sage">kid-friendly meals</span>
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Balanced, age-appropriate meals planned for every day — with grocery lists included.
        </p>
      </div>

      <div className="relative">
        <div className={`grid gap-2 ${!isPro ? 'filter blur-[6px] select-none pointer-events-none' : ''}`} aria-hidden={!isPro}>
          {KIDS_WEEKLY_PREVIEW.map((day) => (
            <div key={day.day} className="glass-card rounded-lg p-3 border border-border/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-primary w-24">{day.day}</span>
                <span className="text-sm font-medium">{day.meal}</span>
              </div>
              <span className="text-lg">{day.emoji}</span>
            </div>
          ))}
        </div>

        {!isPro && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <Lock className="h-6 w-6 text-primary" />
              <Badge className="bg-primary text-white">Pro</Badge>
            </div>
            <h4 className="font-bold text-lg mb-1">Unlock Weekly Kids Meal Plan</h4>
            <p className="text-sm text-muted-foreground mb-4 text-center max-w-sm px-4">
              Get 7 days of age-appropriate meals with auto-generated grocery lists, nutrition info, and portion guides.
            </p>
            <Button asChild size="lg" className="shadow-lg">
              <Link href="/pricing">
                Upgrade to Pro <ChevronRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </motion.section>
  )
}

// ── Variation Display (age-specific, prominent) ──

function KidsVariationCard({ variation }: { variation: SmartVariation }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-xl border border-primary/30 bg-primary/5 p-5"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">{variation.emoji}</span>
        <div>
          <h3 className="font-bold text-base">{variation.title}</h3>
          <p className="text-xs text-muted-foreground">{variation.label} version</p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-3">{variation.description}</p>

      {variation.modifications.length > 0 && (
        <div className="mb-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-primary mb-1.5">Modifications</h4>
          <ul className="space-y-1">
            {variation.modifications.map((mod, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <ChefHat className="h-3.5 w-3.5 text-primary mt-0.5 flex-shrink-0" />
                {mod}
              </li>
            ))}
          </ul>
        </div>
      )}

      {variation.safetyNotes.length > 0 && (
        <div className="mb-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-700 mb-1.5 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" /> Safety Notes
          </h4>
          <ul className="space-y-1">
            {variation.safetyNotes.map((note, i) => (
              <li key={i} className="text-xs text-amber-800">{note}</li>
            ))}
          </ul>
        </div>
      )}

      {variation.textureNotes && (
        <p className="text-xs text-muted-foreground italic">🍽️ Texture: {variation.textureNotes}</p>
      )}

      {variation.servingTip && (
        <p className="text-xs text-muted-foreground italic mt-1">💡 {variation.servingTip}</p>
      )}

      {variation.allergyWarnings.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {variation.allergyWarnings.map((w) => (
            <Badge key={w} variant="outline" className="text-[10px] border-red-300 text-red-700 bg-red-50">
              ⚠️ {w}
            </Badge>
          ))}
        </div>
      )}
    </motion.div>
  )
}

// ── Main Inner Component ──

function KidsPageInner() {
  const searchParams = useSearchParams()
  const initialAge = (searchParams.get('age') as AgeStage) || null

  const { status } = usePaywallStatus()
  const [selectedAge, setSelectedAge] = useState<AgeStage | null>(initialAge)
  const [allergies, setAllergies] = useState<string[]>([])
  const [texture, setTexture] = useState<string>('normal')
  const [isPicky, setIsPicky] = useState(false)

  const [loading, setLoading] = useState(false)
  const [meal, setMeal] = useState<SmartMealResult | null>(null)
  const [recipesUsed, setRecipesUsed] = useState(0)
  const [paywallOpen, setPaywallOpen] = useState(false)

  // Sub-mode: 'select' (choosing age), 'preferences' (setting prefs), 'result' (seeing recipe)
  const [phase, setPhase] = useState<'select' | 'preferences' | 'result'>(initialAge ? 'preferences' : 'select')

  useEffect(() => {
    setRecipesUsed(readKidsRecipeCount())
  }, [])

  const fetchMeal = useCallback(async () => {
    if (!selectedAge) return
    setLoading(true)

    const household = {
      adultsCount: 0,
      kidsCount: selectedAge === 'kid' ? 1 : 0,
      toddlersCount: selectedAge === 'toddler' ? 1 : 0,
      babiesCount: selectedAge === 'baby' ? 1 : 0,
    }

    try {
      const res = await fetch('/api/smart-meal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          household,
          allergies,
          pickyEater: isPicky ? { active: true, texturePreference: texture } : undefined,
          maxCookTime: 30,
        }),
      })
      if (res.ok) {
        const data = (await res.json()) as SmartMealResult
        setMeal(data)
      }
    } catch {
      // Silently fail
    }
  }, [selectedAge, allergies, texture, isPicky])

  const handleGenerateRecipe = useCallback(() => {
    // Check gating
    if (!status.isAuthenticated) {
      // Let logged-out users generate — they'll see blurred result
      setPhase('result')
      fetchMeal()
      return
    }

    if (!status.isPro) {
      const nextCount = recipesUsed + 1
      if (nextCount > status.freeKidsRecipeLimit) {
        setPaywallOpen(true)
        return
      }
      writeKidsRecipeCount(nextCount)
      setRecipesUsed(nextCount)
    }

    setPhase('result')
    fetchMeal()
  }, [status, recipesUsed, fetchMeal])

  const handleTryAnother = useCallback(() => {
    if (!status.isAuthenticated) {
      fetchMeal()
      return
    }

    if (!status.isPro) {
      const nextCount = recipesUsed + 1
      if (nextCount > status.freeKidsRecipeLimit) {
        setPaywallOpen(true)
        return
      }
      writeKidsRecipeCount(nextCount)
      setRecipesUsed(nextCount)
    }

    fetchMeal()
  }, [status, recipesUsed, fetchMeal])

  const recipesRemaining = status.isPro
    ? null
    : Math.max(status.freeKidsRecipeLimit - recipesUsed, 0)

  // Find the relevant variation for selected age
  const relevantVariation = meal?.variations.find((v) => v.stage === selectedAge)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <div className="flex items-center gap-2 font-bold text-sm">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white">
              <Leaf className="h-3.5 w-3.5" />
            </span>
            <span className="text-gradient-sage">MealEase</span>
          </div>
          <Button asChild size="sm" variant="ghost">
            <Link href="/signup">Sign up</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
        <AnimatePresence mode="wait">
          {/* ── Phase 1: Age Selection ── */}
          {phase === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <Badge variant="outline" className="mb-3 border-pink-300 text-pink-700 bg-pink-50">
                👶 Baby &amp; Kids Meals
              </Badge>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
                Who are you cooking for?
              </h1>
              <p className="text-muted-foreground mb-8">
                Select your child&apos;s age group for safe, delicious meal ideas.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
                {AGE_STAGES.map((stage) => (
                  <button
                    key={stage.id}
                    onClick={() => {
                      setSelectedAge(stage.id)
                      setPhase('preferences')
                      // Default texture based on age
                      if (stage.id === 'baby') setTexture('pureed')
                      else if (stage.id === 'toddler') setTexture('soft')
                      else setTexture('normal')
                    }}
                    className={`glass-card rounded-2xl border-2 p-6 text-center transition-all hover:border-primary/60 hover:shadow-lg group ${
                      selectedAge === stage.id ? 'border-primary bg-primary/5' : 'border-border/60'
                    }`}
                  >
                    <span className="text-5xl block mb-3">{stage.emoji}</span>
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{stage.label}</h3>
                    <p className="text-xs text-primary font-medium mb-1">{stage.ageRange}</p>
                    <p className="text-xs text-muted-foreground">{stage.description}</p>
                  </button>
                ))}
              </div>

              <p className="text-xs text-muted-foreground mt-8">
                <ShieldCheck className="inline h-3.5 w-3.5 mr-1 text-primary" />
                Every recipe includes age-specific safety checks, allergen alerts, and texture guidance.
              </p>
            </motion.div>
          )}

          {/* ── Phase 2: Preferences ── */}
          {phase === 'preferences' && selectedAge && (
            <motion.div
              key="preferences"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <button
                onClick={() => setPhase('select')}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Change age group
              </button>

              <div className="text-center mb-8">
                <Badge variant="outline" className="mb-3 border-pink-300 text-pink-700 bg-pink-50">
                  {AGE_STAGES.find((s) => s.id === selectedAge)?.emoji}{' '}
                  {AGE_STAGES.find((s) => s.id === selectedAge)?.label} Meals
                </Badge>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
                  Quick preferences
                </h1>
                <p className="text-muted-foreground">
                  Optional — helps us find the safest, tastiest recipe.
                </p>
              </div>

              {/* Allergy checkboxes */}
              <div className="glass-card rounded-xl border border-border/60 p-5 mb-4">
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Any allergies?
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {COMMON_ALLERGIES.map((allergy) => (
                    <div key={allergy.id} className="flex items-center gap-2">
                      <Checkbox
                        id={`allergy-${allergy.id}`}
                        checked={allergies.includes(allergy.id)}
                        onCheckedChange={(checked) => {
                          setAllergies((prev) =>
                            checked
                              ? [...prev, allergy.id]
                              : prev.filter((a) => a !== allergy.id),
                          )
                        }}
                      />
                      <Label htmlFor={`allergy-${allergy.id}`} className="text-sm cursor-pointer">
                        {allergy.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Texture preference (especially for baby/toddler) */}
              {(selectedAge === 'baby' || selectedAge === 'toddler') && (
                <div className="glass-card rounded-xl border border-border/60 p-5 mb-4">
                  <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <ChefHat className="h-4 w-4 text-primary" />
                    Preferred texture
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {TEXTURE_OPTIONS.filter((t) =>
                      selectedAge === 'baby'
                        ? ['pureed', 'soft'].includes(t.id)
                        : ['soft', 'finger_foods', 'normal'].includes(t.id),
                    ).map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTexture(t.id)}
                        className={`rounded-lg border p-3 text-left transition-all ${
                          texture === t.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border/60 hover:border-primary/40'
                        }`}
                      >
                        <span className="text-sm font-medium">{t.label}</span>
                        <span className="text-xs text-muted-foreground block">{t.description}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Picky eater toggle */}
              <div className="glass-card rounded-xl border border-border/60 p-5 mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      😤 Picky eater?
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      We&apos;ll prioritize familiar flavors and sneaky veggie tricks
                    </p>
                  </div>
                  <button
                    onClick={() => setIsPicky(!isPicky)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isPicky ? 'bg-primary' : 'bg-muted'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isPicky ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Two Sub-Mode Cards */}
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {/* Instant Recipe Card */}
                <button
                  onClick={handleGenerateRecipe}
                  className="glass-card rounded-2xl border-2 border-primary/40 bg-primary/5 p-6 text-left hover:border-primary/60 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <h3 className="font-bold text-base group-hover:text-primary transition-colors">
                      Get a recipe now
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Instant age-appropriate recipe with safety checks and texture guidance.
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs border-emerald-300 text-emerald-700 bg-emerald-50">
                      Free · {status.isPro ? 'Unlimited' : `${recipesRemaining ?? 3} left today`}
                    </Badge>
                  </div>
                </button>

                {/* Weekly Plan Card */}
                <div className="glass-card rounded-2xl border-2 border-border/60 p-6 text-left relative overflow-hidden">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    <h3 className="font-bold text-base">Weekly meal plan</h3>
                    <Badge className="bg-purple-600 text-white text-[10px] ml-auto">Pro</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    7 days of balanced, kid-friendly meals with grocery lists and nutrition info.
                  </p>
                  {status.isPro ? (
                    <Button asChild size="sm" variant="outline">
                      <Link href="/onboarding">Plan my week <ChevronRight className="ml-1 h-3.5 w-3.5" /></Link>
                    </Button>
                  ) : (
                    <Button asChild size="sm" variant="outline">
                      <Link href="/pricing">
                        <Lock className="mr-1.5 h-3 w-3" /> Unlock with Pro
                      </Link>
                    </Button>
                  )}
                </div>
              </div>

              {/* Photo-to-recipe hint */}
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  <Camera className="inline h-3.5 w-3.5 mr-1" />
                  Want to snap a photo of your fridge?{' '}
                  <Link href={status.isPro ? '/tonight?mode=pantry' : '/pricing'} className="text-primary hover:underline font-medium">
                    {status.isPro ? 'Use photo-to-recipe →' : 'Available with Pro →'}
                  </Link>
                </p>
              </div>
            </motion.div>
          )}

          {/* ── Phase 3: Loading ── */}
          {phase === 'result' && loading && (
            <LoadingPhase key="loading" onComplete={() => setLoading(false)} />
          )}

          {/* ── Phase 4: Recipe Result ── */}
          {phase === 'result' && !loading && meal && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <button
                onClick={() => {
                  setPhase('preferences')
                  setMeal(null)
                }}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to preferences
              </button>

              {/* Mode Badge + Title */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
              >
                <Badge variant="outline" className="mb-3 border-pink-300 text-pink-700 bg-pink-50">
                  {AGE_STAGES.find((s) => s.id === selectedAge)?.emoji}{' '}
                  {AGE_STAGES.find((s) => s.id === selectedAge)?.label} Recipe
                </Badge>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
                  {meal.title}
                </h1>
                <p className="text-muted-foreground text-base sm:text-lg">{meal.tagline}</p>
              </motion.div>

              {/* Recipe Content — Blurred for logged-out users */}
              <div className="relative">
                <div className={!status.isAuthenticated ? 'filter blur-[6px] select-none pointer-events-none' : ''}>
                  {/* Stats Row */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-8"
                  >
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 text-primary" />
                      {meal.prepTime + meal.cookTime} min total
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <ChefHat className="h-4 w-4 text-primary" />
                      {meal.difficulty}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <DollarSign className="h-4 w-4 text-primary" />
                      ~${meal.estimatedCost.toFixed(0)}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Users className="h-4 w-4 text-primary" />
                      Serves {meal.servings}
                    </div>
                  </motion.div>

                  {/* Age-specific Variation — PROMINENT */}
                  {relevantVariation && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mb-8"
                    >
                      <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-primary" />
                        {AGE_STAGES.find((s) => s.id === selectedAge)?.label} Adaptation
                      </h2>
                      <KidsVariationCard variation={relevantVariation} />
                    </motion.div>
                  )}

                  {/* Tags */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 }}
                    className="flex flex-wrap justify-center gap-1.5 mb-8"
                  >
                    {meal.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs font-normal">
                        {tag}
                      </Badge>
                    ))}
                  </motion.div>

                  {/* Description */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card rounded-xl border border-border/60 p-5 sm:p-6 mb-8"
                  >
                    <p className="text-muted-foreground leading-relaxed">{meal.description}</p>
                  </motion.div>

                  {/* Ingredients */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mb-8"
                  >
                    <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                      🛒 Ingredients
                    </h2>
                    <div className="glass-card rounded-xl border border-border/60 divide-y divide-border/40">
                      {meal.ingredients.map((ing) => (
                        <div key={ing.name} className="flex items-center justify-between px-4 py-2.5">
                          <span className="text-sm">
                            {ing.name}
                            {ing.note && <span className="text-muted-foreground ml-1">({ing.note})</span>}
                          </span>
                          <span className="text-sm text-muted-foreground font-mono">{ing.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Steps */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mb-10"
                  >
                    <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                      <ChefHat className="h-5 w-5 text-primary" />
                      How to Make It
                    </h2>
                    <div className="space-y-2">
                      {meal.steps.map((step, i) => (
                        <div key={i} className="glass-card rounded-lg border border-border/40 p-3 flex items-start gap-3">
                          <span className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                            {i + 1}
                          </span>
                          <p className="text-sm leading-relaxed">{step}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Blur overlay for logged-out */}
                {!status.isAuthenticated && <BlurredRecipeGate />}
              </div>

              {/* Try Another Button (visible to authenticated users) */}
              {status.isAuthenticated && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="flex flex-col items-center gap-3 mt-8"
                >
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleTryAnother} className="gap-2">
                      <RefreshCw className="h-3.5 w-3.5" /> Try a different recipe
                    </Button>
                    {meal && <ShareMealButton meal={meal} />}
                  </div>
                  {recipesRemaining !== null && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      {recipesRemaining > 0
                        ? `${recipesRemaining} free recipe${recipesRemaining === 1 ? '' : 's'} left today.`
                        : 'Free recipes used. Pro unlocks unlimited kids recipes.'}
                    </p>
                  )}
                </motion.div>
              )}

              {/* Weekly Plan Preview / Upsell */}
              <WeeklyPlanPreview isPro={status.isPro} />

              {/* Final CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="mt-16 text-center pb-8"
              >
                <h3 className="text-xl font-bold mb-2">Love what you see?</h3>
                <p className="text-sm text-muted-foreground mb-5 max-w-md mx-auto">
                  Get unlimited kids recipes, weekly meal plans, grocery lists, and nutrition insights for your little ones.
                </p>
                <Button asChild size="lg" className="shadow-lg px-8">
                  <Link href={status.isAuthenticated ? '/pricing' : '/signup'}>
                    {status.isAuthenticated ? 'Upgrade to Pro' : 'Get started free'}{' '}
                    <ChevronRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
                {!status.isAuthenticated && (
                  <p className="mt-2 text-xs text-muted-foreground">Free plan · No credit card required</p>
                )}
              </motion.div>
            </motion.div>
          )}

          {/* Empty / error state */}
          {phase === 'result' && !loading && !meal && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4"
            >
              <p className="text-muted-foreground mb-4">Couldn&apos;t load a recipe right now. Please try again.</p>
              <Button variant="outline" size="sm" onClick={() => fetchMeal()} className="gap-2">
                <RefreshCw className="h-3.5 w-3.5" /> Try again
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <PaywallDialog
          open={paywallOpen}
          onOpenChange={setPaywallOpen}
          title="You've used your free kids recipes today"
          description="You've explored 3 free recipes today. Upgrade to Pro for unlimited kids recipes, weekly meal plans, and grocery lists."
          isAuthenticated={status.isAuthenticated}
          redirectPath="/kids"
        />
      </main>
    </div>
  )
}

export default function KidsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Baby className="h-8 w-8 text-primary animate-spin" />
        </div>
      }
    >
      <KidsPageInner />
    </Suspense>
  )
}
