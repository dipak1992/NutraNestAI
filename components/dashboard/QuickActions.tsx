'use client'

import Link from 'next/link'
import { Bookmark, Settings, ShoppingCart } from 'lucide-react'
import { cn } from '@/lib/utils'

const MEAL_TOOLS = [
  { href: '/saved', label: 'Saved meals', icon: Bookmark },
  { href: '/grocery-list', label: 'Grocery list', icon: ShoppingCart },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function QuickActions() {
  return (
    <section aria-labelledby="quick-actions-heading" className="space-y-3">
      <h2
        id="quick-actions-heading"
        className="text-sm font-bold uppercase tracking-wide text-neutral-500 dark:text-neutral-400"
      >
        Your meal tools
      </h2>

      <div className="grid grid-cols-3 gap-2 overflow-x-auto pb-1 sm:flex sm:gap-2.5">
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
    </section>
  )
}
