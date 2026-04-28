'use client'

import type { SubscriptionTier } from '@/types'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useRef, useEffect, useCallback } from 'react'
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
  BarChart2,
  Gift,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const isPro = subscriptionTier === 'pro'
  const isPaid = isPro

  // Close menu on click outside
  useEffect(() => {
    if (!menuOpen) return
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [menuOpen])

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  async function handleSignOut() {
    setSigningOut(true)
    closeMenu()
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
                : 'border-primary/20 bg-primary/5 text-primary',
            )}
          >
            {isPaid ? <Crown className="mr-1.5 h-3 w-3" /> : null}
            {subscriptionTier}
          </Badge>
          {!isPaid && (
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link href="/pricing?intent=pro">Upgrade to Plus</Link>
            </Button>
          )}

          {/* Account menu — simple React state, no Base UI */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="rounded-full p-0 border-0 bg-transparent hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 outline-none"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                {initials}
              </span>
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-border bg-background shadow-lg py-1 z-50 animate-in fade-in-0 zoom-in-95"
              >
                {userEmail && (
                  <>
                    <div className="px-3 py-2 text-xs text-muted-foreground truncate border-b border-border">
                      {userEmail}
                    </div>
                  </>
                )}
                <button
                  role="menuitem"
                  onClick={() => { closeMenu(); router.push('/settings') }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                >
                  <User className="h-4 w-4" />
                  Profile &amp; Settings
                </button>
                <button
                  role="menuitem"
                  onClick={() => { closeMenu(); router.push('/insights') }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                >
                  <BarChart2 className="h-4 w-4" />
                  Insights
                </button>
                {!isPaid && (
                  <button
                    role="menuitem"
                    onClick={() => { closeMenu(); router.push('/pricing?intent=pro') }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                  >
                    <Crown className="h-4 w-4" />
                    Upgrade to Plus
                  </button>
                )}
                <button
                  role="menuitem"
                  onClick={() => { closeMenu(); router.push('/referrals') }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                >
                  <Gift className="h-4 w-4" />
                  Refer Friends
                </button>
                <div className="border-t border-border my-1" />
                <button
                  role="menuitem"
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
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
                  Upgrade to Plus
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
