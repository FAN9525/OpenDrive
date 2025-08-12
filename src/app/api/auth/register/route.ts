import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/utils/supabase'

export async function POST(request: NextRequest) {
  try {
    if (!supabase) return NextResponse.json({ success: false, error: 'DB not available' }, { status: 500 })
    const { email, password, fullName } = await request.json()
    if (!email || !password) return NextResponse.json({ success: false, error: 'Email and password required' }, { status: 400 })
    const { data, error } = await supabase.from('user_invites').insert({ email, full_name: fullName || '', role: 'Client', status: 'accepted' }).select('id').single()
    if (error) throw error
    return NextResponse.json({ success: true, data })
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Registration failed' }, { status: 500 })
  }
}


