import type { StatusItem } from "@/generated/prisma/enums";

export const STATUS_ITEM_LABELS: Record<StatusItem, string> = {
  COMPRADO: "Comprado",
  RECEBIDO_USCLOSER: "Recebido USCloser",
  ENVIADO: "Enviado",
  RECEBIDO_BRASIL: "Recebido Brasil",
  VENDIDO: "Vendido",
};

export const STATUS_ITEM_PILL_CLASS: Record<StatusItem, string> = {
  COMPRADO: "pill-comprado",
  RECEBIDO_USCLOSER: "pill-recebido_uscloser",
  ENVIADO: "pill-enviado",
  RECEBIDO_BRASIL: "pill-recebido_brasil",
  VENDIDO: "pill-vendido",
};

export const STATUS_ITEM_OPTIONS: StatusItem[] = [
  "COMPRADO",
  "RECEBIDO_USCLOSER",
  "ENVIADO",
  "RECEBIDO_BRASIL",
  "VENDIDO",
];
