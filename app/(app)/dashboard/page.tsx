import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardHub } from '@/components/hub/DashboardHub'

export const metadata = { title: 'Dashboard – MealEase' }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return <DashboardHub userName={user.email ?? 'there'} />
}

