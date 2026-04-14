import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/sonner'
import { getSiteUrl } from '@/lib/seo'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
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
  openGraph: {
    title: 'MealEase – Make family meals easy',
    description: 'From one idea to a full meal plan for your whole family — in seconds.',
    type: 'website',
    url: '/',
    siteName: 'MealEase',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MealEase – Make family meals easy',
    description: 'From one idea to a full meal plan for your whole family — in seconds.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>
          {children}
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  )
}
