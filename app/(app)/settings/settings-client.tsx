'use client'

import { SectionProfile } from '@/components/settings/SectionProfile'
import { SectionNotifications } from '@/components/settings/SectionNotifications'
import { SectionHousehold } from '@/components/settings/SectionHousehold'
import { SectionBilling } from '@/components/settings/SectionBilling'
import { SectionDangerZone } from '@/components/settings/SectionDangerZone'
import type { PlanId } from '@/lib/stripe/plans'

type HouseholdMember = {
  id: string
  invited_email: string
  role: string
  status: string
  created_at: string
}

type NotifPrefs = {
  dinner_reminders: boolean
  weekly_plan_ready: boolean
  grocery_reminders: boolean
  leftover_alerts: boolean
  budget_alerts: boolean
  marketing: boolean
}

type Props = {
  firstName: string
  email: string
  currentPlan: PlanId
  planStatus: string | null
  renewsAt: string | null
  stripeCustomerId: string | null
  hasStripeCustomer: boolean
  notifPrefs: NotifPrefs
  members: HouseholdMember[]
}

export function SettingsClient({
  firstName,
  email,
  currentPlan,
  planStatus,
  renewsAt,
  stripeCustomerId,
  hasStripeCustomer,
  notifPrefs,
  members,
}: Props) {
  return (
    <div className="space-y-6">
      <SectionProfile firstName={firstName} email={email} />
      <SectionNotifications prefs={notifPrefs} />
      <SectionHousehold members={members} currentPlan={currentPlan} />
      <SectionBilling
        currentPlan={currentPlan}
        planStatus={planStatus}
        renewsAt={renewsAt}
        stripeCustomerId={stripeCustomerId}
        hasStripeCustomer={hasStripeCustomer}
      />
      <SectionDangerZone />
    </div>
  )
}
