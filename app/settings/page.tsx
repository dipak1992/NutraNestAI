import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import SettingsClient from './settings-client'

export const metadata = {
  title: 'Settings — NutriNest AI',
}

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email, avatar_url, subscription_tier, stripe_customer_id, plan_renews_at')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')

  const { data: household } = await supabase
    .from('households')
    .select('adults_count, kids_count, toddlers_count, babies_count, budget_level')
    .eq('owner_id', user.id)
    .single()

  return (
    <main className="min-h-screen bg-[#0f0f0f] px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-2xl font-bold text-white">Settings</h1>
        <SettingsClient
          profile={{
            full_name: profile.full_name ?? null,
            email: profile.email ?? user.email ?? '',
            avatar_url: profile.avatar_url ?? null,
            subscription_tier: profile.subscription_tier ?? 'free',
            stripe_customer_id: profile.stripe_customer_id ?? null,
            plan_renews_at: profile.plan_renews_at ?? null,
          }}
          household={household ?? null}
        />
      </div>
    </main>
  )
}
