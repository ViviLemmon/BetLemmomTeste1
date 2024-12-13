import React, { useState, useEffect } from 'react';
import OddsSimulationMenu from './Betting/OddsSimulationMenu';

const BetTicketGeneration = ({ matches, onTicketGenerated }) => {
  const [selectedMatches, setSelectedMatches] = useState([]);
  const [stake, setStake] = useState(10);
  const [combinedTickets, setCombinedTickets] = useState([]);
  const [error, setError] = useState('');

  // Função auxiliar para calcular fatorial
  const factorial = (n) => {
    if (n === 0 || n === 1) return 1;
    return n * factorial(n - 1);
  };

  // Função para calcular combinação
  const combination = (n, k) => {
    return factorial(n + k - 1) / (factorial(k) * factorial(n - 1));
  };

  // Calcula probabilidade usando distribuição binomial negativa
  const negativeBinomialProbability = (r, p, k) => {
    return combination(k, r) * Math.pow(p, r) * Math.pow(1 - p, k - r);
  };

  // Simula odds de empate usando distribuição binomial negativa
  const simulateDrawOdds = (match) => {
    // Parâmetros da distribuição binomial negativa
    const r = 1; // número de sucessos desejados (empate)
    let p = 0.25; // probabilidade base de empate (25%)
    
    // Ajusta probabilidade base com base na força dos times
    const homeStrength = match.homeTeam.strength || 0.5;
    const awayStrength = match.awayTeam.strength || 0.5;
    const strengthDiff = Math.abs(homeStrength - awayStrength);
    
    // Times mais próximos em força aumentam a probabilidade de empate
    p += (1 - strengthDiff) * 0.1;
    
    // Número de tentativas (k) baseado nas características do jogo
    const k = Math.ceil(3 + Math.random() * 2); // entre 3 e 5 tentativas
    
    // Calcula probabilidade usando distribuição binomial negativa
    const probability = negativeBinomialProbability(r, p, k);
    
    // Usa dispersão fixa de 1.5 (valor empiricamente validado)
    const dispersionFactor = 1.5;
    const dispersedProbability = probability * (1 + (dispersionFactor * (Math.random() - 0.5)));
    
    // Converte probabilidade para odds com ajuste de margem do bookmaker
    const rawOdds = 1 / dispersedProbability;
    const marginMultiplier = 1.1; // 10% de margem do bookmaker
    const finalOdds = rawOdds * marginMultiplier;
    
    // Log para debug (pode ser removido em produção)
    console.log({
      p,
      dispersionFactor,
      rawOdds,
      finalOdds,
      strengthDiff
    });
    
    return finalOdds.toFixed(2);
  };

  // Verifica se há muitos empates
  const checkDrawPercentage = () => {
    if (selectedMatches.length >= 5) {
      const drawCount = selectedMatches.filter(match => match.selectedMarket === 'draw').length;
      const drawPercentage = (drawCount / selectedMatches.length) * 100;
      return drawPercentage >= 75;
    }
    return false;
  };

  // Verifica a liquidez disponível
  const checkLiquidity = () => {
    const potentialReturn = calculatePotentialReturn();
    let hasLiquidity = true;
    let totalLiquidity = 0;

    selectedMatches.forEach(match => {
      const matchLiquidity = match.liquidity?.[match.selectedMarket] || 0;
      totalLiquidity += matchLiquidity;
      if (matchLiquidity < potentialReturn) {
        hasLiquidity = false;
      }
    });

    return {
      hasLiquidity,
      totalLiquidity
    };
  };

  // Calcula as odds combinadas
  const calculateCombinedOdds = () => {
    return selectedMatches.reduce((total, match) => {
      const selectedOdd = match.selectedOdd;
      return total * selectedOdd;
    }, 1).toFixed(2);
  };

  // Calcula o retorno potencial
  const calculatePotentialReturn = () => {
    const combinedOdds = calculateCombinedOdds();
    return (stake * combinedOdds).toFixed(2);
  };

  const handleMatchSelection = (match, market, odd) => {
    setError('');
    const existingMatch = selectedMatches.find(m => m.id === match.id);
    
    if (existingMatch) {
      setSelectedMatches(selectedMatches.filter(m => m.id !== match.id));
    } else {
      if (selectedMatches.length >= 10) {
        setError('Máximo de 10 jogos permitidos em apostas combinadas');
        return;
      }
      
      const finalOdd = market === 'draw' ? simulateDrawOdds(match) : odd;
      
      setSelectedMatches([...selectedMatches, {
        id: match.id,
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        selectedMarket: market,
        selectedOdd: parseFloat(finalOdd),
        liquidity: match.liquidity
      }]);
    }
  };

  const validateTicket = () => {
    if (selectedMatches.length < 2) {
      setError('Selecione pelo menos 2 jogos para uma aposta combinada');
      return false;
    }

    if (selectedMatches.length > 10) {
      setError('Máximo de 10 jogos permitidos em apostas combinadas');
      return false;
    }

    if (checkDrawPercentage()) {
      setError('Aposta anulada: Mais de 75% dos jogos são apostas em empate');
      return false;
    }

    const { hasLiquidity, totalLiquidity } = checkLiquidity();
    if (!hasLiquidity) {
      setError(`Liquidez insuficiente para cobrir o retorno potencial de R$${calculatePotentialReturn()}`);
      return false;
    }

    return true;
  };

  const generateCombinedTicket = () => {
    if (!validateTicket()) return;

    const newTicket = {
      id: Date.now(),
      matches: selectedMatches,
      combinedOdds: calculateCombinedOdds(),
      stake: stake,
      potentialReturn: calculatePotentialReturn(),
      timestamp: new Date().toISOString(),
      status: 'pendente'
    };

    setCombinedTickets(prev => [newTicket, ...prev]);
    setSelectedMatches([]);
    setStake(10);
    setError('');
    
    if (onTicketGenerated) {
      onTicketGenerated(newTicket);
    }
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Apostas Combinadas</h3>
        
        {/* Regras e Informações */}
        <div className="mb-4 text-sm text-gray-600">
          <ul className="list-disc pl-5 space-y-1">
            <li>Mínimo de 2 e máximo de 10 jogos por aposta combinada</li>
            <li>Apostas com mais de 75% de empates (em 5+ jogos) são anuladas</li>
            <li>A liquidez deve ser suficiente para cobrir o retorno potencial</li>
          </ul>
        </div>

        {/* Mensagem de Erro */}
        {error && (
          <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {/* Seleção de Jogos */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Jogos Selecionados: {selectedMatches.length}/10
          </h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {matches?.map(match => (
              <div key={match.id} className="border p-2 rounded">
                <div className="flex justify-between items-center">
                  <span className="text-sm">{match.homeTeam} x {match.awayTeam}</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleMatchSelection(match, 'home', match.odds.home)}
                      className={`px-2 py-1 text-xs rounded transition-colors duration-200 ${
                        selectedMatches.some(m => m.id === match.id && m.selectedMarket === 'home')
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : match.odds.home >= 2 
                            ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800'
                            : 'bg-blue-100 hover:bg-blue-200 text-blue-800'
                      }`}
                    >
                      Casa ({match.odds.home})
                    </button>
                    <button
                      onClick={() => handleMatchSelection(match, 'draw', match.odds.draw)}
                      className={`px-2 py-1 text-xs rounded transition-colors duration-200 ${
                        selectedMatches.some(m => m.id === match.id && m.selectedMarket === 'draw')
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : match.odds.draw >= 3
                            ? 'bg-red-100 hover:bg-red-200 text-red-800'
                            : 'bg-orange-100 hover:bg-orange-200 text-orange-800'
                      }`}
                    >
                      Empate ({simulateDrawOdds(match)})
                    </button>
                    <button
                      onClick={() => handleMatchSelection(match, 'away', match.odds.away)}
                      className={`px-2 py-1 text-xs rounded transition-colors duration-200 ${
                        selectedMatches.some(m => m.id === match.id && m.selectedMarket === 'away')
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : match.odds.away >= 2
                            ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800'
                            : 'bg-blue-100 hover:bg-blue-200 text-blue-800'
                      }`}
                    >
                      Fora ({match.odds.away})
                    </button>
                  </div>
                </div>
                <div className="mt-1 text-xs">
                  <div className="flex justify-between">
                    <span className={`${
                      match.liquidity?.home >= 1000 
                        ? 'text-green-600' 
                        : match.liquidity?.home >= 500 
                          ? 'text-yellow-600' 
                          : 'text-red-600'
                    }`}>
                      Liquidez Casa: R${match.liquidity?.home.toLocaleString()}
                    </span>
                    <span className={`${
                      match.liquidity?.draw >= 1000 
                        ? 'text-green-600' 
                        : match.liquidity?.draw >= 500 
                          ? 'text-yellow-600' 
                          : 'text-red-600'
                    }`}>
                      Liquidez Empate: R${match.liquidity?.draw.toLocaleString()}
                    </span>
                    <span className={`${
                      match.liquidity?.away >= 1000 
                        ? 'text-green-600' 
                        : match.liquidity?.away >= 500 
                          ? 'text-yellow-600' 
                          : 'text-red-600'
                    }`}>
                      Liquidez Fora: R${match.liquidity?.away.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detalhes da Aposta */}
        {selectedMatches.length > 0 && (
          <div className="mb-4 p-3 bg-gray-50 rounded border-l-4 border-blue-500">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Detalhes da Aposta</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Odds Combinadas:</span>
                <span className={`font-medium ${
                  calculateCombinedOdds() >= 5 
                    ? 'text-red-600' 
                    : calculateCombinedOdds() >= 3 
                      ? 'text-yellow-600' 
                      : 'text-green-600'
                }`}>
                  {calculateCombinedOdds()}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm">Valor (R$):</span>
                <input
                  type="number"
                  min="1"
                  value={stake}
                  onChange={(e) => setStake(Math.max(1, Number(e.target.value)))}
                  className={`border rounded px-2 py-1 w-24 text-right ${
                    stake >= 100 
                      ? 'border-red-300 bg-red-50' 
                      : stake >= 50 
                        ? 'border-yellow-300 bg-yellow-50' 
                        : 'border-green-300 bg-green-50'
                  }`}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span>Retorno Potencial:</span>
                <span className={`font-medium ${
                  calculatePotentialReturn() >= 1000 
                    ? 'text-red-600' 
                    : calculatePotentialReturn() >= 500 
                      ? 'text-yellow-600' 
                      : 'text-green-600'
                }`}>
                  R${calculatePotentialReturn()}
                </span>
              </div>
              {selectedMatches.length >= 5 && (
                <div className={`text-xs ${
                  ((selectedMatches.filter(m => m.selectedMarket === 'draw').length / selectedMatches.length) * 100) >= 60
                    ? 'text-red-600'
                    : ((selectedMatches.filter(m => m.selectedMarket === 'draw').length / selectedMatches.length) * 100) >= 40
                      ? 'text-yellow-600'
                      : 'text-gray-600'
                }`}>
                  Porcentagem de Empates: {
                    ((selectedMatches.filter(m => m.selectedMarket === 'draw').length / selectedMatches.length) * 100).toFixed(1)
                  }%
                </div>
              )}
            </div>
          </div>
        )}

        {/* Botão Gerar Ticket */}
        <button
          onClick={generateCombinedTicket}
          disabled={selectedMatches.length < 2 || selectedMatches.length > 10 || !!error}
          className={`w-full py-2 rounded ${
            selectedMatches.length < 2 || selectedMatches.length > 10 || !!error
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Gerar Ticket Combinado
        </button>

        {/* Histórico de Tickets */}
        {combinedTickets.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Histórico de Tickets</h4>
            <div className="space-y-2">
              {combinedTickets.map(ticket => (
                <div key={ticket.id} className={`border p-2 rounded text-sm ${
                  ticket.status === 'pendente' ? 'bg-yellow-50 border-yellow-200' :
                  ticket.status === 'ganhou' ? 'bg-green-50 border-green-200' :
                  'bg-red-50 border-red-200'
                }`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Ticket #{ticket.id.toString().slice(-4)}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      ticket.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
                      ticket.status === 'ganhou' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {ticket.matches.map(match => (
                      <div key={match.id} className="text-xs text-gray-600">
                        {match.homeTeam} x {match.awayTeam} - {
                          match.selectedMarket === 'home' ? 'Casa' :
                          match.selectedMarket === 'draw' ? 'Empate' : 'Fora'
                        } ({match.selectedOdd})
                      </div>
                    ))}
                    <div className="flex justify-between text-xs mt-2">
                      <span>Valor: R${ticket.stake}</span>
                      <span>Odds: {ticket.combinedOdds}</span>
                      <span className="font-medium">Retorno: R${ticket.potentialReturn}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BetTicketGeneration;
