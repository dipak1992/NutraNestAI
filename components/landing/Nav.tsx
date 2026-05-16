'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ChevronDown, Menu, X } from 'lucide-react'
import { Container } from './shared/Container'
import { Button } from './shared/Button'
import { site } from '@/config/site'
import { MealEaseLogo } from '@/components/ui/MealEaseLogo'
import { cn } from '@/lib/utils'

export function Nav() {
  const [open, setOpen] = useState(false)
  const [featuresOpen, setFeaturesOpen] = useState(false)
  const featuresRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!featuresRef.current?.contains(event.target as Node)) {
        setFeaturesOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setFeaturesOpen(false)
        setOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-neutral-100/60 dark:bg-neutral-950/80 dark:border-neutral-800/60 transition-colors duration-300">
      <Container>
        <nav
          className="flex items-center justify-between h-16"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link href="/" prefetch={false} aria-label="MealEase home" className="flex items-center">
            <MealEaseLogo size="md" showBadge />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            <div
              ref={featuresRef}
              className="group relative"
              onMouseEnter={() => setFeaturesOpen(true)}
              onMouseLeave={() => setFeaturesOpen(false)}
            >
              <button
                type="button"
                aria-expanded={featuresOpen}
                aria-haspopup="menu"
                onClick={() => setFeaturesOpen((value) => !value)}
                className="inline-flex min-h-10 items-center gap-1 text-sm font-medium text-neutral-600 transition-colors duration-200 hover:text-[#D97757] dark:text-neutral-300 dark:hover:text-[#D97757] focus-visible:outline-none focus-ring rounded-md px-1"
              >
                Features
                <ChevronDown
                  className={cn(
                    'h-3.5 w-3.5 transition-transform duration-200',
                    featuresOpen && 'rotate-180'
                  )}
                  aria-hidden
                />
              </button>
              <div
                className={cn(
                  'absolute left-1/2 top-full z-50 w-[440px] -translate-x-1/2 pt-3 transition-all duration-200',
                  featuresOpen
                    ? 'visible translate-y-0 opacity-100'
                    : 'invisible -translate-y-1 opacity-0'
                )}
              >
                <div
                  role="menu"
                  className="rounded-2xl border border-neutral-200/80 bg-white/95 backdrop-blur-xl p-3 shadow-2xl shadow-neutral-950/8 dark:border-neutral-800 dark:bg-neutral-950/95"
                >
                  <div className="grid gap-1">
                    {site.features.map((feature) => (
                      <Link
                        key={feature.href}
                        href={feature.href}
                        prefetch={false}
                        role="menuitem"
                        onClick={() => setFeaturesOpen(false)}
                        className="rounded-xl px-4 py-3 transition-colors duration-150 hover:bg-[#FDF6F1] focus:bg-[#FDF6F1] focus:outline-none focus-ring dark:hover:bg-neutral-900 dark:focus:bg-neutral-900"
                      >
                        <span className="block text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                          {feature.label}
                        </span>
                        <span className="mt-0.5 block text-xs text-neutral-500 dark:text-neutral-400">
                          {feature.description}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                className="text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-[#D97757] dark:hover:text-[#D97757] transition-colors duration-200 focus-visible:outline-none focus-ring rounded-md px-1"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/signup"
              className="inline-flex h-9 items-center justify-center rounded-full bg-[#D97757] px-5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-[#c4684a] hover:shadow-md active:scale-[0.97] focus-visible:outline-none focus-ring"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile: logo + CTA + hamburger */}
          <div className="flex items-center gap-3 lg:hidden">
            <Link
              href="/signup"
              className="inline-flex h-8 items-center justify-center rounded-full bg-[#D97757] px-4 text-xs font-medium text-white shadow-sm transition-all duration-200 hover:bg-[#c4684a] active:scale-[0.97]"
            >
              Get Started
            </Link>
            <button
              className="p-2 -mr-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg transition-colors duration-150 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus-visible:outline-none focus-ring"
              onClick={() => setOpen(!open)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <div
          className={cn(
            'lg:hidden overflow-hidden transition-all duration-300 ease-out',
            open ? 'max-h-[600px] opacity-100 pb-6' : 'max-h-0 opacity-0'
          )}
        >
          <div className="border-t border-neutral-200/60 dark:border-neutral-800 pt-4 flex flex-col gap-4">
            <div className="rounded-2xl bg-[#FDF6F1] p-3 dark:bg-neutral-900">
              <p className="px-2 pb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#D97757]">
                Features
              </p>
              <div className="grid gap-1">
                {site.features.map((feature) => (
                  <Link
                    key={feature.href}
                    href={feature.href}
                    prefetch={false}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-2 py-2.5 transition-colors duration-150 hover:bg-white/60 dark:hover:bg-neutral-800"
                  >
                    <span className="block text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      {feature.label}
                    </span>
                    <span className="mt-0.5 block text-xs text-neutral-500 dark:text-neutral-400">
                      {feature.description}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                onClick={() => setOpen(false)}
                className="text-base font-medium text-neutral-800 dark:text-neutral-200 py-2 min-h-[48px] flex items-center transition-colors duration-150 hover:text-[#D97757]"
              >
                {item.label}
              </Link>
            ))}
            <Button href="/signup" className="mt-2">
              Start Free
            </Button>
          </div>
        </div>
      </Container>
    </header>
  )
}
