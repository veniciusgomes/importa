import { prisma } from "@/lib/prisma";
import { getFreteTiersAtivos } from "@/lib/tarifas.server";
import { fmtUSD, fmtDate } from "@/lib/format";
import {
  STATUS_ENVIO_LABELS,
  STATUS_ENVIO_PILL_CLASS,
  STATUS_ENVIO_PROXIMO,
  STATUS_ENVIO_ACAO_LABEL,
} from "@/lib/statusEnvio";
import { NovoEnvioForm, type ItemElegivel } from "./NovoEnvioForm";

export const dynamic = "force-dynamic";
import { avancarStatusEnvio } from "./actions";

export default async function EnviosPage() {
  const [itensElegiveis, tiers, lotes] = await Promise.all([
    prisma.item.findMany({
      where: { status: "RECEBIDO_USCLOSER", envioId: null },
      orderBy: { dataCompra: "asc" },
    }),
    getFreteTiersAtivos(),
    prisma.envio.findMany({
      include: { itens: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const itensPlain: ItemElegivel[] = itensElegiveis.map((i) => ({
    id: i.id,
    nome: i.nome,
    pesoGramas: Number(i.pesoGramas),
  }));

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Envios</h1>
          <div className="sub">Monte novos envios e acompanhe os lotes já gerados</div>
        </div>
      </div>

      <div className="config-card-title" style={{ marginBottom: 10 }}>
        Novo envio
      </div>
      <NovoEnvioForm itens={itensPlain} tiers={tiers} />

      <div className="config-card-title" style={{ marginBottom: 10 }}>
        Lotes
      </div>
      <div className="card table-card">
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Lote</th>
                <th>Status</th>
                <th className="num-cell">Itens</th>
                <th className="num-cell">Peso</th>
                <th className="num-cell">Frete</th>
                <th>Criado em</th>
                <th className="actions-col">Ações</th>
              </tr>
            </thead>
            <tbody>
              {lotes.map((lote) => {
                const proximo = STATUS_ENVIO_PROXIMO[lote.status];
                return (
                  <tr key={lote.id}>
                    <td>
                      <div className="item-name">ENV-{String(lote.id).padStart(4, "0")}</div>
                      <div className="item-sub">{lote.itens.map((i) => i.nome).join(", ")}</div>
                    </td>
                    <td>
                      <span className={`pill ${STATUS_ENVIO_PILL_CLASS[lote.status]}`}>
                        <span className="dot" />
                        {STATUS_ENVIO_LABELS[lote.status]}
                      </span>
                    </td>
                    <td className="num-cell">{lote.itens.length}</td>
                    <td className="num-cell">{Number(lote.pesoTotalGramas ?? 0)} g</td>
                    <td className="num-cell">{fmtUSD(Number(lote.freteTotalUSD ?? 0))}</td>
                    <td>{fmtDate(lote.createdAt.toISOString())}</td>
                    <td className="actions-cell">
                      {proximo && (
                        <form action={avancarStatusEnvio}>
                          <input type="hidden" name="id" value={lote.id} />
                          <button type="submit" className="btn-ghost" style={{ fontSize: 11.5, padding: "6px 10px" }}>
                            {STATUS_ENVIO_ACAO_LABEL[proximo]}
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {lotes.length === 0 && (
          <div className="empty-note" style={{ border: "none", borderRadius: 0 }}>
            Nenhum lote gerado ainda — confirme um envio acima para criar o primeiro.
          </div>
        )}
      </div>
    </div>
  );
}
