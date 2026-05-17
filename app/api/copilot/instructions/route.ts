import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getActiveInstructions, clearInstructions } from '@/lib/copilot/weekly-instructions'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ instructions: [] })
  }

  const instructions = await getActiveInstructions(user.id)
  return NextResponse.json({ instructions })
}

export async function DELETE(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { category } = await req.json().catch(() => ({ category: 'all' }))
  await clearInstructions(user.id, category === 'all' ? undefined : category)
  return NextResponse.json({ success: true })
}
