import React, { useState } from "react";
import { SideBar } from "../components/sidebar";
import Header from "../components/header";

const estoqueExemplo = [
  { id: 1, nome: "Item A", peso: 2, valorCompra: 100 },
  { id: 2, nome: "Item B", peso: 3.5, valorCompra: 150 },
  { id: 3, nome: "Item C", peso: 1.2, valorCompra: 75 },
];

export default function Lotes() {
  const [itensSelecionados, setItensSelecionados] = useState([]);
  const [valorDolar, setValorDolar] = useState("");
  const [dataLote, setDataLote] = useState("");
  const [lotes, setLotes] = useState([]);

  function toggleSelecionarItem(item) {
    if (itensSelecionados.some((i) => i.id === item.id)) {
      setItensSelecionados(itensSelecionados.filter((i) => i.id !== item.id));
    } else {
      setItensSelecionados([...itensSelecionados, item]);
    }
  }

  const pesoTotal = itensSelecionados.reduce(
    (total, item) => total + item.peso,
    0
  );

  function salvarLote() {
    const novoLote = {
      id: Date.now(),
      data: dataLote,
      valorDolar,
      pesoTotal,
      itens: itensSelecionados,
    };
    setLotes([...lotes, novoLote]);
    setItensSelecionados([]);
    setDataLote("");
    setValorDolar("");
  }

  function excluirLote(id) {
    setLotes(lotes.filter((lote) => lote.id !== id));
  }
  return (
    <div className="flex h-screen bg-gray-100">
      <SideBar />
      <div className="flex-1 flex flex-col">
        <Header texto={"Lotes"} />
        <main className="p-6 space-y-6 overflow-y-auto">
          <section className="bg-white p-6 rounded shadow-md">
            <h3 className="text-2xl font-bold mb-4">Criar Novo Lote</h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Valor do Dólar
                </label>
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2"
                  value={valorDolar}
                  onChange={(e) => setValorDolar(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Data do Lote
                </label>
                <input
                  type="date"
                  className="w-full border rounded px-3 py-2"
                  value={dataLote}
                  onChange={(e) => setDataLote(e.target.value)}
                />
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-2">
                Selecionar Itens do Estoque
              </h4>
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="border-b bg-gray-100">
                    <th className="p-2">Selecionar</th>
                    <th className="p-2">Nome</th>
                    <th className="p-2">Peso (lbs)</th>
                    <th className="p-2">Valor Compra</th>
                  </tr>
                </thead>
                <tbody>
                  {estoqueExemplo.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="p-2">
                        <input
                          type="checkbox"
                          checked={itensSelecionados.some(
                            (i) => i.id === item.id
                          )}
                          onChange={() => toggleSelecionarItem(item)}
                        />
                      </td>
                      <td className="p-2">{item.nome}</td>
                      <td className="p-2">{item.peso}</td>
                      <td className="p-2">${item.valorCompra}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 text-lg">
              Peso Total do Lote:{" "}
              <span className="font-semibold">{pesoTotal.toFixed(2)} lbs</span>
            </div>

            <button
              onClick={salvarLote}
              className="mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Salvar Lote
            </button>
          </section>
          <section className="bg-white p-6 rounded shadow-md">
            <h3 className="text-2xl font-bold mb-4">Lotes Criados</h3>
            <table className="w-full table-auto border-collapse text-left">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="p-2">Data</th>
                  <th className="p-2">Valor Dólar</th>
                  <th className="p-2">Peso Total</th>
                  <th className="p-2">Qtd. Itens</th>
                  <th className="p-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {lotes.map((lote) => (
                  <tr key={lote.id} className="border-b">
                    <td className="p-2">{lote.data}</td>
                    <td className="p-2">{lote.valorDolar}</td>
                    <td className="p-2">{lote.pesoTotal.toFixed(2)} lbs</td>
                    <td className="p-2">{lote.itens.length}</td>
                    <td className="p-2">
                      <button
                        onClick={() => excluirLote(lote.id)}
                        className="text-red-600 hover:underline mr-2"
                      >
                        Excluir
                      </button>
                      <button className="text-blue-600 hover:underline">
                        Detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </main>
      </div>
    </div>
  );
}
