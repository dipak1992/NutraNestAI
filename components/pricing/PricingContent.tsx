'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  Check,
  Crown,
  Sparkles,
  Star,
  Shield,
  Users,
  Quote,
  ArrowRight,
  Zap,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { usePaywallStatus } from '@/lib/paywall/use-paywall-status'

// ── Pricing data ──────────────────────────────────────────────

const MONTHLY_PRICE = 9.99
const ANNUAL_PRICE = 79.99
const FULL_ANNUAL_PRICE = (MONTHLY_PRICE * 12).toFixed(2) // $119.88
const ANNUAL_MONTHLY = Math.round((ANNUAL_PRICE / 12) * 100) / 100 // $6.67
const ANNUAL_SAVINGS = Math.round((1 - ANNUAL_PRICE / (MONTHLY_PRICE * 12)) * 100) // 33%

const TESTIMONIALS = [
  {
    quote: "Monday through Friday, meals are just handled. Then Friday night rolls around and Weekend Mode picks a movie and dinner for us. My kids think I'm magic.",
    name: 'Sarah M.',
    role: 'Mom of 2',
    emoji: '👩‍👧‍👦',
  },
  {
    quote: 'Living solo, I used to default to the same 3 takeout places. Now MealEase keeps things interesting — and Weekend Mode gives me a movie night I actually look forward to.',
    name: 'James K.',
    role: 'Works from home',
    emoji: '👨‍💻',
  },
  {
    quote: 'My partner and I could never agree on dinner. Now MealEase picks something we both love and Weekend Mode is our new Friday ritual.',
    name: 'Priya R.',
    role: 'Half of a busy couple',
    emoji: '💑',
  },
]

const COMPARISON_FEATURES = [
  { feature: 'Tonight meal previews', free: '2 per day', pro: 'Unlimited' },
  { feature: 'Weekly meal plan', free: '3-day preview', pro: 'Full 7 days' },
  { feature: 'Smart grocery list', free: false, pro: true },
  { feature: 'Pantry Magic tools', free: false, pro: true },
  { feature: 'Image-to-meal', free: false, pro: true },
  { feature: 'Household meal variations', free: '3 max', pro: 'Unlimited' },
  { feature: 'Adaptive learning', free: false, pro: true },
  { feature: 'Plan publishing & sharing', free: false, pro: true },
  { feature: 'Weekend Mode 🎬', free: false, pro: true },
]

const FAQ = [
  {
    q: 'What happens during my 7-day free trial?',
    a: 'You get full Pro access — the complete weekly planner, grocery list, Pantry Magic, Weekend Mode, and unlimited swipes. No credit card needed. After 7 days, you simply choose to subscribe or stay on Free.',
  },
  {
    q: 'What can I do on the free plan?',
    a: 'Preview meal ideas instantly, try 2 Tonight swipes per day, and see 3 days of your weekly plan. It\'s enough to feel whether MealEase fits your routine.',
  },
  {
    q: 'What is Weekend Mode?',
    a: 'Every Friday and Saturday evening, Pro users get a curated dinner + movie pairing — a complete night-in experience picked just for you. Think of it as a personal concierge for your weekend.',
  },
  {
    q: 'Is annual billing worth it?',
    a: `Annual saves you ${ANNUAL_SAVINGS}% compared to monthly — that's $${(MONTHLY_PRICE * 12 - ANNUAL_PRICE).toFixed(2)} back in your pocket every year. Most users choose annual after their first month.`,
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Cancel with one click — your plan stays active until the end of the current billing period. No questions, no fees. Full refund within 14 days if Pro isn\'t right for you.',
  },
  {
    q: 'Does one plan cover my whole family?',
    a: 'Yes. One Pro subscription covers your entire household — whether you\'re solo, a couple, or a full family. MealEase adapts each meal for everyone at the table.',
  },
]

// ── Component ─────────────────────────────────────────────────

