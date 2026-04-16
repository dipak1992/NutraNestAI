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
    <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden border-t border-border/60 bg-background">
      <div className="flex">
        {TABS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors',
              pathname?.startsWith(href)
                ? 'text-primary'
                : 'text-muted-foreground'
            )}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
