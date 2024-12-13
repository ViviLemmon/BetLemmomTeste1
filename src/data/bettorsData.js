export const bettorsData = [
  {
    id: 'BET001',
    name: 'João Silva',
    email: 'joao.silva@email.com',
    status: 'ativo',
    createdAt: '2023-01-15',
    balance: 5000.00,
    bets: [
      {
        id: 'APT001',
        timestamp: '2023-12-01T14:30:00',
        stake: 100.00,
        combinedOdds: 2.5,
        potentialReturn: 250.00,
        status: 'ganhou',
        matches: [
          {
            id: 'M001',
            homeTeam: 'Flamengo',
            awayTeam: 'Palmeiras',
            selectedMarket: 'home',
            odds: 1.5
          },
          {
            id: 'M002',
            homeTeam: 'São Paulo',
            awayTeam: 'Santos',
            selectedMarket: 'draw',
            odds: 1.67
          }
        ]
      },
      {
        id: 'APT002',
        timestamp: '2023-12-02T16:00:00',
        stake: 200.00,
        combinedOdds: 3.2,
        potentialReturn: 640.00,
        status: 'perdeu',
        matches: [
          {
            id: 'M003',
            homeTeam: 'Corinthians',
            awayTeam: 'Grêmio',
            selectedMarket: 'away',
            odds: 2.1
          },
          {
            id: 'M004',
            homeTeam: 'Internacional',
            awayTeam: 'Atlético-MG',
            selectedMarket: 'home',
            odds: 1.52
          }
        ]
      }
    ]
  },
  {
    id: 'BET002',
    name: 'Maria Santos',
    email: 'maria.santos@email.com',
    status: 'ativo',
    createdAt: '2023-02-20',
    balance: 7500.00,
    bets: [
      {
        id: 'APT003',
        timestamp: '2023-12-03T15:00:00',
        stake: 150.00,
        combinedOdds: 2.8,
        potentialReturn: 420.00,
        status: 'ganhou',
        matches: [
          {
            id: 'M005',
            homeTeam: 'Fluminense',
            awayTeam: 'Vasco',
            selectedMarket: 'draw',
            odds: 1.9
          },
          {
            id: 'M006',
            homeTeam: 'Botafogo',
            awayTeam: 'Cruzeiro',
            selectedMarket: 'home',
            odds: 1.47
          }
        ]
      },
      {
        id: 'APT004',
        timestamp: '2023-12-04T19:30:00',
        stake: 300.00,
        combinedOdds: 4.1,
        potentialReturn: 1230.00,
        status: 'ganhou',
        matches: [
          {
            id: 'M007',
            homeTeam: 'Athletico-PR',
            awayTeam: 'Coritiba',
            selectedMarket: 'away',
            odds: 2.3
          },
          {
            id: 'M008',
            homeTeam: 'Bahia',
            awayTeam: 'Fortaleza',
            selectedMarket: 'draw',
            odds: 1.78
          }
        ]
      }
    ]
  }
];

export const getBettorById = (id) => {
  return bettorsData.find(bettor => bettor.id === id);
};

export const getBettorBets = (id) => {
  const bettor = getBettorById(id);
  return bettor ? bettor.bets : [];
};
