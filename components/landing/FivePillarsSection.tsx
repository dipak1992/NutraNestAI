import Image from 'next/image'
import { Container } from './shared/Container'
import { FadeIn } from './shared/FadeIn'
import { pillars } from '@/config/pillars'

export function FivePillarsSection() {
  return (
    <section
      id="pillars"
      className="py-16 md:py-22 bg-white dark:bg-neutral-950"
      aria-labelledby="pillars-heading"
    >
      <Container>
        <FadeIn>
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
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

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-6">
          {pillars.map((p, i) => (
            <FadeIn
              key={p.id}
              delay={i * 0.08}
              className={i < 2 ? 'lg:col-span-3' : 'lg:col-span-2'}
            >
              <PillarCard pillar={p} featured={i < 2} />
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  )
}

function PillarCard({
  pillar,
  featured = false,
}: {
  pillar: (typeof pillars)[number]
  featured?: boolean
}) {
  return (
    <article className="group relative h-full overflow-hidden rounded-[1.75rem] bg-neutral-50 ring-1 ring-neutral-200/70 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:ring-[#D97757]/40 dark:bg-neutral-900 dark:ring-neutral-800">
      {/* Feature image — 16:10 aspect ratio */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: featured ? '18/9' : '16/10' }}>
        <Image
          src={pillar.image}
          alt={pillar.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
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

        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-base shadow-sm ring-1 ring-orange-100 dark:bg-neutral-950 dark:ring-neutral-800" aria-hidden>
            {pillar.icon}
          </span>
          <p className="text-sm font-medium text-[#D97757]">
            &ldquo;{pillar.question}&rdquo;
          </p>
        </div>

        <h3 className={`mb-3 font-serif font-bold leading-tight text-neutral-900 [overflow-wrap:normal] dark:text-neutral-50 ${featured ? 'text-[1.75rem]' : 'text-[1.45rem]'}`}>
          {pillar.title}
        </h3>

        <p className="text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400">
          {pillar.answer}
        </p>
      </div>
    </article>
  )
}
