export function fmtUSD(value: number): string {
  return `US$ ${value.toFixed(2).replace(".", ",")}`;
}

export function fmtBRL(value: number): string {
  return `R$ ${value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// `new Date("2026-08-01")` (do valor de um <input type="date">) é
// interpretado como meia-noite UTC — em fusos negativos (ex: America/Sao_Paulo)
// isso "vira" o dia anterior. Parseamos ano/mês/dia manualmente para gravar a
// data local pretendida, não a UTC.
export function parseLocalDate(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function fmtDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const [year, month, day] = iso.slice(0, 10).split("-");
  return `${day}/${month}`;
}
