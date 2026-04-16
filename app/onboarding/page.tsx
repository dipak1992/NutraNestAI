'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useLightOnboardingStore, type HouseholdType } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronRight, ChevronLeft, Check, X, Loader2 } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MealEaseLogo } from '@/components/ui/MealEaseLogo'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

// ─── Static data ──────────────────────────────────────────────────────────────

const CUISINES = [
  { label: 'Italian', emoji: '🍕' },
  { label: 'Mexican', emoji: '🌮' },
  { label: 'Asian', emoji: '🍜' },
  { label: 'Mediterranean', emoji: '🫒' },
  { label: 'American', emoji: '🍔' },
  { label: 'Indian', emoji: '🍛' },
  { label: 'Middle Eastern', emoji: '🧆' },
  { label: 'Japanese', emoji: '🍱' },
  { label: 'Thai', emoji: '🍲' },
  { label: 'French', emoji: '🥐' },
]

const COOKING_TIMES = [
  { value: 15, label: '15 min', emoji: '⚡' },
  { value: 30, label: '30 min', emoji: '🕐' },
  { value: 45, label: '45 min', emoji: '🕤' },
  { value: 60, label: '1 hour', emoji: '⏰' },
  { value: 90, label: '1hr+', emoji: '👨‍🍳' },
]

const COUNTRIES = [
  'United States', 'Canada', 'United Kingdom', 'Australia',
  'Germany', 'France', 'India', 'Brazil', 'Mexico',
  'Japan', 'South Korea', 'Italy', 'Spain', 'Other',
]

// ─── Animation ────────────────────────────────────────────────────────────────

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 36 : -36, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -36 : 36, opacity: 0 }),
}

// ─── Shared toggle ────────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={(e) => { e.stopPropagation(); onChange() }}
      className={cn(
        'relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200',
        checked ? 'bg-primary' : 'bg-border'
      )}
    >
      <span className={cn(
        'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200',
        checked ? 'translate-x-5' : 'translate-x-0'
      )} />
    </button>
  )
}

// ─── Step 1: Household type ───────────────────────────────────────────────────

function StepHousehold({
  value,
  onSelect,
}: {
  value: HouseholdType | null
  onSelect: (type: HouseholdType) => void
}) {
  const options: { value: HouseholdType; emoji: string; label: string; sub: string }[] = [
    { value: 'solo',   emoji: '🧑',          label: 'Just me',  sub: 'Built around your taste, not anyone else\'s' },
    { value: 'couple', emoji: '👫',           label: 'Couple',   sub: 'Two tastes, one meal that works for both' },
    { value: 'family', emoji: '👨‍👩‍👧‍👦', label: 'Family',   sub: 'Kids and adults — all handled automatically' },
  ]

  return (
    <div className="space-y-7">
      <div>
        <p className="text-sm font-medium text-primary mb-2">Step 1 of 5</p>
        <h1 className="text-2xl font-bold tracking-tight">Who are you cooking for?</h1>
        <p className="text-muted-foreground mt-2 text-sm">We’ll build a flavour profile your whole household loves.</p>
      </div>
      <div className="grid gap-3">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onSelect(opt.value)}
            className={cn(
              'flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-200',
              value === opt.value
                ? 'border-primary bg-primary/5 shadow-sm shadow-primary/10'
                : 'border-border/60 hover:border-primary/40 hover:bg-muted/20'
            )}
          >
            <span className="text-3xl leading-none">{opt.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{opt.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{opt.sub}</p>
            </div>
            <div className={cn(
              'h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors',
              value === opt.value ? 'border-primary bg-primary' : 'border-border'
            )}>
              {value === opt.value && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
            </div>
          </button>
        ))}
      </div>
      <p className="text-xs text-center text-muted-foreground">Tap one to continue</p>
    </div>
  )
}

// ─── Step 2: Family details ───────────────────────────────────────────────────

