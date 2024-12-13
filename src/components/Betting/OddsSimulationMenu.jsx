import React from 'react';

const OddsSimulationMenu = ({ matches }) => {
  return (
    <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Simulação de Odds</h2>
        
        {matches?.map(match => (
          <div key={match.id} className="mb-6 border-b pb-4">
            <div className="text-sm font-medium text-gray-700 mb-2">
              {match.homeTeam} x {match.awayTeam}
            </div>
            
            {/* Odds de Back */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-lg mb-2">
              <h3 className="text-xs font-semibold text-blue-800 mb-2">Back (Apostar A Favor)</h3>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Casa:</span>
                  <span className="font-medium">{match.odds.home}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Empate:</span>
                  <span className="font-medium">{match.simulatedDrawOdd}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Fora:</span>
                  <span className="font-medium">{match.odds.away}</span>
                </div>
              </div>
            </div>
            
            {/* Odds de Lay */}
            <div className="bg-gradient-to-r from-pink-50 to-pink-100 p-3 rounded-lg">
              <h3 className="text-xs font-semibold text-pink-800 mb-2">Lay (Apostar Contra)</h3>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Casa:</span>
                  <span className="font-medium">{(match.odds.home * 1.02).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Empate:</span>
                  <span className="font-medium">{(match.simulatedDrawOdd * 1.02).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Fora:</span>
                  <span className="font-medium">{(match.odds.away * 1.02).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Liquidez Disponível */}
            <div className="mt-2 bg-gradient-to-r from-green-50 to-green-100 p-3 rounded-lg">
              <h3 className="text-xs font-semibold text-green-800 mb-2">Liquidez Disponível</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="flex justify-between">
                    <span>Casa:</span>
                    <span className="font-medium">R$ {match.liquidity?.home.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Empate:</span>
                    <span className="font-medium">R$ {match.liquidity?.draw.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fora:</span>
                    <span className="font-medium">R$ {match.liquidity?.away.toLocaleString()}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-600">
                    {((match.liquidity?.home + match.liquidity?.draw + match.liquidity?.away) / 1000).toFixed(1)}K
                  </div>
                  <div className="text-xs text-green-700">Volume Total</div>
                </div>
              </div>
            </div>

            {/* Melhores Ofertas */}
            <div className="mt-2 bg-gradient-to-r from-purple-50 to-purple-100 p-3 rounded-lg">
              <h3 className="text-xs font-semibold text-purple-800 mb-2">Melhores Ofertas</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-purple-700">Back</span>
                  <div className="flex space-x-2">
                    <span className="px-2 py-1 bg-purple-200 rounded">{match.odds.home}</span>
                    <span className="px-2 py-1 bg-purple-200 rounded">{match.simulatedDrawOdd}</span>
                    <span className="px-2 py-1 bg-purple-200 rounded">{match.odds.away}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-purple-700">Lay</span>
                  <div className="flex space-x-2">
                    <span className="px-2 py-1 bg-purple-200 rounded">
                      {(match.odds.home * 1.02).toFixed(2)}
                    </span>
                    <span className="px-2 py-1 bg-purple-200 rounded">
                      {(match.simulatedDrawOdd * 1.02).toFixed(2)}
                    </span>
                    <span className="px-2 py-1 bg-purple-200 rounded">
                      {(match.odds.away * 1.02).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OddsSimulationMenu;
