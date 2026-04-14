import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

type Params = Promise<{ id: string }>

export async function PATCH(req: Request, { params }: { params: Params }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json() as {
    title?: string
    description?: string | null
    is_public?: boolean
  }

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }

  if (body.title !== undefined) {
    updates.title = String(body.title).slice(0, 100)
  }
  if (body.description !== undefined) {
    updates.description = body.description ? String(body.description).slice(0, 500) : null
  }
  if (body.is_public !== undefined) {
    updates.is_public = Boolean(body.is_public)
    if (body.is_public) updates.published_at = new Date().toISOString()
  }

  const { error } = await supabase
    .from('saved_meals')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id) // enforce ownership

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: Request, { params }: { params: Params }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { error } = await supabase
    .from('saved_meals')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id) // enforce ownership

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
