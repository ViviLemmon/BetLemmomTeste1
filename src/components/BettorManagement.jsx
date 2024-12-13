import React, { useState, useEffect } from 'react'

const BettorManagement = () => {
  const [bettors, setBettors] = useState([])
  
  useEffect(() => {
    // Initialize 20 bettors with 60,000 currency each
    const initialBettors = Array.from({ length: 20 }, (_, index) => ({
      id: index + 1,
      balance: 60000,
      totalBets: 0,
      wonBets: 0,
    }))
    setBettors(initialBettors)
  }, [])

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900">Bettor Management</h3>
        <div className="mt-4">
          <div className="flex justify-between text-sm font-medium text-gray-500 mb-2">
            <span>Total Bettors: {bettors.length}</span>
            <span>Total Balance: {bettors.reduce((sum, b) => sum + b.balance, 0).toLocaleString()}</span>
          </div>
          <div className="space-y-2">
            {bettors.slice(0, 5).map(bettor => (
              <div key={bettor.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                <span>Bettor #{bettor.id}</span>
                <span>{bettor.balance.toLocaleString()} credits</span>
              </div>
            ))}
          </div>
          {bettors.length > 5 && (
            <div className="mt-2 text-sm text-gray-500 text-center">
              And {bettors.length - 5} more bettors...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BettorManagement
