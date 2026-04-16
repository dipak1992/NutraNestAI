import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { apiError, apiSuccess, withErrorHandler } from '@/lib/api-response'

export const GET = withErrorHandler('pantry/GET', async () => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return apiError('Unauthorized', 401)

  const { data, error } = await supabase
    .from('pantry_items')
    .select('id, name, category, quantity, unit, expires_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  if (error) return apiError(error.message, 500)
  return apiSuccess(data)
})

export const POST = withErrorHandler('pantry/POST', async (req: Request) => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return apiError('Unauthorized', 401)

  const body = await req.json() as {
    name: string
    category?: string
    quantity?: number
    unit?: string
    expires_at?: string
  }
  if (!body.name?.trim()) return apiError('name is required', 400)

  const { data, error } = await supabase
    .from('pantry_items')
    .insert({
      user_id: user.id,
      name: body.name.trim(),
      category: body.category ?? 'Other',
      quantity: body.quantity ?? 1,
      unit: body.unit ?? 'unit',
      expires_at: body.expires_at || null,
      added_via: 'manual',
    })
    .select('id, name, category, quantity, unit, expires_at')
    .single()

  if (error) return apiError(error.message, 500)
  return apiSuccess(data, 201)
})

export const DELETE = withErrorHandler('pantry/DELETE', async (req: Request) => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return apiError('Unauthorized', 401)

  const { searchParams } = new URL((req as NextRequest).url)
  const id = searchParams.get('id')
  if (!id) return apiError('id is required', 400)

  const { error } = await supabase
    .from('pantry_items')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return apiError(error.message, 500)
  return apiSuccess({ deleted: id })
})
