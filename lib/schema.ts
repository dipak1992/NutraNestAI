import { faqs } from '@/config/faqs'
import { socialProof } from '@/config/social-proof'
import { absoluteUrl, getSiteUrl } from '@/lib/seo'

export function buildBreadcrumbSchema(
  items: Array<{ name: string; path: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'MealEase',
  url: getSiteUrl(),
  logo: `${getSiteUrl()}/icons/logo-generated.png`,
  description:
    'MealEase is the family-first AI meal prep planner for busy households that need dinner ideas, weekly plans, grocery lists, fridge scans, and leftovers support.',
}

export const softwareAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'MealEase',
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Web, iOS, Android',
  url: absoluteUrl('/'),
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: socialProof.rating,
    ratingCount: '2400',
  },
  description:
    'MealEase helps busy families decide what to cook, plan the week, generate grocery lists, use leftovers, and cook from what is already at home.',
}

export const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'MealEase',
  brand: {
    '@type': 'Brand',
    name: 'MealEase',
  },
  category: 'Meal Planning Software',
  description:
    'Family-first AI meal prep planner with weekly planning, grocery lists, pantry scanning, leftovers workflows, and budget-aware dinner suggestions.',
  image: [absoluteUrl('/landing/family-dinner.jpg')],
  url: absoluteUrl('/'),
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: socialProof.rating,
    ratingCount: '2400',
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
    url: absoluteUrl('/pricing'),
  },
}

export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: f.a,
    },
  })),
}
