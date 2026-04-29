'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Check, Shield, Zap, ArrowLeft } from 'lucide-react'
import { PRICING_TIERS, PRO_ANNUAL_SAVINGS } from '@/lib/paywall/config'
import { cn } from '@/lib/utils'
import posthog from 'posthog-js'

/* ─────────────────────── DATA ─────────────────────── */

const BENEFITS = [
  { icon: '🗓️', title: 'Weekly Autopilot', desc: '7 dinners planned in one tap' },
  { icon: '🌙', title: 'Unlimited Swaps', desc: 'Never get stuck on a suggestion' },
  { icon: '🍱', title: 'Leftovers AI', desc: 'Track & use before they expire' },
  { icon: '💰', title: 'Budget Intelligence', desc: 'Weekly spend tracking & alerts' },
  { icon: '🛒', title: 'Smart Grocery List', desc: 'Auto-generated from your plan' },
  { icon: '👨‍👩‍👧‍👦', title: 'Up to 6 Profiles', desc: 'Personalized for every eater' },
]

const TRUST_SIGNALS = [
  'Cancel anytime — one click',
  '7-day free trial included',
  'No credit card to start trial',
  'Trusted by 2,000+ households',
]

/* ─────────────────────── COMPONENT ─────────────────────── */

type Props = {
  isAuthenticated: boolean
}

