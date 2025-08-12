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
  isLoading = false,
  selectedAccessories: liveSelectedAccessories
}: ValuationResultsProps & { selectedAccessories?: Array<{ OptionCode: string; Description: string; Retail: string; Trade: string }> }) {
  if (isLoading) {
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl">
        <h2 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
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
      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl">
        <h2 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
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
      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl">
        <h2 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
          📊 Valuation Results
        </h2>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {results.error}
        </div>
      </div>
    )
  }

  type V = {
    mmNew?: string
    mmRetail?: string
    mmTrade?: string
    mmMakeShortCode?: string
    mvModel?: string
    mmYear?: string
    mmGuide?: string
    mmEstimator?: string
    mmCode?: string
  }
  const valuation = results.data as V
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

  // Merge server-selected accessories (standard options) with live selections (which may include non-standard extras)
  const serverSelected = results.selectedAccessoryDetails || []
  const liveSelected = liveSelectedAccessories || []
  const serverCodes = new Set(serverSelected.map((a) => a.OptionCode))
  const mergedAccessories = [...serverSelected]
  for (const acc of liveSelected) {
    if (!serverCodes.has(acc.OptionCode)) {
      mergedAccessories.push(acc)
    }
  }
  const accessoriesRetailTotal = mergedAccessories.reduce(
    (sum: number, acc: { Retail: string }) => sum + parseInt(acc.Retail), 0
  )
  const accessoriesTradeTotal = mergedAccessories.reduce(
    (sum: number, acc: { Trade: string }) => sum + parseInt(acc.Trade), 0
  )

  // Compute totals locally from base + merged accessories to ensure non-standard extras are included
  const totalRetail = baseRetail + accessoriesRetailTotal
  const totalTrade = baseTrade + accessoriesTradeTotal

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl">
      <h2 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
        📊 Valuation Results
      </h2>

      {/* Vehicle Info Card */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-600 text-white p-3 rounded mb-4">
        <h3 className="text-base font-semibold">
          {valuation.mmMakeShortCode || 'Unknown'} {valuation.mvModel || 'Unknown'} ({valuation.mmYear || 'Unknown'})
        </h3>
        <p className="text-slate-200 text-sm">
          M&M Code: {valuation.mmCode || 'Unknown'} • Guide: {valuation.mmGuide || 'Unknown'} 
          {valuation.mmEstimator === '1' && ' (Estimator)'}
        </p>
      </div>

      {/* Base Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <div className="bg-slate-50 border border-slate-200 p-3 rounded text-center">
          <h4 className="text-slate-600 font-medium mb-1">New Value</h4>
          <div className="text-base font-bold text-slate-800">
            R{newValue.toLocaleString()}
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-3 rounded text-center">
          <h4 className="text-slate-600 font-medium mb-1">Base Retail</h4>
          <div className="text-base font-bold text-slate-800">
            R{baseRetail.toLocaleString()}
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-3 rounded text-center">
          <h4 className="text-slate-600 font-medium mb-1">Base Trade</h4>
          <div className="text-base font-bold text-slate-800">
            R{baseTrade.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Accessories Section */}
      {mergedAccessories.length > 0 && (
        <div className="mb-6">
          <div className="bg-slate-50 border border-slate-200 p-3 rounded text-center mb-3">
            <h4 className="text-slate-600 font-medium mb-1">Accessories Value</h4>
            <div className="text-base font-bold text-slate-800">
              R{accessoriesRetailTotal.toLocaleString()}
            </div>
          </div>

          {/* Total Valuation */}
          <div className="bg-gradient-to-r from-slate-700 to-slate-600 text-white p-4 rounded">
            <h3 className="text-base font-semibold mb-3 text-center">
              🏆 Total Valuation (Including Accessories)
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-slate-200 mb-1">Total Retail Value</div>
                <div className="text-xl font-bold">
                  R{totalRetail.toLocaleString()}
                </div>
              </div>
              <div className="text-center">
                <div className="text-slate-200 mb-1">Total Trade Value</div>
                <div className="text-xl font-bold">
                  R{totalTrade.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Selected Accessories List */}
          <div className="mt-4">
            <h4 className="font-medium text-slate-800 mb-3">
              🔧 Selected Accessories ({mergedAccessories.length}):
            </h4>
            <div className="bg-slate-50 rounded p-3 space-y-2">
              {mergedAccessories.map((acc) => (
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
      {mergedAccessories.length === 0 && (
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg text-center text-slate-600">
          💡 No accessories selected. Add accessories to increase the vehicle value.
        </div>
      )}
    </div>
  )
}
