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

        {/* Visual side — founders photo background */}
        <div className="hidden lg:flex flex-col justify-end px-12 xl:px-20 pb-16 relative overflow-hidden">
          {/* Founders photo — next/image handles WebP/AVIF conversion + sizing */}
          <div className="absolute inset-0">
            <Image
              src="/images/founders-family.jpg"
              alt="Dipak and Suprabha, MealEase co-founders"
              fill
              sizes="50vw"
              className="object-cover object-[center_20%]"
              priority
              quality={85}
            />
          </div>

          {/* Left-to-right gradient: dark on left for text, fades to transparent right */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
          {/* Bottom-to-top gradient: darkens bottom for stats readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Content — positioned at bottom-left where gradient is darkest */}
          <div className="relative z-10 max-w-xs">
            {/* Brand accent line */}
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
