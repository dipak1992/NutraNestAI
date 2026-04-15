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
        {/* Blurred grocery list preview */}
        <div className="relative rounded-2xl overflow-hidden">
          {/* Fake preview content with blur */}
          <div className="select-none pointer-events-none blur-sm" aria-hidden="true">
            <div className="space-y-4 p-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-bold">Your Grocery List</h2>
              </div>
              {[
                { icon: '🥩', name: 'Proteins', items: ['Chicken breast × 2 lbs', 'Ground turkey × 1 lb', 'Salmon fillet × 1.5 lbs'] },
                { icon: '🥬', name: 'Produce', items: ['Broccoli × 2 heads', 'Bell peppers × 4', 'Spinach × 1 bag', 'Onions × 3', 'Garlic × 1 head'] },
                { icon: '🥫', name: 'Pantry', items: ['Olive oil × 1 bottle', 'Pasta × 2 boxes', 'Rice × 1 bag', 'Soy sauce × 1'] },
                { icon: '🧀', name: 'Dairy', items: ['Mozzarella × 8 oz', 'Greek yogurt × 32 oz', 'Butter × 1 stick'] },
              ].map((cat) => (
                <div key={cat.name} className="space-y-1">
                  <div className="flex items-center gap-2 py-1.5 border-b border-border/50">
                    <span>{cat.icon}</span>
                    <span className="font-semibold text-sm">{cat.name}</span>
                    <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{cat.items.length}</span>
                  </div>
                  {cat.items.map((item) => (
                    <div key={item} className="flex items-center gap-3 py-1.5 px-1">
                      <div className="w-4 h-4 rounded border border-border" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Lock overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px]">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 mb-4">
              <Lock className="h-7 w-7 text-amber-600" />
            </div>
            <p className="text-lg font-bold text-foreground text-center">
              ~15 items across 4 categories
            </p>
            <p className="text-sm text-muted-foreground mt-1 text-center max-w-sm">
              Your grocery list is ready — unlock it with Pro.
            </p>
          </div>
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
      <GroceryListPanel />
    </div>
  )
}
