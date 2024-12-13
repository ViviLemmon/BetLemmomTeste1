import React, { useState, useEffect } from 'react';
import { championshipData } from '../../data/championshipData';
import { generateBettors, generateBetsForRound } from '../../data/bettingData';
import MatchMarket from '../Betting/MatchMarket';

const RoundMatches = ({ selectedRound }) => {
  const round = championshipData.rounds[selectedRound - 1];
  const [bettors, setBettors] = useState([]);
  const [closedMarkets, setClosedMarkets] = useState(new Set());
  const [roundResults, setRoundResults] = useState(null);

  // Inicializar bettors
  useEffect(() => {
    const initialBettors = generateBettors();
    setBettors(initialBettors);
    setClosedMarkets(new Set());
    setRoundResults(null);
  }, [selectedRound]);

  const handleCloseBetting = (matchId) => {
    setClosedMarkets(prev => new Set([...prev, matchId]));
  };

  const handleSimulateBets = () => {
    const bettorsWithBets = generateBetsForRound(bettors, round.matches);
    setBettors(bettorsWithBets);
  };

  const generateRoundResults = () => {
    const results = round.matches.map(match => {
      const outcomes = ['home', 'draw', 'away'];
      const result = outcomes[Math.floor(Math.random() * outcomes.length)];
      return {
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        result,
        score: result === 'home' ? '2-0' : result === 'away' ? '0-2' : '1-1'
      };
    });
    setRoundResults(results);
  };

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {championshipData.name} - {round.phase}
        </h2>
        <h3 className="text-xl text-gray-700">Rodada {round.round}</h3>
        
        {/* Botões de Controle */}
        <div className="mt-4 space-x-4">
          <button
            onClick={handleSimulateBets}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Simular Apostas dos Bettors
          </button>
          <button
            onClick={generateRoundResults}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            disabled={closedMarkets.size < round.matches.length}
          >
            Gerar Resultados da Rodada
          </button>
        </div>
      </div>

      {/* Resultados da Rodada */}
      {roundResults && (
        <div className="mb-6 bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium mb-4">Resultados da Rodada</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roundResults.map((result, index) => (
              <div key={index} className="border rounded p-3">
                <div className="text-center font-medium">
                  {result.homeTeam} {result.score} {result.awayTeam}
                </div>
                <div className="text-center text-sm text-gray-600 mt-1">
                  Resultado: {result.result === 'home' ? 'Vitória Casa' : 
                            result.result === 'away' ? 'Vitória Fora' : 'Empate'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {round.matches.map((match, index) => (
          <MatchMarket
            key={index}
            match={{ ...match, id: index }}
            bettors={bettors}
            onCloseBetting={handleCloseBetting}
            isClosed={closedMarkets.has(index)}
          />
        ))}
      </div>

      {/* Resumo das Apostas */}
      <div className="mt-8 bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-medium mb-4">Resumo de Apostas da Rodada</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bettors.map(bettor => (
            <div key={bettor.id} className="border rounded p-3">
              <div className="flex justify-between mb-2">
                <span className="font-medium">{bettor.name}</span>
                <span className="text-gray-600">€{bettor.balance.toLocaleString()}</span>
              </div>
              <div className="space-y-2">
                {bettor.bets
                  .filter(bet => round.matches.some((m, idx) => idx === bet.matchId))
                  .map(bet => (
                    <div key={bet.id} className="text-sm bg-gray-50 p-2 rounded">
                      <div className="flex justify-between">
                        <span>{bet.type.toUpperCase()}</span>
                        <span className={bet.type === 'back' ? 'text-blue-600' : 'text-pink-600'}>
                          {bet.odds}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Stake: €{bet.stake.toLocaleString()}</span>
                        {bet.type === 'lay' && (
                          <span>Liab: €{bet.liability.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoundMatches;
