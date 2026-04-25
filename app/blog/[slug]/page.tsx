import { notFound } from 'next/navigation'
import { PublicSiteHeader } from '@/components/layout/PublicSiteHeader'
import { PublicSiteFooter } from '@/components/layout/PublicSiteFooter'
import { BlogHeader } from '@/components/blog/BlogHeader'
import { BlogCard } from '@/components/blog/BlogCard'
import { ShareButtons } from '@/components/blog/ShareButtons'
import { NewsletterBlock } from '@/components/blog/NewsletterBlock'
import { blogMDXComponents } from '@/lib/blog/mdx-components'
import { getAllPostSlugs, getPostBySlug, getRelatedPosts } from '@/lib/blog/mdx'

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return { title: 'Not found' }

  return {
    title: `${post.title} | MealEase Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      images: post.coverImage ? [post.coverImage] : [],
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const related = getRelatedPosts(slug)

  // Dynamic import of the MDX file
  let MDXContent: React.ComponentType<{ components?: Record<string, React.ComponentType> }>
  try {
    const mod = await import(`@/content/blog/${slug}.mdx`)
    MDXContent = mod.default
  } catch {
    notFound()
  }

  return (
    <>
      <PublicSiteHeader />
      <main id="main">
        <BlogHeader post={post} />

        <article>
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <MDXContent components={blogMDXComponents} />

            <hr className="my-12 border-0 h-px bg-neutral-200 dark:bg-neutral-800" />

            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="text-sm text-neutral-500">
                Written by{' '}
                <span className="font-medium text-neutral-900 dark:text-neutral-100">
                  {post.author}
                </span>
              </div>
              <ShareButtons title={post.title} slug={slug} />
            </div>

            <NewsletterBlock />
          </div>
        </article>

        {related.length > 0 && (
          <section className="py-16 bg-[#FDF6F1] dark:bg-neutral-900">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-8">
                Keep reading
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {related.map((p) => (
                  <BlogCard key={p.slug} post={p} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <PublicSiteFooter />
    </>
  )
}
