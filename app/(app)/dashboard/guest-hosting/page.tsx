'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  UtensilsCrossed,
  Users,
  DollarSign,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  ChefHat,
  ShoppingCart,
  Clock,
  Minus,
  Plus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { PaywallDialog } from '@/components/paywall/PaywallDialog'
import { usePaywallStatus } from '@/lib/paywall/use-paywall-status'
import { getFeatures } from '@/lib/pillars/config'
import { cn } from '@/lib/utils'

// ── Types ─────────────────────────────────────────────────────────────────────

interface GuestPlanResult {
  menuName: string
  courses: {
    type: string
    name: string
    servings: number
    prepTime: string
  }[]
  shoppingList: string[]
  totalPrepTime: string
  estimatedCost: string
  hostingTip: string
}

type BudgetLevel = 'budget' | 'moderate' | 'premium'

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function GuestHostingPage() {
  const router = useRouter()
  const { status, loading: paywallLoading } = usePaywallStatus()
  const features = useMemo(() => getFeatures(status.tier), [status.tier])
  const [paywallOpen, setPaywallOpen] = useState(false)

  // Form state
  const [guestCount, setGuestCount] = useState(4)
  const [budget, setBudget] = useState<BudgetLevel>('moderate')
  const [dietaryNotes, setDietaryNotes] = useState('')
  const [occasion, setOccasion] = useState('')

  // Result state
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState<GuestPlanResult | null>(null)

  // Gate check
  useEffect(() => {
    if (!paywallLoading && !features.guestHostingPlanner) {
      setPaywallOpen(true)
    }
  }, [paywallLoading, features.guestHostingPlanner])

  const handleGenerate = useCallback(async () => {
    setGenerating(true)
    setResult(null)

    try {
      const res = await fetch('/api/guest-hosting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestCount,
          budget,
          dietaryNotes: dietaryNotes || undefined,
          occasion: occasion || undefined,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setResult(data)
      }
    } catch {
      // silent
    } finally {
      setGenerating(false)
    }
  }, [guestCount, budget, dietaryNotes, occasion])

  const budgetOptions: { value: BudgetLevel; label: string; emoji: string }[] = [
    { value: 'budget', label: 'Budget', emoji: '💰' },
    { value: 'moderate', label: 'Moderate', emoji: '🍽️' },
    { value: 'premium', label: 'Premium', emoji: '✨' },
  ]

  const occasions = [
    'Dinner Party',
    'Birthday',
    'Holiday',
    'Game Night',
    'BBQ',
    'Brunch',
  ]

  return (
    <div
      className="min-h-screen"
      style={{
        background: 'linear-gradient(180deg, #fef7f0 0%, #fed7aa 15%, #ffffff 40%, #ffffff 100%)',
      }}
    >
      <div className="mx-auto max-w-lg px-5 pb-16 pt-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/dashboard/household')}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Household
          </button>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100">
              <UtensilsCrossed className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                Guest Hosting Planner
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Plan the perfect dinner for guests
              </p>
            </div>
          </div>
        </div>

        {features.guestHostingPlanner && !result && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            {/* Guest count */}
            <div className="rounded-2xl border border-orange-200/60 bg-gradient-to-br from-orange-50 to-amber-50/80 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-4 w-4 text-orange-600" />
                <h2 className="text-sm font-bold text-foreground">How many guests?</h2>
              </div>
              <div className="flex items-center justify-center gap-4">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-10 w-10 rounded-full"
                  onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                  disabled={guestCount <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="text-center">
                  <span className="text-4xl font-bold text-foreground">{guestCount}</span>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {guestCount === 1 ? 'guest' : 'guests'}
                  </p>
                </div>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-10 w-10 rounded-full"
                  onClick={() => setGuestCount(Math.min(20, guestCount + 1))}
                  disabled={guestCount >= 20}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Budget */}
            <div className="rounded-2xl border border-border/60 bg-white p-5">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="h-4 w-4 text-emerald-600" />
                <h2 className="text-sm font-bold text-foreground">Budget</h2>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {budgetOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setBudget(opt.value)}
                    className={cn(
                      'rounded-xl border p-3 text-center transition-all',
                      budget === opt.value
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-border/60 hover:border-primary/40',
                    )}
                  >
                    <span className="text-lg">{opt.emoji}</span>
                    <p className={cn(
                      'text-xs font-medium mt-1',
                      budget === opt.value ? 'text-primary' : 'text-foreground',
                    )}>
                      {opt.label}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Occasion */}
            <div className="rounded-2xl border border-border/60 bg-white p-5">
              <h2 className="text-sm font-bold text-foreground mb-3">Occasion (optional)</h2>
              <div className="flex flex-wrap gap-2">
                {occasions.map((occ) => (
                  <button
                    key={occ}
                    onClick={() => setOccasion(occasion === occ ? '' : occ)}
                    className={cn(
                      'rounded-full border px-3 py-1.5 text-xs font-medium transition-all',
                      occasion === occ
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border/60 text-foreground hover:border-primary/40',
                    )}
                  >
                    {occ}
                  </button>
                ))}
              </div>
            </div>

            {/* Dietary notes */}
            <div className="rounded-2xl border border-border/60 bg-white p-5">
              <h2 className="text-sm font-bold text-foreground mb-3">
                Guest dietary needs (optional)
              </h2>
              <Input
                placeholder="e.g., 2 vegetarians, 1 gluten-free"
                value={dietaryNotes}
                onChange={(e) => setDietaryNotes(e.target.value)}
              />
            </div>

            {/* Generate button */}
            <Button
              size="lg"
              className="w-full shadow-md gap-2"
              onClick={handleGenerate}
              disabled={generating}
            >
              {generating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Planning your menu...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Plan My Dinner
                </>
              )}
            </Button>
          </motion.div>
        )}

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="space-y-4"
            >
              {/* Menu header */}
              <div className="rounded-2xl border border-orange-200/60 bg-gradient-to-br from-orange-50 to-amber-50/80 p-5">
                <div className="flex items-start justify-between mb-2">
                  <h2 className="text-xl font-bold text-foreground">
                    {result.menuName}
                  </h2>
                  <Badge className="bg-orange-100 text-orange-700 border-0 text-xs">
                    {guestCount} guests
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {result.totalPrepTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-3.5 w-3.5" /> {result.estimatedCost}
                  </span>
                </div>
              </div>

              {/* Courses */}
              <div className="rounded-2xl border border-border/60 bg-white p-5">
                <div className="flex items-center gap-2 mb-4">
                  <ChefHat className="h-4 w-4 text-orange-600" />
                  <h3 className="text-sm font-bold text-foreground">Menu</h3>
                </div>
                <div className="space-y-3">
                  {result.courses.map((course, i) => (
                    <div
                      key={i}
                      className={cn(
                        'flex items-start justify-between py-2',
                        i < result.courses.length - 1 && 'border-b border-border/40',
                      )}
                    >
                      <div>
                        <Badge variant="secondary" className="text-[10px] mb-1">
                          {course.type}
                        </Badge>
                        <p className="text-sm font-semibold text-foreground">
                          {course.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {course.servings} servings · {course.prepTime}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shopping list */}
              <div className="rounded-2xl border border-border/60 bg-white p-5">
                <div className="flex items-center gap-2 mb-3">
                  <ShoppingCart className="h-4 w-4 text-emerald-600" />
                  <h3 className="text-sm font-bold text-foreground">Shopping List</h3>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {result.shoppingList.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-xs text-foreground"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Hosting tip */}
              {result.hostingTip && (
                <div className="rounded-lg bg-orange-50 border border-orange-200/40 px-4 py-3">
                  <p className="text-xs text-orange-800">🍷 {result.hostingTip}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 gap-1.5"
                  onClick={() => {
                    setResult(null)
                  }}
                >
                  <RefreshCw className="h-3.5 w-3.5" /> New Plan
                </Button>
                <Button
                  className="flex-1 gap-1.5"
                  onClick={handleGenerate}
                  disabled={generating}
                >
                  <Sparkles className="h-3.5 w-3.5" /> Regenerate
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <PaywallDialog
        open={paywallOpen}
        onOpenChange={setPaywallOpen}
        title="Unlock Guest Hosting"
        description="Family Plus includes a guest hosting planner — set guest count, dietary needs, and get a complete menu with shopping list."
        isAuthenticated={status.isAuthenticated}
        redirectPath="/dashboard/guest-hosting"
      />
    </div>
  )
}
