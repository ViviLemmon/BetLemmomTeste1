import React, { useState } from 'react';

const BettorCalculators = () => {
  const [activeCalculator, setActiveCalculator] = useState('stake');
  const [values, setValues] = useState({
    stake: {
      bankroll: 1000,
      risk: 1,
      confidence: 50
    },
    hedging: {
      backStake: 100,
      backOdds: 2.0,
      layOdds: 2.1
    },
    dutching: {
      totalStake: 100,
      odds1: 2.0,
      odds2: 3.0,
      odds3: 4.0
    },
    arbitrage: {
      stake: 100,
      odds1: 2.0,
      odds2: 2.0
    },
    roi: {
      stake: 100,
      potentialReturn: 200,
      probability: 50
    }
  });

  const calculateStake = () => {
    const { bankroll, risk, confidence } = values.stake;
    const recommendedStake = (bankroll * (risk / 100) * (confidence / 100)).toFixed(2);
    return recommendedStake;
  };

  const calculateHedging = () => {
    const { backStake, backOdds, layOdds } = values.hedging;
    const layStake = ((backStake * backOdds) / layOdds).toFixed(2);
    const profit = (backStake * (backOdds - 1) - layStake * (layOdds - 1)).toFixed(2);
    return { layStake, profit };
  };

  const calculateDutching = () => {
    const { totalStake, odds1, odds2, odds3 } = values.dutching;
    const totalProbability = (1/odds1 + 1/odds2 + 1/odds3);
    const stake1 = (totalStake * (1/odds1) / totalProbability).toFixed(2);
    const stake2 = (totalStake * (1/odds2) / totalProbability).toFixed(2);
    const stake3 = (totalStake * (1/odds3) / totalProbability).toFixed(2);
    return { stake1, stake2, stake3 };
  };

  const calculateArbitrage = () => {
    const { stake, odds1, odds2 } = values.arbitrage;
    const prob1 = 1/odds1;
    const prob2 = 1/odds2;
    const totalProb = prob1 + prob2;
    const isArbitrage = totalProb < 1;
    const profit = isArbitrage ? (stake * (1 - totalProb)).toFixed(2) : 0;
    return { isArbitrage, profit };
  };

  const calculateROI = () => {
    const { stake, potentialReturn, probability } = values.roi;
    const expectedValue = (potentialReturn * (probability/100) - stake).toFixed(2);
    const roi = ((expectedValue / stake) * 100).toFixed(2);
    return { expectedValue, roi };
  };

  const handleInputChange = (calculator, field, value) => {
    setValues(prev => ({
      ...prev,
      [calculator]: {
        ...prev[calculator],
        [field]: parseFloat(value) || 0
      }
    }));
  };

  return (
    <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Calculadoras</h2>
        
        {/* Seletor de Calculadora */}
        <select
          value={activeCalculator}
          onChange={(e) => setActiveCalculator(e.target.value)}
          className="w-full mb-4 p-2 border rounded-md"
        >
          <option value="stake">Calculadora de Stake</option>
          <option value="hedging">Hedging (Cobertura)</option>
          <option value="dutching">Dutching</option>
          <option value="arbitrage">Arbitragem</option>
          <option value="roi">ROI/Valor Esperado</option>
        </select>

        {/* Calculadora de Stake */}
        {activeCalculator === 'stake' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Bankroll (R$)</label>
              <input
                type="number"
                value={values.stake.bankroll}
                onChange={(e) => handleInputChange('stake', 'bankroll', e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Risco (%)</label>
              <input
                type="number"
                value={values.stake.risk}
                onChange={(e) => handleInputChange('stake', 'risk', e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Confiança (%)</label>
              <input
                type="number"
                value={values.stake.confidence}
                onChange={(e) => handleInputChange('stake', 'confidence', e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm font-medium text-blue-800">
                Stake Recomendada: R$ {calculateStake()}
              </p>
            </div>
          </div>
        )}

        {/* Calculadora de Hedging */}
        {activeCalculator === 'hedging' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Stake Back (R$)</label>
              <input
                type="number"
                value={values.hedging.backStake}
                onChange={(e) => handleInputChange('hedging', 'backStake', e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Odds Back</label>
              <input
                type="number"
                value={values.hedging.backOdds}
                onChange={(e) => handleInputChange('hedging', 'backOdds', e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Odds Lay</label>
              <input
                type="number"
                value={values.hedging.layOdds}
                onChange={(e) => handleInputChange('hedging', 'layOdds', e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm font-medium text-blue-800">
                Stake Lay: R$ {calculateHedging().layStake}
              </p>
              <p className="text-sm font-medium text-blue-800">
                Lucro Garantido: R$ {calculateHedging().profit}
              </p>
            </div>
          </div>
        )}

        {/* Calculadora de Dutching */}
        {activeCalculator === 'dutching' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Stake Total (R$)</label>
              <input
                type="number"
                value={values.dutching.totalStake}
                onChange={(e) => handleInputChange('dutching', 'totalStake', e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Odds 1</label>
              <input
                type="number"
                value={values.dutching.odds1}
                onChange={(e) => handleInputChange('dutching', 'odds1', e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Odds 2</label>
              <input
                type="number"
                value={values.dutching.odds2}
                onChange={(e) => handleInputChange('dutching', 'odds2', e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Odds 3</label>
              <input
                type="number"
                value={values.dutching.odds3}
                onChange={(e) => handleInputChange('dutching', 'odds3', e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm font-medium text-blue-800">
                Stake 1: R$ {calculateDutching().stake1}
              </p>
              <p className="text-sm font-medium text-blue-800">
                Stake 2: R$ {calculateDutching().stake2}
              </p>
              <p className="text-sm font-medium text-blue-800">
                Stake 3: R$ {calculateDutching().stake3}
              </p>
            </div>
          </div>
        )}

        {/* Calculadora de Arbitragem */}
        {activeCalculator === 'arbitrage' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Stake Total (R$)</label>
              <input
                type="number"
                value={values.arbitrage.stake}
                onChange={(e) => handleInputChange('arbitrage', 'stake', e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Odds 1</label>
              <input
                type="number"
                value={values.arbitrage.odds1}
                onChange={(e) => handleInputChange('arbitrage', 'odds1', e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Odds 2</label>
              <input
                type="number"
                value={values.arbitrage.odds2}
                onChange={(e) => handleInputChange('arbitrage', 'odds2', e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="bg-blue-50 p-3 rounded-md">
              {calculateArbitrage().isArbitrage ? (
                <>
                  <p className="text-sm font-medium text-green-800">
                    Oportunidade de Arbitragem!
                  </p>
                  <p className="text-sm font-medium text-blue-800">
                    Lucro Garantido: R$ {calculateArbitrage().profit}
                  </p>
                </>
              ) : (
                <p className="text-sm font-medium text-red-800">
                  Sem oportunidade de arbitragem
                </p>
              )}
            </div>
          </div>
        )}

        {/* Calculadora de ROI */}
        {activeCalculator === 'roi' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Stake (R$)</label>
              <input
                type="number"
                value={values.roi.stake}
                onChange={(e) => handleInputChange('roi', 'stake', e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Retorno Potencial (R$)</label>
              <input
                type="number"
                value={values.roi.potentialReturn}
                onChange={(e) => handleInputChange('roi', 'potentialReturn', e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Probabilidade (%)</label>
              <input
                type="number"
                value={values.roi.probability}
                onChange={(e) => handleInputChange('roi', 'probability', e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm font-medium text-blue-800">
                Valor Esperado: R$ {calculateROI().expectedValue}
              </p>
              <p className="text-sm font-medium text-blue-800">
                ROI: {calculateROI().roi}%
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BettorCalculators;
