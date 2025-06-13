import React, { useState } from "react";
import { SideBar } from "../components/sidebar";
import Header from "../components/header";

export default function Lotes() {
  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({
    nome: "",
    valorCompra: "",
    valorDeclarado: "",
    peso: "",
    quantidade: "",
    dataCompra: "",
    taxas: "",
  });

  function handleAddItem() {
    setItems([...items, currentItem]);
    setCurrentItem({
      nome: "",
      valorCompra: "",
      valorDeclarado: "",
      peso: "",
      quantidade: "",
      dataCompra: "",
      taxas: "",
    });
  }

  console.log(items);

  function handleRemoveItem(indexToRemove) {
    setItems(items.filter((_, index) => index !== indexToRemove));
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header texto={"Lotes"} />
        {/* Central Content */}
        <div className="flex-1 flex flex-col">
          <main className="p-6 space-y-6 overflow-y-auto">
            {/* Tela de Novo Lote */}
            <section className="bg-white p-6 rounded shadow-md">
              <h3 className="text-xl font-bold mb-4">Novo Lote</h3>

              {/* Informações do Lote */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Valor do Frete (USD)
                  </label>
                  <input
                    type="number"
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Data do Envio
                  </label>
                  <input
                    type="date"
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>

              {/* Itens do Lote */}
              <div className="mb-4">
                <h4 className="text-lg font-semibold mb-2">Itens</h4>
                <div className="grid grid-cols-7 gap-2 text-sm font-medium text-gray-700 mb-1">
                  <span>Nome</span>
                  <span>Valor Compra (USD)</span>
                  <span>Valor Declarado (USD)</span>
                  <span>Peso (lbs)</span>
                  <span>Quantidade</span>
                  <span>Data Compra</span>
                  <span>Taxas</span>
                </div>
                <div className="grid grid-cols-7 gap-2 mb-2">
                  <input
                    type="text"
                    className="border rounded px-2 py-1"
                    value={currentItem.nome}
                    onChange={(e) =>
                      setCurrentItem({ ...currentItem, nome: e.target.value })
                    }
                  />
                  <input
                    type="number"
                    className="border rounded px-2 py-1"
                    value={currentItem.valorCompra}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        valorCompra: e.target.value,
                      })
                    }
                  />
                  <input
                    type="number"
                    className="border rounded px-2 py-1"
                    value={currentItem.valorDeclarado}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        valorDeclarado: e.target.value,
                      })
                    }
                  />
                  <input
                    type="number"
                    className="border rounded px-2 py-1"
                    value={currentItem.peso}
                    onChange={(e) =>
                      setCurrentItem({ ...currentItem, peso: e.target.value })
                    }
                  />
                  <input
                    type="number"
                    className="border rounded px-2 py-1"
                    value={currentItem.quantidade}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        quantidade: e.target.value,
                      })
                    }
                  />
                  <input
                    type="date"
                    className="border rounded px-2 py-1"
                    value={currentItem.dataCompra}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        dataCompra: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    className="border rounded px-2 py-1"
                    value={currentItem.taxas}
                    onChange={(e) =>
                      setCurrentItem({ ...currentItem, taxas: e.target.value })
                    }
                  />
                </div>
                <button
                  onClick={handleAddItem}
                  className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                >
                  Adicionar Item
                </button>

                {/* Lista de itens adicionados */}
                <ul className="mt-4 list-disc pl-5 text-sm text-gray-700">
                  {items.map((item, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center"
                    >
                      {item.nome} - ${item.valorDeclarado} ({item.quantidade}x)
                      <button
                        onClick={() => handleRemoveItem(index)}
                        className="text-red-500 text-xs ml-2 hover:underline"
                      >
                        Remover
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Botões de ação */}
              <div className="mt-6 flex gap-4">
                <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
                  Salvar Lote
                </button>
                <button className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500">
                  Cancelar
                </button>
              </div>
            </section>
            <section className="bg-white p-6 rounded shadow-md">
              <h3 className="text-xl font-bold mb-4">Lotes Salvos</h3>
              <table className="w-full table-auto text-left border-collapse">
                <thead>
                  <tr className="border-b bg-gray-100">
                    <th className="p-2">Data do Envio</th>
                    <th className="p-2">Valor do Frete</th>
                    <th className="p-2">Quantidade de Itens</th>
                    <th className="p-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2">2025-06-01</td>
                    <td className="p-2">$100</td>
                    <td className="p-2">3</td>
                    <td className="p-2 flex gap-2">
                      <button className="text-blue-600 hover:underline">
                        Editar
                      </button>
                      <button className="text-red-600 hover:underline">
                        Excluir
                      </button>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">2025-05-28</td>
                    <td className="p-2">$75</td>
                    <td className="p-2">5</td>
                    <td className="p-2 flex gap-2">
                      <button className="text-blue-600 hover:underline">
                        Editar
                      </button>
                      <button className="text-red-600 hover:underline">
                        Excluir
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
