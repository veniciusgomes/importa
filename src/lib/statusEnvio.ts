import type { StatusEnvio } from "@/generated/prisma/enums";

export const STATUS_ENVIO_LABELS: Record<StatusEnvio, string> = {
  AGUARDANDO_ITENS: "Aguardando itens",
  ENVIADO_USCLOSER: "Enviado (USCloser)",
  TRANSITO_BRASIL: "Em trânsito",
  RECEBIDO_BRASIL: "Recebido no Brasil",
};

export const STATUS_ENVIO_PILL_CLASS: Record<StatusEnvio, string> = {
  AGUARDANDO_ITENS: "pill-comprado",
  ENVIADO_USCLOSER: "pill-lote-enviado",
  TRANSITO_BRASIL: "pill-lote-transito",
  RECEBIDO_BRASIL: "pill-lote-recebido",
};

// Próxima etapa do lote, se houver — usado pra desenhar o botão de avançar.
export const STATUS_ENVIO_PROXIMO: Partial<Record<StatusEnvio, StatusEnvio>> = {
  ENVIADO_USCLOSER: "TRANSITO_BRASIL",
  TRANSITO_BRASIL: "RECEBIDO_BRASIL",
};

export const STATUS_ENVIO_ACAO_LABEL: Partial<Record<StatusEnvio, string>> = {
  TRANSITO_BRASIL: "Marcar em trânsito",
  RECEBIDO_BRASIL: "Marcar recebido no Brasil",
};
