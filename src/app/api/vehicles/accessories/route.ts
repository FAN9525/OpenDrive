import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/utils/supabase'
import { EVALUE8_ENDPOINTS, CACHE_DURATION } from '@/utils/constants'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const mmCode = searchParams.get('mmCode')
    const year = searchParams.get('year')

    if (!mmCode || !year) {
      return NextResponse.json({
        success: false,
        error: 'mmCode and year parameters are required'
      }, { status: 400 })
    }

    const cacheKey = `vehicle_accessories_${mmCode}_${year}`
    
    // Check cache first
    const { data: cachedData } = await supabase
      .from('cached_vehicle_data')
      .select('data, expires_at')
      .eq('cache_key', cacheKey)
      .single()

    if (cachedData && new Date(cachedData.expires_at) > new Date()) {
      return NextResponse.json({
        success: true,
        data: cachedData.data,
        cached: true
      })
    }

    // Get active API configuration
    const { data: config } = await supabase
      .from('api_configurations')
      .select('*')
      .eq('is_active', true)
      .single()

    if (!config) {
      return NextResponse.json({
        success: false,
        error: 'API configuration not found. Please configure API settings.'
      }, { status: 400 })
    }

    // Generate current guide number (month + year)
    const currentDate = new Date()
    const guide = (currentDate.getMonth() + 1).toString() + currentDate.getFullYear().toString()

    // Fetch from eValue8 API
    const baseUrl = config.environment === 'live' 
      ? 'https://www.evalue8.co.za/evalue8webservice/'
      : 'https://www.evalue8.co.za/evalue8webservice/sandbox/'
    
    const response = await fetch(
      `${baseUrl}${EVALUE8_ENDPOINTS.ACCESSORIES}?mmCode=${encodeURIComponent(mmCode)}&mmYear=${encodeURIComponent(year)}&mmGuide=${guide}`
    )
    const apiData = await response.json()

    if (apiData.result !== 0) {
      return NextResponse.json({
        success: false,
        error: apiData.message || 'Failed to fetch vehicle accessories'
      }, { status: 500 })
    }

    // Cache the result
    const expiresAt = new Date(Date.now() + CACHE_DURATION.ACCESSORIES)
    
    await supabase
      .from('cached_vehicle_data')
      .upsert({
        cache_key: cacheKey,
        data_type: 'accessories',
        data: apiData.Optional || [],
        expires_at: expiresAt.toISOString()
      })

    return NextResponse.json({
      success: true,
      data: apiData.Optional || [],
      cached: false
    })

  } catch (error) {
    console.error('Error fetching accessories:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
