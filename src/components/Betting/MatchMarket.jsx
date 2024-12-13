import React, { useState, useEffect } from 'react';
import { calculateMarketLiquidity } from '../../data/bettingData';

const MatchMarket = ({ match, bettors, onCloseBetting, isClosed }) => {
  const [timeLeft, setTimeLeft] = useState(null);

  // Calcula tempo restante até 5 minutos antes do jogo
  useEffect(() => {
    const interval = setInterval(() => {
      const matchTime = new Date(match.date);
      const cutoffTime = new Date(matchTime.getTime() - 5 * 60000); // 5 minutos antes
      const now = new Date();
      const diff = cutoffTime - now;

      if (diff <= 0) {
        clearInterval(interval);
      } else {
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [match.date]);

  // Agregar todas as apostas para este jogo
  const matchBets = bettors.flatMap(bettor => 
    bettor.bets.filter(bet => bet.matchId === match.id)
  );

  const markets = ['home', 'draw', 'away'];
  const liquidity = markets.reduce((acc, market) => ({
    ...acc,
    [market]: calculateMarketLiquidity(matchBets, market)
  }), {});

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${isClosed ? 'opacity-75' : 'hover:shadow-lg'} transition-all`}>
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="text-sm text-gray-500">
            {new Date(match.date).toLocaleDateString('pt-BR')} - {new Date(match.date).toLocaleTimeString('pt-BR')}
          </div>
          {!isClosed && timeLeft && (
            <div className="text-sm text-green-600">
              Tempo restante: {timeLeft}
            </div>
          )}
          {isClosed && (
            <div className="text-sm text-red-600">
              Mercado Fechado
            </div>
          )}
        </div>
        {!isClosed && (
          <button
            onClick={() => onCloseBetting(match.id)}
            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
          >
            Finalizar Apostas
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Mercado Casa */}
        <div className="border-b pb-2">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">{match.homeTeam}</span>
            <div className="text-sm text-gray-600">
              Liquidez: €{liquidity.home.total.toLocaleString()}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-blue-100 p-2 rounded text-center">
              <div className="text-sm font-medium">Back</div>
              <div className="text-blue-700">{match.odds.home}</div>
              <div className="text-xs text-gray-600">€{liquidity.home.backTotal.toLocaleString()}</div>
            </div>
            <div className="bg-pink-100 p-2 rounded text-center">
              <div className="text-sm font-medium">Lay</div>
              <div className="text-pink-700">{(Number(match.odds.home) + 0.1).toFixed(2)}</div>
              <div className="text-xs text-gray-600">€{liquidity.home.layLiability.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Mercado Empate */}
        <div className="border-b pb-2">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Empate</span>
            <div className="text-sm text-gray-600">
              Liquidez: €{liquidity.draw.total.toLocaleString()}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-blue-100 p-2 rounded text-center">
              <div className="text-sm font-medium">Back</div>
              <div className="text-blue-700">{match.odds.draw}</div>
              <div className="text-xs text-gray-600">€{liquidity.draw.backTotal.toLocaleString()}</div>
            </div>
            <div className="bg-pink-100 p-2 rounded text-center">
              <div className="text-sm font-medium">Lay</div>
              <div className="text-pink-700">{(Number(match.odds.draw) + 0.1).toFixed(2)}</div>
              <div className="text-xs text-gray-600">€{liquidity.draw.layLiability.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Mercado Fora */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">{match.awayTeam}</span>
            <div className="text-sm text-gray-600">
              Liquidez: €{liquidity.away.total.toLocaleString()}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-blue-100 p-2 rounded text-center">
              <div className="text-sm font-medium">Back</div>
              <div className="text-blue-700">{match.odds.away}</div>
              <div className="text-xs text-gray-600">€{liquidity.away.backTotal.toLocaleString()}</div>
            </div>
            <div className="bg-pink-100 p-2 rounded text-center">
              <div className="text-sm font-medium">Lay</div>
              <div className="text-pink-700">{(Number(match.odds.away) + 0.1).toFixed(2)}</div>
              <div className="text-xs text-gray-600">€{liquidity.away.layLiability.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchMarket;
