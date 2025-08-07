'use client'

import { useState, useEffect } from 'react'
import { Accessory } from '@/types/vehicle'

interface AccessorySelectorProps {
  mmCode?: string
  mmYear?: number
  onAccessoriesChange?: (accessories: Accessory[]) => void
}

export default function AccessorySelector({ 
  mmCode, 
  mmYear, 
  onAccessoriesChange 
}: AccessorySelectorProps) {
  const [accessories, setAccessories] = useState<Accessory[]>([])
  const [selectedAccessories, setSelectedAccessories] = useState<Accessory[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (mmCode && mmYear) {
      loadAccessories()
    } else {
      setAccessories([])
      setSelectedAccessories([])
    }
  }, [mmCode, mmYear])

  useEffect(() => {
    onAccessoriesChange?.(selectedAccessories)
  }, [selectedAccessories, onAccessoriesChange])

  const loadAccessories = async () => {
    if (!mmCode || !mmYear) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `/api/vehicles/accessories?mmCode=${encodeURIComponent(mmCode)}&year=${mmYear}`
      )
      const data = await response.json()

      if (data.success) {
        setAccessories(data.data || [])
      } else {
        setError(data.error || 'Failed to load accessories')
      }
    } catch (err) {
      setError('Error loading accessories')
      console.error('Error loading accessories:', err)
    } finally {
      setLoading(false)
    }
  }

  const toggleAccessory = (accessory: Accessory) => {
    setSelectedAccessories(prev => {
      const isSelected = prev.find(acc => acc.OptionCode === accessory.OptionCode)
      
      if (isSelected) {
        return prev.filter(acc => acc.OptionCode !== accessory.OptionCode)
      } else {
        return [...prev, accessory]
      }
    })
  }

  const isSelected = (accessory: Accessory) => {
    return selectedAccessories.some(acc => acc.OptionCode === accessory.OptionCode)
  }

  const getTotalValue = () => {
    const retail = selectedAccessories.reduce((sum, acc) => sum + parseInt(acc.Retail), 0)
    const trade = selectedAccessories.reduce((sum, acc) => sum + parseInt(acc.Trade), 0)
    return { retail, trade }
  }

  if (!mmCode || !mmYear) {
    return null
  }

  if (loading) {
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl mt-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          🛠️ Optional Accessories
        </h2>
        <div className="text-center py-8">
          <div className="w-8 h-8 border-3 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading accessories...</p>
        </div>
      </div>
    )
  }

  if (accessories.length === 0) {
    return null
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl mt-6">
      <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
        🛠️ Optional Accessories
      </h2>
      <p className="text-slate-600 mb-6">
        Select the accessories included with this vehicle to get an accurate valuation:
      </p>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Selected Accessories Summary */}
      {selectedAccessories.length > 0 && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-slate-800 mb-3">
            Selected Accessories Summary:
          </h4>
          <div className="space-y-2 mb-4">
            {selectedAccessories.map(acc => (
              <div 
                key={acc.OptionCode}
                className="flex justify-between items-center py-1 border-b border-slate-200 last:border-b-0"
              >
                <span className="text-slate-700">{acc.Description}</span>
                <span className="font-medium text-slate-800">
                  R{parseInt(acc.Retail).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
          <div className="font-semibold text-slate-800 pt-2 border-t border-slate-300">
            <span>Total Accessories Value: </span>
            <span className="text-green-600">
              R{getTotalValue().retail.toLocaleString()} retail / R{getTotalValue().trade.toLocaleString()} trade
            </span>
          </div>
        </div>
      )}

      {/* Accessories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {accessories.map(accessory => (
          <div
            key={accessory.OptionCode}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
              isSelected(accessory)
                ? 'border-slate-500 bg-slate-50 shadow-md'
                : 'border-slate-200 bg-white hover:border-slate-400'
            }`}
            onClick={() => toggleAccessory(accessory)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 pr-2">
                <h5 className="font-semibold text-slate-800 text-sm leading-tight">
                  {accessory.Description}
                </h5>
              </div>
              <input
                type="checkbox"
                checked={isSelected(accessory)}
                onChange={() => toggleAccessory(accessory)}
                className="w-4 h-4 text-slate-600 rounded focus:ring-slate-500"
              />
            </div>
            <div className="flex justify-between text-xs">
              <span className="bg-slate-600 text-white px-2 py-1 rounded">
                Retail: R{parseInt(accessory.Retail).toLocaleString()}
              </span>
              <span className="bg-slate-500 text-white px-2 py-1 rounded">
                Trade: R{parseInt(accessory.Trade).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {selectedAccessories.length > 0 && (
        <button
          onClick={() => {
            // This would trigger a valuation update in the parent component
            console.log('Update valuation with accessories:', selectedAccessories)
          }}
          className="w-full bg-gradient-to-r from-slate-700 to-slate-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
        >
          🔄 Update Valuation with Selected Accessories
        </button>
      )}
    </div>
  )
}