function StepFamily({
  hasKids,
  setHasKids,
  pickyEater,
  setPickyEater,
}: {
  hasKids: boolean | null
  setHasKids: (v: boolean | null) => void
  pickyEater: boolean
  setPickyEater: (v: boolean) => void
}) {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-primary mb-2">Step 2 of 5</p>
        <h1 className="text-2xl font-bold tracking-tight">Tell us about the little ones</h1>
        <p className="text-muted-foreground mt-2 text-sm">We’ll keep every meal safe and age-right — automatically.</p>
      </div>
      <div className="space-y-5">
        <div>
          <p className="text-sm font-medium mb-3">Any little ones at home?</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: true,  emoji: '👶', label: 'Yes, we have kids' },
              { value: false, emoji: '🧑‍🤝‍🧑', label: 'No, just adults' },
            ].map((opt) => (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => setHasKids(opt.value)}
                className={cn(
                  'flex flex-col items-center gap-2.5 p-5 rounded-xl border-2 transition-all duration-200',
                  hasKids === opt.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border/60 hover:border-primary/30'
                )}
              >
                <span className="text-2xl">{opt.emoji}</span>
                <span className="text-xs font-medium text-center leading-tight">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between p-5 rounded-xl border border-border/60 bg-muted/20">
          <div>
            <p className="text-sm font-medium">Any picky eaters?</p>
            <p className="text-xs text-muted-foreground mt-1">Mild, familiar, guaranteed crowd-pleasing</p>
          </div>
          <Toggle checked={pickyEater} onChange={() => setPickyEater(!pickyEater)} />
        </div>
      </div>
    </div>
  )
}

// ─── Step 3: Cuisine + dislikes ────────────────────────────────────────────────

