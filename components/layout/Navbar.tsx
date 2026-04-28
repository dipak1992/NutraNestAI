'use client'

import type { SubscriptionTier } from '@/types'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  Moon,
  Calendar,
  Camera,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
  User,
  Crown,
  Gift,
  BarChart3,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { createClient } from '@/lib/supabase/client'
import { useUIStore } from '@/lib/store'
import { MealEaseLogo } from '@/components/ui/MealEaseLogo'

const navLinks = [
  { href: '/dashboard',           label: 'Home',      icon: Home },
  { href: '/dashboard/tonight',   label: 'Tonight',   icon: Moon },
  { href: '/planner',             label: 'Plan',      icon: Calendar },
  { href: '/dashboard/cook',      label: 'Scan',      icon: Camera },
  { href: '/dashboard/household', label: 'Household', icon: Users },
]

function isNavActive(pathname: string | null, href: string) {
  if (href === '/dashboard') return pathname === '/dashboard'
  return pathname?.startsWith(href)
}

export function Navbar({ userEmail, subscriptionTier = 'free' }: { userEmail?: string; subscriptionTier?: SubscriptionTier }) {
  const pathname = usePathname()
  const router = useRouter()
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const [signingOut, setSigningOut] = useState(false)
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const accountMenuRef = useRef<HTMLDivElement | null>(null)
  const isPro = subscriptionTier === 'pro'
  const isFamily = subscriptionTier === 'family'
  const isPaid = isPro || isFamily

  useEffect(() => {
    if (!accountMenuOpen) return

    function handlePointerDown(event: PointerEvent) {
      if (!accountMenuRef.current?.contains(event.target as Node)) {
        setAccountMenuOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setAccountMenuOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [accountMenuOpen])

  async function handleSignOut() {
    setSigningOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const initials = userEmail
    ? userEmail.slice(0, 2).toUpperCase()
    : 'ME'

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center">
          <MealEaseLogo size="md" />
        </Link>

        {/* Desktop nav — 4 pillars + Home */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isNavActive(pathname, href)
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={cn(
              'inline-flex capitalize',
              isPro
                ? 'border-amber-300 bg-amber-50 text-amber-800'
                : isFamily
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                : 'border-primary/20 bg-primary/5 text-primary',
            )}
          >
            {isPaid ? <Crown className="mr-1.5 h-3 w-3" /> : null}
            {subscriptionTier}
          </Badge>
          {!isPaid && (
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link href="/pricing?intent=pro">Upgrade to Pro</Link>
            </Button>
          )}
          <div ref={accountMenuRef} className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              aria-label="Account menu"
              aria-haspopup="menu"
              aria-expanded={accountMenuOpen}
              onClick={() => setAccountMenuOpen((open) => !open)}
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>

            {accountMenuOpen && (
              <div
                role="menu"
                aria-label="Account menu"
                className="absolute right-0 top-full z-50 mt-2 w-48 rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10"
              >
                {userEmail && (
                  <>
                    <div className="truncate px-2 py-1.5 text-xs text-muted-foreground">
                      {userEmail}
                    </div>
                    <div className="-mx-1 my-1 h-px bg-border" />
                  </>
                )}
                <AccountMenuLink href="/settings" onSelect={() => setAccountMenuOpen(false)}>
                  <User className="h-4 w-4" />
                  Profile &amp; Settings
                </AccountMenuLink>
                <AccountMenuLink href="/insights" onSelect={() => setAccountMenuOpen(false)}>
                  <BarChart3 className="h-4 w-4" />
                  Insights
                </AccountMenuLink>
                {!isPaid && (
                  <AccountMenuLink href="/pricing?intent=pro" onSelect={() => setAccountMenuOpen(false)}>
                    <Crown className="h-4 w-4" />
                    Upgrade to Pro
                  </AccountMenuLink>
                )}
                <AccountMenuLink href="/referral" onSelect={() => setAccountMenuOpen(false)}>
                  <Gift className="h-4 w-4" />
                  Refer Friends
                </AccountMenuLink>
                <div className="-mx-1 my-1 h-px bg-border" />
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="relative flex w-full items-center gap-1.5 rounded-md px-1.5 py-1 text-left text-sm text-destructive outline-hidden select-none hover:bg-destructive/10 focus:bg-destructive/10 disabled:pointer-events-none disabled:opacity-50"
                >
                  <LogOut className="h-4 w-4" />
                  {signingOut ? 'Signing out…' : 'Sign out'}
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleSidebar}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-border/60 bg-background"
          >
            <nav className="flex flex-col gap-1 p-4">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => useUIStore.getState().setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isNavActive(pathname, href)
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
              <Link
                href="/settings"
                onClick={() => useUIStore.getState().setSidebarOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
              {!isPaid && (
                <Link
                  href="/pricing?intent=pro"
                  onClick={() => useUIStore.getState().setSidebarOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
                >
                  <Crown className="h-4 w-4" />
                  Upgrade to Pro
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

function AccountMenuLink({
  href,
  onSelect,
  children,
}: {
  href: string
  onSelect: () => void
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      role="menuitem"
      onClick={onSelect}
      className="relative flex items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground [&_svg]:shrink-0"
    >
      {children}
    </Link>
  )
}
