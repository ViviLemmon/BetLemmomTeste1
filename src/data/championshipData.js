export const teams = [
  "FC São Paulo Warriors",
  "Rio Janeiro United",
  "Belo Horizonte City",
  "Porto Alegre Rangers",
  "Curitiba Wolves",
  "Salvador Lions",
  "Recife Titans",
  "Fortaleza Phoenix",
  "Manaus Jaguars",
  "Brasília Eagles",
  "Goiânia Dragons",
  "Florianópolis Sharks",
  "Vitória Panthers",
  "Belém Hawks",
  "Natal Knights",
  "Campo Grande Bulls",
  "João Pessoa Raiders",
  "Cuiabá Scorpions",
  "Maceió Thunders",
  "Teresina Pythons"
];

const generateMatchDates = () => {
  const startDate = new Date('2024-01-20');
  const matches = [];
  
  // 38 rodadas (19 turno + 19 returno)
  for (let round = 0; round < 38; round++) {
    const roundMatches = [];
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + (round * 7)); // Uma rodada por semana

    // 10 jogos por rodada
    for (let match = 0; match < 10; match++) {
      const matchDate = new Date(currentDate);
      // Distribuir jogos entre Sábado e Domingo
      matchDate.setDate(currentDate.getDate() + Math.floor(match / 5));
      
      // Horários diferentes para cada jogo
      const hours = [11, 16, 16, 18, 20];
      matchDate.setHours(hours[match % 5], 0, 0);

      roundMatches.push({
        date: matchDate,
        homeTeam: teams[match * 2],
        awayTeam: teams[match * 2 + 1],
        odds: {
          home: (2 + Math.random() * 2).toFixed(2),
          draw: (2.5 + Math.random() * 2).toFixed(2),
          away: (2 + Math.random() * 2).toFixed(2)
        }
      });
    }
    matches.push({
      round: round + 1,
      matches: roundMatches,
      phase: round < 19 ? 'Turno' : 'Returno'
    });
  }
  return matches;
};

export const championshipData = {
  name: "Campeonato Brasileiro Série A 2024",
  rounds: generateMatchDates()
};
