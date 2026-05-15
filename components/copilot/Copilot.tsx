'use client'

import { useState } from 'react'
import { usePaywallStatus } from '@/lib/paywall/use-paywall-status'
import { PaywallDialog } from '@/components/paywall/PaywallDialog'
import { CopilotSheet } from './CopilotSheet'
import { CopilotTrigger } from './CopilotTrigger'

/**
 * Copilot wrapper — gates the copilot behind Plus subscription.
 * Renders the trigger FAB + bottom sheet only for Plus users.
 * Free users who somehow reach this see a PaywallDialog.
 */
export function Copilot() {
  const { status, loading } = usePaywallStatus()
  const [paywallOpen, setPaywallOpen] = useState(false)

  // Don't render anything while loading or if not authenticated
  if (loading || !status.isAuthenticated) return null

  // Free users: don't render copilot at all
  if (!status.isPro) return null

  return (
    <>
      <CopilotTrigger />
      <CopilotSheet />
      <PaywallDialog
        open={paywallOpen}
        onOpenChange={setPaywallOpen}
        feature="copilot"
        title="MealEase Copilot"
        description="Your AI meal assistant — get personalized suggestions, quick swaps, and smart planning. Upgrade to Plus to unlock."
        isAuthenticated={status.isAuthenticated}
        redirectPath="/dashboard"
      />
    </>
  )
}
