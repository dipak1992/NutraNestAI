'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

// ─── FAQ data ─────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: 'Can I cancel anytime?',
    a: 'Yes — cancel from your account settings at any time. You keep access until the end of your billing period.',
  },
  {
    q: 'Is there a free trial?',
    a: 'The Free plan is free forever. Paid plans include a 7-day free trial so you can explore all features risk-free.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit and debit cards via Stripe. Apple Pay and Google Pay are also supported.',
  },
  {
    q: 'Can I switch plans?',
    a: 'Absolutely. Upgrade or downgrade at any time. Upgrades take effect immediately; downgrades apply at the next billing cycle.',
  },
  {
    q: 'How does the Family plan work?',
    a: 'The Family plan lets you add up to 6 household members. Each member gets their own dietary profile and the AI adapts every meal plan accordingly.',
  },
  {
    q: 'Is my data private?',
    a: 'Your household data is never sold or shared. It is used solely to personalise your meal plans within NutriNest AI.',
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

export function PricingFAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="mx-auto max-w-2xl space-y-3">
      <h2 className="mb-6 text-center text-2xl font-bold text-white">
        Frequently asked questions
      </h2>
      {FAQS.map((faq, i) => (
        <div
          key={i}
          className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden"
        >
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between px-5 py-4 text-left"
          >
            <span className="text-sm font-medium text-white">{faq.q}</span>
            <ChevronDown
              className={[
                'h-4 w-4 shrink-0 text-white/40 transition-transform',
                open === i ? 'rotate-180' : '',
              ].join(' ')}
            />
          </button>
          {open === i && (
            <div className="border-t border-white/10 px-5 py-4">
              <p className="text-sm text-white/60">{faq.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
