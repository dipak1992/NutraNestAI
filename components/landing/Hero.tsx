import Image from 'next/image'
import { Container } from './shared/Container'
import { Button } from './shared/Button'
import { FadeIn } from './shared/FadeIn'
import { socialProof } from '@/config/social-proof'
import { LandingTonightPreview } from './LandingTonightPreview'

const trustItems = ['Free forever', 'No card required', 'Built for households']

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .replace('.', '')
    .slice(0, 2)
    .toUpperCase()
}

export function Hero() {
  return (
    <section
      className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-32"
      aria-labelledby="hero-heading"
    >
      {/* Soft background wash */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-[#FDF6F1] via-white to-white dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-950"
      />
      <div className="absolute inset-0 -z-10">
        <Image
          src="/landing/heroSection.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="hidden object-cover object-center opacity-25 sm:block"
        />
        <Image
          src="/landing/heroSection.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-18 sm:hidden"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/88 to-white/45 dark:from-neutral-950 dark:via-neutral-950/88 dark:to-neutral-950/56" />
      </div>

      <Container wide>
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left: copy */}
          <div className="lg:col-span-6">
            <FadeIn>
              <h1
                id="hero-heading"
                className="max-w-[320px] sm:max-w-xl font-serif text-[40px] leading-[1.04] sm:text-5xl md:text-6xl lg:text-[64px] font-bold tracking-tight text-neutral-900 dark:text-neutral-50"
              >
                Never ask{' '}
                <span className="italic text-[#D97757]">
                  &ldquo;What&rsquo;s for dinner?&rdquo;
                </span>{' '}
                again.
              </h1>
            </FadeIn>

            <FadeIn delay={0.1}>
              <p className="mt-6 max-w-[310px] text-lg leading-relaxed text-neutral-600 dark:text-neutral-300 sm:max-w-xl md:text-xl">
                MealEase connects tonight&rsquo;s dinner, weekly planning, groceries,
                leftovers, and budget into one calm food system. In 30 seconds.
              </p>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Button href="/signup" className="max-w-full text-center">
                  Plan tonight&rsquo;s dinner — free
                </Button>
                <a
                  href="#how-it-works"
                  className="text-neutral-700 dark:text-neutral-300 hover:text-[#D97757] underline-offset-4 hover:underline text-sm font-medium"
                >
                  See how it works ↓
                </a>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="mt-4 flex max-w-[310px] flex-wrap items-center gap-x-3 gap-y-2 text-sm font-medium text-neutral-500 dark:text-neutral-400 sm:max-w-xl">
                {trustItems.map((item, i) => (
                  <span key={item} className="inline-flex items-center gap-3">
                    <span>{item}</span>
                    {i < trustItems.length - 1 && (
                      <span className="hidden sm:inline-block h-1 w-1 rounded-full bg-[#D97757]/50" aria-hidden />
                    )}
                  </span>
                ))}
              </div>
            </FadeIn>

            {/* Social proof row */}
            <FadeIn delay={0.4}>
              <div className="mt-8 flex max-w-[310px] flex-col items-start gap-4 sm:max-w-xl sm:flex-row sm:items-center">
                <div className="flex -space-x-2" aria-hidden>
                  {socialProof.testimonials.slice(0, 5).map((t, i) => (
                    <div
                      key={t.name}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[11px] font-bold text-[#9B4F34] ring-2 ring-white shadow-sm shadow-neutral-900/10 dark:bg-neutral-800 dark:text-[#F3B18E] dark:ring-neutral-950"
                      style={{ transform: `translateY(${i % 2 === 0 ? 0 : 2}px)` }}
                    >
                      {initials(t.name)}
                    </div>
                  ))}
                </div>
                <div className="min-w-0 text-sm">
                  <div className="font-medium text-neutral-900 dark:text-neutral-100">
                    ★★★★★ {socialProof.rating}
                  </div>
                  <div className="text-neutral-500 dark:text-neutral-400">
                    Trusted by {socialProof.householdCount} households
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right: phone mockup */}
          <div className="lg:col-span-6 relative flex justify-center">
            <FadeIn delay={0.2}>
              <div
                className="relative mx-auto md:max-w-[340px]"
                style={{ width: 'min(280px, calc(100vw - 64px))' }}
              >
                {/* Phone frame */}
                <div className="relative aspect-[9/19.5] rounded-[3rem] bg-neutral-900 p-3 shadow-2xl shadow-neutral-900/20 ring-1 ring-black/5">
                  <div className="relative w-full h-full rounded-[2.3rem] overflow-hidden bg-[#FBFAF3]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(16,185,129,0.14),transparent_34%),radial-gradient(circle_at_100%_20%,rgba(217,119,87,0.14),transparent_32%)]" />
                    <LandingTonightPreview />
                  </div>
                  {/* Notch */}
                  <div
                    aria-hidden
                    className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-neutral-900 rounded-b-2xl"
                  />
                </div>

                {/* Floating "budget" card */}
                <div className="hidden md:flex absolute -right-10 bottom-1/4 bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-4 items-center gap-3 ring-1 ring-black/5">
                  <div className="text-2xl" aria-hidden>💰</div>
                  <div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">This week</div>
                    <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">$87 — under budget</div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </Container>
    </section>
  )
}

