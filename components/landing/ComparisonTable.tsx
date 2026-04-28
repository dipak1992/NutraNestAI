import { CheckCircle2, Sparkles, XCircle } from 'lucide-react'
import { Container } from './shared/Container'
import { Button } from './shared/Button'
import { FadeIn } from './shared/FadeIn'

const genericAi = [
  'Ask every night',
  'Forgets preferences',
  'No grocery workflow',
  'No weekly system',
  'Generic answers',
]

const mealease = [
  'Remembers preferences',
  'Personalized tonight meals',
  'Swaps instantly',
  'Grocery ready',
  'Weekly autopilot',
  'Built for households',
]

export function ComparisonTable() {
  return (
    <section
      className="py-20 md:py-28 bg-[#FDF6F1] dark:bg-neutral-900"
      aria-labelledby="comparison-heading"
    >
      <Container>
        <FadeIn>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2
              id="comparison-heading"
              className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50"
            >
              Chatbots give ideas.{' '}
              <span className="italic text-[#D97757]">MealEase gets dinner done.</span>
            </h2>
            <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
              Generic AI can help when you know exactly what to ask. MealEase is built
              for the nightly reality of feeding a household: preferences, swaps,
              grocery lists, weekly rhythms, and meals people will actually eat.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            <ComparisonBlock
              title="Generic AI"
              description="A blank chat box is useful for brainstorming, but dinner still depends on you rebuilding the context."
              items={genericAi}
              variant="muted"
            />
            <ComparisonBlock
              title="MealEase"
              description="A purpose-built dinner system that remembers the household and moves each meal toward a plan."
              items={mealease}
              variant="highlight"
            />
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="mt-10 text-center">
            <Button href="/signup" ariaLabel="Try MealEase free">
              Try MealEase Free
            </Button>
            <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
              No blank prompts. No starting over. Just meals that fit your life.
            </p>
          </div>
        </FadeIn>
      </Container>
    </section>
  )
}

function ComparisonBlock({
  title,
  description,
  items,
  variant,
}: {
  title: string
  description: string
  items: string[]
  variant: 'muted' | 'highlight'
}) {
  const isHighlight = variant === 'highlight'

  return (
    <article
      className={
        isHighlight
          ? 'h-full rounded-3xl bg-neutral-900 p-7 md:p-8 text-white shadow-xl ring-1 ring-neutral-900 dark:bg-neutral-950 dark:ring-white/10'
          : 'h-full rounded-3xl bg-white p-7 md:p-8 ring-1 ring-black/5 dark:bg-neutral-950 dark:ring-white/5'
      }
    >
      <div className="flex items-start gap-3">
        <span
          className={
            isHighlight
              ? 'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D97757] text-white'
              : 'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-300'
          }
          aria-hidden
        >
          {isHighlight ? <Sparkles className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
        </span>
        <div>
          <h3
            className={
              isHighlight
                ? 'font-serif text-2xl font-bold text-white'
                : 'font-serif text-2xl font-bold text-neutral-900 dark:text-neutral-50'
            }
          >
            {title}
          </h3>
          <p
            className={
              isHighlight
                ? 'mt-2 text-sm leading-relaxed text-neutral-300'
                : 'mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400'
            }
          >
            {description}
          </p>
        </div>
      </div>

      <ul className="mt-7 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-3">
            {isHighlight ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-[#F3B18E]" aria-hidden />
            ) : (
              <XCircle className="h-5 w-5 shrink-0 text-neutral-300 dark:text-neutral-700" aria-hidden />
            )}
            <span
              className={
                isHighlight
                  ? 'text-sm font-medium text-white'
                  : 'text-sm font-medium text-neutral-700 dark:text-neutral-300'
              }
            >
              {item}
            </span>
          </li>
        ))}
      </ul>
    </article>
  )
}
