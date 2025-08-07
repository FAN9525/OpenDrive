'use client'

import { useState, useEffect } from 'react'
import { ApiConfiguration } from '@/types/vehicle'

interface AdminConfigProps {
  apiConfig: ApiConfiguration
  setApiConfig: (config: ApiConfiguration) => void
  onBack: () => void
}

export default function AdminConfig({ apiConfig, setApiConfig, onBack }: AdminConfigProps) {
  const [formData, setFormData] = useState<ApiConfiguration>(apiConfig)
  const [testing, setTesting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    // Load configuration from localStorage on mount
    const saved = localStorage.getItem('opendrive_config')
    if (saved) {
      try {
        const config = JSON.parse(saved)
        setFormData(config)
        setApiConfig(config)
      } catch (error) {
        console.error('Error loading saved config:', error)
      }
    }
  }, [setApiConfig])

  const handleInputChange = (field: keyof ApiConfiguration, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const setEnvironment = (environment: 'live' | 'sandbox') => {
    handleInputChange('environment', environment)
  }

  const getBaseUrl = () => {
    return formData.environment === 'live' 
      ? 'https://www.evalue8.co.za/evalue8webservice/'
      : 'https://www.evalue8.co.za/evalue8webservice/sandbox/'
  }

  const saveConfiguration = async () => {
    const requiredFields = ['appName', 'username', 'password', 'clientRef', 'computerName']
    const missing = requiredFields.filter(field => !formData[field as keyof ApiConfiguration])

    if (missing.length > 0) {
      setMessage({
        type: 'error',
        text: 'Please fill in all required fields'
      })
      return
    }

    const configToSave = {
      ...formData,
      configured: true
    }

    try {
      // Save to database via API
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!data.success) {
        setMessage({
          type: 'error',
          text: `Failed to save to database: ${data.error}`
        })
        return
      }

      // Save to localStorage
      localStorage.setItem('opendrive_config', JSON.stringify(configToSave))
      
      // Update parent state
      setApiConfig(configToSave)

      setMessage({
        type: 'success',
        text: 'Configuration saved successfully to database and local storage!'
      })

      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to save configuration: Network error'
      })
      console.error('Save configuration error:', error)
    }
  }

  const testConnection = async () => {
    if (!formData.configured && !formData.appName) {
      setMessage({
        type: 'error',
        text: 'Please save configuration first'
      })
      return
    }

    setTesting(true)
    setMessage(null)

    try {
      const response = await fetch('/api/config/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        setMessage({
          type: 'success',
          text: `✅ Connection successful! ${data.message || ''}`
        })
      } else {
        setMessage({
          type: 'error',
          text: `❌ ${data.error || 'Connection failed'}`
        })
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: '❌ Connection failed: Network error'
      })
      console.error('Connection test error:', error)
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          ⚙️ API Configuration
        </h2>

        {/* Environment Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Environment:
          </label>
          <div className="flex gap-3">
            <button
              onClick={() => setEnvironment('live')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                formData.environment === 'live'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-slate-600 text-white hover:bg-slate-700'
              }`}
            >
              🟢 Live Environment
            </button>
            <button
              onClick={() => setEnvironment('sandbox')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                formData.environment === 'sandbox'
                  ? 'bg-yellow-600 text-white shadow-lg'
                  : 'bg-slate-600 text-white hover:bg-slate-700'
              }`}
            >
              🟡 Sandbox Environment
            </button>
          </div>
        </div>

        {/* API Base URL */}
        <div className="mb-6">
          <label htmlFor="apiUrl" className="block text-sm font-medium text-slate-700 mb-2">
            API Base URL:
          </label>
          <input
            type="text"
            id="apiUrl"
            value={getBaseUrl()}
            readOnly
            className="w-full p-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-600"
          />
        </div>

        {/* Authentication Credentials */}
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          🔐 Authentication Credentials
        </h3>

        <div className="space-y-4">
          {/* Application Name */}
          <div>
            <label htmlFor="appName" className="block text-sm font-medium text-slate-700 mb-2">
              Application Name:
            </label>
            <input
              type="text"
              id="appName"
              value={formData.appName}
              onChange={(e) => handleInputChange('appName', e.target.value)}
              placeholder="Your registered application name"
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-slate-500 focus:outline-none transition-colors"
            />
            <small className="text-slate-500">This must be registered with Imagin8</small>
          </div>

          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-2">
              Username:
            </label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              placeholder="Your eValue8 username"
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-slate-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Your eValue8 password"
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-slate-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Client Reference */}
          <div>
            <label htmlFor="clientRef" className="block text-sm font-medium text-slate-700 mb-2">
              Client Reference Number:
            </label>
            <input
              type="text"
              id="clientRef"
              value={formData.clientRef}
              onChange={(e) => handleInputChange('clientRef', e.target.value)}
              placeholder="Your unique client reference"
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-slate-500 focus:outline-none transition-colors"
            />
            <small className="text-slate-500">Obtain this from the eValue8 Broker Application</small>
          </div>

          {/* Computer Name */}
          <div>
            <label htmlFor="computerName" className="block text-sm font-medium text-slate-700 mb-2">
              Computer/Workstation Name:
            </label>
            <input
              type="text"
              id="computerName"
              value={formData.computerName}
              onChange={(e) => handleInputChange('computerName', e.target.value)}
              placeholder="Identifier for this workstation"
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-slate-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={saveConfiguration}
            className="flex-1 bg-gradient-to-r from-slate-700 to-slate-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
          >
            💾 Save Configuration
          </button>
          <button
            onClick={testConnection}
            disabled={testing}
            className="flex-1 bg-gradient-to-r from-slate-500 to-slate-400 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {testing ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Testing...
              </div>
            ) : (
              '🔧 Test Connection'
            )}
          </button>
          <button
            onClick={onBack}
            className="bg-slate-300 text-slate-700 py-3 px-4 rounded-lg font-semibold hover:bg-slate-400 transition-all duration-200"
          >
            ← Back to Lookup
          </button>
        </div>

        {/* Messages */}
        {message && (
          <div className={`mt-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-100 border border-green-400 text-green-700'
              : 'bg-red-100 border border-red-400 text-red-700'
          }`}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  )
}
