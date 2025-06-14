import React, { useState } from "react";
import { SideBar } from "../components/sidebar";
import Header from "../components/header";

export default function Estoque() {
  const [items, setItems] = useState([]);
  const [item, setItem] = useState({
    nome: "",
    valorCompra: "",
    valorDeclarado: "",
    peso: "",
    quantidade: "",
    dataCompra: "",
    taxas: "",
    valorDolar: "",
  });

  function handleAddItem() {
    setItems([...items, item]);
    setItem({
      nome: "",
      valorCompra: "",
      valorDeclarado: "",
      peso: "",
      quantidade: "",
      dataCompra: "",
      taxas: "",
      valorDolar: "",
    });
  }

  function handleRemoveItem(index) {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header texto={"Estoque"} />
        {/* Central Content */}
        <div className="flex-1 flex flex-col">
          <main className="p-6 space-y-6 overflow-y-auto">
            {/* Tela de Novo Lote */}
            <section className="bg-white p-6 rounded shadow-md">
              <h3 className="text-xl font-bold mb-4">
                Cadastrar Item no Estoque
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Nome do Item
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    value={item.nome}
                    onChange={(e) => setItem({ ...item, nome: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Valor Compra (USD)
                  </label>
                  <input
                    type="number"
                    className="w-full border rounded px-3 py-2"
                    value={item.valorCompra}
                    onChange={(e) =>
                      setItem({ ...item, valorCompra: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Valor Declarado (USD)
                  </label>
                  <input
                    type="number"
                    className="w-full border rounded px-3 py-2"
                    value={item.valorDeclarado}
                    onChange={(e) =>
                      setItem({ ...item, valorDeclarado: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Peso (lbs)
                  </label>
                  <input
                    type="number"
                    className="w-full border rounded px-3 py-2"
                    value={item.peso}
                    onChange={(e) => setItem({ ...item, peso: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Quantidade
                  </label>
                  <input
                    type="number"
                    className="w-full border rounded px-3 py-2"
                    value={item.quantidade}
                    onChange={(e) =>
                      setItem({ ...item, quantidade: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Data da Compra
                  </label>
                  <input
                    type="date"
                    className="w-full border rounded px-3 py-2"
                    value={item.dataCompra}
                    onChange={(e) =>
                      setItem({ ...item, dataCompra: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Valor do Dólar
                  </label>
                  <input
                    type="number"
                    className="w-full border rounded px-3 py-2"
                    value={item.valorDolar}
                    onChange={(e) =>
                      setItem({ ...item, valorDolar: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Taxas
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    value={item.taxas}
                    onChange={(e) =>
                      setItem({ ...item, taxas: e.target.value })
                    }
                  />
                </div>
              </div>
              <button
                onClick={handleAddItem}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Adicionar ao Estoque
              </button>
            </section>

            {/* Listagem de Itens */}
            <section className="bg-white p-6 rounded shadow-md">
              <h3 className="text-xl font-bold mb-4">Itens no Estoque</h3>
              <table className="w-full table-auto text-left border-collapse">
                <thead>
                  <tr className="border-b bg-gray-100">
                    <th className="p-2">Nome</th>
                    <th className="p-2">Valor Compra</th>
                    <th className="p-2">Valor Declarado</th>
                    <th className="p-2">Quantidade</th>
                    <th className="p-2">Data da Compra</th>
                    <th className="p-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((i, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="p-2">{i.nome}</td>
                      <td className="p-2">R${i.valorCompra * i.valorDolar}</td>
                      <td className="p-2">${i.valorDeclarado}</td>
                      <td className="p-2">{i.quantidade}</td>
                      <td className="p-2">{i.dataCompra}</td>
                      <td className="p-2">
                        <button
                          onClick={() => handleRemoveItem(idx)}
                          className="text-red-600 hover:underline"
                        >
                          Remover
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
    </div>
  );
}
