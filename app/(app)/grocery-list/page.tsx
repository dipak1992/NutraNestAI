'use client'

import { GroceryListPanel } from '@/components/grocery/GroceryListPanel'
import { ProPaywallCard } from '@/components/paywall/ProPaywallCard'
import { usePaywallStatus } from '@/lib/paywall/use-paywall-status'

export default function GroceryListPage() {
  const { status, loading } = usePaywallStatus()

  if (!loading && !status.isPro) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProPaywallCard
          title="Grocery lists unlock on Pro"
          description="You’ve seen the planner preview. Upgrade to Pro to turn it into a real shopping list with quantities, pantry deduction, and store formatting."
          isAuthenticated={status.isAuthenticated}
          redirectPath="/grocery-list"
        />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <GroceryListPanel />
    </div>
  )
}
