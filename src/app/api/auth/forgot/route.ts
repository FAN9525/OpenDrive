import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { email } = await request.json()
  if (!email) return NextResponse.json({ success: false, error: 'Email required' }, { status: 400 })
  // Placeholder: in production send email via provider
  return NextResponse.json({ success: true })
}


