import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/utils/supabase'
import { EVALUE8_ENDPOINTS } from '@/utils/constants'
import { decrypt } from '@/utils/encryption'

export async function POST(request: NextRequest) {
  try {
    console.log('API test endpoint called')
    
    if (!supabase) {
      return NextResponse.json({
        success: false,
        error: 'Database connection not available'
      }, { status: 500 })
    }

    const body = await request.json()
    console.log('Request body:', body)
    const { environment = 'live', username, password } = body

    // Get base URL based on environment
    const baseUrl = environment === 'live' 
      ? 'https://www.evalue8.co.za/evalue8webservice/'
      : 'https://www.evalue8.co.za/evalue8webservice/sandbox/'

    // Build test parameters - try multiple common API parameter formats
    let testParams = ''
    if (username && password) {
      // Common API parameter formats for eValue8-type APIs
      testParams = `?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
      
      // Also try with additional common parameters if provided in the body
      if (body.clientRef) {
        testParams += `&clientref=${encodeURIComponent(body.clientRef)}`
      }
      if (body.appName) {
        testParams += `&appname=${encodeURIComponent(body.appName)}`
      }
      if (body.computerName) {
        testParams += `&computername=${encodeURIComponent(body.computerName)}`
      }
    } else {
      // Try to get existing configuration from database
      const { data: config } = await supabase
        .from('api_configurations')
        .select('*')
        .eq('is_active', true)
        .single()

      if (!config) {
        return NextResponse.json({
          success: false,
          error: 'No API credentials provided and no active configuration found'
        }, { status: 400 })
      }

      // Decrypt stored credentials
      const decryptedPassword = decrypt(config.password_encrypted)
      testParams = `?username=${encodeURIComponent(config.username)}&password=${encodeURIComponent(decryptedPassword)}&clientref=${encodeURIComponent(config.client_ref)}&appname=${encodeURIComponent(config.app_name)}&computername=${encodeURIComponent(config.computer_name)}`
    }

    const endpoint = EVALUE8_ENDPOINTS?.MAKES || 'getmakes.php'
    const testUrl = `${baseUrl}${endpoint}${testParams}`
    console.log('Testing URL:', testUrl.replace(/password=[^&]*/g, 'password=***'))

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
        return NextResponse.json({
          success: false,
          error: 'API endpoint not found. Please check the environment and endpoint URL.',
          details: `${response.status}: ${response.statusText}`,
          url: baseUrl + endpoint
        }, { status: 400 })
      }
      
      if (response.status === 403 || response.status === 401) {
        return NextResponse.json({
          success: false,
          error: 'Authentication failed. Please check your credentials.',
          details: `${response.status}: ${response.statusText}`
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
      return NextResponse.json({
        success: true,
        message: `Connection successful! Found ${data.data?.length || 0} vehicle makes.`,
        environment: environment
      })
    } else {
      return NextResponse.json({
        success: false,
        error: data.message || 'API returned an error'
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

    // Check for JSON parsing errors from our decrypt function
    if (error instanceof Error && error.message.includes('decrypt')) {
      return NextResponse.json({
        success: false,
        error: 'Configuration error: Could not decrypt stored credentials. Please re-save your configuration.',
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

