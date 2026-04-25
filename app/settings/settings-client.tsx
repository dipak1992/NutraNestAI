'use client'

import { SectionProfile } from '@/components/settings/SectionProfile'
import { SectionDietary } from '@/components/settings/SectionDietary'
import { SectionHousehold } from '@/components/settings/SectionHousehold'
import { SectionNotifications } from '@/components/settings/SectionNotifications'
import { SectionBilling } from '@/components/settings/SectionBilling'
import { SectionDangerZone } from '@/components/settings/SectionDangerZone'
import type { PlanId } from '@/lib/stripe/plans'

// ─── Props ────────────────────────────────────────────────────────────────────

type Props = {
  profile: {
    full_name: string | null
    email: string
    avatar_url: string | null
    subscription_tier: string
    stripe_customer_id: string | null
    plan_renews_at: string | null
  }
  household: {
    adults_count: number
    kids_count: number
    toddlers_count: number
    babies_count: number
    budget_level: string
  } | null
}

// ─── Client ───────────────────────────────────────────────────────────────────

export default function SettingsClient({ profile, household }: Props) {
  // Map stored tier to PlanId
  const planId: PlanId =
    profile.subscription_tier === 'pro'
      ? 'plus'
      : profile.subscription_tier === 'family'
      ? 'family'
      : 'free'

  const defaultNotifPrefs = {
    weekly_plan_ready: true,
    grocery_reminders: true,
    leftover_alerts: true,
    budget_alerts: true,
    marketing: false,
  }

  return (
    <div className="space-y-6">
      <SectionProfile
        profile={{
          full_name: profile.full_name,
          email: profile.email,
          avatar_url: profile.avatar_url,
        }}
      />

      <SectionDietary dietary={[]} dislikes={[]} />

      {household && (
        <SectionHousehold household={household} />
      )}

      <SectionNotifications prefs={defaultNotifPrefs} />

      <SectionBilling
        currentPlan={planId}
        renewsAt={profile.plan_renews_at}
        stripeCustomerId={profile.stripe_customer_id}
      />

      <SectionDangerZone />
    </div>
  )
}
