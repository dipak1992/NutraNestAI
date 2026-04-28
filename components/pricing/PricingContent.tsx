'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { usePaywallStatus } from '@/lib/paywall/use-paywall-status'
import { PRICING_TIERS, PRO_ANNUAL_SAVINGS } from '@/lib/paywall/config'
import { cn } from '@/lib/utils'

/* ─────────────────────── DATA ─────────────────────── */

const FREE_FEATURES = [
  'Tonight Suggestions (3/day)',
  'Snap & Cook (3 scans/week)',
  'Basic grocery list',
  '1 member profile',
  'Basic dietary filters',
]

const PLUS_FEATURES = [
  'Unlimited meal generations',
  'Unlimited Snap & Cook',
  'Full 7-day Weekly Planner',
  'Weekly Autopilot',
  'Smart Menu Scan ✨',
  'Food Check — calorie snap ✨',
  'Budget meal mode',
  'Healthy mode',
  'Up to 2 member profiles',
  'Household memory',
  'Saved preferences',
  'Meal history',
  'Faster AI responses',
]

const FAQ = [
  {
    q: 'Is there a free version?',
    a: 'Yes. The free plan gives you Tonight Suggestions, up to 3 meal ideas daily, and a basic grocery list — enough to experience how MealEase thinks. When you\'re ready for Weekly Autopilot or Household Memory, upgrade anytime. Plus includes a 7-day free trial.',
  },
  {
    q: 'What is a household profile?',
    a: 'A profile stores preferences, allergies, age groups, and food goals for one person. Profiles are not separate logins — they help MealEase personalize every meal for each person at your table. Free plan includes 1 profile. Plus includes up to 2.',
  },
  {
    q: 'What is Weekly Autopilot?',
    a: 'One tap, seven nights planned. Autopilot builds a full week of dinners tailored to your household — balancing variety, nutrition, prep time, and what you already have on hand. It generates a smart grocery list alongside it.',
  },
  {
    q: 'How does Household Memory work?',
    a: 'Every time you cook, save, skip, or swap a meal, MealEase quietly learns. It tracks which cuisines your household gravitates toward and which nights you tend to reach for something fast. Over weeks, your suggestions get sharper.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes — cancel with one click from your account settings. No questions asked. Your plan stays active until the end of the current billing period.',
  },
  {
    q: 'What is Smart Menu Scan?',
    a: 'Photograph any restaurant menu and choose a goal — lose weight, high protein, budget-friendly, or more. AI highlights exactly what to order based on your personal nutrition profile.',
  },
]

/* ─────────────────────── COMPONENT ─────────────────────── */

