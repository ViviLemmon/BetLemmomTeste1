import React, { useState } from 'react';
import BetTicketGeneration from './components/BetTicketGeneration';
import BettorDashboard from './components/Betting/BettorDashboard';
import BettorHistory from './components/Betting/BettorHistory';
import BettorCalculators from './components/Betting/BettorCalculators';
import { getBettorById, getBettorBets } from './data/bettorsData';

function App() {
  const [selectedBettor, setSelectedBettor] = useState('BET001');
  const [activeTab, setActiveTab] = useState('dashboard');

  const bettor = getBettorById(selectedBettor);
  const bets = getBettorBets(selectedBettor);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-800">Dashboard de Apostas</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`${
                    activeTab === 'dashboard'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`${
                    activeTab === 'history'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Histórico
                </button>
                <button
                  onClick={() => setActiveTab('betting')}
                  className={`${
                    activeTab === 'betting'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Nova Aposta
                </button>
              </div>
            </div>
            <div className="flex items-center">
              <select
                value={selectedBettor}
                onChange={(e) => setSelectedBettor(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="BET001">João Silva</option>
                <option value="BET002">Maria Santos</option>
              </select>
            </div>
          </div>
        </div>
      </nav>

      {/* Menu Lateral com Calculadoras */}
      <BettorCalculators />

      {/* Conteúdo Principal */}
      <main className="ml-64 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === 'dashboard' && (
          <BettorDashboard bettor={bettor} bets={bets} />
        )}
        {activeTab === 'history' && (
          <BettorHistory bettor={bettor} bets={bets} />
        )}
        {activeTab === 'betting' && (
          <BetTicketGeneration />
        )}
      </main>
    </div>
  );
}

export default App;
