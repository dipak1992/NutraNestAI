import AppLayout from '@/components/layout/AppLayout'
import { getPaywallStatus } from '@/lib/paywall/server'
import { ScanModal } from '@/components/scan/ScanModal'
import { GlobalCookedPrompt } from '@/components/leftovers/GlobalCookedPrompt'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const paywall = await getPaywallStatus()

  return (
    <AppLayout subscriptionTier={paywall.tier}>
      {children}
      <ScanModal />
      <GlobalCookedPrompt />
    </AppLayout>
  )
}
