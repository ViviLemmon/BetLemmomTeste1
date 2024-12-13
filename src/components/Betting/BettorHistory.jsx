import React, { useState } from 'react';
import { bettors } from '../../data/bettorsData';

const BettorHistory = ({ bettingHistory }) => {
  const [selectedBettor, setSelectedBettor] = useState(null);
  const [filterStatus, setFilterStatus] = useState('todas'); // todas, pendentes, aceitas, rejeitadas

  const getBettorBets = (bettorId) => {
    return bettingHistory.filter(bet => bet.bettorId === bettorId);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pendente':
        return 'text-yellow-600';
      case 'aceita':
        return 'text-green-600';
      case 'rejeitada':
        return 'text-red-600';
      default:
        return '';
    }
  };

  const filteredBets = selectedBettor 
    ? getBettorBets(selectedBettor.id).filter(bet => 
        filterStatus === 'todas' || bet.status === filterStatus
      )
    : [];

  return (
    <div className="flex h-full">
      {/* Menu Lateral */}
      <div className="w-64 bg-gray-100 p-4 border-r">
        <h2 className="text-xl font-bold mb-4">Apostadores</h2>
        <div className="space-y-2">
          {bettors.map(bettor => (
            <button
              key={bettor.id}
              onClick={() => setSelectedBettor(bettor)}
              className={`w-full text-left p-2 rounded ${
                selectedBettor?.id === bettor.id 
                  ? 'bg-blue-500 text-white' 
                  : 'hover:bg-gray-200'
              }`}
            >
              {bettor.nome} {bettor.sobrenome}
            </button>
          ))}
        </div>
      </div>

      {/* Área Principal */}
      <div className="flex-1 p-4">
        {selectedBettor ? (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">
                {selectedBettor.nome} {selectedBettor.sobrenome}
              </h2>
              <p className="text-gray-600">
                Saldo Atual: €{selectedBettor.saldo.toLocaleString()}
              </p>
            </div>

            <div className="mb-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="todas">Todas as Apostas</option>
                <option value="pendente">Pendentes</option>
                <option value="aceita">Aceitas</option>
                <option value="rejeitada">Rejeitadas</option>
              </select>
            </div>

            <div className="space-y-4">
              {filteredBets.map(bet => (
                <div 
                  key={bet.id} 
                  className="border p-4 rounded shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">
                        {bet.homeTeam} vs {bet.awayTeam}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(bet.matchDate).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded ${getStatusClass(bet.status)}`}>
                      {bet.status.charAt(0).toUpperCase() + bet.status.slice(1)}
                    </span>
                  </div>

                  <div className="mt-2">
                    <p>
                      Tipo: {bet.type === 'back' ? 'Back' : 'Lay'} - {bet.market}
                    </p>
                    <p>Odd: {bet.odd}</p>
                    <p>Stake: €{bet.stake.toLocaleString()}</p>
                    {bet.status === 'aceita' && (
                      <p className="text-green-600">
                        Lucro Potencial: €{bet.potentialProfit.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {filteredBets.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  Nenhuma aposta encontrada para os filtros selecionados.
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 py-8">
            Selecione um apostador para ver seu histórico
          </div>
        )}
      </div>
    </div>
  );
};

export default BettorHistory;