export function UpgradeClient({ isAuthenticated }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const feature = searchParams.get('feature') // e.g. "autopilot", "leftovers"
  const [billing, setBilling] = useState<'yearly' | 'monthly'>('yearly')
  const [loading, setLoading] = useState(false)

  const proMonthly = PRICING_TIERS.pro.monthlyPrice
  const proAnnual = PRICING_TIERS.pro.yearlyPrice
  const proAnnualMonthly = (proAnnual / 12).toFixed(2)

  const handleCheckout = useCallback(async () => {
    if (!isAuthenticated) {
      router.push(`/signup?redirect=/upgrade&plan=${billing === 'yearly' ? 'pro_yearly' : 'pro_monthly'}`)
      return
    }

    setLoading(true)
    posthog.capture('upgrade_checkout_initiated', {
      billing,
      feature_trigger: feature,
    })

    try {
      const plan = billing === 'yearly' ? 'pro_yearly' : 'pro_monthly'
      const res = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()

      if (data.error === 'billing_not_configured') {
        // Stripe not configured — fall back to trial
        const trialRes = await fetch('/api/paywall/start-trial', { method: 'POST' })
        const trialData = await trialRes.json()
        if (!trialRes.ok) {
          toast.error(trialData.error || 'Could not start trial')
          return
        }
        posthog.capture('upgrade_trial_started', { billing, feature_trigger: feature })
        toast.success('Your 7-day Plus trial is active!', {
          description: 'Enjoy full access to every feature.',
        })
        router.push('/dashboard')
        router.refresh()
        return
      }

      if (!res.ok) {
        toast.error(data.error || 'Could not start checkout. Please try again.')
        return
      }

      if (data.url) {
        posthog.capture('upgrade_redirected_to_stripe', { billing })
        window.location.href = data.url
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [billing, feature, isAuthenticated, router])

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Back nav */}
      <div className="max-w-2xl mx-auto px-4 pt-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>

      {/* Hero */}
      <section className="pt-8 pb-6 text-center px-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#D97757]/10 text-[#D97757] text-xs font-bold px-4 py-1.5 mb-5 uppercase tracking-widest">
          <Zap className="h-3.5 w-3.5" />
          Upgrade to Plus
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
          Unlock the full MealEase experience
        </h1>
        {feature && (
          <p className="mt-3 text-base text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
            You tried to use a Plus feature.{' '}
            <span className="font-medium text-[#D97757]">Upgrade now</span> to unlock it instantly.
          </p>
        )}
        {!feature && (
          <p className="mt-3 text-base text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
            Stop stressing about dinner. Get personalized meals, smart planning, and budget tracking.
          </p>
        )}
      </section>

      {/* Main checkout card */}
      <section className="px-4 pb-8">
        <div className="max-w-lg mx-auto">
          <div className="relative rounded-3xl overflow-hidden ring-2 ring-[#D97757]/60 shadow-2xl shadow-orange-900/10">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a0e06] via-[#1e1208] to-neutral-900" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_100%_0%,_rgba(217,119,87,0.2),_transparent)]" />

            <div className="relative z-10 p-6 sm:p-8">
              {/* Billing toggle */}
              <div className="flex items-center justify-center gap-1 mb-6">
                <div className="inline-flex items-center rounded-full border border-neutral-700 bg-neutral-800/80 p-1">
                  <button
                    onClick={() => setBilling('monthly')}
                    className={cn(
                      'text-sm font-semibold px-4 py-2 rounded-full transition-all',
                      billing === 'monthly'
                        ? 'bg-white text-neutral-900 shadow-sm'
                        : 'text-neutral-400 hover:text-neutral-200',
                    )}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBilling('yearly')}
                    className={cn(
                      'text-sm font-semibold px-4 py-2 rounded-full transition-all flex items-center gap-1.5',
                      billing === 'yearly'
                        ? 'bg-white text-neutral-900 shadow-sm'
                        : 'text-neutral-400 hover:text-neutral-200',
                    )}
                  >
                    Annual
                    <span className="bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      -{PRO_ANNUAL_SAVINGS}%
                    </span>
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="text-center mb-6">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="font-serif text-5xl font-bold text-white">
                    ${billing === 'yearly' ? proAnnualMonthly : proMonthly}
                  </span>
                  <span className="text-sm text-neutral-400">/month</span>
                </div>
                {billing === 'yearly' && (
                  <p className="text-xs text-neutral-500 mt-1">
                    ${proAnnual}/yr billed annually · <span className="line-through">${proMonthly}/mo</span>
                  </p>
                )}
              </div>

              {/* CTA Button */}
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-[#D97757] to-[#E8895A] hover:from-[#C86646] hover:to-[#D97757] disabled:opacity-60 disabled:cursor-not-allowed py-4 text-base font-bold text-white transition-all shadow-lg shadow-orange-900/30 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="animate-pulse">Processing…</span>
                ) : (
                  <>
                    Continue to Checkout
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>

              {/* Trust signals */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
                {TRUST_SIGNALS.slice(0, 3).map((s) => (
                  <span key={s} className="text-[11px] text-neutral-500 flex items-center gap-1">
                    <Shield className="h-3 w-3 text-emerald-500" />
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits grid */}
      <section className="px-4 pb-12">
        <div className="max-w-lg mx-auto">
          <h2 className="text-center text-sm font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-5">
            Everything included with Plus
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-4 flex gap-3"
              >
                <span className="text-xl shrink-0">{b.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">{b.title}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof / trust */}
      <section className="px-4 pb-12">
        <div className="max-w-lg mx-auto text-center">
          <div className="inline-flex items-center gap-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-6 py-4">
            <div className="flex -space-x-2">
              {['🧑‍🍳', '👩‍🍳', '👨‍🍳', '🧑‍🍳'].map((e, i) => (
                <span
                  key={i}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30 text-sm ring-2 ring-white dark:ring-neutral-900"
                >
                  {e}
                </span>
              ))}
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">2,000+ households</p>
              <p className="text-xs text-neutral-500">already use MealEase Plus</p>
            </div>
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section className="px-4 pb-16">
        <div className="max-w-lg mx-auto">
          <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/30 p-5 flex gap-4">
            <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
              <Check className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-semibold text-sm text-neutral-900 dark:text-neutral-50">Risk-free guarantee</p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                Start with a 7-day free trial. Cancel anytime from settings — no questions asked.
                Your plan stays active until the end of the billing period.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer link */}
      <section className="px-4 pb-8 text-center">
        <Link
          href="/upgrade"
          className="text-sm text-neutral-500 hover:text-[#D97757] transition-colors underline underline-offset-4"
        >
          Back to upgrade →
        </Link>
      </section>
    </div>
  )
}
