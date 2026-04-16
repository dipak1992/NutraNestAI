import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { HomeHub } from '@/components/hub/HomeHub'

export const metadata = { title: 'Dashboard – MealEase' }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return <HomeHub userName={user.email ?? 'there'} />
}

