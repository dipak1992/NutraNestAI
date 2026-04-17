import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServiceClient } from '@/lib/supabase/service'
import { sendDinnerReminderEmail, sendWeeklyReminderEmail, sendWeekendReminderEmail, sendAdminWeeklySummary } from '@/lib/email/triggers'
import { isDinnerReminderDue, isWeeklyReminderDue, isWeekendReminderDue } from '@/lib/email/scheduler'

/**
 * Cron endpoint — called by Vercel Cron or any scheduler.
 *
 * Schedule (vercel.json):
 *   Dinner:        "0 * * * *"    (hourly — timezone-aware per user via isDinnerReminderDue)
 *   Weekly:        "0 0 * * *"    (daily midnight UTC — timezone-aware per user)
 *   Weekend:       "0 17 * * 5"   (Friday 5 PM UTC)
 *   Admin summary: "0 10 * * 1"   (Monday 10 AM UTC)
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

  if (type === 'dinner') return handleDinnerReminders(supabase)
  if (type === 'weekly') return handleWeeklyReminders(supabase)
  if (type === 'weekend') return handleWeekendReminders(supabase)
  if (type === 'admin-summary') return handleAdminSummary(supabase)

  return NextResponse.json({ error: 'Unknown type' }, { status: 400 })
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

type SupabaseClient = ReturnType<typeof createSupabaseServiceClient>
type ProfileRow = { user_id: string; email: string; first_name: string | null; is_pro?: boolean }

/** Batch-fetch profiles for a list of user IDs. Returns a map keyed by user_id. */
async function batchFetchProfiles(
  supabase: SupabaseClient,
  userIds: string[],
  includePro = false,
): Promise<Record<string, ProfileRow>> {
  if (!userIds.length) return {}
  const select = includePro ? 'user_id, email, first_name, is_pro' : 'user_id, email, first_name'
  const { data } = await supabase.from('profiles').select(select).in('user_id', userIds)
  return Object.fromEntries(((data as unknown as ProfileRow[]) ?? []).map((p: ProfileRow) => [p.user_id, p]))
}

// ─── Dinner reminders ────────────────────────────────────────────────────────

async function handleDinnerReminders(supabase: SupabaseClient) {
  // Step 1: get users who have dinner_reminders enabled in notification_preferences
  const { data: prefs, error: prefsError } = await supabase
    .from('notification_preferences')
    .select('user_id')
    .eq('dinner_reminders', true)

  if (prefsError) {
    console.error('[cron] dinner reminder fetch error:', prefsError)
    return NextResponse.json({ error: prefsError.message }, { status: 500 })
  }

  const prefUserIds = (prefs ?? []).map((p: { user_id: string }) => p.user_id)
  if (!prefUserIds.length) return NextResponse.json({ ok: true, sent: 0, skipped: 0 })

  // Step 2: get reminder schedules for those users
  const { data: users, error } = await supabase
    .from('reminder_schedules')
    .select('user_id, dinner_enabled, dinner_hour, timezone, last_dinner_sent_at')
    .eq('dinner_enabled', true)
    .in('user_id', prefUserIds)

  if (error) {
    console.error('[cron] dinner reminder fetch error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const profileMap = await batchFetchProfiles(supabase, (users ?? []).map(u => u.user_id))

  let sent = 0
  let skipped = 0

  for (const row of (users ?? [])) {
    if (!isDinnerReminderDue(row)) { skipped++; continue }

    const profile = profileMap[row.user_id]
    if (!profile?.email) { skipped++; continue }

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

async function handleWeeklyReminders(supabase: SupabaseClient) {
  // Step 1: get users who have weekly_reminders enabled in notification_preferences
  const { data: prefs, error: prefsError } = await supabase
    .from('notification_preferences')
    .select('user_id')
    .eq('weekly_reminders', true)

  if (prefsError) {
    return NextResponse.json({ error: prefsError.message }, { status: 500 })
  }

  const prefUserIds = (prefs ?? []).map((p: { user_id: string }) => p.user_id)
  if (!prefUserIds.length) return NextResponse.json({ ok: true, sent: 0, skipped: 0 })

  // Step 2: get reminder schedules for those users
  const { data: users, error } = await supabase
    .from('reminder_schedules')
    .select('user_id, weekly_enabled, weekly_day, timezone, last_weekly_sent_at')
    .eq('weekly_enabled', true)
    .in('user_id', prefUserIds)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const profileMap = await batchFetchProfiles(supabase, (users ?? []).map(u => u.user_id))

  let sent = 0
  let skipped = 0

  for (const row of (users ?? [])) {
    if (!isWeeklyReminderDue(row)) { skipped++; continue }

    const profile = profileMap[row.user_id]
    if (!profile?.email) { skipped++; continue }

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

// ─── Weekend reminders ───────────────────────────────────────────────────────

async function handleWeekendReminders(supabase: SupabaseClient) {
  const { data: users, error } = await supabase
    .from('reminder_schedules')
    .select('user_id, weekly_enabled, timezone, last_weekend_sent_at')
    .eq('weekly_enabled', true)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const profileMap = await batchFetchProfiles(supabase, (users ?? []).map(u => u.user_id), true)

  let sent = 0
  let skipped = 0

  for (const row of (users ?? [])) {
    if (!isWeekendReminderDue(row)) { skipped++; continue }

    const profile = profileMap[row.user_id]
    if (!profile?.email || !profile.is_pro) { skipped++; continue }

    const result = await sendWeekendReminderEmail({
      to: profile.email,
      firstName: profile.first_name ?? undefined,
      userId: row.user_id,
    })

    if (result.success) {
      await supabase
        .from('reminder_schedules')
        .update({ last_weekend_sent_at: new Date().toISOString() })
        .eq('user_id', row.user_id)
      sent++
    }
  }

  return NextResponse.json({ ok: true, sent, skipped })
}

// ─── Admin weekly summary ────────────────────────────────────────────────────

async function handleAdminSummary(supabase: SupabaseClient) {
  const weekStart = getWeekStart()

  const [
    { count: newUsers },
    { count: newPro },
    { count: totalUsers },
    { count: emailsSent },
    { count: failures },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', weekStart),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_pro', true).gte('pro_activated_at', weekStart),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('email_logs').select('*', { count: 'exact', head: true }).eq('status', 'sent').gte('created_at', weekStart),
    supabase.from('email_logs').select('*', { count: 'exact', head: true }).eq('status', 'failed').gte('created_at', weekStart),
  ])

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

/** Monday of the current week as YYYY-MM-DD (UTC). Consistent with weekStartKey() in lib/email/scheduler.ts. */
function getWeekStart(): string {
  const d = new Date()
  const dow = d.getUTCDay()
  const diff = dow === 0 ? -6 : 1 - dow   // Monday = 1
  const start = new Date(d)
  start.setUTCDate(d.getUTCDate() + diff)
  return start.toISOString().slice(0, 10)
}

