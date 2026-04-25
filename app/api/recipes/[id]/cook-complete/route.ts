import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type Params = { params: Promise<{ id: string }> }

// ─── POST /api/recipes/[id]/cook-complete ─────────────────────────────────────

export async function POST(_req: Request, { params }: Params) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Log cook completion (best-effort — table may not exist yet)
    try {
      await supabase
        .from('cook_completions')
        .insert({
          user_id: user.id,
          meal_id: id,
          completed_at: new Date().toISOString(),
        })
    } catch {
      // non-critical — table may not exist yet
    }

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
