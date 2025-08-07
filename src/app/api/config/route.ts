import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/utils/supabase'
import { encryptPassword } from '@/utils/encryption'

export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json({
        success: false,
        error: 'Database connection not available'
      }, { status: 500 })
    }

    const { data: config } = await supabase
      .from('api_configurations')
      .select('app_name, username, client_ref, computer_name, environment, is_active')
      .eq('is_active', true)
      .single()

    if (!config) {
      return NextResponse.json({
        success: false,
        error: 'No active configuration found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: config
    })

  } catch (error) {
    console.error('Error fetching config:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({
        success: false,
        error: 'Database connection not available'
      }, { status: 500 })
    }

    const body = await request.json()
    const { appName, username, password, clientRef, computerName, environment } = body

    // Validate required fields
    if (!appName || !username || !password || !clientRef || !computerName) {
      return NextResponse.json({
        success: false,
        error: 'All fields are required'
      }, { status: 400 })
    }

    // Deactivate existing configurations
    await supabase
      .from('api_configurations')
      .update({ is_active: false })
      .eq('is_active', true)

    // Encrypt password
    const encryptedPassword = encryptPassword(password)

    // Insert new configuration
    const { data, error } = await supabase
      .from('api_configurations')
      .insert({
        app_name: appName,
        username: username,
        password_encrypted: encryptedPassword,
        client_ref: clientRef,
        computer_name: computerName,
        environment: environment || 'live',
        is_active: true
      })
      .select()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({
        success: false,
        error: 'Failed to save configuration'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Configuration saved successfully',
      data: {
        id: data[0].id,
        environment: data[0].environment
      }
    })

  } catch (error) {
    console.error('Error saving config:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

