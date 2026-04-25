import Image from 'next/image'
import { Container } from '@/components/landing/shared/Container'
import { FadeIn } from '@/components/landing/shared/FadeIn'

export function FounderStory() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Photo + caption (sticky on desktop) */}
          <aside className="lg:col-span-5 lg:sticky lg:top-24">
            <FadeIn>
              <figure>
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 ring-1 ring-neutral-200 dark:ring-neutral-800">
                  <Image
                    src="/founders/dipak-suprabha.jpg"
                    alt="Dipak and Suprabha, co-founders of MealEase, with their two young children"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    priority
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                    Dipak &amp; Suprabha
                  </span>{' '}
                  — co-founders. One software engineer, one CPA, two kids (3½
                  and 1), and a very full fridge.
                </figcaption>
              </figure>
            </FadeIn>
          </aside>

          {/* Long-form story */}
          <div className="lg:col-span-7 space-y-8 text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">
            <FadeIn>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
                Hi, we&apos;re Dipak and Suprabha.
              </h2>
            </FadeIn>

            <FadeIn delay={0.05}>
              <p>
                We&apos;re married. We live in a house that, most evenings, smells
                like something good is happening — and sometimes like something
                we forgot about. We have two little ones: a 3½-year-old with
                strong opinions about what <em>isn&apos;t</em> dinner, and a
                1-year-old who&apos;d happily eat the same banana three times a day.
              </p>
            </FadeIn>

            <FadeIn delay={0.1}>
              <p>
                Dipak builds software. Suprabha is a CPA — which means when
                groceries crept past $1,200 a month, she noticed first. We
                were both exhausted, both good at our jobs, and somehow still
                standing in front of an open fridge at 5:47 PM every single
                night asking each other the same useless question:{' '}
                <span className="font-serif italic text-[#D97757]">
                  &ldquo;What&apos;s for dinner?&rdquo;
                </span>
              </p>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="border-l-4 border-[#D97757] pl-6 py-2">
                <p className="font-serif text-xl md:text-2xl italic text-neutral-900 dark:text-neutral-50 leading-snug">
                  We had a fridge full of food and still ordered takeout three
                  nights a week. That&apos;s when we knew something was broken —
                  and it wasn&apos;t us.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <h3 className="font-serif text-2xl font-bold text-neutral-900 dark:text-neutral-50 mt-12">
                We tried everything.
              </h3>
              <p className="mt-4">
                Every meal planning app on the App Store. Notion templates.
                Paper notebooks. A shared Google Doc. A whiteboard on the
                fridge (that one lasted four days). They all solved 20% of the
                problem and made the other 80% worse. None of them knew what
                was actually <em>in</em> our fridge. None of them noticed when
                the chicken we cooked Monday was still sitting there on
                Thursday. None of them knew we had a toddler who&apos;d riot over
                mushrooms.
              </p>
            </FadeIn>

            <FadeIn delay={0.25}>
              <h3 className="font-serif text-2xl font-bold text-neutral-900 dark:text-neutral-50 mt-12">
                So Dipak started building. Suprabha started breaking it.
              </h3>
              <p className="mt-4">
                One weekend turned into three months. Dipak wrote the first
                version on our kitchen counter, testing it against our actual
                pantry. Suprabha stress-tested the budget math, demanded the
                leftover logic actually worked, and pointed out — loudly, and
                correctly — when a &ldquo;recipe suggestion&rdquo; was something no real
                parent would ever cook on a Tuesday night.
              </p>
              <p className="mt-4">
                The first version was for us. Then a few friends asked if they
                could use it. Then their friends. Here we are.
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <h3 className="font-serif text-2xl font-bold text-neutral-900 dark:text-neutral-50 mt-12">
                What we&apos;re actually trying to do.
              </h3>
              <p className="mt-4">
                MealEase isn&apos;t about becoming a better cook. It&apos;s not about
                optimizing macros or chasing some Pinterest dinner aesthetic.
                It&apos;s about{' '}
                <strong>
                  taking one decision off your plate every single day
                </strong>
                , using what you already have, and not throwing food (or money)
                in the trash.
              </p>
              <p className="mt-4">
                If you&apos;re a busy parent, a couple figuring it out, someone
                cooking for one — we built this for you. The same way we built
                it for us.
              </p>
            </FadeIn>

            <FadeIn delay={0.35}>
              <p className="mt-8 font-serif text-xl text-neutral-900 dark:text-neutral-50">
                Thanks for being here.
                <br />
                <span className="text-[#D97757]">— Dipak &amp; Suprabha</span>
              </p>
            </FadeIn>
          </div>
        </div>
      </Container>
    </section>
  )
}
