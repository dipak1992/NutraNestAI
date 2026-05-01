import Image from 'next/image'
import { Container } from './shared/Container'
import { Button } from './shared/Button'
import { FadeIn } from './shared/FadeIn'

export function FinalCTA() {
  return (
    <section
      className="relative overflow-hidden py-24 md:py-32"
      aria-labelledby="final-cta-heading"
    >
      {/* Background image — desktop (landscape join_us.jpg) */}
      <div className="absolute inset-0 -z-10 hidden sm:block">
        <Image
          src="/landing/join_us.jpg"
          alt=""
          fill
          loading="lazy"
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Desktop: stronger top-center scrim so headline text pops, lower half stays visible */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,8,6,0.82)_0%,rgba(10,8,6,0.72)_45%,rgba(10,8,6,0.38)_100%)]" />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_120%,rgba(217,119,87,0.22),transparent)]"
        />
      </div>

      {/* Background image — mobile only (portrait join_us.jpg) */}
      <div className="absolute inset-0 -z-10 sm:hidden">
        <Image
          src="/mobile/join_us.jpg"
          alt=""
          fill
          loading="lazy"
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Mobile: strong top scrim for text, family scene visible in lower half */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,8,6,0.88)_0%,rgba(10,8,6,0.76)_50%,rgba(10,8,6,0.32)_100%)]" />
        {/* Warm radial glow */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_90%_50%_at_50%_110%,rgba(217,119,87,0.28),transparent)]"
        />
      </div>

      <Container className="relative z-10">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto">
            {/* Headline: text-shadow for premium depth */}
            <h2
              id="final-cta-heading"
              className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.05] [text-shadow:0_2px_16px_rgba(0,0,0,0.55)]"
            >
              Dinner + groceries are{' '}
              <span className="italic text-[#D97757]">handled this week.</span>
            </h2>

            {/* Paragraph: brighter white for readability */}
            <p className="mt-5 text-lg md:text-xl text-white/85 leading-relaxed max-w-xl mx-auto font-medium">
              Join 2,400+ households planning dinners, grocery lists, and shopping workflows in one calm place.
            </p>

            {/* Tighter gap between paragraph and CTA */}
            <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button href="/signup" className="text-lg px-8 min-h-[56px] shadow-lg shadow-[#D97757]/30">
                Plan tonight&rsquo;s dinner — free
              </Button>
              <a
                href="#how-it-works"
                className="text-white/70 hover:text-white underline-offset-4 hover:underline text-sm font-medium transition-colors"
              >
                See how it works ↑
              </a>
            </div>

            <p className="mt-5 text-sm text-white/50">
              Free forever · No credit card · Cancel anytime
            </p>
          </div>
        </FadeIn>
      </Container>
    </section>
  )
}
