'use client'

import { useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { PLANS, type PlanId } from '@/lib/stripe/plans'

// ─── Props ────────────────────────────────────────────────────────────────────

type Props = {
  currentPlan?: PlanId
  isAuthenticated?: boolean
}

// ─── Component ────────────────────────────────────────────────────────────────

export function PricingTiers({ currentPlan = 'free', isAuthenticated = false }: Props) {
  const [loading, setLoading] = useState<PlanId | null>(null)

  async function handleSelect(planId: PlanId) {
    if (planId === currentPlan) return

    // Unauthenticated → send to login
    if (!isAuthenticated) {
      window.location.href = '/login?next=/pricing'
      return
    }

    // Downgrade to free → open billing portal
    if (planId === 'free') {
      setLoading('free')
      try {
        const res = await fetch('/api/stripe/portal', { method: 'POST' })
        const data = await res.json() as { url?: string; error?: string }
        if (data.url) window.location.href = data.url
      } finally {
        setLoading(null)
      }
      return
    }

    setLoading(planId)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      })
      const data = await res.json() as { url?: string; error?: string }
      if (data.url) window.location.href = data.url
    } finally {
      setLoading(null)
    }
  }

  const plans = Object.values(PLANS)

  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {plans.map((plan) => {
        const isCurrent = plan.id === currentPlan
        const isLoading = loading === plan.id

        // Label logic
        let label: string
        if (isCurrent) {
          label = 'Current plan'
        } else if (!isAuthenticated) {
          label = plan.id === 'free' ? 'Get started free' : `Upgrade to ${plan.name}`
        } else if (plan.id === 'free') {
          label = 'Downgrade to Free'
        } else {
          label = `Upgrade to ${plan.name}`
        }

        return (
          <div
            key={plan.id}
            className={[
              'relative flex flex-col rounded-3xl border p-6 transition',
              plan.highlighted
                ? 'border-[#D97757] bg-[#D97757]/10 shadow-lg shadow-[#D97757]/10'
                : 'border-white/10 bg-white/5',
            ].join(' ')}
          >
            {/* Badge */}
            {plan.badge && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#D97757] px-3 py-0.5 text-xs font-semibold text-white">
                {plan.badge}
              </span>
            )}

            {/* Header */}
            <div className="mb-4">
              <p className="text-xs font-medium uppercase tracking-wider text-white/40">
                {plan.tagline}
              </p>
              <h3 className="mt-1 text-xl font-bold text-white">{plan.name}</h3>
              <div className="mt-2 flex items-end gap-1">
                <span className="text-3xl font-extrabold text-white">
                  {plan.priceMonthly === 0 ? 'Free' : `$${plan.priceMonthly}`}
                </span>
                {plan.priceMonthly > 0 && (
                  <span className="mb-1 text-sm text-white/40">/mo</span>
                )}
              </div>
            </div>

            {/* Features */}
            <ul className="mb-6 flex-1 space-y-2">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-white/70">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#D97757]" />
                  {f}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <button
              type="button"
              disabled={isCurrent || isLoading}
              onClick={() => handleSelect(plan.id)}
              className={[
                'flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold transition',
                isCurrent
                  ? 'cursor-default border border-white/20 bg-transparent text-white/40'
                  : plan.highlighted
                  ? 'bg-[#D97757] text-white hover:bg-[#c4694a]'
                  : 'border border-white/20 bg-white/10 text-white hover:bg-white/20',
              ].join(' ')}
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {label}
            </button>
          </div>
        )
      })}
    </div>
  )
}
