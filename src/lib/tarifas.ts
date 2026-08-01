export type FreteTier = {
  id: number;
  pesoMinGramas: number;
  pesoMaxGramas: number;
  valorUSD: number;
};

// A faixa cujo teto ("até X gramas") é o primeiro suficiente para o peso
// informado. Se o peso ultrapassar todas as faixas cadastradas, usa a mais
// pesada (comportamento igual ao mockup: nunca deixa sem faixa aplicável).
export function freteParaPeso(tiers: FreteTier[], pesoGramas: number): FreteTier | null {
  if (tiers.length === 0) return null;
  const tier = tiers.find((t) => pesoGramas <= t.pesoMaxGramas);
  return tier ?? tiers[tiers.length - 1];
}
