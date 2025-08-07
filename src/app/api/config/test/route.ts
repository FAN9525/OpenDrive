import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/utils/supabase'
import { EVALUE8_ENDPOINTS } from '@/utils/constants'

// Simple GET endpoint to test if the API route is working
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'API test endpoint is working',
    timestamp: new Date().toISOString()
  })
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== API test endpoint called ===')
    
    if (!supabase) {
      console.log('ERROR: Supabase client not available')
      return NextResponse.json({
        success: false,
        error: 'Database connection not available'
      }, { status: 500 })
    }

    let body
    try {
      body = await request.json()
      console.log('Request body received:', JSON.stringify(body, null, 2))
    } catch (parseError) {
      console.log('ERROR: Failed to parse JSON body:', parseError)
      return NextResponse.json({
        success: false,
        error: 'Invalid JSON in request body',
        details: (parseError as Error).message
      }, { status: 400 })
    }

    const { environment = 'live', username, password } = body
    
    // Force live environment for testing since sandbox might not exist
    const testEnvironment = 'live'
    console.log('Original environment:', environment, 'Using environment:', testEnvironment)

    // Get base URL based on environment (using live for testing)
    const baseUrl = testEnvironment === 'live' 
      ? 'https://www.evalue8.co.za/evalue8webservice/'
      : 'https://www.evalue8.co.za/evalue8webservice/sandbox/'

    // According to eValue8 documentation, getmakes.php doesn't require authentication
    // We'll test the basic endpoint first, then test with credentials if provided
    let testParams = ''
    let testWithCredentials = false

    if (username && password) {
      testWithCredentials = true
      // Use correct eValue8 parameter names from documentation
      testParams = `?uname=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
      
      // Add required eValue8 parameters if provided
      if (body.clientRef) {
        testParams += `&clientRef=${encodeURIComponent(body.clientRef)}`
      }
      if (body.appName) {
        testParams += `&soft=${encodeURIComponent(body.appName)}`
      }
      if (body.computerName) {
        testParams += `&comid=${encodeURIComponent(body.computerName)}`
      }
    }

    const endpoint = EVALUE8_ENDPOINTS?.MAKES || 'getmakes.php'
    const testUrl = `${baseUrl}${endpoint}${testParams}`
    console.log('Final test URL:', testUrl.replace(/password=[^&]*/g, 'password=***'))
    console.log('Base URL:', baseUrl)
    console.log('Endpoint:', endpoint)
    console.log('Test params:', testParams.replace(/password=[^&]*/g, 'password=***'))
    console.log('Environment requested:', environment, 'Using:', testEnvironment)
    console.log('Credentials provided:', !!username && !!password)

    // Test connection by fetching makes (simplest endpoint)
    // First, try to connect to the API endpoint
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'OpenDrive-App/1.0'
      },
      // Add timeout
      signal: AbortSignal.timeout(15000) // 15 second timeout
    })

    console.log('Response status:', response.status)
    console.log('Response ok:', response.ok)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.log('Error response text:', errorText)
      
      // Check for common HTTP errors
      if (response.status === 404) {
        console.log('ERROR: 404 - API endpoint not found')
        console.log('Full URL that failed:', testUrl.replace(/password=[^&]*/g, 'password=***'))
        return NextResponse.json({
          success: false,
          error: 'API endpoint not found. Please check the environment and endpoint URL.',
          details: `${response.status}: ${response.statusText}`,
          url: baseUrl + endpoint,
          fullUrl: testUrl.replace(/password=[^&]*/g, 'password=***')
        }, { status: 400 })
      }
      
      if (response.status === 403 || response.status === 401) {
        console.log(`ERROR: ${response.status} - Authentication failed`)
        console.log('Error response:', errorText)
        return NextResponse.json({
          success: false,
          error: 'Authentication failed. Please check your credentials.',
          details: `${response.status}: ${response.statusText}`,
          responseText: errorText
        }, { status: 400 })
      }
      
      return NextResponse.json({
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
        details: errorText,
        url: baseUrl + endpoint
      }, { status: 500 })
    }

    // Try to parse the response
    let data
    try {
      const responseText = await response.text()
      console.log('Response text:', responseText.substring(0, 500) + '...')
      
      // Try to parse as JSON
      data = JSON.parse(responseText)
      console.log('Parsed API response data:', data)
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      return NextResponse.json({
        success: false,
        error: 'Invalid JSON response from API',
        details: 'The API returned a non-JSON response'
      }, { status: 500 })
    }

    if (data.result === 0) {
      const message = testWithCredentials 
        ? `✅ Connection and credentials verified! Found ${data.data?.length || 0} vehicle makes.`
        : `✅ Basic connection successful! Found ${data.data?.length || 0} vehicle makes. ${!testWithCredentials ? '(Note: Credentials not tested - provide credentials to test full API access)' : ''}`
      
      return NextResponse.json({
        success: true,
        message,
        environment: testEnvironment,
        vehicleCount: data.data?.length || 0,
        credentialsTested: testWithCredentials
      })
    } else {
      return NextResponse.json({
        success: false,
        error: data.message || 'API returned an error',
        apiResult: data.result
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Connection test error:', error)
    
    // Check for timeout
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json({
        success: false,
        error: 'Connection timeout: The API did not respond within 15 seconds. The server might be down or slow.'
      }, { status: 500 })
    }
    
    // Check if it's a network/CORS error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json({
        success: false,
        error: 'Network error: Could not connect to eValue8 API. This might be a CORS issue, DNS problem, or the API might be unreachable.',
        details: (error as Error).message
      }, { status: 500 })
    }



    return NextResponse.json({
      success: false,
      error: 'Connection test failed: ' + (error as Error).message,
      details: error instanceof Error ? error.stack : String(error)
    }, { status: 500 })
  }
}

