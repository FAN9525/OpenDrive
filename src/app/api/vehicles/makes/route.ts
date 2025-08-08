import { NextResponse } from 'next/server'
import { supabase } from '@/utils/supabase'
import { EVALUE8_ENDPOINTS, CACHE_DURATION } from '@/utils/constants'

export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json({
        success: false,
        error: 'Database connection not available'
      }, { status: 500 })
    }

    const cacheKey = 'vehicle_makes'
    
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

    // Fetch from eValue8 API - use Live base for non-billed lookups
    const baseUrl = 'https://www.evalue8.co.za/evalue8webservice/'
    
    console.log('Fetching makes from:', `${baseUrl}${EVALUE8_ENDPOINTS.MAKES}`)
    console.log('Config environment:', config.environment, 'Using live base for non-billed endpoint')
    
    const response = await fetch(`${baseUrl}${EVALUE8_ENDPOINTS.MAKES}`)
    console.log('Makes API response status:', response.status)
    
    if (!response.ok) {
      console.log('Makes API error:', response.status, response.statusText)
      return NextResponse.json({
        success: false,
        error: `API returned ${response.status}: ${response.statusText}`
      }, { status: 500 })
    }
    
    const apiData = await response.json()
    console.log('Makes API data result:', apiData.result, 'Data count:', apiData.data?.length)

    if (apiData.result !== 0) {
      return NextResponse.json({
        success: false,
        error: apiData.message || 'Failed to fetch vehicle makes'
      }, { status: 500 })
    }

    // Cache the result
    const expiresAt = new Date(Date.now() + CACHE_DURATION.MAKES)
    
    await supabase
      .from('cached_vehicle_data')
      .upsert({
        cache_key: cacheKey,
        data_type: 'makes',
        data: apiData.data,
        expires_at: expiresAt.toISOString()
      })

    return NextResponse.json({
      success: true,
      data: apiData.data,
      cached: false
    })

  } catch (error) {
    console.error('Error fetching makes:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
