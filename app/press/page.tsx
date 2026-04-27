import { PublicSiteHeader } from '@/components/layout/PublicSiteHeader'
import { PublicSiteFooter } from '@/components/layout/PublicSiteFooter'
import { PressHero } from '@/components/press/PressHero'
import { FactSheet } from '@/components/press/FactSheet'
import { FoundersBios } from '@/components/press/FoundersBios'
import { DownloadableAssets } from '@/components/press/DownloadableAssets'
import { PressContact } from '@/components/press/PressContact'

export const metadata = {
  title: 'Press kit | MealEase',
  description:
    'Logos, founder photos, bios, and fact sheet for media. Direct contact with founders.',
  openGraph: {
    title: 'MealEase Press Kit',
    description:
      'Everything journalists and partners need — logos, photos, founder bios, and the story behind MealEase.',
  },
}

export default function PressPage() {
  return (
    <>
      <PublicSiteHeader />
      <main id="main">
        <PressHero />
        <FactSheet />
        <FoundersBios />
        <DownloadableAssets />
        <PressContact />
      </main>
      <PublicSiteFooter />
    </>
  )
}
