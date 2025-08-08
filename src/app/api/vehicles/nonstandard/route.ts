import { NextRequest, NextResponse } from 'next/server'

// Fetch non-standard extra value based on year, cost price and vehicle type
// API: getNon_stdextras.php?mmYear=2012&costPrice=3000&vehicleType=P

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const mmYear = searchParams.get('mmYear')
    const costPrice = searchParams.get('costPrice')
    const vehicleType = searchParams.get('vehicleType') || 'P'

    if (!mmYear || !costPrice) {
      return NextResponse.json({ success: false, error: 'mmYear and costPrice are required' }, { status: 400 })
    }

    const baseUrl = 'https://www.evalue8.co.za/evalue8webservice/'
    const qs = new URLSearchParams({
      mmYear: String(mmYear),
      costPrice: String(costPrice),
      vehicleType: vehicleType.toUpperCase() === 'C' ? 'C' : 'P',
    })

    const apiUrl = `${baseUrl}getNon_stdextras.php?${qs.toString()}`
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

    if (data.result !== 1 || !data.data || data.data.length === 0) {
      return NextResponse.json({ success: false, error: data.message || 'No data found' }, { status: 404 })
    }

    const first = data.data[0]
    return NextResponse.json({
      success: true,
      data: {
        ExtraCode: String(first.ExtraCode),
        RetailValue: Number(first.RetailValue) || 0,
        TradeValue: Number(first.TradeValue) || 0,
      },
    })
  } catch (error) {
    console.error('Non-standard extra error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}


