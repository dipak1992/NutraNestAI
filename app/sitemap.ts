import type { MetadataRoute } from 'next'
import { getAllBlogPosts } from '@/lib/content/blog'
import { getPublicMeals } from '@/lib/content/public'
import { absoluteUrl } from '@/lib/seo'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    '/',
    '/pricing',
    '/tonight',
    '/meals',
    '/blog',
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

  const publicMeals = await getPublicMeals(200)
  const mealRoutes: MetadataRoute.Sitemap = publicMeals.map((meal) => ({
    url: absoluteUrl(`/meals/${meal.slug}`),
    lastModified: new Date(meal.published_at ?? meal.created_at),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...blogRoutes, ...mealRoutes]
}
