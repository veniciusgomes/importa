"use client";

import { useMemo, useState } from "react";
import type { FreteTier } from "@/lib/tarifas";
import { freteParaPeso } from "@/lib/tarifas";
import { calcularImpostoPFRTS, type ParametrosRegimePFRTS } from "@/lib/impostoCalculo";
import { fmtUSD, fmtBRL } from "@/lib/format";

export function CalculadoraForm({
  tiers,
  regimeParams,
  margemPadrao,
}: {
  tiers: FreteTier[];
  regimeParams: ParametrosRegimePFRTS;
  margemPadrao: number;
}) {
  const [peso, setPeso] = useState(350);
  const [valorUSD, setValorUSD] = useState(45);
  const [cambio, setCambio] = useState(5.35);
  const [margem, setMargem] = useState(margemPadrao);

  const tier = useMemo(() => freteParaPeso(tiers, peso), [tiers, peso]);
  const freteUSD = tier?.valorUSD ?? 0;
  const { valorII, valorICMS, valorTotalImpostosUSD } = useMemo(
    () => calcularImpostoPFRTS(valorUSD, freteUSD, regimeParams),
    [valorUSD, freteUSD, regimeParams]
  );

  const totalUSD = valorUSD + freteUSD + valorTotalImpostosUSD;
  const totalBRL = totalUSD * cambio;
  const precoSugerido = totalBRL * (1 + margem / 100);

  return (
    <div className="two-col">
      <div className="card">
        <div className="field">
          <label htmlFor="peso">Peso do item (gramas)</label>
          <input id="peso" type="number" value={peso} min={0} onChange={(e) => setPeso(Number(e.target.value))} />
        </div>
        <div className="field">
          <label htmlFor="valor">Valor de compra (USD)</label>
          <input
            id="valor"
            type="number"
            value={valorUSD}
            min={0}
            step="0.01"
            onChange={(e) => setValorUSD(Number(e.target.value))}
          />
        </div>
        <div className="field">
          <label htmlFor="cambio">Cotação do dólar (BRL)</label>
          <input
            id="cambio"
            type="number"
            value={cambio}
            min={0}
            step="0.01"
            onChange={(e) => setCambio(Number(e.target.value))}
          />
        </div>
        <div className="field">
          <label>Margem de lucro desejada</label>
          <div className="range-row">
            <input type="range" min={0} max={150} value={margem} onChange={(e) => setMargem(Number(e.target.value))} />
            <span className="range-value">{margem}%</span>
          </div>
        </div>
        <div className="field-hint">
          Parâmetros de imposto e frete vêm das configurações (regime PF/RTS ativo).
        </div>
      </div>

      <div className="result-card">
        <div className="result-hero-label">Preço de venda sugerido</div>
        <div className="result-hero">{fmtBRL(precoSugerido)}</div>
        <div className="result-row">
          <span>Valor de compra</span>
          <span>{fmtUSD(valorUSD)}</span>
        </div>
        <div className="result-row">
          <span>Frete estimado (faixa de peso)</span>
          <span>{fmtUSD(freteUSD)}{tier ? ` (até ${tier.pesoMaxGramas}g)` : ""}</span>
        </div>
        <div className="result-row">
          <span>Imposto de importação (II)</span>
          <span>{fmtUSD(valorII)}</span>
        </div>
        <div className="result-row">
          <span>ICMS</span>
          <span>{fmtUSD(valorICMS)}</span>
        </div>
        <div className="result-row total">
          <span>Custo total</span>
          <span>{fmtBRL(totalBRL)}</span>
        </div>
      </div>
    </div>
  );
}
