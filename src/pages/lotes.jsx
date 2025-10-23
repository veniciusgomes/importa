import React, { useEffect, useState } from "react";
import { SideBar } from "../components/sidebar";
import Header from "../components/header";

export default function Lotes() {
  const [itensEstoque, setItensEstoque] = useState([]);
  const [itensSelecionados, setItensSelecionados] = useState([]);
  const [valorDolar, setValorDolar] = useState(0);
  const [dataLote, setDataLote] = useState("");
  const [valorCaixaUSCLOSER, setValorCaixaUSCLOSER] = useState(0);
  const [pesoCaixaUSCLOSER, setPesoCaixaUSCLOSER] = useState(0);
  const [lotes, setLotes] = useState([]);
  const [freteDeclarado, setFreteDeclarado] = useState(0);
  const [seguro, setSeguro] = useState(0);
  const [taxasFixas] = useState({ icms: 20, importacao: 60 });
  const [valorFrete, setValorFrete] = useState(0);
  const [importacao, setImportacao] = useState(0);
  const [icms, setIcms] = useState(0);

  useEffect(() => {
    loadEstoque();
    loadLotes();
  }, []);

  const loadEstoque = async () => {
    const dados = await window.electronAPI.getItems();
    const formatado = dados.map((i) => ({
      id: i.id,
      nome: i.nome_item,
      valorCompra: i.valor_compra,
      valorDeclarado: i.valor_declarado,
      peso: i.peso,
      quantidade: i.quantidade,
      dataCompra: i.data_compra,
      taxas: i.taxas,
      valorDolar: i.valor_dolar,
    }));
    setItensEstoque(formatado);
  };

  const loadLotes = async () => {
    const dados = await window.electronAPI.getLotesComItens();
    const agrupado = dados.reduce((acc, row) => {
      if (!acc[row.lote_id]) {
        acc[row.lote_id] = {
          id: row.lote_id,
          data: row.data_criacao,
          dolar: row.valor_dolar,
          valorCaixa: row.valor_caixa_uscloser,
          pesoCaixa: row.peso_caixa_uscloser,
          freteDeclarado: row.frete_declarado,
          seguro: row.seguro,
          freteLote: row.frete_lote,
          valorImportacao: row.valor_importacao,
          valorICMS: row.valor_icms,
          itens: [],
        };
      }
      acc[row.lote_id].itens.push({
        id: row.item_id,
        nome: row.nome_item,
        peso: row.peso,
        quantidade: row.quantidade,
        valorCompra: row.valor_compra,
        valorDeclarado: row.valor_declarado,
      });
      return acc;
    }, {});
    setLotes(Object.values(agrupado));
  };

  console.log("lotes:", lotes);

  const toggleSelecionado = (item) => {
    if (itensSelecionados.some((i) => i.id === item.id)) {
      setItensSelecionados(itensSelecionados.filter((i) => i.id !== item.id));
    } else {
      setItensSelecionados([...itensSelecionados, item]);
    }
  };

  const pesoTotal = itensSelecionados.reduce(
    (total, item) => total + parseFloat(item.peso * item.quantidade),
    0
  );

  const valorTotalDeclarado = itensSelecionados.reduce(
    (total, item) => total + parseFloat(item.valorDeclarado * item.quantidade),
    0
  );

  const excluirLote = async (id) => {
    await window.electronAPI.excluirLote(id);
    loadEstoque();
    loadLotes();
  };

  const salvarLote = async () => {
    if (!dataLote || !valorDolar || itensSelecionados.length === 0) return;

    var frete = (pesoTotal * valorCaixaUSCLOSER) / pesoCaixaUSCLOSER;
    setValorFrete(frete * valorDolar);

    var taxaImportacao =
      (valorTotalDeclarado + seguro + freteDeclarado) *
      valorDolar *
      (taxasFixas.importacao / 100);

    setImportacao(taxaImportacao);

    var valorAduaneiro =
      (valorTotalDeclarado + seguro + freteDeclarado) * valorDolar;

    var baseCalculo = valorAduaneiro + taxaImportacao;

    const aliquotaDecimal = taxasFixas.icms / 100;

    const icms = (baseCalculo / (1 - aliquotaDecimal)) * aliquotaDecimal;

    setIcms(icms);

    const lote = {
      data_criacao: dataLote,
      valor_dolar: valorDolar,
      valor_caixa_uscloser: valorCaixaUSCLOSER,
      peso_caixa_uscloser: pesoCaixaUSCLOSER,
      frete_declarado: freteDeclarado,
      seguro: seguro,
      frete_lote: frete * valorDolar,
      valor_importacao: taxaImportacao,
      valor_icms: icms,
    };

    await window.electronAPI.salvarLote(lote, itensSelecionados);
    setDataLote("");
    setValorDolar(0);
    setValorCaixaUSCLOSER(0);
    setPesoCaixaUSCLOSER(0);
    setFreteDeclarado(0);
    setSeguro(0);
    setItensSelecionados([]);
    loadEstoque();
    loadLotes();
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <SideBar />
      <div className="flex-1 flex flex-col">
        <Header texto="Criar Lote" />
        <main className="p-6 space-y-6 overflow-y-auto">
          <section className="bg-white p-6 rounded shadow-md">
            <h3 className="text-xl font-bold mb-4">Dados do Lote</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Data de Criação
                </label>
                <input
                  type="date"
                  className="w-full border rounded px-3 py-2"
                  value={dataLote}
                  onChange={(e) => setDataLote(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Valor do Dólar
                </label>
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2"
                  value={valorDolar}
                  onChange={(e) => setValorDolar(parseFloat(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Valor da Caixa USCLOSER (USD)
                </label>
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2"
                  value={valorCaixaUSCLOSER}
                  onChange={(e) =>
                    setValorCaixaUSCLOSER(parseFloat(e.target.value))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Peso da Caixa USCLOSER (lbs)
                </label>
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2"
                  value={pesoCaixaUSCLOSER}
                  onChange={(e) =>
                    setPesoCaixaUSCLOSER(parseFloat(e.target.value))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Frete a Declarar (USD)
                </label>
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2"
                  value={freteDeclarado}
                  onChange={(e) =>
                    setFreteDeclarado(parseFloat(e.target.value))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Seguro (USD)
                </label>
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2"
                  value={seguro}
                  onChange={(e) => setSeguro(parseFloat(e.target.value))}
                />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Peso Total Itens:{" "}
              <span className="font-bold">{pesoTotal.toFixed(2)} lbs</span>
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Valor Declarado Total Itens:{" "}
              <span className="font-bold">
                {valorTotalDeclarado.toFixed(2)} USD
              </span>
            </p>

            <h3 className="text-xl font-bold mb-4">
              Selecionar Itens do Estoque
            </h3>
            <table className="w-full table-auto text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray-100">
                  <th className="p-2">Selecionar</th>
                  <th className="p-2">Nome</th>
                  <th className="p-2">Peso</th>
                  <th className="p-2">Quantidade</th>
                  <th className="p-2">Data</th>
                </tr>
              </thead>
              <tbody>
                {itensEstoque.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="p-2">
                      <input
                        type="checkbox"
                        checked={itensSelecionados.some(
                          (i) => i.id === item.id
                        )}
                        onChange={() => toggleSelecionado(item)}
                      />
                    </td>
                    <td className="p-2">{item.nome}</td>
                    <td className="p-2">{item.peso} lbs</td>
                    <td className="p-2">{item.quantidade}</td>
                    <td className="p-2">{item.dataCompra}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 text-right">
              <button
                onClick={salvarLote}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Criar Lote
              </button>
            </div>
          </section>

          <section className="bg-white p-6 rounded shadow-md">
            <h3 className="text-xl font-bold mb-4">Lotes Criados</h3>
            {lotes.map((lote) => (
              <div key={lote.id} className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-lg">
                    Lote #{lote.id} - {lote.data}
                  </h4>
                  <button
                    onClick={() => excluirLote(lote.id)}
                    className="text-red-600 hover:underline"
                  >
                    Excluir
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-blue-100 p-4 rounded shadow text-center">
                    <p className="text-sm text-gray-700">Valor do Dólar</p>
                    <p className="text-xl font-bold text-blue-800">
                      R$ {lote.dolar}
                    </p>
                  </div>
                  <div className="bg-yellow-100 p-4 rounded shadow text-center">
                    <p className="text-sm text-gray-700">
                      Alíquota de Importação
                    </p>
                    <p className="text-xl font-bold text-yellow-800">
                      {taxasFixas.importacao}%
                    </p>
                  </div>
                  <div className="bg-purple-100 p-4 rounded shadow text-center">
                    <p className="text-sm text-gray-700">Alíquota de ICMS</p>
                    <p className="text-xl font-bold text-purple-800">
                      {taxasFixas.icms}%
                    </p>
                  </div>
                  <div className="bg-green-100 p-4 rounded shadow text-center">
                    <p className="text-sm text-gray-700">Frete (R$)</p>
                    <p className="text-xl font-bold text-green-800">
                      R$ {lote.freteLote.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-red-100 p-4 rounded shadow text-center">
                    <p className="text-sm text-gray-700">Importação (R$)</p>
                    <p className="text-xl font-bold text-red-800">
                      R$ {lote.valorImportacao.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-indigo-100 p-4 rounded shadow text-center">
                    <p className="text-sm text-gray-700">ICMS (R$)</p>
                    <p className="text-xl font-bold text-indigo-800">
                      R$ {lote.valorICMS.toFixed(2)}
                    </p>
                  </div>
                </div>
                <table className="w-full table-auto text-left border-collapse">
                  <thead>
                    <tr className="border-b bg-gray-100">
                      <th className="p-2">Nome</th>
                      <th className="p-2">Peso</th>
                      <th className="p-2">Quantidade</th>
                      <th className="p-2">Valor Compra</th>
                      <th className="p-2">Custo do item</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lote.itens.map((item) => {
                      var valorTotalDeclaradoAux = lote.itens.reduce(
                        (total, item) =>
                          total + parseFloat(item.valorDeclarado),
                        0
                      );

                      var valorFrete =
                        (item.peso * lote.valorCaixa) / lote.pesoCaixa;

                      var impostoProporcional =
                        (lote.valorImportacao * item.valorDeclarado) /
                        valorTotalDeclaradoAux;

                      var icmsProporcional =
                        (lote.valorICMS * item.valorDeclarado) /
                        valorTotalDeclaradoAux;

                      var custoItem =
                        (item.valorCompra * lote.dolar +
                          impostoProporcional +
                          icmsProporcional +
                          valorFrete * lote.dolar) *
                        item.quantidade;
                      return (
                        <tr key={item.id} className="border-b">
                          <td className="p-2">{item.nome}</td>
                          <td className="p-2">{item.peso} lbs</td>
                          <td className="p-2">{item.quantidade}</td>
                          <td className="p-2">${item.valorCompra}</td>
                          <td className="p-2">
                            R$
                            {custoItem.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ))}
          </section>
        </main>
      </div>
    </div>
  );
}
