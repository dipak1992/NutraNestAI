/**
 * POST /api/onboarding
 *
 * Saves lightweight onboarding preferences to Supabase.
 * This is fire-and-forget — the client never waits on this response.
 *
 * Required Supabase migration (run once in the SQL editor):
 * ─────────────────────────────────────────────────────────
 * create table if not exists onboarding_preferences (
 *   id                   uuid primary key default gen_random_uuid(),
 *   user_id              uuid references auth.users(id) on delete cascade unique,
 *   household_type       text,
 *   has_kids             boolean,
 *   picky_eater          boolean default false,
 *   cuisines             text[]  default '{}',
 *   disliked_foods       text[]  default '{}',
 *   cooking_time_minutes int     default 30,
 *   low_energy           boolean default false,
 *   country              text,
 *   store_preference     text,
 *   created_at           timestamptz default now(),
 *   updated_at           timestamptz default now()
 * );
 *
 * alter table onboarding_preferences enable row level security;
 *
 * create policy "Users manage own preferences"
 *   on onboarding_preferences
 *   for all using (auth.uid() = user_id)
 *   with check (auth.uid() = user_id);
 * ─────────────────────────────────────────────────────────
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Guest users: preferences live in localStorage — that's fine
    if (!user) {
      return NextResponse.json({ ok: true, note: 'guest' })
    }

    const payload = {
      user_id:              user.id,
      household_type:       body.household_type       ?? null,
      has_kids:             body.has_kids             ?? null,
      picky_eater:          body.picky_eater          ?? false,
      cuisines:             Array.isArray(body.cuisines)       ? body.cuisines       : [],
      disliked_foods:       Array.isArray(body.disliked_foods) ? body.disliked_foods : [],
      cooking_time_minutes: typeof body.cooking_time_minutes === 'number' ? body.cooking_time_minutes : 30,
      low_energy:           body.low_energy           ?? false,
      country:              body.country              ?? null,
      store_preference:     body.store_preference     ?? null,
      updated_at:           new Date().toISOString(),
    }

    const { error: prefError } = await supabase
      .from('onboarding_preferences')
      .upsert(payload, { onConflict: 'user_id' })

    if (prefError) {
      // Table may not exist yet — non-fatal, just log
      console.warn('[onboarding] preferences save skipped:', prefError.message)
    }

    // Best-effort: mark profile as onboarding complete
    await supabase
      .from('profiles')
      .update({ onboarding_completed: true, updated_at: new Date().toISOString() })
      .eq('id', user.id)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[onboarding] route error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