export function PricingContent() {
  const [isAnnual, setIsAnnual] = useState(true)
  const [isStartingTrial, setIsStartingTrial] = useState(false)
  const { status, loading: paywallLoading } = usePaywallStatus()
  const router = useRouter()

  const plan = isAnnual ? 'yearly' : 'monthly'

  const handleStartTrial = useCallback(async () => {
    if (!status.isAuthenticated) {
      router.push('/signup?plan=pro&trial=1')
      return
    }

    if (status.isPro) {
      toast.info('You already have Pro!')
      return
    }

    setIsStartingTrial(true)
    try {
      const res = await fetch('/api/paywall/start-trial', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Could not start trial')
        return
      }
      toast.success('Your 7-day Pro trial is active!', {
        description: 'Enjoy full access to every feature.',
      })
      router.push('/dashboard')
      router.refresh()
    } catch {
      toast.error('Something went wrong. Try again.')
    } finally {
      setIsStartingTrial(false)
    }
  }, [status, router])

  const handleCheckout = useCallback(async () => {
    if (!status.isAuthenticated) {
      router.push(`/signup?plan=pro`)
      return
    }

    try {
      const res = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()

      if (data.error === 'billing_not_configured') {
        handleStartTrial()
        return
      }

      if (!res.ok) {
        toast.error(data.error || 'Could not start checkout')
        return
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      toast.error('Something went wrong. Try again.')
    }
  }, [plan, status, router, handleStartTrial])

  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      {/* ── Hero ── */}
      <div className="text-center mb-16">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/8 px-4 py-2 text-sm font-medium text-primary">
          <Sparkles className="h-4 w-4" />
          Weeknights planned. Weekends curated.
        </div>

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-[3.5rem] leading-[1.1] mb-5">
          Stop deciding what&rsquo;s for dinner.
          <span className="block text-gradient-sage mt-1">Start enjoying it.</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
          MealEase plans your weeknight meals in seconds — then surprises you with
          a <strong className="text-foreground">dinner + movie night</strong> every weekend. One subscription, every mouth at the table.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> 7-day free trial</span>
          <span className="text-border">|</span>
          <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> No credit card</span>
          <span className="text-border">|</span>
          <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> Cancel anytime</span>
        </div>
      </div>

      {/* ── Billing toggle ── */}
      <div className="flex items-center justify-center gap-1 mb-12">
        <div className="inline-flex rounded-full border border-border/60 bg-muted/40 p-1">
          <button
            onClick={() => setIsAnnual(false)}
            className={`text-sm font-medium px-5 py-2 rounded-full transition-all ${
              !isAnnual
                ? 'bg-white text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={`text-sm font-medium px-5 py-2 rounded-full transition-all flex items-center gap-2 ${
              isAnnual
                ? 'bg-white text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Annual
            <Badge className="border-0 bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              -{ANNUAL_SAVINGS}%
            </Badge>
          </button>
        </div>
      </div>

      {/* ── Pricing cards ── */}
      <div className="mx-auto mb-20 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 items-start">
        {/* Free tier */}
        <div className="relative flex flex-col rounded-3xl border border-border/60 bg-white/80 p-8">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-2xl bg-muted p-3">
                <Sparkles className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Free</h2>
                <p className="text-sm text-muted-foreground">
                  Taste what MealEase can do
                </p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-4xl font-bold tracking-tight">$0</p>
              <p className="text-sm text-muted-foreground mt-1">No commitment</p>
            </div>
          </div>

          <ul className="mb-8 flex-1 space-y-3.5">
            {[
              'Instant meal previews',
              '2 Tonight swipes per day',
              '3-day weekly plan preview',
              '3 kid recipe variations',
            ].map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span>{f}</span>
              </li>
            ))}
            {[
              'Full 7-day planner',
              'Grocery list',
              'Weekend Mode',
            ].map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm text-muted-foreground/60">
                <X className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <Button asChild variant="outline" size="lg" className="w-full">
            <Link href="/signup">Get started free</Link>
          </Button>
        </div>

        {/* Pro tier */}
        <div className="relative flex flex-col rounded-3xl border-2 border-primary/30 bg-white p-8 shadow-xl shadow-primary/8 md:-translate-y-3">
          <span className="absolute -top-3.5 left-7 rounded-full gradient-sage px-4 py-1.5 text-xs font-bold text-white tracking-wide shadow-md shadow-primary/20">
            MOST POPULAR
          </span>

          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-2xl bg-gradient-to-br from-primary to-emerald-600 p-3 text-white shadow-md shadow-primary/20">
                <Crown className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Pro</h2>
                <p className="text-sm text-muted-foreground">
                  Weeknights handled. Weekends elevated.
                </p>
              </div>
            </div>

            <div className="mt-4">
              {isAnnual ? (
                <>
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-bold tracking-tight">
                      ${ANNUAL_MONTHLY.toFixed(2)}
                      <span className="ml-1 text-base font-normal text-muted-foreground">/mo</span>
                    </p>
                    <span className="text-sm text-muted-foreground line-through">${MONTHLY_PRICE}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge className="bg-emerald-100 text-emerald-800 border-0 text-[11px] font-bold">Save {ANNUAL_SAVINGS}%</Badge>
                    <p className="text-sm text-muted-foreground">
                      ${ANNUAL_PRICE}/year · billed annually
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-4xl font-bold tracking-tight">
                    ${MONTHLY_PRICE}
                    <span className="ml-1 text-base font-normal text-muted-foreground">/month</span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Less than one takeout dinner
                  </p>
                </>
              )}
            </div>
          </div>

          <ul className="mb-6 flex-1 space-y-3.5">
            {[
              'Full 7-day meal planner',
              'Smart auto-built grocery list',
              'Pantry Magic tools',
              'Unlimited Tonight swipes',
              'Adaptive learning for your household',
              'Unlimited kid recipe variations',
              'Image-to-meal & plan sharing',
            ].map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          {/* Weekend Mode spotlight */}
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-amber-200/70 bg-gradient-to-r from-amber-50/80 to-yellow-50/60 px-4 py-3.5">
            <span className="text-2xl">🎬</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-amber-900">Weekend Mode included</p>
              <p className="text-[12px] text-amber-700/70 mt-0.5 leading-snug">
                Curated dinner + movie night every Fri & Sat — the perk members love most.
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            <Button
              size="lg"
              className="w-full gradient-sage border-0 text-white hover:opacity-90 shadow-md shadow-primary/15 gap-2 text-[15px]"
              onClick={handleStartTrial}
              disabled={isStartingTrial || (status.isPro && !paywallLoading)}
            >
              {isStartingTrial
                ? 'Starting trial…'
                : status.isPro
                ? 'You have Pro'
                : 'Try Pro free for 7 days'}
              {!isStartingTrial && !status.isPro && <ArrowRight className="h-4 w-4" />}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              No credit card required · Cancel anytime
            </p>
            {!status.isPro && (
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={handleCheckout}
              >
                Subscribe now — ${isAnnual ? `${ANNUAL_PRICE}/yr` : `${MONTHLY_PRICE}/mo`}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ── Weekend Mode spotlight ── */}
      <div className="mx-auto max-w-4xl mb-20">
        <div className="relative overflow-hidden rounded-3xl border border-amber-200/60 bg-gradient-to-br from-amber-50/80 via-white to-yellow-50/40 px-8 py-10 sm:px-12 sm:py-12 text-center">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-amber-200/20 blur-3xl" />
          <div className="pointer-events-none absolute -left-12 -bottom-12 h-40 w-40 rounded-full bg-yellow-200/15 blur-3xl" />

          <div className="relative">
            <span className="text-5xl mb-4 block">🎬🍽️</span>
            <Badge className="mb-4 border-amber-300 bg-amber-100 text-amber-900 text-xs font-bold">
              PRO EXCLUSIVE
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
              Weekend Mode
            </h2>
            <p className="mx-auto max-w-lg text-muted-foreground leading-relaxed">
              Every Friday and Saturday, Pro members get a curated dinner + movie pairing —
              a complete night-in experience picked just for you. No planning, no scrolling, just enjoy.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm font-medium text-amber-900">
              <span className="flex items-center gap-1.5 rounded-full bg-amber-100/80 px-3 py-1.5">
                <Zap className="h-3.5 w-3.5" /> Auto-paired dinners
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-amber-100/80 px-3 py-1.5">
                🎬 Curated movie picks
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-amber-100/80 px-3 py-1.5">
                🔄 Swap until it&rsquo;s perfect
              </span>
            </div>
            {!status.isPro && (
              <Button
                size="lg"
                className="mt-8 gradient-sage border-0 text-white hover:opacity-90 shadow-md shadow-primary/15 gap-2"
                onClick={handleStartTrial}
                disabled={isStartingTrial}
              >
                {isStartingTrial ? 'Starting trial…' : 'Unlock Weekend Mode — free for 7 days'}
                {!isStartingTrial && <ArrowRight className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ── Social proof ── */}
      <div className="mx-auto max-w-5xl mb-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <h2 className="text-2xl font-bold tracking-tight">People are loving this</h2>
          <p className="mt-2 text-sm text-muted-foreground">Real feedback from real households</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {TESTIMONIALS.map(({ quote, name, role, emoji }) => (
            <div
              key={name}
              className="glass-card rounded-2xl border border-border/50 p-6 relative"
            >
              <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/8" />
              <p className="text-sm leading-relaxed text-foreground mb-5">
                &ldquo;{quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{emoji}</span>
                <div>
                  <p className="text-sm font-semibold">{name}</p>
                  <p className="text-xs text-muted-foreground">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Comparison table ── */}
      <div className="mx-auto max-w-3xl mb-20">
        <h2 className="text-2xl font-bold text-center mb-3 tracking-tight">
          Free vs Pro — side by side
        </h2>
        <p className="text-center text-sm text-muted-foreground mb-8">
          See exactly what you get at every level
        </p>
        <div className="rounded-2xl border border-border/60 overflow-hidden">
          <div className="grid grid-cols-3 bg-muted/50 text-sm font-semibold">
            <div className="px-5 py-3.5">Feature</div>
            <div className="px-5 py-3.5 text-center">Free</div>
            <div className="px-5 py-3.5 text-center text-primary">Pro</div>
          </div>
          {COMPARISON_FEATURES.map(({ feature, free, pro }, i) => (
            <div
              key={feature}
              className={`grid grid-cols-3 text-sm ${
                i % 2 === 0 ? 'bg-background' : 'bg-muted/20'
              } ${feature.includes('Weekend') ? 'bg-amber-50/50' : ''}`}
            >
              <div className={`px-5 py-3.5 font-medium ${feature.includes('Weekend') ? 'text-amber-900' : ''}`}>
                {feature}
              </div>
              <div className="px-5 py-3.5 text-center text-muted-foreground">
                {typeof free === 'boolean' ? (
                  free ? (
                    <Check className="mx-auto h-4 w-4 text-emerald-600" />
                  ) : (
                    <span className="text-muted-foreground/40">—</span>
                  )
                ) : (
                  free
                )}
              </div>
              <div className="px-5 py-3.5 text-center font-medium">
                {typeof pro === 'boolean' ? (
                  pro ? (
                    <Check className="mx-auto h-4 w-4 text-emerald-600" />
                  ) : (
                    <span className="text-muted-foreground/40">—</span>
                  )
                ) : (
                  pro
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Guarantee ── */}
      <div className="mx-auto max-w-3xl mb-16">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 px-6 py-5 flex items-center gap-4">
          <Shield className="h-8 w-8 text-emerald-600 flex-shrink-0" />
          <div>
            <p className="font-bold text-sm">Risk-free guarantee</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Cancel anytime with one click. Full refund within 14 days if Pro isn&rsquo;t right for you. No questions asked.
            </p>
          </div>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div className="mx-auto max-w-3xl mb-16">
        <h2 className="mb-8 text-center text-2xl font-bold tracking-tight">
          Common Questions
        </h2>
        <Accordion className="space-y-2">
          {FAQ.map(({ q, a }, i) => (
            <AccordionItem
              key={q}
              value={`faq-${i}`}
              className="glass-card rounded-2xl border border-border/50 px-5"
            >
              <AccordionTrigger className="font-semibold text-sm text-left py-4 hover:no-underline">
                {q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground pb-4">
                {a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* ── Bottom CTA ── */}
      <div className="text-center">
        <h3 className="text-xl font-bold tracking-tight mb-2">
          Ready for stress-free dinners?
        </h3>
        <p className="text-muted-foreground mb-6 text-sm">
          Join households who never ask &ldquo;what&rsquo;s for dinner?&rdquo; again.
        </p>
        {!status.isPro ? (
          <Button
            size="lg"
            className="gradient-sage border-0 text-white hover:opacity-90 shadow-md shadow-primary/15 gap-2"
            onClick={handleStartTrial}
            disabled={isStartingTrial}
          >
            {isStartingTrial ? 'Starting trial…' : 'Start your free trial'}
            {!isStartingTrial && <ArrowRight className="h-4 w-4" />}
          </Button>
        ) : (
          <Button asChild size="lg" variant="outline">
            <Link href="/dashboard">Go to dashboard</Link>
          </Button>
        )}
        <p className="text-muted-foreground text-xs mt-8">
          Questions?{' '}
          <a
            href="mailto:hello@mealeaseai.com"
            className="text-primary hover:underline"
          >
            hello@mealeaseai.com
          </a>
        </p>
      </div>
    </div>
  )
}
