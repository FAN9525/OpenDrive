'use client'

import { useState, useEffect } from 'react'
import VehicleSelector from '@/components/VehicleSelector'
import AccessorySelector from '@/components/AccessorySelector'
import ValuationResults from '@/components/ValuationResults'
import AdminConfig from '@/components/AdminConfig'
import { ApiConfiguration } from '@/types/vehicle'

export default function Home() {
  const [currentPage, setCurrentPage] = useState<'lookup' | 'admin'>('lookup')
  const [apiConfig, setApiConfig] = useState<ApiConfiguration>({
    appName: '',
    username: '',
    password: '',
    clientRef: '',
    computerName: '',
    environment: 'live',
    configured: false
  })

  // Vehicle selection state
  const [selectedVehicle, setSelectedVehicle] = useState<{
    make: string
    model: string
    mmCode: string
    year: string
    condition: string
    mileage: string
  } | null>(null)

  // Valuation results state
  const [valuationResults, setValuationResults] = useState<{
    success?: boolean
    data?: {
      mmNew?: string
      mmRetail?: string
      mmTrade?: string
      mmMakeShortCode?: string
      mvModel?: string
    }
    error?: string
    selectedAccessoryDetails?: Array<{
      OptionCode: string
      Description: string
      Retail: string
      Trade: string
    }>
  } | null>(null)
  const [valuationLoading, setValuationLoading] = useState(false)

  // Load configuration from localStorage on component mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('opendrive_config')
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig)
        setApiConfig(parsedConfig)
      } catch (error) {
        console.error('Error parsing saved config:', error)
      }
    }
  }, [])

  // Handle vehicle valuation
  const handleGetValuation = async (vehicleData: {
    make: string
    model: string
    mmCode: string
    year: string
    condition: string
    mileage: string
  }) => {
    setValuationLoading(true)
    setValuationResults(null)

    try {
      const response = await fetch('/api/valuation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mmCode: vehicleData.mmCode,
          mmYear: parseInt(vehicleData.year),
          condition: vehicleData.condition,
          mileage: vehicleData.mileage,
          accessories: [] // Start with no accessories
        })
      })

      const data = await response.json()

      if (data.success) {
        setValuationResults(data)
        setSelectedVehicle(vehicleData)
      } else {
        const details = typeof data.details === 'string' ? `: ${data.details.slice(0, 300)}` : ''
        console.error('Valuation failed:', data.error, data.details)
        setValuationResults({ error: `${data.error}${details}` })
      }
    } catch (error) {
      console.error('Valuation request failed:', error)
      setValuationResults({ error: 'Network error during valuation' })
    } finally {
      setValuationLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-500">
      <div className="container mx-auto px-4 py-5 max-w-7xl min-h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 mb-4 shadow-xl relative">
          <button
            className="absolute top-4 right-4 bg-gradient-to-r from-slate-700 to-slate-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
            onClick={() => setCurrentPage('admin')}
          >
            ⚙️ Admin
          </button>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="https://i.ibb.co/xtRWrHD8/Logo.png" 
                alt="OpenDrive Logo" 
                className="h-12 w-auto"
              />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                OpenDrive
              </h1>
            </div>
            <p className="text-slate-600 mb-2 text-sm">Professional vehicle valuation system powered by eValue8</p>
            
            {/* Center navigation buttons removed to save space; use top-right Admin button */}
          </div>
        </div>

        {/* Main Content */}
        {currentPage === 'lookup' ? (
          <div className="flex-1">
            {/* Configuration status removed from main UI; available in Admin panel */}

            {/* Vehicle Lookup Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
              <VehicleSelector 
                apiConfig={apiConfig} 
                onGetValuation={handleGetValuation}
                isLoading={valuationLoading}
              />
              <ValuationResults 
                results={valuationResults}
                isLoading={valuationLoading}
              />
            </div>

            {/* Accessories Section */}
            <div className="pb-10">
              <AccessorySelector 
                mmCode={selectedVehicle?.mmCode}
                mmYear={selectedVehicle ? parseInt(selectedVehicle.year) : undefined}
              />
            </div>
          </div>
        ) : (
          <AdminConfig 
            apiConfig={apiConfig} 
            setApiConfig={setApiConfig}
            onBack={() => setCurrentPage('lookup')}
          />
        )}
      </div>
    </div>
  )
}