import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/utils/supabase'

export async function GET(request: NextRequest) {
  try {
    if (!supabase) return NextResponse.json({ success: false, error: 'DB not available' }, { status: 500 })
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')
    if (!userId) return NextResponse.json({ success: false, error: 'user_id required' }, { status: 400 })
    const { data, error } = await supabase
      .from('user_app_roles')
      .select('id, created_at, apps:app_id(key,name), roles:role_id(name)')
      .eq('user_id', userId)
    if (error) throw error
    return NextResponse.json({ success: true, data })
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Failed to fetch entitlements' }, { status: 500 })
  }
}


