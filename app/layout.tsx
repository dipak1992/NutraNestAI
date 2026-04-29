import type { Metadata, Viewport } from 'next'
import { Inter, Fraunces } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/sonner'
import { PWAServiceWorkerRegister } from '@/components/pwa/PWAServiceWorkerRegister'
import { getSiteUrl } from '@/lib/seo'

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
    default: 'MealEase – Make family meals easy',
    template: '%s | MealEase',
  },
  description:
    'MealEase helps you decide what to cook with simple, smart meal plans for your whole family. From one idea to a full meal plan in seconds.',
  keywords: ['meal planning', 'family meals', 'meal planner', 'easy dinner ideas', 'family recipe planner'],
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/icons/favicon-32.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon-180.png', type: 'image/png', sizes: '180x180' },
    ],
    shortcut: '/icons/favicon-32.png',
  },
  openGraph: {
    title: 'MealEase – Make family meals easy',
    description: 'From one idea to a full meal plan for your whole family — in seconds.',
    type: 'website',
    url: '/',
    siteName: 'MealEase',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'MealEase – Make family meals easy' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MealEase – Make family meals easy',
    description: 'From one idea to a full meal plan for your whole family — in seconds.',
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
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'MealEase',
              url: getSiteUrl(),
              logo: `${getSiteUrl()}/icons/logo-generated.png`,
              description:
                'MealEase helps you decide what to cook with simple, smart meal plans for your whole family.',
              sameAs: [],
            }),
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
