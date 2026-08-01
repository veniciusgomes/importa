import "server-only";
import { prisma } from "@/lib/prisma";
import type { FreteTier } from "@/lib/tarifas";

export async function getFreteTiersAtivos(): Promise<FreteTier[]> {
  const tiers = await prisma.tabelaFreteUscloser.findMany({
    where: { vigenciaFim: null },
    orderBy: { pesoMaxGramas: "asc" },
  });
  return tiers.map((t) => ({
    id: t.id,
    pesoMinGramas: Number(t.pesoMinGramas),
    pesoMaxGramas: Number(t.pesoMaxGramas),
    valorUSD: Number(t.valorUSD),
  }));
}
