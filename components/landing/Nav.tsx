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
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-neutral-200/60 dark:border-neutral-800/60">
      <Container>
        <nav
          className="flex items-center justify-between h-16"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link href="/" aria-label="MealEase home" className="flex items-center">
            <MealEaseLogo size="md" showBadge />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-8">
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
                className="inline-flex min-h-10 items-center gap-1 text-sm text-neutral-700 transition-colors hover:text-[#D97757] dark:text-neutral-300"
              >
                Features
                <ChevronDown
                  className={cn(
                    'h-4 w-4 transition-transform',
                    featuresOpen && 'rotate-180'
                  )}
                  aria-hidden
                />
              </button>
              <div
                className={cn(
                  'absolute left-1/2 top-full z-50 w-[440px] -translate-x-1/2 pt-3 transition-all',
                  featuresOpen
                    ? 'visible translate-y-0 opacity-100'
                    : 'invisible -translate-y-1 opacity-0'
                )}
              >
                <div
                  role="menu"
                  className="rounded-2xl border border-neutral-200 bg-white p-3 shadow-2xl shadow-neutral-950/10 dark:border-neutral-800 dark:bg-neutral-950"
                >
                  <div className="grid gap-1">
                    {site.features.map((feature) => (
                      <Link
                        key={feature.href}
                        href={feature.href}
                        role="menuitem"
                        onClick={() => setFeaturesOpen(false)}
                        className="rounded-xl px-4 py-3 transition-colors hover:bg-[#FDF6F1] focus:bg-[#FDF6F1] focus:outline-none dark:hover:bg-neutral-900 dark:focus:bg-neutral-900"
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
                className="text-sm text-neutral-700 dark:text-neutral-300 hover:text-[#D97757] transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Button href="/signup" className="h-10 min-h-[40px] px-5 text-sm">
              Start Free
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 -mr-2 min-h-[48px] min-w-[48px] flex items-center justify-center"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden pb-6 border-t border-neutral-200 dark:border-neutral-800 pt-4 flex flex-col gap-4">
            <div className="rounded-2xl bg-[#FDF6F1] p-3 dark:bg-neutral-900">
              <p className="px-2 pb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#D97757]">
                Features
              </p>
              <div className="grid gap-1">
                {site.features.map((feature) => (
                  <Link
                    key={feature.href}
                    href={feature.href}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-2 py-2.5"
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
                onClick={() => setOpen(false)}
                className="text-base text-neutral-800 dark:text-neutral-200 py-2 min-h-[48px] flex items-center"
              >
                {item.label}
              </Link>
            ))}
            <Button href="/signup" className="mt-2">
              Start Free
            </Button>
          </div>
        )}
      </Container>
    </header>
  )
}
