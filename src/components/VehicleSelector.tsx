'use client'

import { useState, useEffect, useCallback } from 'react'
import { ApiConfiguration, VehicleMake, VehicleModel, VehicleYear, SearchMode } from '@/types/vehicle'
import { CONDITION_OPTIONS, MILEAGE_OPTIONS } from '@/utils/constants'

interface VehicleSelectorProps {
  apiConfig: ApiConfiguration
  onGetValuation?: (vehicleData: {
    make: string
    model: string
    mmCode: string
    year: string
    condition: string
    mileage: string
  }) => void
  isLoading?: boolean
}

export default function VehicleSelector({ apiConfig, onGetValuation, isLoading: parentLoading }: VehicleSelectorProps) {
  const [makes, setMakes] = useState<VehicleMake[]>([])
  const [models, setModels] = useState<VehicleModel[]>([])
  const [years, setYears] = useState<VehicleYear[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [searchMode, setSearchMode] = useState<SearchMode>('make-model')
  const [selectedMake, setSelectedMake] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [condition, setCondition] = useState('GO')
  const [mileage, setMileage] = useState('AV')
  const [manualMmCode, setManualMmCode] = useState('')
  const [vin, setVin] = useState('')

  const loadMakes = useCallback(async () => {
    if (!apiConfig.configured) {
      setError('Please configure API settings in the Admin section first')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/vehicles/makes')
      const data = await response.json()
      
      if (data.success) {
        setMakes(data.data)
      } else {
        setError(data.error || 'Failed to load vehicle makes')
      }
    } catch (error) {
      setError('Error loading vehicle makes')
      console.error('Error loading makes:', error)
    } finally {
      setLoading(false)
    }
  }, [apiConfig.configured])

  // Auto-load makes whenever component mounts and API is configured
  useEffect(() => {
    if (apiConfig.configured && makes.length === 0) {
      void loadMakes()
    }
  }, [apiConfig.configured, makes.length, loadMakes])

  const loadModels = async (make: string) => {
    if (!make) return

    setLoading(true)
    try {
      const response = await fetch(`/api/vehicles/models?make=${encodeURIComponent(make)}`)
      const data = await response.json()

      if (data.success) {
        setModels(data.data)
      } else {
        const details = typeof data.details === 'string' ? `: ${data.details.slice(0, 200)}` : ''
        setError((data.error || 'Failed to load models') + details)
      }
    } catch (error) {
      setError('Error loading models')
      console.error('Error loading models:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadYears = async (modelCode: string) => {
    if (!modelCode) return

    setLoading(true)
    try {
      const response = await fetch(`/api/vehicles/years?mmCode=${encodeURIComponent(modelCode)}`)
      const data = await response.json()

      if (data.success) {
        setYears(data.data)
      } else {
        const details = typeof data.details === 'string' ? `: ${data.details.slice(0, 200)}` : ''
        setError((data.error || 'Failed to load years') + details)
      }
    } catch (error) {
      setError('Error loading years')
      console.error('Error loading years:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMakeChange = (make: string) => {
    setSelectedMake(make)
    setSelectedModel('')
    setSelectedYear('')
    setModels([])
    setYears([])
    
    if (make) {
      loadModels(make)
    }
  }

  const handleModelChange = (modelCode: string) => {
    setSelectedModel(modelCode)
    setSelectedYear('')
    setYears([])
    
    if (modelCode) {
      loadYears(modelCode)
    }
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl">
      <h2 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
        🚗 Vehicle Selection
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-3 text-sm">
        {/* Search Mode */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Search By:</label>
          <select
            value={searchMode}
            onChange={(e) => setSearchMode(e.target.value as SearchMode)}
            className="w-full p-2.5 border-2 border-gray-200 rounded-lg focus:border-slate-500 focus:outline-none transition-colors text-sm"
          >
            <option value="make-model">Make & Model</option>
            <option value="mmcode">M&M Code</option>
            <option value="vin">VIN Number</option>
          </select>
        </div>
        {/* Vehicle Make */}
        <div>
          <label htmlFor="makeSelect" className="block text-sm font-medium text-slate-700 mb-2">
            Vehicle Make:
          </label>
          <select
            id="makeSelect"
            value={selectedMake}
            onChange={(e) => handleMakeChange(e.target.value)}
            className="w-full p-2.5 border-2 border-gray-200 rounded-lg focus:border-slate-500 focus:outline-none transition-colors text-sm"
            disabled={loading || searchMode !== 'make-model'}
          >
            <option value="">Select a make...</option>
            {makes.map((make) => (
              <option key={make.mmMakeShortCode} value={make.mmMakeShortCode}>
                {make.mmMakeShortCode}
              </option>
            ))}
          </select>
        </div>

        {/* Vehicle Model */}
        <div>
          <label htmlFor="modelSelect" className="block text-sm font-medium text-slate-700 mb-2">
            Vehicle Model:
          </label>
          <select
            id="modelSelect"
            value={selectedModel}
            onChange={(e) => handleModelChange(e.target.value)}
            className="w-full p-2.5 border-2 border-gray-200 rounded-lg focus:border-slate-500 focus:outline-none transition-colors text-sm"
            disabled={loading || !selectedMake || searchMode !== 'make-model'}
          >
            <option value="">Select make first...</option>
            {models.map((model) => (
              <option key={model.mvCode} value={model.mvCode}>
                {model.mvModel}
              </option>
            ))}
          </select>
        </div>

        {/* Model Year */}
        <div>
          <label htmlFor="yearSelect" className="block text-sm font-medium text-slate-700 mb-2">
            Model Year:
          </label>
          <select
            id="yearSelect"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full p-2.5 border-2 border-gray-200 rounded-lg focus:border-slate-500 focus:outline-none transition-colors text-sm"
            disabled={loading || (searchMode === 'make-model' && !selectedModel)}
          >
        {/* M&M Code and VIN inputs (enabled per mode) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">M&M Code:</label>
            <input
              type="text"
              value={manualMmCode}
              onChange={(e) => setManualMmCode(e.target.value)}
              placeholder="e.g. 64072915"
              className="w-full p-2.5 border-2 border-gray-200 rounded-lg focus:border-slate-500 focus:outline-none transition-colors text-sm"
              disabled={searchMode !== 'mmcode'}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">VIN Number:</label>
            <input
              type="text"
              value={vin}
              onChange={(e) => setVin(e.target.value.toUpperCase())}
              placeholder="17-character VIN"
              className="w-full p-2.5 border-2 border-gray-200 rounded-lg focus:border-slate-500 focus:outline-none transition-colors text-sm"
              disabled={searchMode !== 'vin'}
            />
          </div>
        </div>
            <option value="">Select model first...</option>
            {years.map((year) => (
              <option key={year.mmYear} value={year.mmYear}>
                {year.mmYear}
              </option>
            ))}
          </select>
        </div>

        {/* Vehicle Condition + Mileage Category inline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="conditionSelect" className="block text-sm font-medium text-slate-700 mb-2">
              Vehicle Condition:
            </label>
            <select
              id="conditionSelect"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full p-2.5 border-2 border-gray-200 rounded-lg focus:border-slate-500 focus:outline-none transition-colors text-sm"
            >
              {CONDITION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="mileageSelect" className="block text-sm font-medium text-slate-700 mb-2">
              Mileage Category:
            </label>
            <select
              id="mileageSelect"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
              className="w-full p-2.5 border-2 border-gray-200 rounded-lg focus:border-slate-500 focus:outline-none transition-colors text-sm"
            >
              {MILEAGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-3">
          <button
            onClick={() => {
              if (!onGetValuation) return

              if (searchMode === 'make-model') {
                if (selectedMake && selectedModel && selectedYear) {
                  const selectedModelData = models.find(m => m.mvCode === selectedModel)
                  if (selectedModelData) {
                    onGetValuation({
                      make: selectedMake,
                      model: selectedModelData.mvModel,
                      mmCode: selectedModel,
                      year: selectedYear,
                      condition,
                      mileage
                    })
                  }
                }
              } else if (searchMode === 'mmcode') {
                if (manualMmCode && selectedYear) {
                  onGetValuation({
                    make: '',
                    model: '',
                    mmCode: manualMmCode,
                    year: selectedYear,
                    condition,
                    mileage
                  })
                }
              } else if (searchMode === 'vin') {
                if (vin) {
                  onGetValuation({
                    make: '',
                    model: '',
                    mmCode: `VIN:${vin}`,
                    year: selectedYear || '',
                    condition,
                    mileage
                  })
                }
              }
            }}
            disabled={loading || parentLoading || (!selectedYear && searchMode !== 'vin')}
            className="w-full bg-gradient-to-r from-slate-700 to-slate-600 text-white py-2.5 px-3 rounded font-semibold hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {parentLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Getting Value...
              </div>
            ) : (
              '💰 Get Vehicle Value'
            )}
          </button>
        </div>

        {loading && (
          <div className="text-center py-4">
            <div className="inline-flex items-center gap-2 text-slate-600">
              <div className="w-4 h-4 border-2 border-slate-600 border-t-transparent rounded-full animate-spin"></div>
              Loading...
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