function StepCuisine({
  cuisines,
  setCuisines,
  dislikedFoods,
  setDislikedFoods,
}: {
  cuisines: string[]
  setCuisines: (v: string[]) => void
  dislikedFoods: string[]
  setDislikedFoods: (v: string[]) => void
}) {
  const [input, setInput] = useState('')

  const toggleCuisine = (label: string) => {
    setCuisines(
      cuisines.includes(label) ? cuisines.filter((c) => c !== label) : [...cuisines, label]
    )
  }

  const addFood = () => {
    const trimmed = input.trim()
    if (trimmed && !dislikedFoods.includes(trimmed)) {
      setDislikedFoods([...dislikedFoods, trimmed])
    }
    setInput('')
  }

  return (
    <div className="space-y-7">
      <div>
        <p className="text-sm font-medium text-primary mb-2">Step 3 of 5</p>
        <h1 className="text-2xl font-bold tracking-tight">What cuisines do you love?</h1>
        <p className="text-muted-foreground mt-2 text-sm">We’ll lean toward these when picking your meals.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {CUISINES.map((c) => {
          const active = cuisines.includes(c.label)
          return (
            <button
              key={c.label}
              type="button"
              onClick={() => toggleCuisine(c.label)}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'border-border/60 hover:border-primary/50 hover:bg-muted/30'
              )}
            >
              {c.emoji} {c.label}
            </button>
          )
        })}
      </div>

      <div>
        <p className="text-sm font-medium mb-2.5">Any foods to avoid?</p>
        <div className="flex gap-2">
          <Input
            placeholder="e.g. cilantro, mushrooms…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFood() } }}
            className="flex-1"
          />
          <Button variant="outline" size="sm" onClick={addFood} disabled={!input.trim()}>
            Add
          </Button>
        </div>
        {dislikedFoods.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {dislikedFoods.map((f) => (
              <span key={f} className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-full bg-muted/60 border border-border/60">
                {f}
                <button
                  type="button"
                  onClick={() => setDislikedFoods(dislikedFoods.filter((x) => x !== f))}
                  className="ml-0.5 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Step 4: Lifestyle ────────────────────────────────────────────────────────

function StepLifestyle({
  cookingTimeMinutes,
  setCookingTimeMinutes,
  lowEnergy,
  setLowEnergy,
}: {
  cookingTimeMinutes: number
  setCookingTimeMinutes: (v: number) => void
  lowEnergy: boolean
  setLowEnergy: (v: boolean) => void
}) {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-primary mb-2">Step 4 of 5</p>
        <h1 className="text-2xl font-bold tracking-tight">How much time do you usually have?</h1>
        <p className="text-muted-foreground mt-2 text-sm">We’ll match every suggestion to your real schedule.</p>
      </div>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium mb-3">How long can you spare for dinner?</p>
          <div className="flex flex-wrap gap-2">
            {COOKING_TIMES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setCookingTimeMinutes(t.value)}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all duration-200',
                  cookingTimeMinutes === t.value
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border/60 hover:border-primary/30'
                )}
              >
                <span>{t.emoji}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between p-5 rounded-xl border-2 border-border/60">
          <div className="flex items-start gap-3">
            <span className="text-xl mt-0.5">⚡</span>
            <div>
              <p className="text-sm font-medium">Low energy mode</p>
              <p className="text-xs text-muted-foreground mt-0.5">On hard days, we’ll suggest meals under 20 minutes.</p>
            </div>
          </div>
          <Toggle checked={lowEnergy} onChange={() => setLowEnergy(!lowEnergy)} />
        </div>
      </div>
    </div>
  )
}

// ─── Step 5: Location ─────────────────────────────────────────────────────────

function StepLocation({
  country,
  setCountry,
  storePreference,
  setStorePreference,
}: {
  country: string
  setCountry: (v: string) => void
  storePreference: string
  setStorePreference: (v: string) => void
}) {
  return (
    <div className="space-y-7">
      <div>
        <p className="text-sm font-medium text-primary mb-2">Step 5 of 5</p>
        <h1 className="text-2xl font-bold tracking-tight">Where are you based?</h1>
        <p className="text-muted-foreground mt-2 text-sm">We’ll suggest ingredients you can actually find nearby.</p>
      </div>
      <div className="space-y-4">
        <div>
          <label htmlFor="country" className="text-sm font-medium mb-2 block">Country</label>
          <Select value={country || undefined} onValueChange={(v) => v && setCountry(v)}>
            <SelectTrigger id="country" className="w-full">
              <SelectValue placeholder="Select your country" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="store" className="text-sm font-medium mb-2 block">
            Favorite grocery store{' '}
            <span className="text-muted-foreground font-normal">(optional)</span>
          </label>
          <Input
            id="store"
            placeholder="e.g. Whole Foods, Trader Joe's, Costco…"
            value={storePreference}
            onChange={(e) => setStorePreference(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}

// ─── Done screen ──────────────────────────────────────────────────────────────

function StepDone({
  householdType,
  cuisines,
  cookingTimeMinutes,
  country,
  pickyEater,
  lowEnergy,
  onFinish,
  onSkip,
  saving,
}: {
  householdType: HouseholdType | null
  cuisines: string[]
  cookingTimeMinutes: number
  country: string
  pickyEater: boolean
  lowEnergy: boolean
  onFinish: () => void
  onSkip: () => void
  saving: boolean
}) {
  const householdLabels: Record<HouseholdType, string> = { solo: 'Solo', couple: 'Couple', family: 'Family' }
  const summaryItems = [
    householdType && householdLabels[householdType],
    cuisines.length > 0 && `${cuisines.slice(0, 2).join(', ')}${cuisines.length > 2 ? ` +${cuisines.length - 2}` : ''}`,
    `${cookingTimeMinutes} min meals`,
    pickyEater && 'Picky-eater friendly',
    lowEnergy && 'Low energy mode',
    country || null,
  ].filter(Boolean) as string[]

  return (
    <div className="text-center space-y-8 py-4">
      <div>
        <div className="text-5xl mb-5">🎉</div>
        <h1 className="text-2xl font-bold tracking-tight">Your family profile is ready.</h1>
        <p className="text-muted-foreground mt-2.5 text-sm leading-relaxed max-w-xs mx-auto">
          MealEase now knows your household. Every suggestion from here is shaped around your family — and it gets more precise the more you use it.
        </p>
      </div>

      {summaryItems.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center">
          {summaryItems.map((item, i) => (
            <span key={i} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">
              <Check className="h-3 w-3" />
              {item}
            </span>
          ))}
        </div>
      )}

      <div className="space-y-3 pt-1">
        <Button
          onClick={onFinish}
          disabled={saving}
          size="lg"
          className="w-full gap-2 gradient-sage text-white border-0 shadow-md shadow-primary/20"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>✨</span>}
          See what we picked for you
        </Button>
        <button
          type="button"
          onClick={onSkip}
          className="block w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
        >
          Skip for now — I’ll explore first
        </button>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter()
  const store = useLightOnboardingStore()
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [saving, setSaving] = useState(false)

  const goTo = (next: number, dir: 1 | -1) => {
    setDirection(dir)
    setStep(next)
  }

  const handleAdvance = () => {
    // Step 1 (family details) is skipped for solo households
    const next = step === 0 && store.householdType === 'solo' ? 2 : step + 1
    goTo(Math.min(next, 5), 1)
  }

  const handleBack = () => {
    // Mirror the skip logic when going backwards
    const prev = step === 2 && store.householdType === 'solo' ? 0 : step - 1
    goTo(Math.max(prev, 0), -1)
  }

  const handleSkip = () => router.push('/dashboard')

  const handleFinish = async () => {
    store.markCompleted()
    setSaving(true)
    // Fire-and-forget — never blocks navigation
    fetch('/api/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        household_type:        store.householdType,
        has_kids:              store.hasKids,
        picky_eater:           store.pickyEater,
        cuisines:              store.cuisines,
        disliked_foods:        store.dislikedFoods,
        cooking_time_minutes:  store.cookingTimeMinutes,
        low_energy:            store.lowEnergy,
        country:               store.country,
        store_preference:      store.storePreference,
      }),
    }).catch(() => {}) // Silent — data is already in localStorage
    toast.success("Preferences saved! Let's start cooking. 🍽️")
    setSaving(false)
    router.push('/dashboard')
  }

  // Steps 1–5 show the footer nav; step 0 auto-advances on selection
  const showBottomNav = step >= 1 && step <= 5

  return (
    <div className="min-h-[100dvh] gradient-hero flex flex-col">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-6 pt-6 pb-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <MealEaseLogo size="sm" />
        </div>
        <button
          type="button"
          onClick={handleSkip}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Skip for now →
        </button>
      </header>

      {/* ── Progress bar ─────────────────────────────────────────────────────── */}
      {step < 5 && (
        <div className="px-6 py-4 flex-shrink-0">
          <Progress value={(step / 5) * 100} className="h-2" />
        </div>
      )}

      {/* ── Step content ─────────────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-4 overflow-x-hidden">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {step === 0 && (
                <StepHousehold
                  value={store.householdType}
                  onSelect={(type) => {
                    store.setHouseholdType(type)
                    goTo(type === 'solo' ? 2 : 1, 1)
                  }}
                />
              )}
              {step === 1 && (
                <StepFamily
                  hasKids={store.hasKids}
                  setHasKids={store.setHasKids}
                  pickyEater={store.pickyEater}
                  setPickyEater={store.setPickyEater}
                />
              )}
              {step === 2 && (
                <StepCuisine
                  cuisines={store.cuisines}
                  setCuisines={store.setCuisines}
                  dislikedFoods={store.dislikedFoods}
                  setDislikedFoods={store.setDislikedFoods}
                />
              )}
              {step === 3 && (
                <StepLifestyle
                  cookingTimeMinutes={store.cookingTimeMinutes}
                  setCookingTimeMinutes={store.setCookingTimeMinutes}
                  lowEnergy={store.lowEnergy}
                  setLowEnergy={store.setLowEnergy}
                />
              )}
              {step === 4 && (
                <StepLocation
                  country={store.country}
                  setCountry={store.setCountry}
                  storePreference={store.storePreference}
                  setStorePreference={store.setStorePreference}
                />
              )}
              {step === 5 && (
                <StepDone
                  householdType={store.householdType}
                  cuisines={store.cuisines}
                  cookingTimeMinutes={store.cookingTimeMinutes}
                  country={store.country}
                  pickyEater={store.pickyEater}
                  lowEnergy={store.lowEnergy}
                  onFinish={handleFinish}
                  onSkip={handleSkip}
                  saving={saving}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Bottom nav (steps 1–5) ───────────────────────────────────────────── */}
      {showBottomNav && (
        <footer className="flex items-center justify-between px-6 py-5 border-t border-border/40 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="gap-1 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
          {step < 5 && (
            <Button size="sm" onClick={handleAdvance} className="gap-1.5 px-5">
              Continue
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </footer>
      )}
    </div>
  )
}

