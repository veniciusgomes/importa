# 📦 importa

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=flat&logo=sqlite&logoColor=white)

Controle de itens comprados no exterior (ex: eBay) para revenda no Brasil — do custo em dólar até o preço de venda sugerido, passando por frete, câmbio e imposto de importação.

## Sobre

Os itens são agrupados por **envio**, consolidado e despachado por uma transportadora terceirizada (USCloser). O sistema acompanha cada item desde a compra até a venda, registrando em cada etapa:

- Valor de compra em USD e a cotação do dólar do dia
- Peso, para ratear frete e taxas do envio proporcionalmente
- Imposto de importação, calculado por um regime tributário parametrizável (troca de regime não exige alterar código)
- Preço de venda sugerido, a partir do custo total + margem de lucro variável por item

## Status

- [x] Estrutura do projeto (Next.js + TypeScript + Tailwind + Prisma/SQLite)
- [x] Modelo de dados inicial ([docs/database.md](docs/database.md))
- [ ] Cadastro de itens e envios
- [ ] Motor de cálculo de imposto (PF/RTS ↔ PJ/DUIMP)
- [ ] Integração com USCloser (scraper de cotação e calculadora de frete)
- [ ] Sugestão de preço de venda

## Modelo de dados

Documentação completa, com a descrição de cada entidade e as decisões de design, em [docs/database.md](docs/database.md).

```mermaid
erDiagram
    ENVIO ||--o{ ITEM : contem
    ITEM ||--o{ ITEM_IMPOSTO_CALCULO : gera
    CONFIG_REGIME_TRIBUTARIO ||--o{ ITEM_IMPOSTO_CALCULO : aplicado_em
    CONFIG_ICMS_ESTADO ||--o{ ITEM_IMPOSTO_CALCULO : aplicado_em
    TABELA_FRETE_USCLOSER ||--o{ ENVIO : tarifa_usada
    CONFIGURACAO_SISTEMA ||--|| CREDENCIAL_USCLOSER : possui

    ENVIO {
        int id PK
        string codigoRastreio
        enum status
        decimal pesoTotalGramas
        decimal freteTotalUSD
        decimal taxaUscloserUSD
        decimal cotacaoDolarUscloser
        int tabelaFreteId FK
        datetime dataEnvioUscloser
        datetime dataRecebimentoBrasil
        datetime createdAt
    }

    ITEM {
        int id PK
        int envioId FK
        string nome
        string origemPlataforma
        enum status
        decimal pesoGramas
        decimal valorCompraUSD
        decimal cotacaoDolarCompra
        datetime dataCompra
        decimal margemLucroPercentual
        decimal precoVendaSugerido
        decimal precoVendaReal
        datetime dataVenda
    }

    ITEM_IMPOSTO_CALCULO {
        int id PK
        int itemId FK
        int regimeConfigId FK
        int icmsConfigId FK
        decimal valorAduaneiroUSD
        decimal valorII
        decimal valorICMS
        decimal valorTotalImpostosUSD
        decimal valorImpostoDeclaradoUSD
        datetime calculadoEm
    }

    CONFIG_REGIME_TRIBUTARIO {
        int id PK
        enum regime
        decimal aliquotaII
        decimal descontoUSD
        decimal limiteIsencaoUSD
        decimal limiteRegimeUSD
        datetime vigenciaInicio
        datetime vigenciaFim
    }

    CONFIG_ICMS_ESTADO {
        int id PK
        string uf
        decimal aliquotaICMS
        datetime vigenciaInicio
        datetime vigenciaFim
    }

    TABELA_FRETE_USCLOSER {
        int id PK
        decimal pesoMinGramas
        decimal pesoMaxGramas
        decimal valorUSD
        datetime vigenciaInicio
        datetime vigenciaFim
    }

    CREDENCIAL_USCLOSER {
        int id PK
        string usuario
        string senhaCriptografada
        datetime ultimaSincronizacaoEm
    }

    CONFIGURACAO_SISTEMA {
        int id PK
        enum regimeSelecionado
        string estadoOperacao
        decimal margemLucroPadrao
    }
```

## Stack

- [Next.js](https://nextjs.org) (App Router) + [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Prisma](https://www.prisma.io) + SQLite

## Rodando localmente

```bash
npm install
npx prisma migrate dev
npm run dev
```

Abre em [http://localhost:3000](http://localhost:3000).

## Documentação

- [docs/database.md](docs/database.md) — modelo de dados, diagrama ER e decisões de design
