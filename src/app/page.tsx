import { prisma } from "@/lib/prisma";
import { fmtBRL, fmtUSD, fmtDate } from "@/lib/format";

// Lê do banco a cada request — sem isso, o Next.js prerenderia esta página
// como estática no build e o dashboard congelaria com os dados de quando
// rodou o `next build`.
export const dynamic = "force-dynamic";
import { STATUS_ITEM_LABELS } from "@/lib/statusItem";
import { StatusPill } from "@/components/StatusPill";
import { roundedTopPath, roundedRightPath } from "@/lib/svgBars";
import type { StatusItem } from "@/generated/prisma/enums";

const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

// Ordem do pipeline (mesma lógica do mockup): estágios intermediários usam o
// degradê azul ordinal; "Vendido" é o único estado de sucesso terminal, por
// isso fica de fora do degradê e usa a cor de status "good".
const ETAPAS: { status: StatusItem; cor: string }[] = [
  { status: "COMPRADO", cor: "var(--step-250)" },
  { status: "RECEBIDO_USCLOSER", cor: "var(--step-350)" },
  { status: "ENVIADO", cor: "var(--step-450)" },
  { status: "RECEBIDO_BRASIL", cor: "var(--step-550)" },
  { status: "VENDIDO", cor: "var(--status-good)" },
];

