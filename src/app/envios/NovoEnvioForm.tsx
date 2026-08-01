"use client";

import { useMemo, useState } from "react";
import type { FreteTier } from "@/lib/tarifas";
import { freteParaPeso } from "@/lib/tarifas";
import { fmtUSD, fmtBRL } from "@/lib/format";
import { criarEnvio } from "./actions";

export type ItemElegivel = { id: number; nome: string; pesoGramas: number };

export function NovoEnvioForm({
  itens,
  tiers,
}: {
  itens: ItemElegivel[];
  tiers: FreteTier[];
}) {
  const [selecionados, setSelecionados] = useState<Set<number>>(new Set());

  function toggle(id: number) {
    setSelecionados((atual) => {
      const proximo = new Set(atual);
      if (proximo.has(id)) proximo.delete(id);
      else proximo.add(id);
      return proximo;
    });
  }

  const pesoTotal = useMemo(
    () => itens.filter((i) => selecionados.has(i.id)).reduce((soma, i) => soma + i.pesoGramas, 0),
    [itens, selecionados]
  );
  const tier = freteParaPeso(tiers, pesoTotal);

  async function handleSubmit(formData: FormData) {
    await criarEnvio(formData);
    setSelecionados(new Set());
  }

  return (
    <div className="two-col" style={{ marginBottom: 26 }}>
      <div>
        <div className="chart-note" style={{ marginBottom: 8 }}>
          Itens disponíveis (recebidos pela USCloser, ainda sem envio)
        </div>
        {itens.length === 0 ? (
          <div className="empty-note" style={{ marginTop: 8 }}>
            Nenhum item recebido pela USCloser aguardando envio no momento.
          </div>
        ) : (
          <div className="envio-list">
            {itens.map((item) => (
              <label className="envio-row" key={item.id}>
                <input
                  type="checkbox"
                  form="novo-envio-form"
                  name="itemIds"
                  value={item.id}
                  checked={selecionados.has(item.id)}
                  onChange={() => toggle(item.id)}
                />
                <span className="meta">
                  <div className="item-name">{item.nome}</div>
                </span>
                <span className="weight">{item.pesoGramas} g</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <form id="novo-envio-form" action={handleSubmit} className="result-card">
        <div className="result-hero-label">Frete estimado do envio</div>
        <div className="result-hero">{fmtBRL((tier?.valorUSD ?? 0) * 5.35)}</div>
        <div className="result-row">
          <span>Itens selecionados</span>
          <span>{selecionados.size} item(ns)</span>
        </div>
        <div className="result-row">
          <span>Peso total</span>
          <span>{pesoTotal} g</span>
        </div>
        <div className="result-row">
          <span>Faixa aplicada (Packet Standard®)</span>
          <span>{tier ? `até ${tier.pesoMaxGramas} g` : "—"}</span>
        </div>
        <div className="result-row total">
          <span>Frete (USD)</span>
          <span>{fmtUSD(tier?.valorUSD ?? 0)}</span>
        </div>

        <div className="field" style={{ marginTop: 14 }}>
          <label htmlFor="cotacaoDolarUscloser">Cotação do dólar (USCloser)</label>
          <input id="cotacaoDolarUscloser" type="number" name="cotacaoDolarUscloser" step="0.01" required />
          <div className="field-hint">
            Informada manualmente por enquanto — a integração com a USCloser vai preencher isso sozinha.
          </div>
        </div>

        <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: 8 }} disabled={selecionados.size === 0}>
          Confirmar envio
        </button>
      </form>
    </div>
  );
}
