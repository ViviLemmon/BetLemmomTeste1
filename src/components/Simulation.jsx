import React, { useState } from 'react'

const Simulation = () => {
  const [isSimulating, setIsSimulating] = useState(false)
  const [simulationResults, setSimulationResults] = useState([])

  const runSimulation = () => {
    setIsSimulating(true)
    
    // Simulate a championship round
    const results = Array.from({ length: 5 }, (_, index) => ({
      id: Date.now() + index,
      match: `Match ${index + 1}`,
      totalBets: Math.floor(Math.random() * 50) + 20,
      totalVolume: Math.floor(Math.random() * 100000),
      winningOdds: (1 + Math.random() * 3).toFixed(2)
    }))

    setSimulationResults(results)
    setIsSimulating(false)
  }

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Championship Simulation</h3>
          <button
            onClick={runSimulation}
            disabled={isSimulating}
            className={`px-4 py-2 rounded text-white ${
              isSimulating ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isSimulating ? 'Simulating...' : 'Run Simulation'}
          </button>
        </div>

        <div className="space-y-3">
          {simulationResults.map(result => (
            <div key={result.id} className="bg-gray-50 p-3 rounded">
              <div className="flex justify-between font-medium">
                <span>{result.match}</span>
                <span>Odds: {result.winningOdds}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>Bets: {result.totalBets}</span>
                <span>Volume: {result.totalVolume.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>

        {simulationResults.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="text-sm font-medium text-gray-900">Summary</div>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <div className="text-sm text-gray-500">Total Bets</div>
                <div className="text-lg font-medium">
                  {simulationResults.reduce((sum, r) => sum + r.totalBets, 0)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Total Volume</div>
                <div className="text-lg font-medium">
                  {simulationResults
                    .reduce((sum, r) => sum + r.totalVolume, 0)
                    .toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Simulation
