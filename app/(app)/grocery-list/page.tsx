'use client'

import { GroceryListPanel } from '@/components/grocery/GroceryListPanel'
import { ProPaywallCard } from '@/components/paywall/ProPaywallCard'
import { usePaywallStatus } from '@/lib/paywall/use-paywall-status'
import { ShoppingCart, Lock } from 'lucide-react'
import Link from 'next/link'

export default function GroceryListPage() {
  const { status, loading } = usePaywallStatus()

  if (!loading && !status.isPro) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-2 mb-6">
          <ShoppingCart className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Grocery List</h1>
        </div>

        {/* Unlock prompt */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/20 py-16 px-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 mb-4">
            <Lock className="h-7 w-7 text-amber-600" />
          </div>
          <p className="text-lg font-bold text-foreground">Your personalized grocery list lives here</p>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            Generate your weekly meal plan, then upgrade to Pro to unlock your auto-built grocery list with quantities and pantry deductions.
          </p>
        </div>

        <div className="mt-6">
          <ProPaywallCard
            title="Turn your meal plan into a shopping list"
            description="Upgrade to Pro to unlock auto-built grocery lists with quantities, pantry deduction, and store formatting — for all 7 days."
            isAuthenticated={status.isAuthenticated}
            redirectPath="/grocery-list"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <ShoppingCart className="h-6 w-6 text-primary" />
        Grocery List
      </h1>
      <GroceryListPanel />
    </div>
  )
}
