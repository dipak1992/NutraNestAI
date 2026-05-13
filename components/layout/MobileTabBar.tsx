'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CalendarDays, Utensils, Refrigerator, Wallet, ShoppingCart } from 'lucide-react'
import { cn } from '@/lib/utils'

// The app is intentionally focused around the five jobs users return for.
const TABS = [
  { href: '/dashboard/tonight', label: 'Tonight',   icon: Utensils },
  { href: '/planner',           label: 'Week',      icon: CalendarDays },
  { href: '/grocery-list',      label: 'Groceries', icon: ShoppingCart },
  { href: '/leftovers',         label: 'Leftovers', icon: Refrigerator },
  { href: '/budget',            label: 'Budget',    icon: Wallet },
]

export function MobileTabBar() {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === '/planner') return pathname?.startsWith('/planner') || pathname?.startsWith('/plan')
    return pathname?.startsWith(href)
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border/60 bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden">
      <div className="mx-auto flex max-w-xl">
        {TABS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'relative flex min-h-16 flex-1 flex-col items-center justify-center gap-1 py-2 text-[9.5px] font-semibold transition-colors active:scale-[0.985]',
              isActive(href)
                ? 'text-primary'
                : 'text-muted-foreground'
            )}
          >
            {isActive(href) ? (
              <span className="absolute top-0 h-0.5 w-8 rounded-full bg-primary" />
            ) : null}
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
