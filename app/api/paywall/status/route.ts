import { NextResponse } from 'next/server'
import { getPaywallStatus } from '@/lib/paywall/server'

export async function GET() {
  const status = await getPaywallStatus()
  return NextResponse.json(status)
}
