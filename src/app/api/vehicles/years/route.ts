import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/utils/supabase'
import { EVALUE8_ENDPOINTS, CACHE_DURATION } from '@/utils/constants'

export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({
        success: false,
        error: 'Database connection not available'
      }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const mmCode = searchParams.get('mmCode')

    if (!mmCode) {
      return NextResponse.json({
        success: false,
        error: 'mmCode parameter is required'
      }, { status: 400 })
    }

    const cacheKey = `vehicle_years_${mmCode}`
    
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
    // Temporarily force live environment since sandbox returns 404
    const useEnvironment = 'live' // Force live environment for now
    const baseUrl = useEnvironment === 'live' 
      ? 'https://www.evalue8.co.za/evalue8webservice/'
      : 'https://www.evalue8.co.za/evalue8webservice/sandbox/'
    
    const apiUrl = `${baseUrl}${EVALUE8_ENDPOINTS.YEARS}?mmCode=${encodeURIComponent(mmCode)}&nGuide=${guide}`
    console.log('Fetching years from:', apiUrl)
    console.log('Config environment:', config.environment, 'Using:', useEnvironment)
    console.log('mmCode parameter:', mmCode, 'Guide:', guide)
    
    const response = await fetch(apiUrl)
    console.log('Years API response status:', response.status)
    
    if (!response.ok) {
      console.log('Years API error:', response.status, response.statusText)
      const errorText = await response.text()
      console.log('Years API error response:', errorText)
      return NextResponse.json({
        success: false,
        error: `API returned ${response.status}: ${response.statusText}`,
        details: errorText
      }, { status: 500 })
    }
    
    const apiData = await response.json()
    console.log('Years API data result:', apiData.result, 'Years count:', apiData.Years?.length)

    if (apiData.result !== 0) {
      return NextResponse.json({
        success: false,
        error: apiData.message || 'Failed to fetch vehicle years'
      }, { status: 500 })
    }

    // Cache the result
    const expiresAt = new Date(Date.now() + CACHE_DURATION.YEARS)
    
    await supabase
      .from('cached_vehicle_data')
      .upsert({
        cache_key: cacheKey,
        data_type: 'years',
        data: apiData.Years || [],
        expires_at: expiresAt.toISOString()
      })

    return NextResponse.json({
      success: true,
      data: apiData.Years || [],
      cached: false
    })

  } catch (error) {
    console.error('Error fetching years:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

