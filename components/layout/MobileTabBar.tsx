'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Calendar, ShoppingCart, Package, Bookmark } from 'lucide-react'
import { cn } from '@/lib/utils'

const TABS = [
  { href: '/dashboard',    label: 'Home',    icon: LayoutDashboard },
  { href: '/planner',      label: 'Planner', icon: Calendar },
  { href: '/grocery-list', label: 'Grocery', icon: ShoppingCart },
  { href: '/pantry',       label: 'Pantry',  icon: Package },
  { href: '/saved',        label: 'Saved',   icon: Bookmark },
]

export function MobileTabBar() {
  const pathname = usePathname()
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border/60 bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden">
      <div className="mx-auto flex max-w-xl">
        {TABS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'relative flex min-h-16 flex-1 flex-col items-center justify-center gap-1 py-2 text-[10px] font-semibold transition-colors active:scale-[0.985]',
              pathname?.startsWith(href)
                ? 'text-primary'
                : 'text-muted-foreground'
            )}
          >
            {pathname?.startsWith(href) ? (
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
