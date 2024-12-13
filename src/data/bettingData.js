// Simulação de bettors com seus saldos
export const generateBettors = () => {
  return Array.from({ length: 20 }, (_, index) => ({
    id: index + 1,
    name: `Bettor ${index + 1}`,
    balance: 60000,
    bets: [],
    riskManagement: {
      maxLiability: 30000, // 50% do saldo para responsabilidade em apostas lay
      maxBetSize: 6000,    // 10% do saldo para apostas individuais
    }
  }));
};

// Gera apostas aleatórias para cada bettor em uma rodada
export const generateBetsForRound = (bettors, matches) => {
  const updatedBettors = [...bettors];
  
  updatedBettors.forEach(bettor => {
    // Cada bettor faz 1-3 apostas por rodada
    const numberOfBets = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < numberOfBets; i++) {
      const match = matches[Math.floor(Math.random() * matches.length)];
      const isBack = Math.random() > 0.3; // 70% chance de ser back, 30% lay
      const market = ['home', 'draw', 'away'][Math.floor(Math.random() * 3)];
      const stake = Math.floor(Math.random() * bettor.riskManagement.maxBetSize) + 100;
      
      const bet = {
        id: Date.now() + i,
        matchId: match.id,
        type: isBack ? 'back' : 'lay',
        market,
        odds: isBack ? match.odds[market] : (Number(match.odds[market]) + 0.1).toFixed(2),
        stake,
        liability: isBack ? stake : stake * (Number(match.odds[market]) - 1),
        timestamp: new Date().toISOString(),
        status: 'active'
      };

      // Verificar limites de responsabilidade para apostas lay
      if (bet.type === 'lay') {
        if (bet.liability <= bettor.riskManagement.maxLiability) {
          bettor.bets.push(bet);
        }
      } else {
        bettor.bets.push(bet);
      }
    }
  });

  return updatedBettors;
};

// Calcula a liquidez total para cada mercado
export const calculateMarketLiquidity = (bets, market) => {
  const backTotal = bets
    .filter(bet => bet.type === 'back' && bet.market === market)
    .reduce((sum, bet) => sum + bet.stake, 0);

  const layLiability = bets
    .filter(bet => bet.type === 'lay' && bet.market === market)
    .reduce((sum, bet) => sum + bet.liability, 0);

  return {
    backTotal,
    layLiability,
    total: backTotal + layLiability
  };
};
