import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/sonner'
import { getSiteUrl } from '@/lib/seo'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: 'NutriNest AI — Family Meal Planning Made Safe & Simple',
    template: '%s | NutriNest AI',
  },
  description:
    'Plan one meal. Feed the whole family — safely. AI-powered meal planning that creates personalized variations for every family member based on their age, allergies, and health conditions.',
  keywords: ['meal planning', 'family nutrition', 'AI meal planner', 'baby food', 'allergy-safe recipes'],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'NutriNest AI — Family Meal Planning Made Safe & Simple',
    description: 'Plan one meal. Feed the whole family — safely.',
    type: 'website',
    url: '/',
    siteName: 'NutriNest AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NutriNest AI — Family Meal Planning Made Safe & Simple',
    description: 'Plan one meal. Feed the whole family — safely.',
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
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
