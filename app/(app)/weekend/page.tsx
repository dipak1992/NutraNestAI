import { redirect } from 'next/navigation'
import { getPaywallStatus } from '@/lib/paywall/server'
import { ProPaywallCard } from '@/components/paywall/ProPaywallCard'
import WeekendModeFetcher from '@/components/weekend/WeekendModeFetcher'

export const metadata = {
  title: 'Weekend Mode — NutriNest AI',
  description: 'Your personalized dinner + movie plan for the weekend.',
}

export default async function WeekendPage() {
  const paywall = await getPaywallStatus()

  if (!paywall.isPro) {
    return (
      <div className="mx-auto max-w-lg px-4 py-10">
        <ProPaywallCard
          title="Weekend Mode is a Pro feature"
          description="Get a personalized dinner + movie night pairing every Friday & Saturday — curated for your household."
          isAuthenticated={paywall.isAuthenticated}
          redirectPath="/weekend"
        />
      </div>
    )
  }

  const day = new Date().getDay()
  const hour = new Date().getHours()
  const isWeekend = day === 0 || day === 6 || (day === 5 && hour >= 17)

  if (!isWeekend) {
    redirect('/dashboard')
  }

  return <WeekendModeFetcher />
}
