import Image from 'next/image'
import { CheckCircle2, Play } from 'lucide-react'
import { Container } from './shared/Container'
import { FadeIn } from './shared/FadeIn'
import {
  groceryBeforeAfterExamples,
  productProofRecordings,
  productProofScreenshots,
} from '@/lib/proof-assets'

export function ProofAssetsSection() {
  return (
    <section className="bg-white py-20 dark:bg-neutral-950 md:py-28" aria-labelledby="proof-assets-heading">
      <Container>
        <FadeIn>
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#D97757]">
              Product proof
            </p>
            <h2
              id="proof-assets-heading"
              className="mt-3 font-serif text-4xl font-bold tracking-tight text-neutral-950 dark:text-neutral-50 md:text-5xl"
            >
              Real screens, real flows, practical grocery examples.
            </h2>
            <p className="mt-4 text-lg leading-8 text-neutral-600 dark:text-neutral-400">
              MealEase has to prove the whole loop: pick dinner, build the list,
              save the plan, and make next week easier.
            </p>
          </div>
        </FadeIn>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {productProofRecordings.map((recording, index) => (
            <FadeIn key={recording.title} delay={index * 0.08}>
              <article className="overflow-hidden rounded-3xl border border-neutral-200 bg-[#FBFAF3] dark:border-neutral-800 dark:bg-neutral-900">
                <div className="relative aspect-video bg-neutral-950">
                  <Image
                    src={recording.animation}
                    alt={recording.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 380px"
                    className="object-cover"
                    unoptimized
                  />
                  {/* <video
                    className="h-full w-full object-cover"
                    controls
                    muted
                    playsInline
                    preload="none"
                    poster={recording.poster}
                  >
                    <source src={recording.video} type="video/webm" />
                  </video> */}
                  <div className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-black/55 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                    <Play className="h-3.5 w-3.5" />
                    Demo
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-xl font-bold text-neutral-950 dark:text-neutral-50">
                    {recording.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                    {recording.description}
                  </p>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
          {productProofScreenshots.map((screenshot, index) => (
            <FadeIn key={screenshot.title} delay={index * 0.04}>
              <article className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <div className="relative aspect-[4/3] bg-neutral-100 dark:bg-neutral-800">
                  <Image
                    src={screenshot.image}
                    alt={screenshot.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 240px"
                    className="object-cover object-top"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold text-neutral-950 dark:text-neutral-50">
                    {screenshot.title}
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-neutral-600 dark:text-neutral-400">
                    {screenshot.description}
                  </p>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {groceryBeforeAfterExamples.map((example) => (
            <FadeIn key={example.title}>
              <article className="rounded-3xl border border-neutral-200 bg-[#FBFAF3] p-5 dark:border-neutral-800 dark:bg-neutral-900">
                <h3 className="font-serif text-2xl font-bold text-neutral-950 dark:text-neutral-50">
                  {example.title}
                </h3>
                <div className="mt-5 grid gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-500">
                      Before
                    </p>
                    <ul className="mt-2 space-y-2">
                      {example.before.map((item) => (
                        <li key={item} className="text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl bg-white p-4 dark:bg-neutral-950">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#D97757]">
                      After
                    </p>
                    <ul className="mt-2 space-y-2">
                      {example.after.map((item) => (
                        <li key={item} className="flex gap-2 text-sm leading-6 text-neutral-700 dark:text-neutral-300">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#D97757]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  )
}
