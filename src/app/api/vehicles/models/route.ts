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
    const make = searchParams.get('make')

    if (!make) {
      return NextResponse.json({
        success: false,
        error: 'Make parameter is required'
      }, { status: 400 })
    }

    const cacheKey = `vehicle_models_${make}`

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

    // Respect configured environment
    const useEnvironment = config.environment === 'sandbox' ? 'sandbox' : 'live'
    const baseUrl = useEnvironment === 'live'
      ? 'https://www.evalue8.co.za/evalue8webservice/'
      : 'https://www.evalue8.co.za/evalue8webservice/sandbox/'

    const apiUrl = `${baseUrl}${EVALUE8_ENDPOINTS.MODELS}?mmMake=${encodeURIComponent(make)}&datasource=TRANSUNION`
    console.log('Fetching models from:', apiUrl)
    console.log('Config environment:', config.environment, 'Using:', useEnvironment)
    console.log('Make parameter:', make)

    const response = await fetch(apiUrl)
    console.log('Models API response status:', response.status)

    const raw = await response.text()
    if (!response.ok) {
      console.log('Models API error:', response.status, response.statusText, raw)
      return NextResponse.json({
        success: false,
        error: `API returned ${response.status}: ${response.statusText}`,
        details: raw
      }, { status: 500 })
    }

    let apiData: { result: number; Variants?: unknown[]; message?: string }
    try {
      apiData = JSON.parse(raw)
    } catch (e) {
      console.error('Models API returned non-JSON:', raw)
      return NextResponse.json({
        success: false,
        error: 'Unexpected response format from models service',
        details: raw?.slice(0, 500)
      }, { status: 500 })
    }
    console.log('Models API data result:', apiData.result, 'Variants count:', apiData.Variants?.length)

    if (apiData.result !== 0) {
      return NextResponse.json({
        success: false,
        error: apiData.message || 'Failed to fetch vehicle models'
      }, { status: 500 })
    }

    // Cache the result
    const expiresAt = new Date(Date.now() + CACHE_DURATION.MODELS)

    await supabase
      .from('cached_vehicle_data')
      .upsert({
        cache_key: cacheKey,
        data_type: 'models',
        data: apiData.Variants || [],
        expires_at: expiresAt.toISOString()
      })

    return NextResponse.json({
      success: true,
      data: apiData.Variants || [],
      cached: false
    })

  } catch (error) {
    console.error('Error fetching models:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}


