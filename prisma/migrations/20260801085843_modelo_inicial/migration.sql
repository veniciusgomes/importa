-- CreateTable
CREATE TABLE "Envio" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "codigoRastreio" TEXT,
    "status" TEXT NOT NULL DEFAULT 'AGUARDANDO_ITENS',
    "pesoTotalGramas" DECIMAL,
    "freteTotalUSD" DECIMAL,
    "taxaUscloserUSD" DECIMAL,
    "cotacaoDolarUscloser" DECIMAL,
    "tabelaFreteId" INTEGER,
    "dataEnvioUscloser" DATETIME,
    "dataRecebimentoBrasil" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Envio_tabelaFreteId_fkey" FOREIGN KEY ("tabelaFreteId") REFERENCES "TabelaFreteUscloser" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "envioId" INTEGER,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "origemPlataforma" TEXT,
    "urlAnuncio" TEXT,
    "status" TEXT NOT NULL DEFAULT 'COMPRADO',
    "pesoGramas" DECIMAL NOT NULL,
    "valorCompraUSD" DECIMAL NOT NULL,
    "cotacaoDolarCompra" DECIMAL NOT NULL,
    "dataCompra" DATETIME NOT NULL,
    "margemLucroPercentual" DECIMAL,
    "precoVendaSugerido" DECIMAL,
    "precoVendaReal" DECIMAL,
    "dataVenda" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Item_envioId_fkey" FOREIGN KEY ("envioId") REFERENCES "Envio" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ItemImpostoCalculo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "itemId" INTEGER NOT NULL,
    "regimeConfigId" INTEGER NOT NULL,
    "icmsConfigId" INTEGER NOT NULL,
    "valorAduaneiroUSD" DECIMAL NOT NULL,
    "valorII" DECIMAL NOT NULL,
    "valorICMS" DECIMAL NOT NULL,
    "valorTotalImpostosUSD" DECIMAL NOT NULL,
    "valorImpostoDeclaradoUSD" DECIMAL,
    "calculadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ItemImpostoCalculo_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ItemImpostoCalculo_regimeConfigId_fkey" FOREIGN KEY ("regimeConfigId") REFERENCES "ConfiguracaoRegimeTributario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ItemImpostoCalculo_icmsConfigId_fkey" FOREIGN KEY ("icmsConfigId") REFERENCES "ConfigIcmsEstado" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ConfiguracaoRegimeTributario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "regime" TEXT NOT NULL,
    "aliquotaII" DECIMAL NOT NULL,
    "descontoUSD" DECIMAL NOT NULL,
    "limiteIsencaoUSD" DECIMAL NOT NULL,
    "limiteRegimeUSD" DECIMAL NOT NULL,
    "vigenciaInicio" DATETIME NOT NULL,
    "vigenciaFim" DATETIME
);

-- CreateTable
CREATE TABLE "ConfigIcmsEstado" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uf" TEXT NOT NULL,
    "aliquotaICMS" DECIMAL NOT NULL,
    "vigenciaInicio" DATETIME NOT NULL,
    "vigenciaFim" DATETIME
);

-- CreateTable
CREATE TABLE "TabelaFreteUscloser" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pesoMinGramas" DECIMAL NOT NULL,
    "pesoMaxGramas" DECIMAL NOT NULL,
    "valorUSD" DECIMAL NOT NULL,
    "vigenciaInicio" DATETIME NOT NULL,
    "vigenciaFim" DATETIME
);

-- CreateTable
CREATE TABLE "CredencialUscloser" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuario" TEXT NOT NULL,
    "senhaCriptografada" TEXT NOT NULL,
    "ultimaSincronizacaoEm" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ConfiguracaoSistema" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "regimeSelecionado" TEXT NOT NULL DEFAULT 'PF_RTS',
    "estadoOperacao" TEXT NOT NULL,
    "margemLucroPadrao" DECIMAL
);
