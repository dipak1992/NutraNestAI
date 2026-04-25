import { PublicSiteHeader } from '@/components/layout/PublicSiteHeader'
import { PublicSiteFooter } from '@/components/layout/PublicSiteFooter'
import { AboutHero } from '@/components/about/AboutHero'
import { FounderStory } from '@/components/about/FounderStory'
import { WhyBuiltIt } from '@/components/about/WhyBuiltIt'
import { Principles } from '@/components/about/Principles'
import { AboutCTA } from '@/components/about/AboutCTA'

export const metadata = {
  title: "About | MealEase — Built by a family that got tired of 'what's for dinner?'",
  description:
    'Meet the husband-and-wife team behind MealEase. A software engineer and a CPA with two tiny kids, building the meal planner they wished existed.',
  openGraph: {
    title: 'About MealEase',
    description:
      "Built by a family that got tired of the 5:30 PM fridge stare. Meet Dipak and Suprabha.",
    images: ['/og-about.png'],
  },
}

export default function AboutPage() {
  return (
    <>
      <PublicSiteHeader />
      <main id="main">
        <AboutHero />
        <FounderStory />
        <WhyBuiltIt />
        <Principles />
        <AboutCTA />
      </main>
      <PublicSiteFooter />
    </>
  )
}
