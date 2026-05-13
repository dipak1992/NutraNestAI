'use client'

import Link from 'next/link'
import { Bookmark, Home, Settings, ShoppingCart } from 'lucide-react'
import { useWeeklyPlanStore } from '@/lib/planner/store'
import { cn } from '@/lib/utils'

const MEAL_TOOLS = [
  { href: '/saved', label: 'Saved meals', icon: Bookmark },
  { href: '/grocery-list', label: 'Grocery list', icon: ShoppingCart },
  { href: '/dashboard/household', label: 'Household', icon: Home },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function QuickActions() {
  const groceryList = useWeeklyPlanStore((s) => s.groceryList)
  const hasGroceryItems = groceryList && groceryList.items.length > 0

  return (
    <section aria-labelledby="quick-actions-heading" className="space-y-3">
      <h2
        id="quick-actions-heading"
        className="text-sm font-bold uppercase tracking-wide text-neutral-500 dark:text-neutral-400"
      >
        Your meal tools
      </h2>

      <div className="grid grid-cols-4 gap-2 overflow-x-auto pb-1 sm:flex sm:gap-2.5">
        {MEAL_TOOLS.map(({ href, label, icon: Icon }) => {
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex min-h-[68px] flex-col items-center justify-center gap-1.5 rounded-2xl px-2 py-3 text-center',
                'bg-white text-xs font-semibold text-neutral-700 ring-1 ring-neutral-200/80 transition',
                'hover:-translate-y-0.5 hover:bg-[#D97757]/5 hover:ring-[#D97757]/40 hover:shadow-sm',
                'dark:bg-neutral-900 dark:text-neutral-300 dark:ring-neutral-800 sm:min-h-[44px] sm:flex-row sm:rounded-full sm:px-4 sm:py-2.5 sm:text-sm'
              )}
            >
              <Icon className="h-4 w-4 text-[#D97757]" />
              <span>{label}</span>
            </Link>
          )
        })}
      </div>

      {/* Grocery nudge when list is empty */}
      {!hasGroceryItems && (
        <Link
          href="/grocery-list"
          className="flex items-center gap-2 rounded-xl bg-orange-50/70 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 px-3.5 py-2.5 text-xs text-neutral-600 dark:text-neutral-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-colors group"
        >
          <ShoppingCart className="h-3.5 w-3.5 text-[#D97757] flex-shrink-0" />
          <span>
            Your grocery list builds automatically when you plan your week{' '}
            <span className="text-[#D97757] font-medium group-hover:underline">→</span>
          </span>
        </Link>
      )}
    </section>
  )
}
