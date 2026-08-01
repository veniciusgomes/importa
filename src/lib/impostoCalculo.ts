export type ParametrosRegimePFRTS = {
  aliquotaII: number; // %
  descontoUSD: number;
  limiteIsencaoUSD: number;
  aliquotaICMS: number; // %
};

export type ResultadoImposto = {
  valorII: number;
  valorICMS: number;
  valorTotalImpostosUSD: number;
};

// Fórmula do RTS (Regime de Tributação Simplificada): II sobre o valor
// aduaneiro acima do limite de isenção, com desconto; ICMS "por dentro"
// (gross-up) sobre valor aduaneiro + II + frete. Ver docs/database.md.
export function calcularImpostoPFRTS(
  valorAduaneiroUSD: number,
  freteUSD: number,
  params: ParametrosRegimePFRTS
): ResultadoImposto {
  const valorII =
    valorAduaneiroUSD <= params.limiteIsencaoUSD
      ? 0
      : Math.max(0, (valorAduaneiroUSD - params.descontoUSD) * (params.aliquotaII / 100));

  const baseICMS = valorAduaneiroUSD + valorII + freteUSD;
  const valorICMS = baseICMS / (1 - params.aliquotaICMS / 100) - baseICMS;

  return {
    valorII,
    valorICMS,
    valorTotalImpostosUSD: valorII + valorICMS,
  };
}
