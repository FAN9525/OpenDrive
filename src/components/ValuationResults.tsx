'use client'

interface ValuationResultsProps {
  results?: {
    success?: boolean
    data?: {
      mmNew?: string
      mmRetail?: string
      mmTrade?: string
      mmMakeShortCode?: string
      mvModel?: string
      mmYear?: string
      mmGuide?: string
      mmEstimator?: string
    }
    error?: string
    selectedAccessoryDetails?: Array<{
      OptionCode: string
      Description: string
      Retail: string
      Trade: string
    }>
  } | null
  isLoading?: boolean
}

export default function ValuationResults({ 
  results, 
  isLoading = false 
}: ValuationResultsProps) {
  if (isLoading) {
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          📊 Valuation Results
        </h2>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-3 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Loading valuation...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          📊 Valuation Results
        </h2>
        <div className="text-center py-12 text-slate-500">
          🔍 Configure API settings and select a vehicle to see valuation results.
        </div>
      </div>
    )
  }

  // Handle error case
  if (results.error) {
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          📊 Valuation Results
        </h2>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {results.error}
        </div>
      </div>
    )
  }

  const valuation = results.data
  if (!valuation) {
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          📊 Valuation Results
        </h2>
        <div className="text-center py-12 text-slate-500">
          No valuation data available.
        </div>
      </div>
    )
  }

  const newValue = parseInt(valuation.mmNew || '0') || 0
  const baseRetail = parseInt(valuation.mmRetail || '0') || 0
  const baseTrade = parseInt(valuation.mmTrade || '0') || 0

  const accessories = results.selectedAccessoryDetails || []
  const accessoriesRetailTotal = accessories.reduce(
    (sum: number, acc: { Retail: string }) => sum + parseInt(acc.Retail), 0
  )
  const accessoriesTradeTotal = accessories.reduce(
    (sum: number, acc: { Trade: string }) => sum + parseInt(acc.Trade), 0
  )

  const totalRetail = baseRetail + accessoriesRetailTotal
  const totalTrade = baseTrade + accessoriesTradeTotal

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl">
      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        📊 Valuation Results
      </h2>

      {/* Vehicle Info Card */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-600 text-white p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold">
          {valuation.mmMakeShortCode || 'Unknown'} {valuation.mvModel || 'Unknown'} ({valuation.mmYear || 'Unknown'})
        </h3>
        <p className="text-slate-200">
          Guide: {valuation.mmGuide || 'Unknown'} 
          {valuation.mmEstimator === '1' && ' (Estimator)'}
        </p>
      </div>

      {/* Base Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg text-center">
          <h4 className="text-slate-600 font-medium mb-1">New Value</h4>
          <div className="text-lg font-bold text-slate-800">
            R{newValue.toLocaleString()}
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg text-center">
          <h4 className="text-slate-600 font-medium mb-1">Base Retail</h4>
          <div className="text-lg font-bold text-slate-800">
            R{baseRetail.toLocaleString()}
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg text-center">
          <h4 className="text-slate-600 font-medium mb-1">Base Trade</h4>
          <div className="text-lg font-bold text-slate-800">
            R{baseTrade.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Accessories Section */}
      {accessories.length > 0 && (
        <div className="mb-6">
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg text-center mb-4">
            <h4 className="text-slate-600 font-medium mb-1">Accessories Value</h4>
            <div className="text-lg font-bold text-slate-800">
              R{accessoriesRetailTotal.toLocaleString()}
            </div>
          </div>

          {/* Total Valuation */}
          <div className="bg-gradient-to-r from-slate-700 to-slate-600 text-white p-5 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-center">
              🏆 Total Valuation (Including Accessories)
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-slate-200 mb-1">Total Retail Value</div>
                <div className="text-2xl font-bold">
                  R{totalRetail.toLocaleString()}
                </div>
              </div>
              <div className="text-center">
                <div className="text-slate-200 mb-1">Total Trade Value</div>
                <div className="text-2xl font-bold">
                  R{totalTrade.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Selected Accessories List */}
          <div className="mt-4">
            <h4 className="font-medium text-slate-800 mb-3">
              🔧 Selected Accessories ({accessories.length}):
            </h4>
            <div className="bg-slate-50 rounded-lg p-4 space-y-2">
              {accessories.map((acc) => (
                <div 
                  key={acc.OptionCode} 
                  className="flex justify-between items-center py-2 border-b border-slate-200 last:border-b-0"
                >
                  <span className="font-medium text-slate-700">
                    {acc.Description}
                  </span>
                  <span className="font-semibold text-slate-800">
                    R{parseInt(acc.Retail).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* No Accessories Message */}
      {accessories.length === 0 && (
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg text-center text-slate-600">
          💡 No accessories selected. Add accessories to increase the vehicle value.
        </div>
      )}
    </div>
  )
}
