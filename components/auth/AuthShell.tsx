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
        {/* Form side */}
        <div className="flex flex-col justify-center px-6 py-12 lg:px-12 xl:px-20">
          <div className="mx-auto w-full max-w-sm">
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

        {/* Visual side — warm premium background */}
        <div className="hidden lg:flex flex-col justify-center px-12 xl:px-20 relative overflow-hidden">
          {/* Background: warm food photo with rich overlay */}
          <div className="absolute inset-0">
            <Image
              src="/landing/family-dinner.jpg"
              alt=""
              fill
              sizes="50vw"
              className="object-cover object-center"
              priority
            />
            {/* Multi-layer warm gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#7C2D12]/85 via-[#9A3412]/75 to-[#431407]/90" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>

          {/* Subtle warm dot pattern */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, #FED7AA 1px, transparent 0)',
              backgroundSize: '28px 28px',
            }}
          />

          {/* Warm glow accent */}
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#D97757]/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-amber-500/15 blur-3xl" />

          <div className="relative z-10 max-w-sm">
            {/* Brand accent line */}
            <div className="w-10 h-1 rounded-full bg-[#D97757] mb-6" />

            <blockquote className="text-white text-xl font-serif leading-relaxed mb-6">
              &ldquo;We had a fridge full of food and still ordered takeout three
              nights a week.&rdquo;
            </blockquote>
            <div className="text-orange-200/80 text-sm">
              <p className="font-semibold text-white">— Dipak &amp; Suprabha</p>
              <p>Co-founders. Parents of two. Former takeout enthusiasts.</p>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-6">
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
      <p className="text-xs text-orange-200/60 mb-1">{label}</p>
      <p className="text-white font-semibold text-lg">{value}</p>
    </div>
  )
}
