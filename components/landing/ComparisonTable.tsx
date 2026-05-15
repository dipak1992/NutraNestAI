import { ArrowRight, CheckCircle2, MessageSquareText, Sparkles, XCircle } from 'lucide-react'
import { Container } from './shared/Container'
import { Button } from './shared/Button'
import { FadeIn } from './shared/FadeIn'

const genericAi = [
  'Ask every night',
  'Forgets preferences',
  'No grocery handoff',
  'No weekly system',
  'Cannot change the plan',
  'Generic answers',
]

const mealease = [
  'Copilot knows the current screen',
  'Remembers preferences',
  'Changes the plan workflow',
  'Prepares grocery lists',
  'Checks leftovers before waste',
  'Adjusts budget before checkout',
  'Built for households',
]

const workflowProof = [
  {
    label: 'ChatGPT prompt burden',
    body: 'Tell me dietary needs, budget, ingredients, dislikes, leftovers, time limit, grocery needs, and what we ate recently.',
  },
  {
    label: 'MealEase saved once',
    body: 'Household profile, fridge context, weekly plan, grocery list, leftovers, and budget stay connected.',
  },
] as const

export function ComparisonTable() {
  return (
    <section
      className="me-defer-section py-20 md:py-28 bg-[#FDF6F1] dark:bg-neutral-900"
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
              <span className="italic text-[#D97757]">MealEase Copilot takes action.</span>
            </h2>
            <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
              ChatGPT gives meal ideas. MealEase Copilot changes the plan, checks leftovers,
              adjusts budget, and prepares groceries around the household context you already saved.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mb-8 grid gap-4 rounded-3xl bg-white p-4 ring-1 ring-black/5 dark:bg-neutral-950 dark:ring-white/5 md:grid-cols-[1fr_auto_1fr] md:items-center">
            {workflowProof.slice(0, 1).map((item) => (
              <div key={item.label} className="rounded-2xl bg-[#FBFAF3] p-5 dark:bg-neutral-900">
                <div className="flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  <MessageSquareText className="h-4 w-4 text-[#D97757]" aria-hidden />
                  {item.label}
                </div>
                <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                  {item.body}
                </p>
              </div>
            ))}
            <ArrowRight className="hidden h-6 w-6 text-[#D97757] md:block" aria-hidden />
            {workflowProof.slice(1).map((item) => (
              <div key={item.label} className="rounded-2xl bg-[#FBFAF3] p-5 dark:bg-neutral-900">
                <div className="flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  <MessageSquareText className="h-4 w-4 text-[#D97757]" aria-hidden />
                  {item.label}
                </div>
                <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                  {item.body}
                </p>
                <p className="mt-3 text-xs font-bold uppercase tracking-wide text-[#D97757]">
                  Copilot routes plan, grocery, budget, and leftover actions from remembered context.
                </p>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            <ComparisonBlock
              title="Generic AI"
              description="A blank chat box is useful for brainstorming, but dinner still depends on you rebuilding the context."
              items={genericAi}
              variant="muted"
            />
            <ComparisonBlock
              title="MealEase"
              description="A purpose-built food system where Copilot routes actions across household memory, meals, groceries, leftovers, and budget."
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
              No blank prompts. No starting over. Just a Copilot that knows your food system.
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
