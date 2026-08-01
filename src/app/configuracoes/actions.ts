"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { encrypt } from "@/lib/crypto";
import type { RegimeTributario } from "@/generated/prisma/enums";

async function getConfiguracaoSistema() {
  const existing = await prisma.configuracaoSistema.findFirst();
  if (existing) return existing;
  return prisma.configuracaoSistema.create({
    data: { regimeSelecionado: "PF_RTS", estadoOperacao: "SP" },
  });
}

export async function setRegimeSelecionado(formData: FormData) {
  const regime = formData.get("regime") as RegimeTributario;
  const sistema = await getConfiguracaoSistema();
  await prisma.configuracaoSistema.update({
    where: { id: sistema.id },
    data: { regimeSelecionado: regime },
  });
  revalidatePath("/configuracoes");
}

export async function updateRegimeConfig(formData: FormData) {
  const aliquotaII = Number(formData.get("aliquotaII"));
  const descontoUSD = Number(formData.get("descontoUSD"));
  const limiteIsencaoUSD = Number(formData.get("limiteIsencaoUSD"));
  const limiteRegimeUSD = Number(formData.get("limiteRegimeUSD"));
  const agora = new Date();

  await prisma.$transaction([
    prisma.configuracaoRegimeTributario.updateMany({
      where: { regime: "PF_RTS", vigenciaFim: null },
      data: { vigenciaFim: agora },
    }),
    prisma.configuracaoRegimeTributario.create({
      data: {
        regime: "PF_RTS",
        aliquotaII,
        descontoUSD,
        limiteIsencaoUSD,
        limiteRegimeUSD,
        vigenciaInicio: agora,
      },
    }),
  ]);
  revalidatePath("/configuracoes");
}

export async function setEstadoOperacao(formData: FormData) {
  const uf = formData.get("uf") as string;
  const sistema = await getConfiguracaoSistema();
  await prisma.configuracaoSistema.update({
    where: { id: sistema.id },
    data: { estadoOperacao: uf },
  });
  revalidatePath("/configuracoes");
}

export async function updateIcmsConfig(formData: FormData) {
  const aliquotaICMS = Number(formData.get("aliquotaICMS"));
  const uf = formData.get("uf") as string;
  const agora = new Date();

  await prisma.$transaction([
    prisma.configIcmsEstado.updateMany({
      where: { uf, vigenciaFim: null },
      data: { vigenciaFim: agora },
    }),
    prisma.configIcmsEstado.create({
      data: { uf, aliquotaICMS, vigenciaInicio: agora },
    }),
  ]);
  revalidatePath("/configuracoes");
}

export async function addFreteTier() {
  const last = await prisma.tabelaFreteUscloser.findFirst({
    where: { vigenciaFim: null },
    orderBy: { pesoMaxGramas: "desc" },
  });
  const pesoMinGramas = last ? Number(last.pesoMaxGramas) + 1 : 0;
  const pesoMaxGramas = last ? Number(last.pesoMaxGramas) + 1000 : 500;
  const valorUSD = last ? Number(last.valorUSD) + 10 : 18;

  await prisma.tabelaFreteUscloser.create({
    data: { pesoMinGramas, pesoMaxGramas, valorUSD, vigenciaInicio: new Date() },
  });
  revalidatePath("/configuracoes");
}

export async function updateFreteTier(formData: FormData) {
  const id = Number(formData.get("id"));
  const pesoMaxGramas = Number(formData.get("pesoMaxGramas"));
  const valorUSD = Number(formData.get("valorUSD"));
  await prisma.tabelaFreteUscloser.update({
    where: { id },
    data: { pesoMaxGramas, valorUSD },
  });
  revalidatePath("/configuracoes");
}

export async function deleteFreteTier(formData: FormData) {
  const id = Number(formData.get("id"));
  await prisma.tabelaFreteUscloser.delete({ where: { id } });
  revalidatePath("/configuracoes");
}

export async function saveCredencial(formData: FormData) {
  const usuario = formData.get("usuario") as string;
  const senha = formData.get("senha") as string;
  if (!usuario || !senha) return;

  const senhaCriptografada = encrypt(senha);
  const existing = await prisma.credencialUscloser.findFirst();
  if (existing) {
    await prisma.credencialUscloser.update({
      where: { id: existing.id },
      data: { usuario, senhaCriptografada },
    });
  } else {
    await prisma.credencialUscloser.create({
      data: { usuario, senhaCriptografada },
    });
  }
  revalidatePath("/configuracoes");
}

export async function updateMargemPadrao(formData: FormData) {
  const margemLucroPadrao = Number(formData.get("margemLucroPadrao"));
  const sistema = await getConfiguracaoSistema();
  await prisma.configuracaoSistema.update({
    where: { id: sistema.id },
    data: { margemLucroPadrao },
  });
  revalidatePath("/configuracoes");
}
