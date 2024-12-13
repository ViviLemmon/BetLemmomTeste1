import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const Visualization = () => {
  // Sample data for visualization
  const data = [
    { name: 'Mon', tickets: 120, revenue: 4500 },
    { name: 'Tue', tickets: 150, revenue: 5200 },
    { name: 'Wed', tickets: 180, revenue: 6100 },
    { name: 'Thu', tickets: 140, revenue: 4800 },
    { name: 'Fri', tickets: 200, revenue: 7200 },
    { name: 'Sat', tickets: 250, revenue: 8500 },
    { name: 'Sun', tickets: 220, revenue: 7800 }
  ]

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg col-span-2">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Weekly Performance</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="tickets" fill="#4F46E5" name="Tickets" />
              <Bar yAxisId="right" dataKey="revenue" fill="#10B981" name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-indigo-50 p-4 rounded">
            <div className="text-sm text-indigo-600">Total Tickets</div>
            <div className="text-2xl font-bold text-indigo-700">
              {data.reduce((sum, day) => sum + day.tickets, 0)}
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded">
            <div className="text-sm text-green-600">Total Revenue</div>
            <div className="text-2xl font-bold text-green-700">
              {data.reduce((sum, day) => sum + day.revenue, 0).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Visualization
