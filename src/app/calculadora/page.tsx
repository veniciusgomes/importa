import { prisma } from "@/lib/prisma";
import { getFreteTiersAtivos } from "@/lib/tarifas.server";
import { CalculadoraForm } from "./CalculadoraForm";

export const dynamic = "force-dynamic";

export default async function CalculadoraPage() {
  const [regimeConfig, sistema, tiers] = await Promise.all([
    prisma.configuracaoRegimeTributario.findFirst({
      where: { regime: "PF_RTS", vigenciaFim: null },
      orderBy: { vigenciaInicio: "desc" },
    }),
    prisma.configuracaoSistema.findFirst(),
    getFreteTiersAtivos(),
  ]);

  const icmsConfig = await prisma.configIcmsEstado.findFirst({
    where: { uf: sistema?.estadoOperacao ?? "SP", vigenciaFim: null },
    orderBy: { vigenciaInicio: "desc" },
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Calculadora rápida</h1>
          <div className="sub">Simule o custo e o preço sugerido de um item antes de comprar</div>
        </div>
      </div>

      <CalculadoraForm
        tiers={tiers}
        regimeParams={{
          aliquotaII: Number(regimeConfig?.aliquotaII ?? 60),
          descontoUSD: Number(regimeConfig?.descontoUSD ?? 30),
          limiteIsencaoUSD: Number(regimeConfig?.limiteIsencaoUSD ?? 50),
          aliquotaICMS: Number(icmsConfig?.aliquotaICMS ?? 19),
        }}
        margemPadrao={Number(sistema?.margemLucroPadrao ?? 35)}
      />
    </div>
  );
}
