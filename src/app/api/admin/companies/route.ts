import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/utils/supabase'

export async function GET() {
  try {
    if (!supabase) return NextResponse.json({ success: false, error: 'DB not available' }, { status: 500 })
    const { data, error } = await supabase.from('companies').select('id, name').order('name')
    if (error) throw error
    return NextResponse.json({ success: true, data })
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Failed to load companies' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!supabase) return NextResponse.json({ success: false, error: 'DB not available' }, { status: 500 })
    const body = await request.json()
    const name = (body?.name as string)?.trim()
    if (!name) return NextResponse.json({ success: false, error: 'Name required' }, { status: 400 })
    const { data, error } = await supabase.from('companies').insert({ name }).select('id, name').single()
    if (error) throw error
    return NextResponse.json({ success: true, data })
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Failed to create company' }, { status: 500 })
  }
}


