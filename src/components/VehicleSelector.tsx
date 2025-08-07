'use client'

import { useState, useEffect } from 'react'
import { ApiConfiguration, VehicleMake, VehicleModel, VehicleYear } from '@/types/vehicle'
import { CONDITION_OPTIONS, MILEAGE_OPTIONS } from '@/utils/constants'

interface VehicleSelectorProps {
  apiConfig: ApiConfiguration
}

export default function VehicleSelector({ apiConfig }: VehicleSelectorProps) {
  const [makes, setMakes] = useState<VehicleMake[]>([])
  const [models, setModels] = useState<VehicleModel[]>([])
  const [years, setYears] = useState<VehicleYear[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [selectedMake, setSelectedMake] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [condition, setCondition] = useState('GO')
  const [mileage, setMileage] = useState('AV')

  const loadMakes = async () => {
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
    } catch (err) {
      setError('Error loading vehicle makes')
      console.error('Error loading makes:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadModels = async (make: string) => {
    if (!make) return

    setLoading(true)
    try {
      const response = await fetch(`/api/vehicles/models?make=${encodeURIComponent(make)}`)
      const data = await response.json()
      
      if (data.success) {
        setModels(data.data)
      } else {
        setError(data.error || 'Failed to load models')
      }
    } catch (err) {
      setError('Error loading models')
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
        setError(data.error || 'Failed to load years')
      }
    } catch (err) {
      setError('Error loading years')
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
    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl">
      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        🚗 Vehicle Selection
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Vehicle Make */}
        <div>
          <label htmlFor="makeSelect" className="block text-sm font-medium text-slate-700 mb-2">
            Vehicle Make:
          </label>
          <select
            id="makeSelect"
            value={selectedMake}
            onChange={(e) => handleMakeChange(e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-slate-500 focus:outline-none transition-colors"
            disabled={loading}
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
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-slate-500 focus:outline-none transition-colors"
            disabled={loading || !selectedMake}
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
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-slate-500 focus:outline-none transition-colors"
            disabled={loading || !selectedModel}
          >
            <option value="">Select model first...</option>
            {years.map((year) => (
              <option key={year.mmYear} value={year.mmYear}>
                {year.mmYear}
              </option>
            ))}
          </select>
        </div>

        {/* Vehicle Condition */}
        <div>
          <label htmlFor="conditionSelect" className="block text-sm font-medium text-slate-700 mb-2">
            Vehicle Condition:
          </label>
          <select
            id="conditionSelect"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-slate-500 focus:outline-none transition-colors"
          >
            {CONDITION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Mileage Category */}
        <div>
          <label htmlFor="mileageSelect" className="block text-sm font-medium text-slate-700 mb-2">
            Mileage Category:
          </label>
          <select
            id="mileageSelect"
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-slate-500 focus:outline-none transition-colors"
          >
            {MILEAGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <button
            onClick={loadMakes}
            disabled={loading || !apiConfig.configured}
            className="w-full bg-gradient-to-r from-slate-700 to-slate-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Loading...
              </div>
            ) : (
              '🔄 Load Vehicle Makes'
            )}
          </button>
          
          <button
            onClick={() => {
              // This will trigger valuation in parent component
              // For now, we'll just log the selection
              console.log({
                make: selectedMake,
                model: selectedModel,
                year: selectedYear,
                condition,
                mileage
              })
            }}
            disabled={loading || !selectedYear}
            className="w-full bg-gradient-to-r from-slate-700 to-slate-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            💰 Get Vehicle Value
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
