import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { getAllBlogPosts } from '@/lib/content/blog'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Family Meal Planning Blog',
  description:
    'Practical articles on family meal planning, toddler dinners, baby-safe meals, picky eating, and condition-aware cooking.',
  path: '/blog',
  keywords: ['family meal planning blog', 'toddler dinners', 'baby safe meals', 'healthy family dinners'],
})

export default function BlogIndexPage() {
  const posts = getAllBlogPosts()

  return (
    <main className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="max-w-3xl mb-10">
        <Badge variant="outline" className="mb-4">MealEase Blog</Badge>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Family nutrition advice built for real households</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Browse practical articles on feeding babies, toddlers, kids, and adults from one dinner plan without adding more chaos to the week.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="rounded-2xl border border-border/60 bg-card overflow-hidden flex flex-col"
          >
            {post.heroImage && (
              <Link href={`/blog/${post.slug}`} className="block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.heroImage}
                  alt={post.heroImageAlt}
                  className="w-full aspect-[16/9] object-cover"
                  loading="lazy"
                />
              </Link>
            )}
            <div className="p-6 flex flex-col flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="secondary">{post.category}</Badge>
                <span className="text-xs text-muted-foreground">
                  {new Date(post.publishedAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <span className="text-xs text-muted-foreground">· {post.readingTime}</span>
              </div>
              <h2 className="text-xl font-semibold mb-2">
                <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                  {post.title}
                </Link>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4 flex-1">{post.excerpt}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="text-sm font-medium text-primary hover:underline"
              >
                Read article →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}
