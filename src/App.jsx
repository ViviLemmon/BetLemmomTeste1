import React, { useState } from 'react';
import BettorManagement from './components/BettorManagement'
import BetTicketGeneration from './components/BetTicketGeneration'
import RevenueCalculation from './components/RevenueCalculation'
import Visualization from './components/Visualization'
import Simulation from './components/Simulation'
import Login from './components/Auth/Login'
import RoundMatches from './components/Championship/RoundMatches'
import BettorHistory from './components/Betting/BettorHistory';
import { championshipData } from './data/championshipData'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedRound, setSelectedRound] = useState(1);
  const [activeTab, setActiveTab] = useState('matches');
  const [bettingHistory, setBettingHistory] = useState([]);

  const handleLogin = (success) => {
    setIsAuthenticated(success);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard de Apostas Esportivas
            </h1>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Sair
            </button>
          </div>
        </div>
      </header>
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard de Apostas</h1>
          <div className="space-x-4">
            <button
              onClick={() => setActiveTab('matches')}
              className={`px-4 py-2 rounded ${
                activeTab === 'matches' ? 'bg-blue-700' : 'hover:bg-blue-500'
              }`}
            >
              Jogos
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded ${
                activeTab === 'history' ? 'bg-blue-700' : 'hover:bg-blue-500'
              }`}
            >
              Histórico de Apostadores
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto p-4">
        {activeTab === 'matches' ? (
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {/* Seletor de Rodadas */}
            <div className="mb-6 bg-white shadow rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700">Selecione a Rodada</label>
              <select
                value={selectedRound}
                onChange={(e) => setSelectedRound(Number(e.target.value))}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                {championshipData.rounds.map((round) => (
                  <option key={round.round} value={round.round}>
                    Rodada {round.round} - {round.phase}
                  </option>
                ))}
              </select>
            </div>

            {/* Jogos da Rodada */}
            <RoundMatches selectedRound={selectedRound} onBetPlaced={(bet) => setBettingHistory(prev => [...prev, bet])} />

            {/* Dashboard Original */}
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <BettorManagement />
              <BetTicketGeneration />
              <RevenueCalculation />
              <Visualization />
              <Simulation />
            </div>
          </div>
        ) : (
          <BettorHistory bettingHistory={bettingHistory} />
        )}
      </main>
    </div>
  )
}

export default App
