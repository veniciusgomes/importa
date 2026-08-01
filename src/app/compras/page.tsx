import { prisma } from "@/lib/prisma";
import { STATUS_ITEM_OPTIONS } from "@/lib/statusItem";
import type { StatusItem } from "@/generated/prisma/enums";
import { ComprasClient, type ItemPlain } from "./ComprasClient";

export default async function ComprasPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const statusFiltro = STATUS_ITEM_OPTIONS.includes(status as StatusItem)
    ? (status as StatusItem)
    : undefined;

  const itens = await prisma.item.findMany({
    where: statusFiltro ? { status: statusFiltro } : undefined,
    orderBy: { dataCompra: "desc" },
  });

  const itensPlain: ItemPlain[] = itens.map((item) => ({
    id: item.id,
    nome: item.nome,
    origemPlataforma: item.origemPlataforma,
    urlAnuncio: item.urlAnuncio,
    status: item.status,
    pesoGramas: Number(item.pesoGramas),
    valorCompraUSD: Number(item.valorCompraUSD),
    cotacaoDolarCompra: Number(item.cotacaoDolarCompra),
    dataCompra: item.dataCompra.toISOString(),
    margemLucroPercentual: item.margemLucroPercentual ? Number(item.margemLucroPercentual) : null,
    precoVendaReal: item.precoVendaReal ? Number(item.precoVendaReal) : null,
    dataVenda: item.dataVenda ? item.dataVenda.toISOString() : null,
  }));

  return <ComprasClient items={itensPlain} currentStatus={statusFiltro} />;
}
