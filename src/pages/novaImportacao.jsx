import React, { useState } from "react";
import { SideBar } from "../components/sidebar";
import Header from "../components/header";

export default function NovaImportacao() {
  const [valorDeclarado, setValorDeclarado] = useState(0);
  const [valorSeguro, setValorSeguro] = useState(0);
  const [valorFrete, setValorFrete] = useState(0);
  const [valorDolar, setValorDolar] = useState(0);
  const [peso, setPeso] = useState(0);
  const [taxasFixas] = useState({ icms: 17, importacao: 60 });
  const [valorImportacao, setImportacao] = useState(0.0);
  const [valorIcms, setIcms] = useState(0.0);
  const [valorTotal, setTotal] = useState(0.0);

  const handleCalcularTaxa = () => {
    var taxaImportacao =
      (valorDeclarado + valorSeguro + valorFrete) *
      valorDolar *
      (taxasFixas.importacao / 100);

    //console.log(taxaImportacao);

    setImportacao(taxaImportacao);

    var taxaIcms =
      (valorDeclarado +
        valorSeguro +
        valorFrete +
        taxaImportacao / (1 - taxasFixas.icms / 100)) *
      (taxasFixas.icms / 100);

    setIcms(taxaIcms);

    //console.log(taxaIcms);

    var valorTotalItem =
      valorDeclarado * valorDolar + taxaImportacao + taxaIcms;

    setTotal(valorTotalItem);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <SideBar />
      <div className="flex-1 flex flex-col">
        <Header texto={"Nova importação"} />
        <main className="p-6 space-y-6 overflow-y-auto">
          <section className="bg-white p-6 rounded shadow-md">
            <h3 className="text-xl font-bold mb-4">
              Calcular Taxa de Importação
            </h3>
            <form className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Valor Declarado (USD)
                </label>
                <input
                  onChange={(e) =>
                    setValorDeclarado(parseFloat(e.target.value))
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
                  Frete (USD)
                </label>
                <input
                  type="number"
                  onChange={(e) => setValorFrete(parseFloat(e.target.value))}
                  className="w-full border rounded px-3 py-2"
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
              {/* <div>
                <label className="block mb-1 text-sm font-medium">
                  Peso (lbs)
                </label>
                <input
                  type="number"
                  onChange={(e) => setPeso(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              </div> */}
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
              <p>Frete: R$ XXX,XX</p>
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
