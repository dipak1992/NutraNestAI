import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PublicSiteFooter } from '@/components/layout/PublicSiteFooter'
import { PublicSiteHeader } from '@/components/layout/PublicSiteHeader'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'About',
  description:
    'Meet the family behind MealEase — Dipak and Suprabha built a calmer way for busy parents to decide what to cook, so you never have to dread that question again.',
  path: '/about',
  keywords: ['about MealEase', 'MealEase founders', 'family meal planning story', 'busy parents dinner solution'],
})

export default function AboutPage() {
  return (
    <>
      <PublicSiteHeader />
      <main className="min-h-screen gradient-cream">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">

          {/* ── Hook ── */}
          <div className="text-center mb-14">
            <Badge className="mb-4 border-0 bg-primary/10 text-primary">Our Story</Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              We didn&apos;t build another recipe app.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg sm:text-xl leading-relaxed text-muted-foreground">
              We built the thing we wished existed on the hardest nights — when the fridge was full but nobody could answer the question: <span className="italic text-foreground">&ldquo;What are we making tonight?&rdquo;</span>
            </p>
          </div>

          {/* ── Founder Photo ── */}
          <figure className="mb-14 flex flex-col items-center">
            <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-border/60 bg-background shadow-lg">
              <Image
                src="/images/founders-family.jpg"
                alt="Dipak and Suprabha with their children"
                width={2712}
                height={2536}
                className="h-auto w-full object-cover"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUE/8QAIRAAAQQCAgMAAAAAAAAAAAAAAQIDBBEABSExUWH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8Ai8e4Tl2btsSnfkWxHFqr1XMRBbBJIAHXYABJ0AOtgmqGMWqxRr9rp4WGKSWSQKN+5JJJJJJJJJJJJJJJJJJJJL/2Q=="
                priority
              />
            </div>

          </figure>

          {/* ── Story ── */}
          <div className="mx-auto max-w-3xl rounded-3xl border border-border/60 bg-background/90 p-6 shadow-sm sm:p-10">
            <div className="space-y-6 text-[15px] leading-8 text-muted-foreground">

              {/* Founder introduction */}
              <p>
                We&apos;re <strong className="text-foreground">Dipak and Suprabha</strong>, a husband-and-wife team based in the United States. Dipak comes from a software engineering and entrepreneurial background. Suprabha is a CPA. We&apos;re also busy working parents with two young kids, ages one and four.
              </p>

              {/* The deep pain */}
              <p>
                Like a lot of families, our hardest dinner problem wasn&apos;t actually cooking. It was <em>everything that happened before cooking</em>.
              </p>
              <p>
                Every single day, the same exhausting cycle: What should we make? Will the kids eat it? Do we have the ingredients? Should we order groceries tonight or wait? Can one meal work for everyone — or are we about to make three slightly different dinners again?
              </p>
              <p>
                Some nights the kids wanted completely different things. Some nights nobody had energy. Some weeks the fridge looked full but still didn&apos;t answer the real question. We weren&apos;t struggling because we didn&apos;t know how to cook. We were <em>struggling because the deciding was draining us</em>.
              </p>

              {/* The turning point */}
              <p className="text-foreground font-semibold text-base border-l-4 border-primary/40 pl-4 py-1">
                The problem was never cooking. The problem was deciding.
              </p>
              <p>
                That one insight changed everything. We realized families don&apos;t need more recipe clutter. They need a <strong className="text-foreground">calm, trustworthy system</strong> that helps them make a decision quickly and move on with their evening.
              </p>

              {/* What we built */}
              <p>
                So we built MealEase. Not another recipe database — a decision engine. A tool that helps you <strong className="text-foreground">choose faster, plan better, waste less food, and feel genuinely confident</strong> about what&apos;s going on the table tonight.
              </p>
              <p>
                Tell it you&apos;re tired — it picks something effortless. Snap your fridge — it builds a meal from what you already have. Need a week of dinners — it plans all seven, with kid-friendly variations and a grocery list. It learns what your family loves and gets smarter every time.
              </p>

              {/* The mission */}
              <p className="text-foreground font-semibold text-base border-l-4 border-primary/40 pl-4 py-1">
                We want MealEase to feel simple, human, and genuinely helpful — not like one more complicated app to manage.
              </p>
              <p>
                Just a better way to get from daily stress to a dinner plan that actually works. Something that makes the hardest 20 minutes of every parent&apos;s evening disappear.
              </p>

              {/* Relatable close */}
              <p>
                If MealEase gives even one family a calmer evening, a shorter grocery debate, or one less round of <span className="italic">&ldquo;what should we eat?&rdquo;</span> — then it&apos;s doing exactly what we hoped it would do.
              </p>

              {/* Contact */}
              <p className="pt-3 text-foreground font-medium">
                Questions, feedback, or just want to say hi?{' '}
                <a href="mailto:hello@mealeaseai.com" className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors">
                  hello@mealeaseai.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* ── Signup CTA ── */}
        <div className="mx-auto max-w-2xl mt-16 rounded-3xl glass-card border border-border/60 px-6 py-10 text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to end the dinner debate?</h2>
          <p className="text-muted-foreground mb-6">
            Join thousands of families who already know what&apos;s for dinner tonight.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg" className="gradient-sage border-0 text-white hover:opacity-90">
              <Link href="/signup">Get started free</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/pricing">See pricing</Link>
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">No credit card required &middot; Free plan available</p>
        </div>
      </main>
      <PublicSiteFooter />
    </>
  )
}
