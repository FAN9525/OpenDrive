import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/utils/supabase'

// Identify vehicle details either by mmCode+mmYear or by VIN using getvalues.php
// This endpoint does NOT log a valuation; it only returns identification data

export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ success: false, error: 'Database connection not available' }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const mmCode = searchParams.get('mmCode') || ''
    const mmYear = searchParams.get('mmYear') || ''
    const vin = searchParams.get('vin') || ''

    if (!vin && (!mmCode || !mmYear)) {
      return NextResponse.json({ success: false, error: 'Provide either vin or mmCode and mmYear' }, { status: 400 })
    }

    const { data: config } = await supabase
      .from('api_configurations')
      .select('*')
      .eq('is_active', true)
      .single()

    if (!config) {
      return NextResponse.json({ success: false, error: 'API configuration not found' }, { status: 400 })
    }

    // Build request
    const useEnvironment = config.environment === 'sandbox' ? 'Sandbox' : 'Live'
    const baseUrl = 'https://www.evalue8.co.za/evalue8webservice/'

    const params = new URLSearchParams({
      soft: config.app_name,
      comid: config.computer_name,
      uname: config.username,
      password: config.password_encrypted, // encrypted; valuation route decrypts, but here we pass plaintext param not available
      // We'll call valuation route instead to leverage decryption
    })

    // Instead of duplicating decrypt logic here, call our valuation route in preview mode
    const previewUrl = new URL(request.url)
    const query = new URLSearchParams()
    if (vin) {
      query.set('vin', vin)
    } else {
      query.set('mmCode', mmCode)
      query.set('mmYear', mmYear)
    }

    // Directly hit eValue8 using fetch here, reusing logic similar to valuation route (with decryption inline)
    // Minimal duplication to avoid cross-call; decrypt locally via util
    const { decryptPassword } = await import('@/utils/encryption')
    const decryptedPassword = decryptPassword(config.password_encrypted)

    const idParams = new URLSearchParams({
      soft: config.app_name,
      comid: config.computer_name,
      uname: config.username,
      password: decryptedPassword,
      clientRef: config.client_ref,
      credentials: useEnvironment,
      datasource: 'TRANSUNION',
      condition: 'GO',
      mileage: 'AV',
    })
    if (vin) {
      idParams.set('vin', vin)
    } else {
      idParams.set('mmCode', mmCode)
      idParams.set('mmYear', mmYear)
    }

    const apiUrl = `${baseUrl}getvalues.php?${idParams.toString()}`
    const resp = await fetch(apiUrl)
    const raw = await resp.text()
    if (!resp.ok) {
      return NextResponse.json({ success: false, error: `API returned ${resp.status}`, details: raw }, { status: 500 })
    }

    let data
    try {
      data = JSON.parse(raw)
    } catch (e) {
      return NextResponse.json({ success: false, error: 'Unexpected response format', details: raw.slice(0, 500) }, { status: 500 })
    }

    if (data.result !== 0) {
      return NextResponse.json({ success: false, error: data.message || 'Lookup failed' }, { status: 400 })
    }

    const id = {
      mmCode: data.data?.mmCode,
      mmYear: data.data?.mmYear,
      mmMakeShortCode: data.data?.mmMakeShortCode,
      mvModel: data.data?.mvModel,
      mmGuide: data.data?.mmGuide,
    }

    return NextResponse.json({ success: true, data: id })
  } catch (error) {
    console.error('Identify error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}


