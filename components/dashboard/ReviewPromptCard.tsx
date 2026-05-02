'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MessageSquareQuote, Star } from 'lucide-react'
import { trackEvent, Analytics } from '@/lib/analytics'
import type { DashboardPayload } from '@/lib/dashboard/types'

const DISMISS_KEY = 'mealease_review_prompt_dismissed_v1'

export function ReviewPromptCard({
  user,
  retention,
}: {
  user: DashboardPayload['user']
  retention: DashboardPayload['retention']
}) {
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    const stored = window.localStorage.getItem(DISMISS_KEY)
    if (stored === '1') return

    const qualifies =
      retention.plannedDays >= 3 || retention.expiringSoon > 0 || user.plan !== 'free'

    if (qualifies) {
      setDismissed(false)
      trackEvent(Analytics.REVIEW_PROMPT_VIEWED, {
        plan: user.plan,
        planned_days: retention.plannedDays,
        expiring_soon: retention.expiringSoon,
      })
    }
  }, [retention.expiringSoon, retention.plannedDays, user.plan])

  if (dismissed) return null

  return (
    <section className="rounded-2xl bg-[#FDF6F1] p-5 ring-1 ring-[#E7D5CB]" aria-label="Share your MealEase story">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[#D97757] ring-1 ring-[#E7D5CB]">
            <MessageSquareQuote className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-neutral-950">
              Has MealEase saved you a dinner decision this week?
            </p>
            <p className="mt-1 text-sm leading-6 text-neutral-600">
              Share a quick win and help more busy families discover MealEase.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href="/contact"
            onClick={() =>
              trackEvent(Analytics.REVIEW_PROMPT_CLICKED, {
                destination: 'contact',
                plan: user.plan,
              })
            }
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-[#D97757] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#C86646]"
          >
            <Star className="h-4 w-4" />
            Share your story
          </Link>
          <button
            type="button"
            onClick={() => {
              window.localStorage.setItem(DISMISS_KEY, '1')
              setDismissed(true)
            }}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-neutral-300 bg-white px-5 text-sm font-semibold text-neutral-700 transition-colors hover:border-[#D97757] hover:text-[#D97757]"
          >
            Not now
          </button>
        </div>
      </div>
    </section>
  )
}
