import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { loadWeekPlan } from './loader'
import { PlanClient } from './plan-client'

export const metadata = {
  title: 'Weekly Plan | MealEase',
  description: 'Plan your week of dinners with AI-powered autopilot.',
}

export default async function PlanPage({
  searchParams,
}: {
  searchParams: Promise<{ weekStart?: string }>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { weekStart } = await searchParams
  const plan = await loadWeekPlan(user.id, weekStart)

  return <PlanClient initialPlan={plan} />
}
