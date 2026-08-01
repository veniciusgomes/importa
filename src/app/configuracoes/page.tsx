import { prisma } from "@/lib/prisma";
import {
  setRegimeSelecionado,
  updateRegimeConfig,
  setEstadoOperacao,
  updateIcmsConfig,
  addFreteTier,
  updateFreteTier,
  deleteFreteTier,
  saveCredencial,
  updateMargemPadrao,
} from "./actions";

export const dynamic = "force-dynamic";

const ESTADOS = [
  { uf: "SP", nome: "São Paulo" },
  { uf: "RJ", nome: "Rio de Janeiro" },
  { uf: "MG", nome: "Minas Gerais" },
  { uf: "PR", nome: "Paraná" },
  { uf: "SC", nome: "Santa Catarina" },
  { uf: "RS", nome: "Rio Grande do Sul" },
];

async function getConfiguracaoSistema() {
  const existing = await prisma.configuracaoSistema.findFirst();
  if (existing) return existing;
  return prisma.configuracaoSistema.create({
    data: { regimeSelecionado: "PF_RTS", estadoOperacao: "SP" },
  });
}

export default async function ConfiguracoesPage() {
  const sistema = await getConfiguracaoSistema();

  const [regimeConfig, icmsConfig, freteTiers, credencial] = await Promise.all([
    prisma.configuracaoRegimeTributario.findFirst({
      where: { regime: "PF_RTS", vigenciaFim: null },
      orderBy: { vigenciaInicio: "desc" },
    }),
    prisma.configIcmsEstado.findFirst({
      where: { uf: sistema.estadoOperacao, vigenciaFim: null },
      orderBy: { vigenciaInicio: "desc" },
    }),
    prisma.tabelaFreteUscloser.findMany({
      where: { vigenciaFim: null },
      orderBy: { pesoMaxGramas: "asc" },
    }),
    prisma.credencialUscloser.findFirst(),
  ]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Configurações</h1>
          <div className="sub">Regime tributário, tabela de frete e credencial da USCloser</div>
        </div>
      </div>

      <div className="config-stack">
        {/* Regime tributário */}
        <div className="card">
          <div className="config-card-title">Regime tributário</div>
          <div className="chart-note" style={{ marginBottom: 12 }}>
            Muda como o imposto é calculado em todos os itens — sem alterar código.
          </div>

          <div className="segmented">
            <form action={setRegimeSelecionado}>
              <input type="hidden" name="regime" value="PF_RTS" />
              <button
                type="submit"
                className={`segmented-opt ${sistema.regimeSelecionado === "PF_RTS" ? "active" : ""}`}
              >
                Pessoa física (RTS)
              </button>
            </form>
            <form action={setRegimeSelecionado}>
              <input type="hidden" name="regime" value="PJ_DUIMP" />
              <button
                type="submit"
                className={`segmented-opt ${sistema.regimeSelecionado === "PJ_DUIMP" ? "active" : ""}`}
              >
                Pessoa jurídica (DUIMP)
              </button>
            </form>
          </div>

          {sistema.regimeSelecionado === "PF_RTS" ? (
            <form action={updateRegimeConfig}>
              <div className="two-col" style={{ marginTop: 16 }}>
                <div className="field">
                  <label>Alíquota do II</label>
                  <input
                    type="number"
                    name="aliquotaII"
                    step="1"
                    defaultValue={regimeConfig?.aliquotaII.toString() ?? "60"}
                  />
                  <div className="field-hint">% sobre o valor aduaneiro, acima do limite de isenção</div>
                </div>
                <div className="field">
                  <label>Desconto por remessa</label>
                  <input
                    type="number"
                    name="descontoUSD"
                    step="1"
                    defaultValue={regimeConfig?.descontoUSD.toString() ?? "30"}
                  />
                  <div className="field-hint">USD, só para sites do Remessa Conforme</div>
                </div>
              </div>
              <div className="two-col">
                <div className="field">
                  <label>Limite de isenção</label>
                  <input
                    type="number"
                    name="limiteIsencaoUSD"
                    step="1"
                    defaultValue={regimeConfig?.limiteIsencaoUSD.toString() ?? "50"}
                  />
                  <div className="field-hint">USD — abaixo disso, II = 0</div>
                </div>
                <div className="field">
                  <label>Teto do regime simplificado</label>
                  <input
                    type="number"
                    name="limiteRegimeUSD"
                    step="1"
                    defaultValue={regimeConfig?.limiteRegimeUSD.toString() ?? "3000"}
                  />
                  <div className="field-hint">USD — acima disso, despacho por NCM</div>
                </div>
              </div>
              <button type="submit" className="btn-primary">
                Salvar parâmetros
              </button>
            </form>
          ) : (
            <div className="empty-note inline" style={{ marginTop: 16 }}>
              <strong>Depende do NCM de cada produto</strong>
              No regime PJ/DUIMP o imposto não usa uma alíquota única — cada produto tem sua
              própria alíquota de II conforme a classificação fiscal (NCM), além de IPI,
              PIS/COFINS e créditos possíveis de ICMS. Essa tabela de NCM ainda precisa ser
              desenhada quando/se você migrar de regime.
            </div>
          )}

          <div className="field-hint" style={{ marginTop: 10 }}>
            Alterar um valor cria uma nova vigência a partir de hoje — cálculos já feitos
            continuam guardados com os parâmetros usados na época (compliance).
          </div>
        </div>

        {/* ICMS por estado */}
        <div className="card">
          <div className="config-card-title">ICMS por estado</div>
          <div className="two-col">
            <form action={setEstadoOperacao} className="field">
              <label htmlFor="uf">Estado de operação (UF)</label>
              <select id="uf" name="uf" defaultValue={sistema.estadoOperacao}>
                {ESTADOS.map((e) => (
                  <option key={e.uf} value={e.uf}>
                    {e.nome} ({e.uf})
                  </option>
                ))}
              </select>
              <button type="submit" className="btn-ghost" style={{ marginTop: 8 }}>
                Definir estado de operação
              </button>
            </form>

            <form action={updateIcmsConfig} className="field">
              <input type="hidden" name="uf" value={sistema.estadoOperacao} />
              <label htmlFor="aliquotaICMS">Alíquota de ICMS ({sistema.estadoOperacao})</label>
              <input
                id="aliquotaICMS"
                type="number"
                name="aliquotaICMS"
                step="0.1"
                defaultValue={icmsConfig?.aliquotaICMS.toString() ?? "19"}
              />
              <button type="submit" className="btn-primary" style={{ marginTop: 8 }}>
                Salvar alíquota
              </button>
            </form>
          </div>
          <div className="field-hint">
            Usada como padrão nos cálculos — varia por estado e muda com a legislação.
          </div>
        </div>

        {/* Tabela de frete */}
        <div className="card">
          <div className="config-card-title">Tabela de frete — USCloser (Packet Standard®)</div>
          <div className="chart-note" style={{ marginBottom: 10 }}>
            Espelha a calculadora de frete do site — atualize quando a USCloser reajustar valores.
          </div>
          <table className="data-table frete-table">
            <thead>
              <tr>
                <th>Até (gramas)</th>
                <th className="num">Valor (USD)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {freteTiers.map((tier) => (
                <tr key={tier.id}>
                  <td>
                    <form id={`frete-${tier.id}`} action={updateFreteTier}>
                      <input type="hidden" name="id" value={tier.id} />
                    </form>
                    <input
                      type="number"
                      name="pesoMaxGramas"
                      form={`frete-${tier.id}`}
                      defaultValue={tier.pesoMaxGramas.toString()}
                    />
                  </td>
                  <td className="num">
                    <input
                      type="number"
                      step="0.01"
                      name="valorUSD"
                      form={`frete-${tier.id}`}
                      defaultValue={tier.valorUSD.toString()}
                    />
                  </td>
                  <td className="actions-cell">
                    <button type="submit" form={`frete-${tier.id}`} className="icon-btn" aria-label="Salvar faixa">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </button>
                    <form action={deleteFreteTier}>
                      <input type="hidden" name="id" value={tier.id} />
                      <button type="submit" className="icon-btn danger" aria-label="Remover faixa">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <form action={addFreteTier}>
            <button type="submit" className="btn-ghost" style={{ marginTop: 10 }}>
              + Adicionar faixa
            </button>
          </form>
        </div>

        {/* Credencial USCloser */}
        <div className="card">
          <div className="config-card-title">Credencial USCloser</div>
          <div className="chart-note" style={{ marginBottom: 10 }}>
            Usada pelo robô que consulta a cotação e o frete na área logada. A senha fica
            sempre criptografada.
          </div>
          <form action={saveCredencial}>
            <div className="two-col">
              <div className="field">
                <label htmlFor="usuario">Usuário</label>
                <input
                  id="usuario"
                  type="text"
                  name="usuario"
                  placeholder="seu login na USCloser"
                  defaultValue={credencial?.usuario ?? ""}
                />
              </div>
              <div className="field">
                <label htmlFor="senha">Senha</label>
                <input id="senha" type="password" name="senha" placeholder="••••••••" />
              </div>
            </div>
            <div className="field-hint" style={{ marginBottom: 12 }}>
              Última sincronização:{" "}
              {credencial?.ultimaSincronizacaoEm
                ? credencial.ultimaSincronizacaoEm.toLocaleString("pt-BR")
                : "nunca sincronizado"}
            </div>
            <button type="submit" className="btn-primary">
              Salvar credencial
            </button>
          </form>
        </div>

        {/* Preferências gerais */}
        <div className="card">
          <div className="config-card-title">Preferências gerais</div>
          <form action={updateMargemPadrao}>
            <div className="field" style={{ maxWidth: 260 }}>
              <label htmlFor="margemLucroPadrao">Margem de lucro padrão</label>
              <input
                id="margemLucroPadrao"
                type="number"
                name="margemLucroPadrao"
                step="1"
                defaultValue={sistema.margemLucroPadrao?.toString() ?? "35"}
              />
              <div className="field-hint">
                Sugerida ao cadastrar um item novo — pode ser ajustada por item.
              </div>
            </div>
            <button type="submit" className="btn-primary">
              Salvar margem padrão
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
