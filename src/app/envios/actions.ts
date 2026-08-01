"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { freteParaPeso } from "@/lib/tarifas";
import { getFreteTiersAtivos } from "@/lib/tarifas.server";
import { STATUS_ENVIO_PROXIMO } from "@/lib/statusEnvio";

export async function criarEnvio(formData: FormData) {
  const itemIds = formData.getAll("itemIds").map((v) => Number(v));
  const cotacaoDolarUscloser = Number(formData.get("cotacaoDolarUscloser"));
  if (itemIds.length === 0 || !cotacaoDolarUscloser) return;

  const itens = await prisma.item.findMany({ where: { id: { in: itemIds } } });
  const pesoTotalGramas = itens.reduce((soma, item) => soma + Number(item.pesoGramas), 0);

  const tiers = await getFreteTiersAtivos();
  const tier = freteParaPeso(tiers, pesoTotalGramas);

  await prisma.$transaction(async (tx) => {
    const envio = await tx.envio.create({
      data: {
        status: "ENVIADO_USCLOSER",
        pesoTotalGramas,
        freteTotalUSD: tier?.valorUSD ?? 0,
        cotacaoDolarUscloser,
        tabelaFreteId: tier?.id,
        dataEnvioUscloser: new Date(),
      },
    });
    await tx.item.updateMany({
      where: { id: { in: itemIds } },
      data: { status: "ENVIADO", envioId: envio.id },
    });
  });

  revalidatePath("/envios");
  revalidatePath("/compras");
  revalidatePath("/");
}

export async function avancarStatusEnvio(formData: FormData) {
  const id = Number(formData.get("id"));
  const envio = await prisma.envio.findUnique({ where: { id } });
  if (!envio) return;

  const proximo = STATUS_ENVIO_PROXIMO[envio.status];
  if (!proximo) return;

  await prisma.envio.update({
    where: { id },
    data: {
      status: proximo,
      dataRecebimentoBrasil: proximo === "RECEBIDO_BRASIL" ? new Date() : undefined,
    },
  });

  if (proximo === "RECEBIDO_BRASIL") {
    await prisma.item.updateMany({
      where: { envioId: id },
      data: { status: "RECEBIDO_BRASIL" },
    });
  }

  revalidatePath("/envios");
  revalidatePath("/compras");
  revalidatePath("/");
}
