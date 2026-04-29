import { redirect } from 'next/navigation'
import { getPaywallStatus } from '@/lib/paywall/server'
import { UpgradeClient } from './upgrade-client'

export const metadata = {
  title: 'Upgrade to Plus — MealEase',
  description: 'Unlock the connected MealEase system: Planner, grocery, budget, leftovers, Cook Mode, and household memory.',
}

export default async function UpgradePage() {
  const status = await getPaywallStatus()

  // Already a Plus member — redirect to dashboard
  if (status.isPro) {
    redirect('/dashboard')
  }

  return <UpgradeClient isAuthenticated={status.isAuthenticated} />
}
