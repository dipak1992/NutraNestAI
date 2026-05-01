import Image from 'next/image'
import { Container } from './shared/Container'
import { FadeIn } from './shared/FadeIn'
import { pillars } from '@/config/pillars'

export function FivePillarsSection() {
  return (
    <section
      id="pillars"
      className="py-20 md:py-28 bg-white dark:bg-neutral-950"
      aria-labelledby="pillars-heading"
    >
      <Container>
        <FadeIn>
          <div className="text-center max-w-2xl mx-auto mb-14 md:mb-20">
            <h2
              id="pillars-heading"
              className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50"
            >
              Six questions. One app.{' '}
              <span className="italic text-[#D97757]">Zero stress.</span>
            </h2>
            <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
              Every food question your household asks — answered.
            </p>
          </div>
        </FadeIn>

        {/* 3 + 3 grid on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-5 md:gap-6">
          {pillars.map((p, i) => (
            <FadeIn
              key={p.id}
              delay={i * 0.08}
              className="md:col-span-2"
            >
              <PillarCard pillar={p} index={i} />
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  )
}

function PillarCard({
  pillar,
  index,
}: {
  pillar: (typeof pillars)[number]
  index: number
}) {
  // Only the first card is above the fold — prioritize it, lazy-load the rest
  const isPriority = index === 0

  return (
    <article className="group relative h-full rounded-3xl bg-neutral-50 dark:bg-neutral-900 ring-1 ring-neutral-200/70 dark:ring-neutral-800 hover:ring-[#D97757]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden">
      {/* Feature image — 16:10 aspect ratio */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/10' }}>
        <Image
          src={pillar.image}
          alt={pillar.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          priority={isPriority}
          loading={isPriority ? 'eager' : 'lazy'}
          quality={85}
        />
        {/* Subtle bottom gradient for visual continuity into card body */}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-neutral-50 dark:from-neutral-900 to-transparent" />
      </div>

      {/* Card body */}
      <div className="relative px-6 pb-7 pt-4 md:px-7 md:pb-8">
        {/* Badge */}
        {pillar.badge && (
          <span className="absolute top-4 right-5 text-[10px] font-semibold tracking-wider uppercase bg-[#D97757] text-white px-2 py-1 rounded-full">
            {pillar.badge}
          </span>
        )}

        <p className="text-sm font-medium text-[#D97757] mb-2">
          &ldquo;{pillar.question}&rdquo;
        </p>

        <h3 className="font-serif text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-3">
          {pillar.title}
        </h3>

        <p className="text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400">
          {pillar.answer}
        </p>
      </div>
    </article>
  )
}
