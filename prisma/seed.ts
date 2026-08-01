import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

// Data da MP 1.357/2026 e Portaria MF 1.342/2026, que alteraram as regras
// do Programa Remessa Conforme (ver docs/database.md) — usada como início
// de vigência dos parâmetros pesquisados.
const VIGENCIA_INICIO = new Date("2026-05-12");

async function main() {
  const regimeCount = await prisma.configuracaoRegimeTributario.count();
  if (regimeCount === 0) {
    await prisma.configuracaoRegimeTributario.create({
      data: {
        regime: "PF_RTS",
        aliquotaII: 60,
        descontoUSD: 30,
        limiteIsencaoUSD: 50,
        limiteRegimeUSD: 3000,
        vigenciaInicio: VIGENCIA_INICIO,
      },
    });
  }

  const icmsCount = await prisma.configIcmsEstado.count();
  if (icmsCount === 0) {
    await prisma.configIcmsEstado.create({
      data: {
        uf: "SP",
        aliquotaICMS: 19,
        vigenciaInicio: VIGENCIA_INICIO,
      },
    });
  }

  const freteCount = await prisma.tabelaFreteUscloser.count();
  if (freteCount === 0) {
    await prisma.tabelaFreteUscloser.createMany({
      data: [
        { pesoMinGramas: 0, pesoMaxGramas: 500, valorUSD: 18, vigenciaInicio: VIGENCIA_INICIO },
        { pesoMinGramas: 501, pesoMaxGramas: 1000, valorUSD: 27, vigenciaInicio: VIGENCIA_INICIO },
        { pesoMinGramas: 1001, pesoMaxGramas: 2000, valorUSD: 38, vigenciaInicio: VIGENCIA_INICIO },
        { pesoMinGramas: 2001, pesoMaxGramas: 3000, valorUSD: 52, vigenciaInicio: VIGENCIA_INICIO },
      ],
    });
  }

  const sistemaCount = await prisma.configuracaoSistema.count();
  if (sistemaCount === 0) {
    await prisma.configuracaoSistema.create({
      data: {
        regimeSelecionado: "PF_RTS",
        estadoOperacao: "SP",
        margemLucroPadrao: 35,
      },
    });
  }

  console.log("Seed concluído.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
