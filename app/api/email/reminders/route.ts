import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServiceClient } from '@/lib/supabase/service'
import { sendDinnerReminderEmail, sendWeeklyReminderEmail, sendAdminWeeklySummary } from '@/lib/email/triggers'

/**
 * Cron endpoint — called by Vercel Cron or any scheduler.
 *
 * Schedule examples (vercel.json):
 *   Daily reminders:  "0 21 * * *"    (21 UTC = 4–6 PM across US timezones)
 *   Weekly summary:   "0 9 * * MON"   (Monday 9 AM UTC)
 *
 * Protected by CRON_SECRET env var.
 */
export async function GET(request: NextRequest) {
  // Auth guard
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const auth = request.headers.get('authorization')
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const type = request.nextUrl.searchParams.get('type') ?? 'dinner'
  const supabase = createSupabaseServiceClient()

  if (type === 'dinner') {
    return handleDinnerReminders(supabase)
  } else if (type === 'weekly') {
    return handleWeeklyReminders(supabase)
  } else if (type === 'admin-summary') {
    return handleAdminSummary(supabase)
  }

  return NextResponse.json({ error: 'Unknown type' }, { status: 400 })
}

// ─── Dinner reminders ────────────────────────────────────────────────────────

async function handleDinnerReminders(supabase: ReturnType<typeof createSupabaseServiceClient>) {
  // Get users with dinner reminders enabled
  const { data: users, error } = await supabase
    .from('reminder_schedules')
    .select(`
      user_id,
      dinner_hour,
      last_dinner_sent_at,
      notification_preferences!inner(dinner_reminders)
    `)
    .eq('dinner_enabled', true)
    .eq('notification_preferences.dinner_reminders', true)

  if (error) {
    console.error('[cron] dinner reminder fetch error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const today = new Date().toISOString().slice(0, 10)
  let sent = 0
  let skipped = 0

  for (const row of (users ?? [])) {
    // Skip if already sent today
    const lastSent = row.last_dinner_sent_at?.slice(0, 10)
    if (lastSent === today) {
      skipped++
      continue
    }

    // Get user profile for name / email
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, first_name')
      .eq('user_id', row.user_id)
      .maybeSingle()

    if (!profile?.email) {
      skipped++
      continue
    }

    const result = await sendDinnerReminderEmail({
      to: profile.email,
      firstName: profile.first_name ?? undefined,
    })

    if (result.success) {
      await supabase
        .from('reminder_schedules')
        .update({ last_dinner_sent_at: new Date().toISOString() })
        .eq('user_id', row.user_id)
      sent++
    }
  }

  return NextResponse.json({ ok: true, sent, skipped })
}

// ─── Weekly reminders ────────────────────────────────────────────────────────

async function handleWeeklyReminders(supabase: ReturnType<typeof createSupabaseServiceClient>) {
  const thisWeek = getWeekStart()

  const { data: users, error } = await supabase
    .from('reminder_schedules')
    .select(`
      user_id,
      last_weekly_sent_at,
      notification_preferences!inner(weekly_reminders)
    `)
    .eq('weekly_enabled', true)
    .eq('notification_preferences.weekly_reminders', true)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  let sent = 0
  let skipped = 0

  for (const row of (users ?? [])) {
    const lastSent = row.last_weekly_sent_at?.slice(0, 10)
    if (lastSent === thisWeek) {
      skipped++
      continue
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('email, first_name')
      .eq('user_id', row.user_id)
      .maybeSingle()

    if (!profile?.email) {
      skipped++
      continue
    }

    const result = await sendWeeklyReminderEmail({
      to: profile.email,
      firstName: profile.first_name ?? undefined,
    })

    if (result.success) {
      await supabase
        .from('reminder_schedules')
        .update({ last_weekly_sent_at: new Date().toISOString() })
        .eq('user_id', row.user_id)
      sent++
    }
  }

  return NextResponse.json({ ok: true, sent, skipped })
}

// ─── Admin weekly summary ────────────────────────────────────────────────────

async function handleAdminSummary(supabase: ReturnType<typeof createSupabaseServiceClient>) {
  const weekStart = getWeekStart()

  // New signups this week
  const { count: newUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', weekStart)

  // New Pro subs this week
  const { count: newPro } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('is_pro', true)
    .gte('pro_activated_at', weekStart)

  // Total users
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  // Email stats this week
  const { count: emailsSent } = await supabase
    .from('email_logs')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'sent')
    .gte('created_at', weekStart)

  const { count: failures } = await supabase
    .from('email_logs')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'failed')
    .gte('created_at', weekStart)

  await sendAdminWeeklySummary({
    weekStart,
    newUsers: newUsers ?? 0,
    newPro: newPro ?? 0,
    totalUsers: totalUsers ?? 0,
    emailsSent: emailsSent ?? 0,
    failures: failures ?? 0,
  })

  return NextResponse.json({ ok: true })
}

function getWeekStart() {
  const d = new Date()
  const day = d.getDay()
  const diff = d.getDate() - day
  const start = new Date(d)
  start.setDate(diff)
  return start.toISOString().slice(0, 10)
}
