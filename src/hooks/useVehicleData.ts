import { useState } from 'react'
import { VehicleMake, VehicleModel, VehicleYear, Accessory } from '@/types/vehicle'

export function useVehicleData() {
  const [makes, setMakes] = useState<VehicleMake[]>([])
  const [models, setModels] = useState<VehicleModel[]>([])
  const [years, setYears] = useState<VehicleYear[]>([])
  const [accessories, setAccessories] = useState<Accessory[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadMakes = async () => {
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
  }

  const loadModels = async (make: string) => {
    if (!make) {
      setModels([])
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/vehicles/models?make=${encodeURIComponent(make)}`)
      const data = await response.json()
      
      if (data.success) {
        setModels(data.data)
      } else {
        setError(data.error || 'Failed to load models')
      }
    } catch (error) {
      setError('Error loading models')
      console.error('Error loading models:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadYears = async (mmCode: string) => {
    if (!mmCode) {
      setYears([])
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/vehicles/years?mmCode=${encodeURIComponent(mmCode)}`)
      const data = await response.json()
      
      if (data.success) {
        setYears(data.data)
      } else {
        setError(data.error || 'Failed to load years')
      }
    } catch (error) {
      setError('Error loading years')
      console.error('Error loading years:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadAccessories = async (mmCode: string, year: number) => {
    if (!mmCode || !year) {
      setAccessories([])
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/vehicles/accessories?mmCode=${encodeURIComponent(mmCode)}&year=${year}`)
      const data = await response.json()
      
      if (data.success) {
        setAccessories(data.data || [])
      } else {
        setError(data.error || 'Failed to load accessories')
      }
    } catch (error) {
      setError('Error loading accessories')
      console.error('Error loading accessories:', error)
    } finally {
      setLoading(false)
    }
  }

  return {
    makes,
    models,
    years,
    accessories,
    loading,
    error,
    loadMakes,
    loadModels,
    loadYears,
    loadAccessories
  }
}
