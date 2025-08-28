import { NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/utils/supabase'

export async function GET() {
  try {
    const diagnostics = {
      timestamp: new Date().toISOString(),
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing',
      supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Missing',
      encryptionKey: process.env.ENCRYPTION_KEY ? 'Set' : 'Missing',
      supabaseClient: supabase ? 'Initialized' : 'Not initialized',
      supabaseAdmin: supabaseAdmin ? 'Initialized' : 'Not initialized'
    }

    // Test database connection
    let dbTest = 'Failed'
    if (supabaseAdmin) {
      try {
        const { error } = await supabaseAdmin
          .from('api_configurations')
          .select('count')
          .limit(1)
        
        if (!error) {
          dbTest = 'Connected'
        } else {
          dbTest = `Error: ${error.message}`
        }
      } catch (err: unknown) {
        dbTest = `Exception: ${err instanceof Error ? err.message : 'Unknown error'}`
      }
    }

    return NextResponse.json({
      success: true,
      diagnostics: {
        ...diagnostics,
        databaseConnection: dbTest
      }
    })
  } catch (error: unknown) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      diagnostics: {
        timestamp: new Date().toISOString(),
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
        supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing',
        supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Missing',
        encryptionKey: process.env.ENCRYPTION_KEY ? 'Set' : 'Missing'
      }
    }, { status: 500 })
  }
}
