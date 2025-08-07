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
    data?: any
    error?: string
    selectedAccessoryDetails?: any[]
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
        console.error('Valuation failed:', data.error)
        setValuationResults({ error: data.error })
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
      <div className="container mx-auto px-4 py-5 max-w-7xl">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 mb-6 shadow-xl relative">
          <button
            className="absolute top-4 right-4 bg-gradient-to-r from-slate-700 to-slate-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
            onClick={() => setCurrentPage('admin')}
          >
            ⚙️ Admin
          </button>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="https://i.ibb.co/xtRWrHD8/Logo.png" 
                alt="OpenDrive Logo" 
                className="h-12 w-auto"
              />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                OpenDrive
              </h1>
            </div>
            <p className="text-slate-600 mb-4">Professional vehicle valuation system powered by eValue8</p>
            
            <div className="flex justify-center gap-3">
              <button
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  currentPage === 'lookup'
                    ? 'bg-white shadow-lg'
                    : 'bg-white/70 hover:bg-white/90'
                }`}
                onClick={() => setCurrentPage('lookup')}
              >
                🔍 Vehicle Lookup
              </button>
              <button
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  currentPage === 'admin'
                    ? 'bg-white shadow-lg'
                    : 'bg-white/70 hover:bg-white/90'
                }`}
                onClick={() => setCurrentPage('admin')}
              >
                ⚙️ Configuration
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {currentPage === 'lookup' ? (
          <div>
            {/* Configuration Status */}
            <div className={`p-4 rounded-lg mb-6 text-center ${
              apiConfig.configured
                ? 'bg-green-100 border border-green-400 text-green-800'
                : 'bg-red-100 border border-red-400 text-red-800'
            }`}>
              <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                apiConfig.configured ? 'bg-green-500' : 'bg-red-500'
              }`}></span>
              <strong>
                {apiConfig.configured 
                  ? `✅ API Configured - Connected to ${apiConfig.environment} environment`
                  : '⚠️ API Not Configured - Please configure authentication in the Admin section'
                }
              </strong>
            </div>

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
            <AccessorySelector 
              mmCode={selectedVehicle?.mmCode}
              mmYear={selectedVehicle ? parseInt(selectedVehicle.year) : undefined}
            />
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