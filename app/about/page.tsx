import { Badge } from '@/components/ui/badge'
import { PublicSiteFooter } from '@/components/layout/PublicSiteFooter'
import { PublicSiteHeader } from '@/components/layout/PublicSiteHeader'
import { buildMetadata } from '@/lib/seo'

const founderImageUrl = 'https://drive.google.com/uc?export=view&id=1Fe3MSxM3CXMt7JIGkLO5rkTOgR1_RGtE'

export const metadata = buildMetadata({
  title: 'About',
  description:
    'Meet the family behind MealEase and learn why Dipak and Suprabha built a simpler way for busy parents to decide what to cook.',
  path: '/about',
  keywords: ['about MealEase', 'MealEase founders', 'family meal planning story'],
})

export default function AboutPage() {
  return (
    <>
      <PublicSiteHeader />
      <main className="min-h-screen gradient-cream">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="text-center mb-12">
            <Badge className="mb-4 border-0 bg-primary/10 text-primary">About MealEase</Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Built by parents who needed this too</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              MealEase started in a real home, during real weeknights, with two tired parents asking the same question over and over: what are we making tonight?
            </p>
          </div>

          <div className="mb-12 flex justify-center">
            <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-border/60 bg-background shadow-lg">
              <img
                src={founderImageUrl}
                alt="Dipak and Suprabha with their children"
                className="h-auto w-full object-cover"
              />
            </div>
          </div>

          <div className="mx-auto max-w-3xl rounded-3xl border border-border/60 bg-background/90 p-6 shadow-sm sm:p-8">
            <div className="space-y-5 text-[15px] leading-8 text-muted-foreground">
              <p>
                We&apos;re Dipak and Suprabha, a husband-and-wife team based in the United States. Dipak comes from a software and entrepreneurial background. Suprabha is a CPA. We&apos;re also busy working parents with two young kids, ages one and four.
              </p>
              <p>
                Like a lot of families, our hardest dinner problem wasn&apos;t actually cooking. It was everything that happened before cooking.
              </p>
              <p>
                Every day we were stuck in the same cycle. What should we make? Will the kids eat it? Do we already have the ingredients? Should we buy groceries tonight or wait until the weekend? Could one meal work for everyone, or were we about to make three slightly different dinners again?
              </p>
              <p>
                Some nights the kids wanted different things. Some nights nobody had energy. Some weeks the fridge looked full but still somehow didn&apos;t answer the real question. We weren&apos;t struggling because we didn&apos;t know how to cook. We were struggling because deciding was draining us.
              </p>
              <p className="text-foreground font-medium">
                The problem wasn&apos;t cooking — it was deciding.
              </p>
              <p>
                That insight changed everything. We realized families do not need more recipe clutter. They need a calm, trustworthy system that helps them make a decision quickly and move on with their lives.
              </p>
              <p>
                So we built MealEase to make family meals easy. A tool that helps you choose faster, plan better, waste less, and feel more confident about what is going on the table.
              </p>
              <p>
                We want MealEase to feel simple, human, and genuinely helpful. Not like one more complicated app. Not like one more thing to manage. Just a better way to get from daily stress to a dinner plan that works.
              </p>
              <p>
                If MealEase gives even one family a calmer evening, a shorter grocery debate, or one less round of “what should we eat?”, then it is doing exactly what we hoped it would do.
              </p>
              <p className="pt-2 text-foreground font-medium">Have questions? Reach us at hello@mealeaseai.com</p>
            </div>
          </div>
        </div>
      </main>
      <PublicSiteFooter />
    </>
  )
}