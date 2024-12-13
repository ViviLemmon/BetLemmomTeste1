import React, { useState, useEffect } from 'react'

const RevenueCalculation = () => {
  const [revenue, setRevenue] = useState({
    total: 0,
    today: 0,
    weeklyTrend: []
  })

  const ADMIN_FEE = 0.038 // 3.8% administration fee

  useEffect(() => {
    // Simulate some initial revenue data
    const weeklyData = Array.from({ length: 7 }, () => 
      Math.floor(Math.random() * 50000)
    )
    
    setRevenue({
      total: weeklyData.reduce((sum, val) => sum + val, 0),
      today: weeklyData[weeklyData.length - 1],
      weeklyTrend: weeklyData
    })
  }, [])

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900">Revenue Overview</h3>
        <div className="mt-4 space-y-4">
          <div className="bg-green-50 p-4 rounded">
            <div className="text-sm text-green-600">Total Revenue</div>
            <div className="text-2xl font-bold text-green-700">
              {revenue.total.toLocaleString()} credits
            </div>
            <div className="text-xs text-green-500">
              Admin Fee Rate: {(ADMIN_FEE * 100).toFixed(1)}%
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded">
            <div className="text-sm text-blue-600">Today's Revenue</div>
            <div className="text-xl font-bold text-blue-700">
              {revenue.today.toLocaleString()} credits
            </div>
          </div>

          <div className="pt-4">
            <div className="text-sm font-medium text-gray-500 mb-2">Weekly Trend</div>
            <div className="flex items-end space-x-1">
              {revenue.weeklyTrend.map((value, index) => (
                <div
                  key={index}
                  style={{ height: `${(value / Math.max(...revenue.weeklyTrend)) * 100}px` }}
                  className="flex-1 bg-blue-200 hover:bg-blue-300 transition-colors"
                  title={`Day ${index + 1}: ${value.toLocaleString()} credits`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RevenueCalculation
