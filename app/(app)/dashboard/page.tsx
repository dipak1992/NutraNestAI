import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardHub } from '@/components/hub/DashboardHub'

export const metadata = { title: 'Dashboard – MealEase' }

function toDisplayName(value: string | null | undefined): string | null {
  if (!value) return null
  const cleaned = value
    .trim()
    .replace(/[._-]+/g, ' ')
    .replace(/\s+/g, ' ')

  return cleaned.length > 0 ? cleaned : null
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .maybeSingle()

  const metadata = (user.user_metadata ?? {}) as {
    household_name?: string
    full_name?: string
    name?: string
  }

  const emailPrefix = user.email?.split('@')[0]
  const displayName =
    toDisplayName(metadata.household_name) ??
    toDisplayName(profile?.full_name) ??
    toDisplayName(metadata.full_name) ??
    toDisplayName(metadata.name) ??
    toDisplayName(emailPrefix) ??
    'there'

  return <DashboardHub displayName={displayName} />
}

