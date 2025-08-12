import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/utils/supabase'

export async function POST(request: NextRequest) {
  try {
    if (!supabase) return NextResponse.json({ success: false, error: 'DB not available' }, { status: 500 })
    const { email, fullName, role, companyId } = await request.json()
    if (!email || !fullName || !role || !companyId) {
      return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 })
    }
    // Create user record (Assumes auth handled separately; this is an invite record)
    const { data, error } = await supabase.from('user_invites').insert({
      email,
      full_name: fullName,
      role,
      company_id: companyId,
      status: 'pending'
    }).select('id').single()
    if (error) throw error
    return NextResponse.json({ success: true, data })
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Failed to create invite' }, { status: 500 })
  }
}


