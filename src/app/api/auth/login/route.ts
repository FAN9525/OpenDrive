import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/utils/supabase'

export async function POST(request: NextRequest) {
  // Server-side not needed when using Supabase client auth; keep for health check
  if (!supabaseAdmin) return NextResponse.json({ success: false, error: 'Supabase not configured' }, { status: 500 })
  return NextResponse.json({ success: true })
}


