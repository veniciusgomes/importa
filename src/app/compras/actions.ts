"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { parseLocalDate } from "@/lib/format";
import type { StatusItem } from "@/generated/prisma/enums";

function readItemForm(formData: FormData) {
  return {
    nome: formData.get("nome") as string,
    origemPlataforma: (formData.get("origemPlataforma") as string) || null,
    urlAnuncio: (formData.get("urlAnuncio") as string) || null,
    status: formData.get("status") as StatusItem,
    pesoGramas: Number(formData.get("pesoGramas")),
    valorCompraUSD: Number(formData.get("valorCompraUSD")),
    cotacaoDolarCompra: Number(formData.get("cotacaoDolarCompra")),
    dataCompra: parseLocalDate(formData.get("dataCompra") as string),
    margemLucroPercentual: formData.get("margemLucroPercentual")
      ? Number(formData.get("margemLucroPercentual"))
      : null,
    precoVendaReal: formData.get("precoVendaReal") ? Number(formData.get("precoVendaReal")) : null,
    dataVenda: formData.get("dataVenda") ? parseLocalDate(formData.get("dataVenda") as string) : null,
  };
}

export async function createItem(formData: FormData) {
  const data = readItemForm(formData);
  if (!data.nome) return;
  await prisma.item.create({ data });
  revalidatePath("/compras");
  revalidatePath("/");
}

export async function updateItem(id: number, formData: FormData) {
  const data = readItemForm(formData);
  if (!data.nome) return;
  await prisma.item.update({ where: { id }, data });
  revalidatePath("/compras");
  revalidatePath("/envios");
  revalidatePath("/");
}

export async function deleteItem(formData: FormData) {
  const id = Number(formData.get("id"));
  await prisma.item.delete({ where: { id } });
  revalidatePath("/compras");
  revalidatePath("/");
}
