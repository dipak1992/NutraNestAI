import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { ProductMockup } from './ProductMockup'
import { Container } from '@/components/landing/shared/Container'
import { cn } from '@/lib/utils'

type MockupVariant = 'tonight' | 'snap' | 'weekly' | 'leftovers' | 'budget' | 'landing'

type FeatureHeroProps = {
  eyebrow: string
  title: ReactNode
  description: string
  primaryHref: string
  primaryLabel: string
  secondaryHref: string
  secondaryLabel: string
  note?: ReactNode
  image: string
  mobileImage?: string
  mockup: MockupVariant
  align?: 'center' | 'split'
}

export function FeatureHero({
  eyebrow,
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  note,
  image,
  mobileImage,
  mockup,
  align = 'split',
}: FeatureHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-neutral-950 py-16 text-white md:py-24">
      <Image
        src={image}
        alt=""
        fill
        priority
        sizes="100vw"
        className={cn('object-cover opacity-55', mobileImage && 'hidden sm:block')}
      />
      {mobileImage && (
        <Image
          src={mobileImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-55 sm:hidden"
        />
      )}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,10,0.88),rgba(10,10,10,0.64)_48%,rgba(10,10,10,0.34)),radial-gradient(circle_at_80%_15%,rgba(217,119,87,0.34),transparent_32%)]"
      />
      <Container className="relative z-10 max-w-full">
        <div
          className={cn(
            'grid items-center gap-10 lg:grid-cols-12 lg:gap-14',
            align === 'center' && 'mx-auto max-w-5xl text-center'
          )}
        >
          <div className={cn('min-w-0 lg:col-span-6', align === 'center' && 'mx-auto')}>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-semibold text-[#FFD2BD] backdrop-blur">
              {eyebrow}
            </div>
            <h1 className="mt-6 max-w-full font-serif text-4xl font-bold tracking-tight text-white sm:max-w-3xl sm:text-5xl md:text-6xl">
              {title}
            </h1>
            <p className="mt-6 max-w-full text-lg leading-relaxed text-white/82 sm:max-w-2xl md:text-xl">
              {description}
            </p>
            <div className={cn('mt-8 flex max-w-full flex-col gap-3 sm:max-w-none sm:flex-row', align === 'center' && 'justify-center')}>
              <Link
                href={primaryHref}
                className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-[#D97757] px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-black/20 transition-colors hover:bg-[#c4664a]"
              >
                {primaryLabel}
              </Link>
              <Link
                href={secondaryHref}
                className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-white/25 bg-white/10 px-7 py-3.5 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/16"
              >
                {secondaryLabel}
              </Link>
            </div>
            {note && <p className="mt-4 text-sm text-white/68">{note}</p>}
          </div>

          <div className="min-w-0 lg:col-span-6">
            <ProductMockup variant={mockup} />
          </div>
        </div>
      </Container>
    </section>
  )
}
