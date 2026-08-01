"use client";

import { useState } from "react";
import Link from "next/link";
import type { StatusItem } from "@/generated/prisma/enums";
import { STATUS_ITEM_LABELS, STATUS_ITEM_OPTIONS } from "@/lib/statusItem";
import { StatusPill } from "@/components/StatusPill";
import { fmtUSD, fmtDate } from "@/lib/format";
import { createItem, updateItem, deleteItem } from "./actions";

export type ItemPlain = {
  id: number;
  nome: string;
  origemPlataforma: string | null;
  urlAnuncio: string | null;
  status: StatusItem;
  pesoGramas: number;
  valorCompraUSD: number;
  cotacaoDolarCompra: number;
  dataCompra: string;
  margemLucroPercentual: number | null;
  precoVendaReal: number | null;
  dataVenda: string | null;
};

type DrawerState = { mode: "create" } | { mode: "edit"; item: ItemPlain } | null;

export function ComprasClient({
  items,
  currentStatus,
}: {
  items: ItemPlain[];
  currentStatus?: StatusItem;
}) {
  const [drawer, setDrawer] = useState<DrawerState>(null);

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Controle de compras</h1>
          <div className="sub">Cadastro de todos os itens comprados — origem, custo, peso e status</div>
        </div>
        <button className="btn-primary" onClick={() => setDrawer({ mode: "create" })}>
          + Novo item
        </button>
      </div>

      <div className="filter-row">
        <Link className="filter-chip" data-active={!currentStatus} href="/compras">
          Todos
        </Link>
        {STATUS_ITEM_OPTIONS.map((s) => (
          <Link
            key={s}
            className="filter-chip"
            data-active={currentStatus === s}
            href={`/compras?status=${s}`}
          >
            {STATUS_ITEM_LABELS[s]}
          </Link>
        ))}
      </div>

      <div className="card table-card">
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Status</th>
                <th className="num-cell">Peso</th>
                <th className="num-cell">Valor USD</th>
                <th className="num-cell">Câmbio</th>
                <th>Data</th>
                <th className="actions-col">Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="item-name">{item.nome}</div>
                    <div className="item-sub">{item.origemPlataforma}</div>
                  </td>
                  <td>
                    <StatusPill status={item.status} />
                  </td>
                  <td className="num-cell">{item.pesoGramas} g</td>
                  <td className="num-cell">{fmtUSD(item.valorCompraUSD)}</td>
                  <td className="num-cell">{item.cotacaoDolarCompra.toFixed(2).replace(".", ",")}</td>
                  <td>{fmtDate(item.dataCompra)}</td>
                  <td className="actions-cell">
                    <button
                      className="icon-btn"
                      aria-label="Editar"
                      onClick={() => setDrawer({ mode: "edit", item })}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                      </svg>
                    </button>
                    <form action={deleteItem}>
                      <input type="hidden" name="id" value={item.id} />
                      <button className="icon-btn danger" aria-label="Excluir" type="submit">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M4 7h16" />
                          <path d="M10 11v6" />
                          <path d="M14 11v6" />
                          <path d="M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" />
                          <path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
                        </svg>
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {items.length === 0 && (
          <div className="empty-note" style={{ border: "none", borderRadius: 0 }}>
            Nenhum item nessa etapa ainda.
          </div>
        )}
      </div>

      {drawer && (
        <ItemDrawer
          key={drawer.mode === "edit" ? drawer.item.id : "create"}
          state={drawer}
          onClose={() => setDrawer(null)}
        />
      )}
    </>
  );
}

function ItemDrawer({ state, onClose }: { state: NonNullable<DrawerState>; onClose: () => void }) {
  const item = state.mode === "edit" ? state.item : null;
  const action = state.mode === "edit" ? updateItem.bind(null, state.item.id) : createItem;

  async function handleSubmit(formData: FormData) {
    await action(formData);
    onClose();
  }

  return (
    <div className="drawer-overlay open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="drawer" role="dialog" aria-modal="true">
        <div className="drawer-head">
          <h2>{item ? "Editar item" : "Novo item"}</h2>
          <button className="drawer-close" aria-label="Fechar" onClick={onClose}>
            ✕
          </button>
        </div>
        <form action={handleSubmit}>
          <div className="drawer-body">
            <div className="field">
              <label htmlFor="nome">Nome do item</label>
              <input id="nome" type="text" name="nome" defaultValue={item?.nome} placeholder="ex: Console Retro Portátil" required />
            </div>
            <div className="two-col">
              <div className="field">
                <label htmlFor="origemPlataforma">Origem</label>
                <input id="origemPlataforma" type="text" name="origemPlataforma" defaultValue={item?.origemPlataforma ?? "eBay"} />
              </div>
              <div className="field">
                <label htmlFor="status">Status</label>
                <select id="status" name="status" defaultValue={item?.status ?? "COMPRADO"}>
                  {STATUS_ITEM_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_ITEM_LABELS[s]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="two-col">
              <div className="field">
                <label htmlFor="pesoGramas">Peso (gramas)</label>
                <input id="pesoGramas" type="number" name="pesoGramas" min="0" defaultValue={item?.pesoGramas} required />
              </div>
              <div className="field">
                <label htmlFor="dataCompra">Data da compra</label>
                <input
                  id="dataCompra"
                  type="date"
                  name="dataCompra"
                  defaultValue={item?.dataCompra.slice(0, 10) ?? new Date().toISOString().slice(0, 10)}
                  required
                />
              </div>
            </div>
            <div className="two-col">
              <div className="field">
                <label htmlFor="valorCompraUSD">Valor de compra (USD)</label>
                <input id="valorCompraUSD" type="number" name="valorCompraUSD" min="0" step="0.01" defaultValue={item?.valorCompraUSD} required />
              </div>
              <div className="field">
                <label htmlFor="cotacaoDolarCompra">Cotação do dólar na compra</label>
                <input id="cotacaoDolarCompra" type="number" name="cotacaoDolarCompra" min="0" step="0.01" defaultValue={item?.cotacaoDolarCompra} required />
              </div>
            </div>
            <div className="field">
              <label htmlFor="urlAnuncio">Link do anúncio (opcional)</label>
              <input id="urlAnuncio" type="text" name="urlAnuncio" defaultValue={item?.urlAnuncio ?? ""} placeholder="https://..." />
            </div>
            <div className="field">
              <label htmlFor="margemLucroPercentual">Margem de lucro desejada (%, opcional)</label>
              <input id="margemLucroPercentual" type="number" name="margemLucroPercentual" min="0" step="1" defaultValue={item?.margemLucroPercentual ?? ""} />
            </div>
            <div className="two-col">
              <div className="field">
                <label htmlFor="precoVendaReal">Preço de venda real (BRL, se já vendido)</label>
                <input id="precoVendaReal" type="number" name="precoVendaReal" min="0" step="0.01" defaultValue={item?.precoVendaReal ?? ""} />
              </div>
              <div className="field">
                <label htmlFor="dataVenda">Data da venda</label>
                <input id="dataVenda" type="date" name="dataVenda" defaultValue={item?.dataVenda?.slice(0, 10) ?? ""} />
              </div>
            </div>
          </div>
          <div className="drawer-foot">
            <button type="button" className="btn-ghost" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              Salvar item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
