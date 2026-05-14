import Image from 'next/image'
import { Container } from './shared/Container'
import { Button } from './shared/Button'
import { FadeIn } from './shared/FadeIn'
import { socialProof } from '@/config/social-proof'
import { LandingTonightPreview } from './LandingTonightPreview'
import { LandingScanDemoButton } from './LandingScanDemoButton'
import { productStory, productStoryShort, trustCopy } from '@/lib/marketing/stats'

const trustItems = trustCopy

export function Hero() {
  return (
    <section
      className="relative overflow-hidden pt-14 pb-16 sm:pt-16 sm:pb-20 md:pt-24 md:pb-32"
      aria-labelledby="hero-heading"
    >
      {/* Base warm gradient — always present */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-[#FDF6F1] via-white to-white dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-950"
      />

      {/* Art-directed hero background: one responsive request, no hidden priority image. */}
      <div className="absolute inset-0 -z-10">
        <picture>
          <source media="(max-width: 639px)" srcSet="/landing/optimized/hero-section-mobile.avif" type="image/avif" />
          <source media="(max-width: 639px)" srcSet="/landing/optimized/hero-section-mobile.webp" type="image/webp" />
          <source srcSet="/landing/optimized/hero-section.avif" type="image/avif" />
          <source srcSet="/landing/optimized/hero-section.webp" type="image/webp" />
          <img
            src="/landing/optimized/hero-section.webp"
            alt=""
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover object-right opacity-100 sm:object-center sm:opacity-25"
          />
        </picture>
        <div className="absolute inset-0 hidden bg-gradient-to-r from-white via-white/88 to-white/45 dark:from-neutral-950 dark:via-neutral-950/88 dark:to-neutral-950/56 sm:block" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.97)_0%,rgba(255,255,255,0.92)_40%,rgba(255,255,255,0.62)_65%,rgba(255,255,255,0.14)_100%)] dark:bg-[linear-gradient(to_right,rgba(10,10,10,0.97)_0%,rgba(10,10,10,0.92)_40%,rgba(10,10,10,0.62)_65%,rgba(10,10,10,0.14)_100%)] sm:hidden" />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#FDF6F1]/90 to-transparent dark:from-neutral-950/90 sm:hidden" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white/80 to-transparent dark:from-neutral-950/80 sm:hidden" />
      </div>

      <Container wide>
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Left: copy */}
          <div className="lg:col-span-6">
            <FadeIn>
              <h1
                id="hero-heading"
                className="font-serif text-[38px] leading-[1.05] sm:text-5xl md:text-6xl lg:text-[64px] font-bold tracking-tight text-neutral-900 dark:text-neutral-50"
              >
                {productStoryShort}
                <br />
                <span className="italic text-[#D97757]">Household dinner handled.</span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.1}>
              <p className="mt-4 sm:mt-6 max-w-[230px] sm:max-w-xl text-base sm:text-lg leading-[1.6] text-neutral-600 dark:text-neutral-300 md:text-xl">
                {productStory} Start with a fridge scan or three quick preferences,
                then get a dinner plan and shopping-ready list.
              </p>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                {/* CTA: slightly narrower on mobile, premium shadow, active press state */}
                <Button
                  href="/start"
                  className="w-[88%] sm:w-auto text-center shadow-md shadow-[#D97757]/20 hover:shadow-lg hover:shadow-[#D97757]/28 active:shadow-sm active:scale-[0.98] transition-all duration-150"
                >
                  Plan dinner free
                </Button>
                <Button
                  href="/demo/scan"
                  variant="secondary"
                  className="w-[88%] sm:w-auto text-center"
                >
                  Try fridge scan
                </Button>
                <LandingScanDemoButton />
                <a
                  href="#how-it-works"
                  className="text-neutral-600 dark:text-neutral-300 hover:text-[#D97757] underline-offset-4 hover:underline text-sm font-medium transition-colors"
                >
                  See how it works ↓
                </a>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <p className="mt-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Plan the week. Get groceries ready. Stop repeating dinner decisions.
              </p>

              {/* Mobile: vertical stack; sm+: horizontal row */}
              <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-y-1.5 sm:gap-y-1.5 sm:gap-x-2.5 text-xs sm:text-sm font-medium text-neutral-500 dark:text-neutral-400">
                {trustItems.map((item, i) => (
                  <span key={item} className="inline-flex items-center gap-2">
                    <span className="inline-block h-[5px] w-[5px] rounded-full bg-[#D97757]/60 sm:hidden shrink-0" aria-hidden />
                    <span className="text-neutral-600 dark:text-neutral-400">{item}</span>
                    {i < trustItems.length - 1 && (
                      <span className="hidden sm:inline-block h-1 w-1 rounded-full bg-[#D97757]/40" aria-hidden />
                    )}
                  </span>
                ))}
              </div>
            </FadeIn>

            {/* Social proof row */}
            <FadeIn delay={0.4}>
              <div className="mt-6 sm:mt-8 flex max-w-[270px] sm:max-w-xl flex-row items-center gap-3 sm:gap-4">
                {/* Avatar stack — real photos */}
                <div className="flex -space-x-1.5 shrink-0" aria-hidden>
                  {socialProof.testimonials.slice(0, 5).map((t, i) => (
                    <div
                      key={t.name}
                      className="relative h-8 w-8 sm:h-9 sm:w-9 overflow-hidden rounded-full ring-2 ring-white dark:ring-neutral-950 shadow-sm"
                      style={{ transform: `translateY(${i % 2 === 0 ? 0 : 1}px)` }}
                    >
                      <Image
                        src={t.photo}
                        alt={t.name}
                        fill
                        sizes="36px"
                        className="object-cover object-top"
                      />
                    </div>
                  ))}
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100 leading-tight">
                    <span className="text-amber-500">★★★★★</span>{' '}
                    <span className="font-medium text-neutral-700 dark:text-neutral-300">{socialProof.rating}</span>
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-400 leading-tight mt-0.5">
                    Dinner decided in 3 seconds · free forever
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right: phone mockup — raised on mobile via negative margin */}
          <div className="lg:col-span-6 relative flex justify-center -mt-8 sm:mt-0">
            <FadeIn delay={0.2}>
              <div
                className="relative mx-auto md:max-w-[340px]"
                style={{ width: 'min(260px, calc(100vw - 80px))' }}
              >
                {/* Phone frame */}
                <div className="relative aspect-[9/19.5] rounded-[3rem] bg-neutral-900 p-3 shadow-2xl shadow-neutral-900/25 ring-1 ring-black/8">
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
