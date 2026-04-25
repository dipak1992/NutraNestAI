import { Container } from '@/components/landing/shared/Container'
import { Button } from '@/components/landing/shared/Button'
import { FadeIn } from '@/components/landing/shared/FadeIn'

export function AboutCTA() {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-br from-[#D97757] via-[#C86646] to-[#B8935A]"
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,white,transparent_50%)]"
      />

      <Container className="relative">
        <FadeIn>
          <div className="max-w-2xl mx-auto text-center text-white">
            <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight">
              Cook dinner with us tonight.
            </h2>
            <p className="mt-4 text-lg text-white/90">
              One question answered. One less thing to think about. Free to
              start, no card required.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                href="/signup"
                className="bg-white text-[#D97757] hover:bg-neutral-50 hover:text-[#C86646]"
              >
                Plan tonight&apos;s dinner — free
              </Button>
              <a
                href="mailto:hello@mealease.ai"
                className="inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 min-h-[48px] px-6 text-base text-white hover:bg-white/10 border border-white/30"
              >
                Say hi to the founders
              </a>
            </div>
            <p className="mt-6 text-sm text-white/70">
              Questions, feedback, or just want to say hello? Dipak and Suprabha
              read every email.
            </p>
          </div>
        </FadeIn>
      </Container>
    </section>
  )
}
