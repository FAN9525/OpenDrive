import { NextRequest, NextResponse } from 'next/server'

// Simple placeholder auth for demo; integrate with Supabase Auth later
export async function POST(request: NextRequest) {
  const { email, password } = await request.json()
  if (email === 'fanie@adminfocus.co.za' && password === 'P@ss100alone') {
    return NextResponse.json({ success: true })
  }
  return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 })
}


