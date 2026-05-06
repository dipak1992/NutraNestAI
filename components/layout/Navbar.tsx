'use client'

import type { SubscriptionTier } from '@/types'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect, useCallback } from 'react'
import {
  LogOut,
  User,
  Crown,
  BarChart2,
  Gift,
  Home,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { MealEaseLogo } from '@/components/ui/MealEaseLogo'

export function Navbar({ userEmail, subscriptionTier = 'free' }: { userEmail?: string; subscriptionTier?: SubscriptionTier }) {
  const router = useRouter()
  const [signingOut, setSigningOut] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const isPro = subscriptionTier === 'pro'
  const isPaid = isPro

  // Close menu on click outside or Escape
  useEffect(() => {
    if (!menuOpen) return
    function handlePointerDown(e: PointerEvent) {
      // Ignore clicks on the toggle button itself — the onClick handler manages that
      if (buttonRef.current && buttonRef.current.contains(e.target as Node)) return
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
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
    <header className="sticky top-0 z-[70] w-full border-b border-border/60 bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center">
          <MealEaseLogo size="md" />
        </Link>

        {/* Right side — tier badge + upgrade + account */}
        <div className="flex items-center gap-2">
          {isPaid ? (
            <Badge
              variant="outline"
              className="inline-flex border-amber-300 bg-amber-50 text-amber-800"
            >
              <Crown className="mr-1.5 h-3 w-3" />
              Plus Member
            </Badge>
          ) : (
            <>
              <Badge
                variant="outline"
                className="inline-flex border-primary/20 bg-primary/5 text-primary"
              >
                Free
              </Badge>
              <Button asChild size="sm" className="hidden sm:inline-flex">
                <Link href="/upgrade">Upgrade to Plus</Link>
              </Button>
            </>
          )}

          {/* Account menu */}
          <div className="relative" ref={menuRef}>
            <button
              ref={buttonRef}
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
                className="fixed right-4 top-16 z-[80] w-52 rounded-xl border border-border bg-background py-1 shadow-lg sm:absolute sm:right-0 sm:top-full sm:mt-2"
              >
                {userEmail && (
                  <div className="px-3 py-2 text-xs text-muted-foreground truncate border-b border-border">
                    {userEmail}
                  </div>
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
                  onClick={() => { closeMenu(); router.push('/dashboard/household') }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                >
                  <Home className="h-4 w-4" />
                  Household
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
                    onClick={() => { closeMenu(); router.push('/upgrade') }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                  >
                    <Crown className="h-4 w-4" />
                    Upgrade to Plus
                  </button>
                )}
                <button
                  role="menuitem"
                  onClick={() => { closeMenu(); router.push('/referral') }}
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
        </div>
      </div>
    </header>
  )
}
