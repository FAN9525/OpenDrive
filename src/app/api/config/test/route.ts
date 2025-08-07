import { NextRequest, NextResponse } from 'next/server'
import { EVALUE8_ENDPOINTS } from '@/utils/constants'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { environment = 'live' } = body

    // Get base URL based on environment
    const baseUrl = environment === 'live' 
      ? 'https://www.evalue8.co.za/evalue8webservice/'
      : 'https://www.evalue8.co.za/evalue8webservice/sandbox/'

    // Test connection by fetching makes (simplest endpoint)
    const response = await fetch(`${baseUrl}${EVALUE8_ENDPOINTS.MAKES}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`
      }, { status: 500 })
    }

    const data = await response.json()

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
    
    // Check if it's a network/CORS error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json({
        success: false,
        error: 'Network error: Could not connect to eValue8 API. This might be a CORS issue or the API might be unreachable.'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: false,
      error: 'Connection test failed: ' + (error as Error).message
    }, { status: 500 })
  }
}

