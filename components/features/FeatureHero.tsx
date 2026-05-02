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
  mobileImage: string
  imageAlt?: string
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
  imageAlt = '',
  mockup,
  align = 'split',
}: FeatureHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-[#17110f] py-16 text-white md:py-24">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(217,119,87,0.22),transparent_28%),radial-gradient(circle_at_82%_26%,rgba(16,185,129,0.12),transparent_30%),linear-gradient(135deg,rgba(23,17,15,1),rgba(10,10,10,0.96)_54%,rgba(37,25,20,1))]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
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

          <div className="min-w-0 pb-20 lg:col-span-6 lg:pb-16">
            <div className="relative mx-auto max-w-[430px] lg:mr-0 lg:max-w-[560px]">
              <div className="relative overflow-hidden rounded-[1.75rem] border border-white/12 bg-white/[0.045] shadow-2xl shadow-black/35 ring-1 ring-white/10">
                <div className="relative aspect-[4/5] sm:hidden">
                  <Image
                    src={mobileImage}
                    alt={imageAlt}
                    fill
                    priority
                    sizes="(max-width: 640px) 92vw"
                    className="object-cover"
                  />
                </div>
                <div className="relative hidden aspect-[16/10] sm:block">
                  <Image
                    src={image}
                    alt={imageAlt}
                    fill
                    priority
                    sizes="(max-width: 1024px) 80vw, 560px"
                    className="object-cover"
                  />
                </div>
                <div
                  aria-hidden
                  className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.04),rgba(10,10,10,0.48)),radial-gradient(circle_at_22%_12%,rgba(255,255,255,0.24),transparent_28%)]"
                />
              </div>
              <div className="absolute bottom-0 left-1/2 w-[min(78%,300px)] translate-y-1/2 -translate-x-1/2 sm:left-auto sm:right-5 sm:w-[270px] sm:translate-x-0 lg:w-[295px]">
                <ProductMockup variant={mockup} />
              </div>
              <div
                aria-hidden
                className="absolute -inset-3 -z-10 rounded-[2rem] bg-[radial-gradient(circle_at_55%_12%,rgba(217,119,87,0.22),transparent_46%),linear-gradient(145deg,rgba(255,255,255,0.08),transparent_58%)]"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
