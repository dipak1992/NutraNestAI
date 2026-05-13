import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, MessageSquareText } from 'lucide-react'
import { Nav } from '@/components/landing/Nav'
import { Footer } from '@/components/landing/Footer'
import { evidenceSamples } from '@/lib/seo-evidence'
import type { ComparePage } from '@/lib/seo-pages'

export function ComparePageTemplate({
  page,
  jsonLd,
}: {
  page: ComparePage
  jsonLd: Record<string, unknown>
}) {
  return (
    <>
      <Nav />
      <main id="main">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <section className="relative overflow-hidden bg-neutral-950 py-16 text-white md:py-24">
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(217,119,87,0.34),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_22%)]"
          />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#F3B18E]">
              {page.eyebrow}
            </p>
            <h1 className="mt-4 max-w-4xl font-serif text-4xl font-bold tracking-tight md:text-6xl">
              {page.h1}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/78">
              {page.intro}
            </p>
            <div className="mt-7 rounded-3xl bg-white/8 p-5 ring-1 ring-white/12 backdrop-blur-sm">
              <p className="text-sm font-semibold text-white">{page.winner}</p>
            </div>
          </div>
        </section>

        {page.slug === 'mealease-vs-chatgpt' && (
          <section className="border-b border-neutral-200 bg-[#FBFAF3] py-12">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <h2 className="font-serif text-3xl font-bold tracking-tight text-neutral-950">
                The real difference is the workflow
              </h2>
              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                <article className="rounded-3xl bg-white p-6 ring-1 ring-neutral-200">
                  <div className="flex items-center gap-2 text-sm font-bold text-neutral-950">
                    <MessageSquareText className="h-4 w-4 text-neutral-500" />
                    ChatGPT starts from a prompt
                  </div>
                  <p className="mt-3 text-sm leading-6 text-neutral-600">
                    &ldquo;Tell me dietary needs, budget, ingredients, dislikes, grocery needs,
                    leftovers, cook time, and what we already ate this week.&rdquo;
                  </p>
                </article>
                <article className="rounded-3xl bg-neutral-950 p-6 text-white">
                  <div className="flex items-center gap-2 text-sm font-bold">
                    <CheckCircle2 className="h-4 w-4 text-[#F3B18E]" />
                    MealEase starts from remembered household context
                  </div>
                  <p className="mt-3 text-sm leading-6 text-white/75">
                    Saved once: household profile, disliked foods, fridge context,
                    weekly plan, grocery list, leftovers, and budget stay connected.
                  </p>
                </article>
              </div>
            </div>
          </section>
        )}

        <section className="py-16 md:py-20">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
            <div className="rounded-3xl bg-[#FDF6F1] p-6 ring-1 ring-neutral-200">
              <h2 className="font-serif text-3xl font-bold tracking-tight text-neutral-950">
                Best for
              </h2>
              <ul className="mt-6 space-y-4">
                {page.bestFor.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-neutral-700">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#D97757]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white">
              <div className="grid grid-cols-[1.1fr_1fr_1fr] border-b border-neutral-200 bg-neutral-50 text-sm font-semibold text-neutral-900">
                <div className="p-4">Category</div>
                <div className="p-4">MealEase</div>
                <div className="p-4">{page.competitor}</div>
              </div>
              {page.comparisonRows.map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-[1.1fr_1fr_1fr] border-b border-neutral-200 last:border-b-0"
                >
                  <div className="p-4 text-sm font-medium text-neutral-900">{row.label}</div>
                  <div className="p-4 text-sm text-neutral-700">{row.mealease}</div>
                  <div className="p-4 text-sm text-neutral-600">{row.other}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-neutral-50 py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-3xl font-bold tracking-tight text-neutral-950">
              Proof, not just claims
            </h2>
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              {page.proofCards.map((card) => (
                <article
                  key={card.title}
                  className="overflow-hidden rounded-3xl bg-white ring-1 ring-neutral-200"
                >
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 560px"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-neutral-950">{card.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-neutral-600">{card.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D97757]">
                Original examples
              </p>
              <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight text-neutral-950">
                Real workflows you can inspect
              </h2>
              <p className="mt-3 text-sm leading-6 text-neutral-600">
                These sample plans and grocery lists show the practical output MealEase is built around, so the comparison is grounded in workflow evidence instead of abstract AI claims.
              </p>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {evidenceSamples.slice(0, 3).map((sample) => (
                <Link
                  key={sample.slug}
                  href={`/samples/${sample.slug}`}
                  className="rounded-3xl border border-neutral-200 bg-white p-5 transition-colors hover:border-[#D97757]"
                >
                  <p className="text-xs font-bold uppercase tracking-wide text-[#D97757]">
                    {sample.intent}
                  </p>
                  <h3 className="mt-3 text-lg font-semibold text-neutral-950">{sample.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">{sample.description}</p>
                </Link>
              ))}
            </div>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
              Founder-reviewed by the MealEase team for household dinner planning accuracy.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-3xl font-bold tracking-tight text-neutral-950">
              Questions people ask
            </h2>
            <div className="mt-6 divide-y divide-neutral-200 rounded-3xl border border-neutral-200 bg-white">
              {page.faqs.map((faq) => (
                <div key={faq.question} className="p-5">
                  <h3 className="text-sm font-semibold text-neutral-950">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">{faq.answer}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#D97757] px-6 text-base font-semibold text-white transition-colors hover:bg-[#C86646]"
              >
                Try MealEase free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/compare"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-neutral-300 px-6 text-base font-semibold text-neutral-900 transition-colors hover:border-[#D97757] hover:text-[#D97757]"
              >
                See all comparisons
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
