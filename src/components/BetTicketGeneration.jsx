import React, { useState } from 'react'

const BetTicketGeneration = () => {
  const [tickets, setTickets] = useState([])
  
  const generateTicket = () => {
    const marketTypes = ['exchange', 'combined']
    const newTicket = {
      id: Date.now(),
      marketType: marketTypes[Math.floor(Math.random() * marketTypes.length)],
      odds: (1 + Math.random() * 4).toFixed(2),
      amount: Math.floor(Math.random() * 1000) * 10,
      timestamp: new Date().toISOString()
    }
    
    setTickets(prev => [newTicket, ...prev].slice(0, 10))
  }

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Bet Tickets</h3>
          <button
            onClick={generateTicket}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Generate Ticket
          </button>
        </div>
        <div className="space-y-2">
          {tickets.map(ticket => (
            <div key={ticket.id} className="bg-gray-50 p-2 rounded text-sm">
              <div className="flex justify-between">
                <span className="font-medium">{ticket.marketType}</span>
                <span>Odds: {ticket.odds}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Amount: {ticket.amount}</span>
                <span>{new Date(ticket.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BetTicketGeneration
