import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const BettorDashboard = ({ bettor, bets }) => {
  const [statistics, setStatistics] = useState({
    totalBets: 0,
    wonBets: 0,
    lostBets: 0,
    totalStake: 0,
    totalReturns: 0,
    profitLoss: 0,
    roi: 0,
    winRate: 0,
    averageOdds: 0,
    streaks: {
      current: 0,
      best: 0,
      worst: 0
    }
  });

  const [performanceData, setPerformanceData] = useState([]);
  const [oddsDistribution, setOddsDistribution] = useState([]);
  const [marketPreferences, setMarketPreferences] = useState([]);

  useEffect(() => {
    if (bets && bets.length > 0) {
      calculateStatistics();
      generatePerformanceData();
      analyzeOddsDistribution();
      analyzeMarketPreferences();
    }
  }, [bets]);

  const calculateStatistics = () => {
    const stats = {
      totalBets: bets.length,
      wonBets: bets.filter(bet => bet.status === 'ganhou').length,
      lostBets: bets.filter(bet => bet.status === 'perdeu').length,
      totalStake: bets.reduce((acc, bet) => acc + bet.stake, 0),
      totalReturns: bets.reduce((acc, bet) => acc + (bet.status === 'ganhou' ? bet.potentialReturn : 0), 0),
      streaks: { current: 0, best: 0, worst: 0 }
    };

    stats.profitLoss = stats.totalReturns - stats.totalStake;
    stats.roi = ((stats.totalReturns - stats.totalStake) / stats.totalStake * 100).toFixed(2);
    stats.winRate = ((stats.wonBets / stats.totalBets) * 100).toFixed(2);
    stats.averageOdds = (bets.reduce((acc, bet) => acc + bet.combinedOdds, 0) / stats.totalBets).toFixed(2);

    // Calcula sequências
    let currentStreak = 0;
    let bestStreak = 0;
    let worstStreak = 0;
    let currentNegativeStreak = 0;
    let worstNegativeStreak = 0;

    bets.forEach(bet => {
      if (bet.status === 'ganhou') {
        currentStreak++;
        currentNegativeStreak = 0;
        bestStreak = Math.max(bestStreak, currentStreak);
      } else if (bet.status === 'perdeu') {
        currentNegativeStreak++;
        currentStreak = 0;
        worstNegativeStreak = Math.min(worstNegativeStreak, -currentNegativeStreak);
      }
    });

    stats.streaks = {
      current: currentStreak || currentNegativeStreak,
      best: bestStreak,
      worst: worstNegativeStreak
    };

    setStatistics(stats);
  };

  const generatePerformanceData = () => {
    let balance = 0;
    const data = bets.map(bet => {
      balance += bet.status === 'ganhou' ? 
        (bet.potentialReturn - bet.stake) : 
        -bet.stake;
      
      return {
        date: new Date(bet.timestamp).toLocaleDateString(),
        balance: parseFloat(balance.toFixed(2)),
        stake: bet.stake,
        odds: bet.combinedOdds
      };
    });

    setPerformanceData(data);
  };

  const analyzeOddsDistribution = () => {
    const distribution = {};
    bets.forEach(bet => {
      const oddRange = Math.floor(bet.combinedOdds);
      distribution[oddRange] = (distribution[oddRange] || 0) + 1;
    });

    const data = Object.entries(distribution).map(([range, count]) => ({
      range: `${range}-${parseInt(range) + 1}`,
      count
    }));

    setOddsDistribution(data);
  };

  const analyzeMarketPreferences = () => {
    const preferences = {
      home: 0,
      draw: 0,
      away: 0
    };

    bets.forEach(bet => {
      bet.matches.forEach(match => {
        preferences[match.selectedMarket]++;
      });
    });

    const data = Object.entries(preferences).map(([market, count]) => ({
      market: market === 'home' ? 'Casa' : market === 'draw' ? 'Empate' : 'Fora',
      count
    }));

    setMarketPreferences(data);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Cabeçalho do Bettor */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{bettor.name}</h2>
            <p className="text-gray-600">ID: {bettor.id}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-gray-700">
              Saldo: <span className={`${statistics.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                R$ {statistics.profitLoss.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </p>
            <p className="text-sm text-gray-500">ROI: {statistics.roi}%</p>
          </div>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Apostas</h3>
          <div className="space-y-2">
            <p className="flex justify-between">
              <span className="text-gray-600">Total:</span>
              <span className="font-medium">{statistics.totalBets}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600">Ganhas:</span>
              <span className="text-green-600 font-medium">{statistics.wonBets}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600">Perdidas:</span>
              <span className="text-red-600 font-medium">{statistics.lostBets}</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Performance</h3>
          <div className="space-y-2">
            <p className="flex justify-between">
              <span className="text-gray-600">Taxa de Vitória:</span>
              <span className="font-medium">{statistics.winRate}%</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600">Média de Odds:</span>
              <span className="font-medium">{statistics.averageOdds}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600">ROI:</span>
              <span className={`font-medium ${statistics.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {statistics.roi}%
              </span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Sequências</h3>
          <div className="space-y-2">
            <p className="flex justify-between">
              <span className="text-gray-600">Atual:</span>
              <span className={`font-medium ${statistics.streaks.current >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(statistics.streaks.current)}
              </span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600">Melhor:</span>
              <span className="text-green-600 font-medium">{statistics.streaks.best}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600">Pior:</span>
              <span className="text-red-600 font-medium">{Math.abs(statistics.streaks.worst)}</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Financeiro</h3>
          <div className="space-y-2">
            <p className="flex justify-between">
              <span className="text-gray-600">Total Apostado:</span>
              <span className="font-medium">R$ {statistics.totalStake.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600">Retorno Total:</span>
              <span className="font-medium">R$ {statistics.totalReturns.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600">Lucro/Prejuízo:</span>
              <span className={`font-medium ${statistics.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                R$ {statistics.profitLoss.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Performance */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Performance ao Longo do Tempo</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="#3B82F6"
                  fill="#93C5FD"
                  name="Saldo"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Distribuição de Odds */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Distribuição de Odds</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={oddsDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8B5CF6" name="Quantidade" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Preferências de Mercado */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Preferências de Mercado</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={marketPreferences}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="market" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#EC4899" name="Quantidade" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Stakes e Odds */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Stakes vs Odds</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="stake"
                  stroke="#10B981"
                  name="Stake"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="odds"
                  stroke="#F59E0B"
                  name="Odds"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BettorDashboard;
