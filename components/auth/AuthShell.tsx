import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { MealEaseLogo } from '@/components/ui/MealEaseLogo'

type Props = {
  title: string
  subtitle: string
  footerText: string
  footerLink: { label: string; href: string }
  children: ReactNode
}

export function AuthShell({
  title,
  subtitle,
  footerText,
  footerLink,
  children,
}: Props) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 grid lg:grid-cols-2">
        {/* Form side — mobile: subtle image background; desktop: clean white */}
        <div className="relative flex flex-col justify-center px-6 py-12 lg:px-12 xl:px-20">
          {/* Mobile-only background image (hidden on lg+) */}
          <div className="absolute inset-0 lg:hidden">
            <Image
              src="/images/auth_hero_mobile.jpg"
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-center"
              priority
              quality={85}
            />
            {/* Strong white overlay — keeps form fully readable */}
            <div className="absolute inset-0 bg-white/88 dark:bg-neutral-950/90" />
          </div>
          <div className="relative z-10 mx-auto w-full max-w-sm">
            {/* Logo */}
            <Link href="/" aria-label="MealEase home" className="inline-flex items-center mb-8">
              <MealEaseLogo size="md" showBadge />
            </Link>

            <div className="mb-8">
              <h1 className="font-serif text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
                {title}
              </h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {subtitle}
              </p>
            </div>

            {children}

            <p className="mt-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
              {footerText}{' '}
              <Link
                href={footerLink.href}
                className="font-medium text-[#D97757] hover:underline"
              >
                {footerLink.label}
              </Link>
            </p>
          </div>
        </div>

        {/* Visual side — auth hero: family staring at takeout with full fridge */}
        <div className="hidden lg:flex flex-col justify-end px-12 xl:px-20 pb-16 relative overflow-hidden">
          {/* Hero image — 146KB optimized JPEG, next/image serves WebP/AVIF at runtime */}
          <div className="absolute inset-0">
            <Image
              src="/images/auth_hero.jpg"
              alt="Family with a full fridge still ordering takeout — the problem MealEase solves"
              fill
              sizes="50vw"
              className="object-cover object-[30%_center]"
              priority
              quality={90}
            />
          </div>

          {/* Gradient layers for text readability over warm kitchen scene */}
          {/* Left-side dark band where quote sits */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
          {/* Bottom darkening for stats */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />

          {/* Content — bottom-left, darkest zone */}
          <div className="relative z-10 max-w-xs">
            {/* Brand accent */}
            <div className="w-8 h-0.5 rounded-full bg-[#D97757] mb-5" />

            <blockquote className="text-white text-lg font-serif leading-relaxed mb-5 drop-shadow-sm">
              &ldquo;We had a fridge full of food and still ordered takeout three
              nights a week.&rdquo;
            </blockquote>
            <div className="text-white/75 text-sm">
              <p className="font-semibold text-white">— Dipak &amp; Suprabha</p>
              <p className="mt-0.5">Co-founders. Parents of two. Former takeout enthusiasts.</p>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-5">
              <Stat label="Households" value="2,400+" />
              <Stat label="Meals planned" value="180k+" />
              <Stat label="Avg. saved/wk" value="$47" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-neutral-400">
          <span>© {new Date().getFullYear()} MealEase</span>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-neutral-600 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-neutral-600 transition-colors">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-neutral-600 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-white/50 mb-1">{label}</p>
      <p className="text-white font-semibold text-lg drop-shadow-sm">{value}</p>
    </div>
  )
}
