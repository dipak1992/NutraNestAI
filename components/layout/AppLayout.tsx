import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/layout/Navbar'
import { MobileTabBar } from '@/components/layout/MobileTabBar'
import { PWAInstallPrompt } from '@/components/pwa/PWAInstallPrompt'
import type { SubscriptionTier } from '@/types'

export default async function AppLayout({
  children,
  subscriptionTier,
}: {
  children: React.ReactNode
  subscriptionTier: SubscriptionTier
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar userEmail={user?.email} subscriptionTier={subscriptionTier} />
      <main className="flex-1 pb-[calc(4.25rem+env(safe-area-inset-bottom))] md:pb-0">{children}</main>
      <PWAInstallPrompt />
      <MobileTabBar />
    </div>
  )
}
