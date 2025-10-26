import React, { useState, useEffect } from "react";
import { SideBar } from "../components/sidebar";
import Header from "../components/header";
import ItemDetailsModal from "../components/ItemDetailsModal";

function formatarDataBR(dataString) {
  if (!dataString) return "N/A";
  const [ano, mes, dia] = dataString.split("-");
  return `${dia}/${mes}/${ano}`;
}

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // <-- ADICIONE ESTA LINHA

  // Carrega os itens do banco ao iniciar
  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
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
    setItems(formatado);
  };

  const handleAddItem = async () => {
    // Validação de inputs (sugestão da revisão anterior)
    if (isNaN(parseFloat(item.valorCompra)) || !item.nome) {
      alert("Por favor, preencha pelo menos o Nome e o Valor da Compra.");
      return;
    }

    setIsLoading(true); // <-- Liga
    try {
      const novoItem = {
        nome_item: item.nome,
        valor_compra: parseFloat(item.valorCompra.replace(",", ".")),
        valor_declarado: parseFloat(item.valorDeclarado.replace(",", ".")),
        peso: parseFloat(item.peso.replace(",", ".")),
        quantidade: parseInt(item.quantidade),
        data_compra: item.dataCompra,
        valor_dolar: parseFloat(item.valorDolar.replace(",", ".")),
        taxas: parseFloat(item.taxas.replace(",", ".")),
      };

      await window.electronAPI.addItem(novoItem);
      setItem({ // Limpa o formulário
        nome: "",
        valorCompra: 0,
        valorDeclarado: 0,
        peso: 0,
        quantidade: 0,
        dataCompra: "",
        taxas: 0,
        valorDolar: 0,
      });
      await loadItems();
    } catch (error) {
      console.error("Erro ao adicionar item:", error);
      alert("Erro ao salvar novo item.");
    } finally {
      setIsLoading(false); // <-- Desliga, não importa o que aconteça
    }
  };

  const handleRemoveItem = async (id) => {
    // Pergunta de confirmação
    if (!window.confirm("Tem certeza que deseja remover este item?")) {
      return;
    }

    setIsLoading(true); // <-- Liga
    try {
      await window.electronAPI.deleteItem(id);
      await loadItems();
    } catch (error) {
      console.error("Erro ao remover item:", error);
      alert("Erro ao remover item.");
    } finally {
      setIsLoading(false); // <-- Desliga, não importa o que aconteça
    }
  };

  // 3. FUNÇÕES PARA CONTROLAR O MODAL
  const handleOpenDetails = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };


  const handleSaveEditedItem = async (editedItem) => {
    setIsLoading(true); // <-- Liga
    try {
      await window.electronAPI.updateItem(editedItem);
      await loadItems(); // Recarrega todos os itens
      // O alert foi removido para um fluxo mais suave,
      // mas você pode adicionar se quiser
    } catch (error) {
      console.error("Erro ao salvar item editado:", error);
      alert("Erro ao atualizar item.");
      // Lança o erro para o modal saber que falhou
      throw error;
    } finally {
      setIsLoading(false); // <-- Desliga, não importa o que aconteça
    }
  };
  return (
    <div className="flex h-screen bg-gray-100">
      <SideBar />

      <div className="flex-1 flex flex-col">
        <Header texto={"Estoque"} />

        <div className="flex-1 flex flex-col">
          <main className="p-6 space-y-6 overflow-y-auto">
            {/* Cadastro */}
            <section className="bg-white p-6 rounded shadow-md">
              <h3 className="text-xl font-bold mb-4">
                Cadastrar Item no Estoque
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { label: "Nome do Item", name: "nome" },
                  { label: "Valor Compra (USD)", name: "valorCompra" },
                  { label: "Valor Declarado (USD)", name: "valorDeclarado" },
                  { label: "Peso (lbs)", name: "peso" },
                  { label: "Quantidade", name: "quantidade" },
                  { label: "Data da Compra", name: "dataCompra", type: "date" },
                  { label: "Valor do Dólar", name: "valorDolar" },
                  { label: "Taxas", name: "taxas" },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block mb-1 text-sm font-medium">
                      {field.label}
                    </label>
                    <input
                      type={field.type || "text"}
                      className="w-full border rounded px-3 py-2"
                      value={item[field.name]}
                      onChange={(e) =>
                        setItem({ ...item, [field.name]: e.target.value })
                      }
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={handleAddItem}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Adicionar ao Estoque
              </button>
            </section>

            {/* Listagem */}
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
                  {items.map((i) => (
                    <tr key={i.id} className="border-b">
                      <td className="p-2">{i.nome}</td>
                      <td className="p-2">
                        R${(i.valorCompra * i.valorDolar).toFixed(2)}
                      </td>
                      <td className="p-2">${i.valorDeclarado}</td>
                      <td className="p-2">{i.quantidade}</td>
                      <td className="p-2">{formatarDataBR(i.dataCompra)}</td>
                      <td className="p-2">
                        {/* 4. ADICIONAR O BOTÃO DE DETALHES */}
                        <button
                          onClick={() => handleOpenDetails(i)}
                          className="text-blue-600 hover:underline mr-3" // mr-3 = margem direita
                        >
                          Detalhes
                        </button>
                        <button
                          onClick={() => handleRemoveItem(i.id)}
                          className="text-red-600 hover:underline"
                        >
                          Remover
                        </button>
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr>
                      <td className="p-2 text-gray-500" colSpan={6}>
                        Nenhum item encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </section>
          </main>
        </div>
      </div>

      {/* 5. RENDERIZAR O MODAL (fora do <main>) */}
      {isModalOpen && (
        <ItemDetailsModal
          item={selectedItem}
          onClose={handleCloseDetails}
          onSave={handleSaveEditedItem}
        />
      )}
    </div>
  );
}