export default async function DashboardPage() {
  const agora = new Date();
  const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
  const inicioProximoMes = new Date(agora.getFullYear(), agora.getMonth() + 1, 1);
  const inicioJanela = new Date(agora.getFullYear(), agora.getMonth() - 5, 1);

  const [remessasEsteMes, itensEsteMes, pesoEmTransito, itensJanela, statusCounts, atividadeRecente, vendidosEsteMes] =
    await Promise.all([
      prisma.envio.count({ where: { createdAt: { gte: inicioMes, lt: inicioProximoMes } } }),
      prisma.item.count({ where: { dataCompra: { gte: inicioMes, lt: inicioProximoMes } } }),
      prisma.item.aggregate({ _sum: { pesoGramas: true }, where: { status: "ENVIADO" } }),
      prisma.item.findMany({
        where: { dataCompra: { gte: inicioJanela } },
        select: { dataCompra: true },
      }),
      prisma.item.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.item.findMany({ orderBy: { updatedAt: "desc" }, take: 6 }),
      prisma.item.findMany({
        where: { dataVenda: { gte: inicioMes, lt: inicioProximoMes }, precoVendaReal: { not: null } },
      }),
    ]);

  const lucroEsteMes = vendidosEsteMes.reduce((soma, item) => {
    const custoBRL = Number(item.valorCompraUSD) * Number(item.cotacaoDolarCompra);
    return soma + (Number(item.precoVendaReal) - custoBRL);
  }, 0);

  const bucketsMes: { label: string; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(agora.getFullYear(), agora.getMonth() - i, 1);
    bucketsMes.push({ label: MESES[d.getMonth()], count: 0 });
  }
  for (const item of itensJanela) {
    const diffMeses =
      (agora.getFullYear() - item.dataCompra.getFullYear()) * 12 + (agora.getMonth() - item.dataCompra.getMonth());
    const idx = 5 - diffMeses;
    if (idx >= 0 && idx < 6) bucketsMes[idx].count++;
  }
  const maxMes = Math.max(10, ...bucketsMes.map((b) => b.count));

  const statusMap = new Map(statusCounts.map((s) => [s.status, s._count._all]));
  const maxEtapa = Math.max(5, ...ETAPAS.map((e) => statusMap.get(e.status) ?? 0));

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <div className="sub">Visão geral das importações</div>
        </div>
        <div className="period-chip">
          {MESES[agora.getMonth()]}/{agora.getFullYear()}
        </div>
      </div>

      <div className="grid-kpi">
        <div className="card">
          <div className="kpi-label">Remessas este mês</div>
          <div className="kpi-value-row">
            <span className="kpi-value">{remessasEsteMes}</span>
          </div>
        </div>
        <div className="card">
          <div className="kpi-label">Itens comprados este mês</div>
          <div className="kpi-value-row">
            <span className="kpi-value">{itensEsteMes}</span>
          </div>
        </div>
        <div className="card">
          <div className="kpi-label">Lucro estimado este mês</div>
          <div className="kpi-value-row">
            <span className="kpi-value">{fmtBRL(lucroEsteMes)}</span>
          </div>
        </div>
        <div className="card">
          <div className="kpi-label">Peso em trânsito</div>
          <div className="kpi-value-row">
            <span className="kpi-value">
              {((Number(pesoEmTransito._sum.pesoGramas) || 0) / 1000).toLocaleString("pt-BR", {
                maximumFractionDigits: 1,
              })}{" "}
              kg
            </span>
          </div>
        </div>
      </div>

      <div className="grid-charts">
        <div className="card">
          <div className="chart-card-head">
            <div>
              <div className="chart-title">Itens comprados por mês</div>
              <div className="chart-note">últimos 6 meses</div>
            </div>
          </div>
          <div className="chart-body">
            <svg viewBox="0 0 560 210" width="100%">
              {[0, 10, 20, 30].map((t) => {
                const y = 10 + 172 - (t / maxMes) * 172;
                return (
                  <g key={t}>
                    <line x1={28} x2={546} y1={y} y2={y} className="gridline" />
                    <text x={4} y={y + 3} className="axis-label">
                      {t}
                    </text>
                  </g>
                );
              })}
              {bucketsMes.map((b, i) => {
                const bw = 24;
                const gap = (560 - 28 - 14 - bw * 6) / 7;
                const x = 28 + gap + i * (bw + gap);
                const barH = (b.count / maxMes) * 172;
                const y = 10 + 172 - barH;
                return (
                  <g key={i}>
                    <path d={roundedTopPath(x, y, bw, barH, 4)} fill="var(--step-450)" />
                    {i === bucketsMes.length - 1 && (
                      <text x={x + bw / 2} y={y - 6} textAnchor="middle" className="value-label">
                        {b.count}
                      </text>
                    )}
                    <text x={x + bw / 2} y={202} textAnchor="middle" className="axis-label">
                      {b.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        <div className="card">
          <div className="chart-card-head">
            <div>
              <div className="chart-title">Itens por etapa</div>
              <div className="chart-note">posição atual do pipeline</div>
            </div>
          </div>
          <div className="chart-body">
            <svg viewBox={`0 0 400 ${6 + ETAPAS.length * 42}`} width="100%">
              {ETAPAS.map((etapa, i) => {
                const y = 6 + i * 42;
                const count = statusMap.get(etapa.status) ?? 0;
                const plotW = 400 - 118 - 34;
                const barW = Math.max((count / maxEtapa) * plotW, count > 0 ? 6 : 0);
                return (
                  <g key={etapa.status}>
                    <text x={108} y={y + 19} textAnchor="end" className="axis-label">
                      {STATUS_ITEM_LABELS[etapa.status]}
                    </text>
                    <rect x={118} y={y} width={plotW} height={30} rx={4} fill="var(--gridline)" opacity={0.4} />
                    <path d={roundedRightPath(118, y, barW, 30, 4)} fill={etapa.cor} />
                    <text x={118 + barW + 8} y={y + 19} className="value-label">
                      {count}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      <div className="card table-card">
        <div style={{ padding: "14px 18px 4px", fontSize: 13.5, fontWeight: 600 }}>Atividade recente</div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Status</th>
                <th className="num-cell">Valor</th>
                <th>Atualizado em</th>
              </tr>
            </thead>
            <tbody>
              {atividadeRecente.map((item) => (
                <tr key={item.id}>
                  <td className="item-name">{item.nome}</td>
                  <td>
                    <StatusPill status={item.status} />
                  </td>
                  <td className="num-cell">{fmtUSD(Number(item.valorCompraUSD))}</td>
                  <td>{fmtDate(item.updatedAt.toISOString())}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {atividadeRecente.length === 0 && (
          <div className="empty-note" style={{ border: "none", borderRadius: 0 }}>
            Nenhuma atividade ainda — cadastre um item em Controle de compras.
          </div>
        )}
      </div>
    </div>
  );
}
