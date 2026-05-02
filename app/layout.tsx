import type { Metadata, Viewport } from 'next'
import { Inter, Fraunces } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/sonner'
import { PWAServiceWorkerRegister } from '@/components/pwa/PWAServiceWorkerRegister'
import { getSiteUrl } from '@/lib/seo'
import { organizationSchema } from '@/lib/schema'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

const fraunces = Fraunces({
  variable: '--font-serif',
  subsets: ['latin'],
  display: 'swap',
  axes: ['opsz'],
})

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: 'MealEase – Family-First AI Meal Prep Planner',
    template: '%s | MealEase',
  },
  description:
    'MealEase is the family-first AI meal prep planner for busy households. Plan dinners, generate grocery lists, use leftovers, and shop smarter.',
  keywords: ['meal prep app', 'meal planning app', 'AI meal prep planner', 'weekly meal prep with grocery list', 'meal prep for parents'],
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/icons/favicon-96.png', type: 'image/png', sizes: '96x96' },
      { url: '/icons/favicon-48.png', type: 'image/png', sizes: '48x48' },
      { url: '/icons/favicon-32.png', type: 'image/png', sizes: '32x32' },
      { url: '/icons/icon-192.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon-180.png', type: 'image/png', sizes: '180x180' },
    ],
    shortcut: '/icons/favicon-96.png',
  },
  openGraph: {
    title: 'MealEase – Family-First AI Meal Prep Planner',
    description: 'Plan dinners, generate grocery lists, use leftovers, and keep budget visible with MealEase.',
    type: 'website',
    url: '/',
    siteName: 'MealEase',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'MealEase – Family-First AI Meal Prep Planner' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MealEase – Family-First AI Meal Prep Planner',
    description: 'Plan dinners, generate grocery lists, use leftovers, and keep budget visible with MealEase.',
    images: ['/twitter-image'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#064E3B',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} antialiased`}
    >
      <body className="flex flex-col bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <Providers>
          <PWAServiceWorkerRegister />
          {children}
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  )
}