export function PricingContent() {
  const [isAnnual, setIsAnnual] = useState(true)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const { status, loading: paywallLoading } = usePaywallStatus()
  const router = useRouter()

  const proMonthly = PRICING_TIERS.pro.monthlyPrice   // 9.99
  const proAnnual  = PRICING_TIERS.pro.yearlyPrice    // 83
  const proAnnualMonthly = (proAnnual / 12).toFixed(2) // 6.92

  const handleCheckout = useCallback(async (plan: 'pro_monthly' | 'pro_yearly') => {
    if (!status.isAuthenticated) {
      router.push(`/signup?plan=${plan}`)
      return
    }
    if (status.isPro) {
      toast.info('You already have Plus!')
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
        // Fall back to trial start
        const trialRes = await fetch('/api/paywall/start-trial', { method: 'POST' })
        const trialData = await trialRes.json()
        if (!trialRes.ok) { toast.error(trialData.error || 'Could not start trial'); return }
        toast.success('Your 7-day free trial is active!')
        router.push('/dashboard')
        router.refresh()
        return
      }
      if (!res.ok) { toast.error(data.error || 'Could not start checkout'); return }
      if (data.url) window.location.href = data.url
    } catch {
      toast.error('Something went wrong. Try again.')
    }
  }, [status, router])

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">

      {/* ── HERO ── */}
      <section className="pt-16 pb-10 text-center px-4">
        <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
          Simple pricing.{' '}
          <span className="italic text-[#D97757]">No surprises.</span>
        </h1>
        <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">
          Start free. Upgrade when you&rsquo;re ready.
        </p>
      </section>

      {/* ── BILLING TOGGLE ── */}
      <section className="flex justify-center pb-8 px-4">
        <div className="inline-flex items-center rounded-full border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 p-1">
          <button
            onClick={() => setIsAnnual(false)}
            className={cn(
              'text-sm font-semibold px-5 py-2 rounded-full transition-all',
              !isAnnual
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 shadow-sm'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200',
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={cn(
              'text-sm font-semibold px-5 py-2 rounded-full transition-all flex items-center gap-2',
              isAnnual
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 shadow-sm'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200',
            )}
          >
            Annual
            <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              SAVE {PRO_ANNUAL_SAVINGS}%
            </span>
          </button>
        </div>
      </section>

      {/* ── PRICING CARDS ── */}
      <section className="pb-16 px-4">
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">

          {/* FREE */}
          <div className="relative flex flex-col h-full rounded-2xl p-8 bg-[#FDF6F1] dark:bg-neutral-900 ring-1 ring-black/5 dark:ring-white/5">
            <div className="mb-6">
              <div className="text-sm font-semibold uppercase tracking-widest mb-2 text-neutral-500 dark:text-neutral-400">
                Free
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-serif text-5xl font-bold text-neutral-900 dark:text-neutral-50">$0</span>
                <span className="text-sm text-neutral-500">/ forever</span>
              </div>
              <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                For households just getting started.
              </p>
            </div>

            <ul className="flex-1 space-y-3 mb-8">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>
                  <span className="text-neutral-700 dark:text-neutral-300">{f}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/signup"
              className="block w-full text-center rounded-xl border border-neutral-300 dark:border-neutral-700 py-3 text-sm font-semibold text-neutral-900 dark:text-neutral-50 hover:border-[#D97757] hover:text-[#D97757] transition-colors"
            >
              Start free
            </Link>
          </div>

          {/* PLUS */}
          <div className="relative flex flex-col h-full rounded-2xl p-8 bg-neutral-900 dark:bg-neutral-800 text-white ring-2 ring-[#D97757]">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-[#D97757] text-white text-xs font-semibold px-4 py-1 rounded-full whitespace-nowrap">
                Most popular
              </span>
            </div>

            <div className="mb-6">
              <div className="text-sm font-semibold uppercase tracking-widest mb-2 text-[#D97757]">
                Plus
              </div>
              <div className="flex items-baseline gap-1">
                {isAnnual ? (
                  <>
                    <span className="font-serif text-5xl font-bold">${proAnnualMonthly}</span>
                    <span className="text-sm text-neutral-400">/mo</span>
                    <span className="text-sm text-neutral-500 line-through ml-1">${proMonthly}</span>
                  </>
                ) : (
                  <>
                    <span className="font-serif text-5xl font-bold">${proMonthly}</span>
                    <span className="text-sm text-neutral-400">/month</span>
                  </>
                )}
              </div>
              {isAnnual && (
                <p className="mt-1 text-xs text-neutral-400">${proAnnual}/yr billed annually</p>
              )}
              <p className="mt-2 text-sm text-neutral-400">
                Everything you need to stop the dinner spiral.
              </p>
            </div>

            <ul className="flex-1 space-y-3 mb-8">
              {PLUS_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <span className="text-emerald-400 mt-0.5 flex-shrink-0">✓</span>
                  <span className="text-neutral-300">{f}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleCheckout(isAnnual ? 'pro_yearly' : 'pro_monthly')}
              disabled={paywallLoading || status.isPro}
              className="block w-full text-center rounded-xl bg-[#D97757] hover:bg-[#c4694a] disabled:opacity-60 py-3 text-sm font-semibold text-white transition-colors"
            >
              {status.isPro ? '✓ You have Plus' : 'Start free — upgrade anytime'}
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 mt-6">
          No credit card required · 7-day free trial · Cancel anytime
        </p>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 px-4 bg-[#FDF6F1] dark:bg-neutral-900">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 text-center mb-10">
            Common questions
          </h2>
          <div className="space-y-3">
            {FAQ.map(({ q, a }, i) => (
              <div
                key={q}
                className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left text-sm font-semibold text-neutral-900 dark:text-neutral-50 hover:text-[#D97757] transition-colors"
                >
                  {q}
                  <span className={cn('ml-4 flex-shrink-0 text-lg leading-none transition-transform', openFaq === i && 'rotate-45')}>+</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="py-16 px-4 text-center">
        <h3 className="font-serif text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-3">
          Ready to simplify dinner?
        </h3>
        <p className="text-neutral-500 dark:text-neutral-400 mb-8 text-sm max-w-md mx-auto">
          Join thousands of households who stopped stressing about meals. Start free, upgrade when you&rsquo;re ready.
        </p>
        {!status.isAuthenticated ? (
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-[#D97757] hover:bg-[#c4694a] px-8 py-3.5 text-sm font-semibold text-white transition-colors"
          >
            Get started free →
          </Link>
        ) : (
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 dark:border-neutral-700 px-8 py-3.5 text-sm font-semibold text-neutral-900 dark:text-neutral-50 hover:border-[#D97757] transition-colors"
          >
            Go to dashboard →
          </Link>
        )}
        <p className="text-neutral-400 text-xs mt-6">
          Questions?{' '}
          <a href="mailto:hello@mealeaseai.com" className="text-[#D97757] hover:underline">
            hello@mealeaseai.com
          </a>
        </p>
      </section>
    </div>
  )
}
