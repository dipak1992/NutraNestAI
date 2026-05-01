import type { MetadataRoute } from 'next'
import { getAllBlogPosts } from '@/lib/content/blog'
import { getPublicMeals } from '@/lib/content/public'
import { absoluteUrl } from '@/lib/seo'
import { growthPages, growthTools } from '@/lib/growth/content'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    '/',
    '/pricing',
    '/faq',
    '/tonight',
    '/meals',
    '/blog',
    '/tools',
    '/growth-dashboard',
    '/content-machine',
    '/features/tonight-suggestions',
    '/features/snap-and-cook',
    '/features/weekly-autopilot',
    '/features/leftovers-ai',
    '/features/budget-intelligence',
  ].map((path) => ({
    url: absoluteUrl(path),
    lastModified: new Date(),
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : 0.7,
  }))

  const blogRoutes: MetadataRoute.Sitemap = getAllBlogPosts().map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.updatedAt ?? post.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const growthRoutes: MetadataRoute.Sitemap = growthPages.map((page) => ({
    url: absoluteUrl(`/${page.slug}`),
    lastModified: new Date(),
    changeFrequency: page.kind === 'cluster' ? 'weekly' : 'monthly',
    priority: page.kind === 'cluster' ? 0.86 : 0.74,
    images: [absoluteUrl(`/api/pinterest-pin?title=${encodeURIComponent(page.h1)}`)],
  }))

  const toolRoutes: MetadataRoute.Sitemap = growthTools.map((tool) => ({
    url: absoluteUrl(`/tools/${tool.slug}`),
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.88,
  }))

  const publicMeals = await getPublicMeals(200)
  const mealRoutes: MetadataRoute.Sitemap = publicMeals.map((meal) => ({
    url: absoluteUrl(`/meals/${meal.slug}`),
    lastModified: new Date(meal.published_at ?? meal.created_at),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...growthRoutes, ...toolRoutes, ...blogRoutes, ...mealRoutes]
}
