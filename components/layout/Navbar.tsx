'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Calendar,
  ShoppingCart,
  Package,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
  User,
  Bookmark,
  Crown,
  Gift,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { createClient } from '@/lib/supabase/client'
import { useUIStore } from '@/lib/store'
import { MealEaseLogo } from '@/components/ui/MealEaseLogo'

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/planner', label: 'Meal Planner', icon: Calendar },
  { href: '/grocery-list', label: 'Grocery List', icon: ShoppingCart },
  { href: '/pantry', label: 'Pantry', icon: Package },
  { href: '/saved', label: 'Saved', icon: Bookmark },
  { href: '/insights', label: 'Insights', icon: BarChart3 },
  { href: '/referral', label: 'Refer Friends', icon: Gift },
]

export function Navbar({ userEmail, subscriptionTier = 'free' }: { userEmail?: string; subscriptionTier?: 'free' | 'plus' | 'pro' }) {
  const pathname = usePathname()
  const router = useRouter()
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const [signingOut, setSigningOut] = useState(false)
  const isPro = subscriptionTier === 'pro'

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
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center">
          <MealEaseLogo size="md" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                pathname?.startsWith(href)
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
            {isPro ? <Crown className="mr-1.5 h-3 w-3" /> : null}
            {subscriptionTier}
          </Badge>
          {!isPro && (
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link href="/pricing?intent=pro">Upgrade to Pro</Link>
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {userEmail && (
                <>
                  <div className="px-2 py-1.5 text-xs text-muted-foreground truncate">
                    {userEmail}
                  </div>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profile &amp; Settings
                </Link>
              </DropdownMenuItem>
              {!isPro && (
                <DropdownMenuItem asChild>
                  <Link href="/pricing?intent=pro" className="flex items-center gap-2">
                    <Crown className="h-4 w-4" />
                    Upgrade to Pro
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link href="/referral" className="flex items-center gap-2">
                  <Gift className="h-4 w-4" />
                  Refer Friends
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                disabled={signingOut}
                className="text-destructive focus:text-destructive flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                {signingOut ? 'Signing out…' : 'Sign out'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
                    pathname?.startsWith(href)
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
              {!isPro && (
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
