import React, { useState, useEffect } from "react"; // Importe o useEffect
import { SideBar } from "../components/sidebar";
import Header from "../components/header";

export default function Calculadoras() {
  // --- ESTADO DOS INPUTS ---
  const [valorItem, setValorItem] = useState(0);
  const [valorItemDeclarado, setValorItemDeclarado] = useState(0);
  const [valorSeguro, setValorSeguro] = useState(0);
  const [valorFreteDeclarado, setValorFreteDeclarado] = useState(0);

  // AJUSTE: O valor inicial virá do config
  const [valorPorLibra, setValorPorLibra] = useState(0);
  const [valorDolar, setValorDolar] = useState(0);
  const [peso, setPeso] = useState(0);

  // AJUSTE: O valor inicial virá do config
  const [taxasFixas, setTaxasFixas] = useState({ icms: 0, importacao: 0 });
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    const loadConfig = async () => {
      const config = await window.electronAPI.getConfig();
      setTaxasFixas({
        icms: config.taxa_icms,
        importacao: config.taxa_importacao,
      });
      setValorPorLibra(config.default_valor_por_libra);
    };
    loadConfig();
  }, []); // [] = Executa apenas uma vez, quando o componente montar

  const handleCalcularTaxa = () => {
    // AJUSTE 3: Validação de inputs básicos
    if (valorDolar <= 0 || valorItem <= 0 || peso <= 0) {
      alert("Preencha Dólar, Valor do Item e Peso para calcular.");
      setResultado(null);
      return;
    }

    // AJUSTE 4: Fazemos TODOS os cálculos com variáveis locais.
    // Não usamos mais setValorFrete, setImportacao, etc.
    const freteUSD = peso * valorPorLibra;
    const freteBRL = freteUSD * valorDolar;

    const aduaneiroUSD = valorItemDeclarado + valorSeguro + valorFreteDeclarado;
    const aduaneiroBRL = aduaneiroUSD * valorDolar;

    const importacaoBRL = aduaneiroUSD * (taxasFixas.importacao / 100) * valorDolar;

    const baseCalculo = aduaneiroBRL + importacaoBRL;

    const aliquotaDecimal = taxasFixas.icms / 100;
    const icmsBRL = (baseCalculo / (1 - aliquotaDecimal)) * aliquotaDecimal;

    const totalBRL =
      (valorItem * valorDolar) + importacaoBRL + icmsBRL + freteBRL;

    // AJUSTE 5: Salvamos o objeto de resultado completo no estado
    setResultado({
      freteBRL,
      aduaneiroBRL,
      importacaoBRL,
      icmsBRL,
      totalBRL,
    });
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
                  // AJUSTE 6: Usamos || 0 para evitar NaN se o campo for apagado
                  onChange={(e) => setValorItem(parseFloat(e.target.value) || 0)}
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
                    setValorItemDeclarado(parseFloat(e.target.value) || 0)
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
                  onChange={(e) => setValorSeguro(parseFloat(e.target.value) || 0)}
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
                    setValorFreteDeclarado(parseFloat(e.target.value) || 0)
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Valor do Dólar (BRL)
                </label>
                <input
                  type="number"
                  onChange={(e) => setValorDolar(parseFloat(e.target.value) || 0)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Peso do Item (lbs)
                </label>
                <input
                  type="number"
                  // AJUSTE 9: Adicionado parseFloat que faltava
                  onChange={(e) => setPeso(parseFloat(e.target.value) || 0)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="col-span-2">
                <button
                  type="button"
                  className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                  onClick={handleCalcularTaxa} // Removido (x) => desnecessário
                >
                  Calcular
                </button>
              </div>
            </form>

            {/* AJUSTE 10: O resultado só é exibido se o objeto 'resultado' existir */}
            {resultado && (
              <div className="mt-4 text-sm text-gray-700">
                <p>Simulação leva em conta o Packet Standard® da USCloser que possui uma media de {valorPorLibra}/lb</p>
                <p>Alíquota de Importação: {taxasFixas.importacao}%</p>
                <p>Alíquota de ICMS: {taxasFixas.icms}%</p>
                <p>Valor aduaneiro: R$ {resultado.aduaneiroBRL.toFixed(2)}</p>
                <p>Frete: R$ {resultado.freteBRL.toFixed(2)}</p>
                <p>Imposto de Importação: R$ {resultado.importacaoBRL.toFixed(2)}</p>
                <p>ICMS: R$ {resultado.icmsBRL.toFixed(2)}</p>
                <p className="font-semibold mt-2">
                  Total Estimado: R$ {resultado.totalBRL.toFixed(2)}
                </p>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}