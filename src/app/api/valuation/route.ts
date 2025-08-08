import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/utils/supabase'
import { EVALUE8_ENDPOINTS } from '@/utils/constants'
import { decryptPassword } from '@/utils/encryption'

export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({
        success: false,
        error: 'Database connection not available'
      }, { status: 500 })
    }

    const body = await request.json()
    const { mmCode, mmYear, condition, mileage, accessories = [] } = body

    // Validate required fields
    if (!mmCode || !mmYear || !condition || !mileage) {
      return NextResponse.json({
        success: false,
        error: 'mmCode, mmYear, condition, and mileage are required'
      }, { status: 400 })
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

    // Build API request parameters
    // Temporarily force Live environment since Sandbox returns 404
    // API expects capitalized values: "Live" | "Sandbox"
    const useEnvironment = 'Live'
    const baseUrl = useEnvironment === 'Live' 
      ? 'https://www.evalue8.co.za/evalue8webservice/'
      : 'https://www.evalue8.co.za/evalue8webservice/sandbox/'
    
    console.log('Valuation request - Config environment:', config.environment, 'Using:', useEnvironment)
    console.log('Valuation params:', { mmCode, mmYear, condition, mileage })

    const params = new URLSearchParams({
      mmCode: mmCode,
      mmYear: mmYear.toString(),
      soft: config.app_name,
      comid: config.computer_name,
      uname: config.username,
      password: decryptPassword(config.password_encrypted),
      clientref: config.client_ref,
      condition: condition,
      mileage: mileage,
      credentials: useEnvironment
    })

    // Add accessories if provided
    if (accessories.length > 0) {
      params.append('options', accessories.join(','))
    }

    // Make API request
    const apiUrl = `${baseUrl}${EVALUE8_ENDPOINTS.VALUATION}?${params}`
    console.log('Valuation API URL:', apiUrl.replace(/password=[^&]*/g, 'password=***'))
    
    const response = await fetch(apiUrl)
    console.log('Valuation API response status:', response.status)
    
    if (!response.ok) {
      console.log('Valuation API error:', response.status, response.statusText)
      const errorText = await response.text()
      console.log('Valuation API error response:', errorText)
      return NextResponse.json({
        success: false,
        error: `API request failed: ${response.status} ${response.statusText}`,
        details: errorText
      }, { status: 500 })
    }

    const apiData = await response.json()
    console.log('Valuation API data result:', apiData.result)

    if (apiData.result !== 0) {
      return NextResponse.json({
        success: false,
        error: apiData.message || 'Valuation request failed'
      }, { status: 500 })
    }

    // Calculate accessories values if provided
    let accessoriesValue = 0
    let selectedAccessoryDetails = []

    if (accessories.length > 0) {
      // Fetch accessory details for logging
      try {
        const currentDate = new Date()
        const guide = (currentDate.getMonth() + 1).toString() + currentDate.getFullYear().toString()
        
        const accessoryResponse = await fetch(
          `${baseUrl}${EVALUE8_ENDPOINTS.ACCESSORIES}?mmCode=${encodeURIComponent(mmCode)}&mmYear=${mmYear}&mmGuide=${guide}`
        )
        
        if (accessoryResponse.ok) {
          const accessoryData = await accessoryResponse.json()
          if (accessoryData.result === 0 && accessoryData.Optional) {
            selectedAccessoryDetails = accessoryData.Optional.filter((acc: { OptionCode: string }) => 
              accessories.includes(acc.OptionCode)
            )
            accessoriesValue = selectedAccessoryDetails.reduce((sum: number, acc: { Retail: string }) => 
              sum + parseInt(acc.Retail), 0
            )
          }
        }
      } catch (err) {
        console.error('Error fetching accessory details:', err)
      }
    }

    // Log the valuation to database
    const baseRetail = parseInt(apiData.data.mmRetail) || 0
    const baseTrade = parseInt(apiData.data.mmTrade) || 0
    const totalRetail = baseRetail + accessoriesValue
    const totalTrade = baseTrade + accessoriesValue // Simplified - in reality, trade value for accessories might be different

    try {
      await supabase
        .from('valuation_logs')
        .insert({
          make: apiData.data.mmMakeShortCode,
          model: apiData.data.mvModel,
          year: parseInt(mmYear),
          mm_code: mmCode,
          condition: condition,
          mileage: mileage,
          base_retail: baseRetail,
          base_trade: baseTrade,
          accessories_value: accessoriesValue,
          total_retail: totalRetail,
          total_trade: totalTrade,
          selected_accessories: selectedAccessoryDetails
        })
    } catch (logError) {
      console.error('Error logging valuation:', logError)
      // Don't fail the request if logging fails
    }

    return NextResponse.json({
      success: true,
      data: {
        ...apiData.data,
        accessories: selectedAccessoryDetails,
        totals: {
          retail: totalRetail,
          trade: totalTrade,
          accessoriesValue: accessoriesValue
        }
      }
    })

  } catch (error) {
    console.error('Error getting valuation:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
