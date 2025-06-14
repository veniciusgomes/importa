import React, { useState } from "react";
import { SideBar } from "../components/sidebar";
import Header from "../components/header";

export default function Calculadoras() {
  const [valorItemDeclarado, setValorItemDeclarado] = useState(0);
  const [valorItem, setValorItem] = useState(0);

  const [valorFrete, setValorFrete] = useState(0);
  const [valorFreteDeclarado, setValorFreteDeclarado] = useState(0);

  const [valorSeguro, setValorSeguro] = useState(0);
  const [peso, setPeso] = useState(0);
  const [taxasFixas] = useState({ icms: 17, importacao: 60 });
  const [valorImportacao, setImportacao] = useState(0.0);
  const [valorIcms, setIcms] = useState(0.0);
  const [valorTotal, setTotal] = useState(0.0);
  const [valorDolar, setValorDolar] = useState(0);
  const [valorCaixa, setValorCaixa] = useState(0);
  const [resultado, setResultado] = useState(null);
  const [pesoCaixa, setPesoCaixa] = useState(0);
  const [quantidadeItensDeclarados, setQuantidadeItensDeclarados] = useState(0);

  const handleCalcularTaxa = () => {
    var frete = (peso * valorCaixa) / pesoCaixa;
    setValorFrete(frete * valorDolar);
    var taxaImportacao =
      (valorItemDeclarado + valorSeguro + valorFreteDeclarado) *
      valorDolar *
      (taxasFixas.importacao / 100);
    setImportacao(taxaImportacao);
    var taxaIcms =
      (valorItemDeclarado +
        valorSeguro +
        valorFreteDeclarado +
        taxaImportacao / (1 - taxasFixas.icms / 100)) *
      (taxasFixas.icms / 100);
    setIcms(taxaIcms);
    var valorTotalItem =
      valorItem * valorDolar + taxaImportacao + taxaIcms + frete;
    setTotal(valorTotalItem);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <SideBar />
      <div className="flex-1 flex flex-col">
        <Header texto={"Calculadoras"} />
        <main className="p-6 space-y-6 overflow-y-auto">
          <section className="bg-white p-6 rounded shadow-md">
            <h3 className="text-xl font-bold mb-4">
              Calculadora do Valor de Importação
            </h3>
            <form className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Valor Item (USD)
                </label>
                <input
                  onChange={(e) => setValorItem(parseFloat(e.target.value))}
                  type="number"
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Valor Declarado (USD)
                </label>
                <input
                  onChange={(e) =>
                    setValorItemDeclarado(parseFloat(e.target.value))
                  }
                  type="number"
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Seguro (USD)
                </label>
                <input
                  type="number"
                  onChange={(e) => setValorSeguro(parseFloat(e.target.value))}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Frete Declarado (USD)
                </label>
                <input
                  type="number"
                  onChange={(e) =>
                    setValorFreteDeclarado(parseFloat(e.target.value))
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Quantidade de itens Declarados
                </label>
                <input
                  type="number"
                  onChange={(e) =>
                    setQuantidadeItensDeclarados(parseFloat(e.target.value))
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Valor da Caixa USCLOSER (USD)
                </label>
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2"
                  value={valorCaixa}
                  onChange={(e) => setValorCaixa(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Peso da Caixa USCLOSER (lbs)
                </label>
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2"
                  value={pesoCaixa}
                  onChange={(e) => setPesoCaixa(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Valor do Dólar (BRL)
                </label>
                <input
                  type="number"
                  onChange={(e) => setValorDolar(parseFloat(e.target.value))}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Peso do Item (lbs)
                </label>
                <input
                  type="number"
                  onChange={(e) => setPeso(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="col-span-2">
                <button
                  type="button"
                  className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                  onClick={(x) => handleCalcularTaxa()}
                >
                  Calcular
                </button>
              </div>
            </form>
            <div className="mt-4 text-sm text-gray-700">
              <p>Alíquota de Importação: {taxasFixas.importacao}%</p>
              <p>Alíquota de ICMS: {taxasFixas.icms}%</p>
              <p>Frete: R$ {valorFrete.toFixed(2)}</p>
              <p>Imposto de Importação: R$ {valorImportacao.toFixed(2)}</p>
              <p>ICMS: R$ {valorIcms.toFixed(2)}</p>
              <p className="font-semibold mt-2">
                Total Estimado: R$ {valorTotal.toFixed(2)}
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
