import React, { useState, useEffect } from "react"; // Importar useEffect também

function formatarDataBR(dataString) {
  if (!dataString) return "N/A";
  const [ano, mes, dia] = dataString.split("-");
  return `${dia}/${mes}/${ano}`;
}

export default function ItemDetailsModal({ item, onClose, onSave }) { // onSave é a nova prop
  // Se não houver item, não renderiza nada
  if (!item) return null;

  // AJUSTE 1: Estado local para os dados editáveis do item
  // Inicializa com os valores do item original
  const [editedItem, setEditedItem] = useState({ ...item });

  // AJUSTE 2: Quando o 'item' muda (se o modal for reaberto para outro item),
  // atualiza o estado local 'editedItem'.
  useEffect(() => {
    setEditedItem({ ...item });
  }, [item]);

  // Função genérica para atualizar qualquer campo do editedItem
  const handleChange = (e) => {
    const { name, value } = e.target;
    const type = e.target.type; // Pega o 'type' do input (ex: "text" ou "number")
    setEditedItem((prev) => ({
      ...prev,
      [name]: type === "number" ? (parseFloat(value) || 0) : value,
    }));
  };

  // Funções de formatação (mantidas)
  const formatBRL = (value) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const formatUSD = (value) =>
    value.toLocaleString("en-US", { style: "currency", currency: "USD" });

  // Cálculos derivados (agora baseados em editedItem)
  const valorCompraBRL = editedItem.valorCompra * editedItem.valorDolar;
  const valorDeclaradoBRL = editedItem.valorDeclarado * editedItem.valorDolar;
  const taxasBRL = editedItem.taxas * editedItem.valorDolar;

  // AJUSTE 3: Função para salvar as alterações
  const handleSave = () => {
    onSave(editedItem); // Chama a função onSave passada pelo pai
    onClose(); // Fecha o modal após salvar
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">
            Editar Item: {editedItem.nome}
          </h3> {/* Título agora é "Editar" */}
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-2xl"
          >
            &times;
          </button>
        </div>

        <div className="space-y-3">
          {/* AJUSTE 4: Campos ID e Data são apenas leitura */}
          <DetailRow label="ID do Item" value={editedItem.id} readOnly />
          <DetailRow label="Data da Compra" value={formatarDataBR(editedItem.dataCompra)} readOnly />

          {/* AJUSTE 5: Transformar em inputs editáveis */}
          <EditableDetailRow
            label="Nome do Item"
            name="nome"
            value={editedItem.nome}
            onChange={handleChange}
            type="text"
          />
          <EditableDetailRow
            label="Quantidade"
            name="quantidade"
            value={editedItem.quantidade}
            onChange={handleChange}
            type="number"
          />
          <EditableDetailRow
            label="Peso (lbs)"
            name="peso"
            value={editedItem.peso}
            onChange={handleChange}
            type="number"
          />
          <EditableDetailRow
            label="Dólar na Compra (R$)"
            name="valorDolar"
            value={editedItem.valorDolar}
            onChange={handleChange}
            type="number"
          />

          <hr className="my-2" />

          <EditableDetailRow
            label="Valor da Compra (USD)"
            name="valorCompra"
            value={editedItem.valorCompra}
            onChange={handleChange}
            type="number"
          />
          <EditableDetailRow
            label="Valor Declarado (USD)"
            name="valorDeclarado"
            value={editedItem.valorDeclarado}
            onChange={handleChange}
            type="number"
          />
          <EditableDetailRow
            label="Taxas (USD)"
            name="taxas"
            value={editedItem.taxas}
            onChange={handleChange}
            type="number"
          />

          <hr className="my-2" />
          {/* Campos derivados podem continuar como apenas leitura, exibindo o cálculo */}
          <DetailRow
            label="Valor da Compra (BRL)"
            value={formatBRL(valorCompraBRL)}
            readOnly
          />
          <DetailRow
            label="Valor Declarado (BRL)"
            value={formatBRL(valorDeclaradoBRL)}
            readOnly
          />
          <DetailRow label="Taxas (BRL)" value={formatBRL(taxasBRL)} readOnly />
        </div>

        {/* AJUSTE 6: Botão de Salvar */}
        <div className="mt-6 text-right">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
          >
            Salvar Alterações
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

// Componente auxiliar para exibir detalhes (apenas leitura)
function DetailRow({ label, value, readOnly = false }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-600">{label}:</span>
      {readOnly ? (
        <span className="font-medium text-gray-900">{value}</span>
      ) : (
        // Se não for readOnly, um fallback para EditableDetailRow caso seja usado incorretamente
        <span className="font-medium text-red-500">Erro: Campo editável aqui</span>
      )}
    </div>
  );
}

// AJUSTE 7: Novo componente auxiliar para inputs editáveis
function EditableDetailRow({ label, name, value, onChange, type = "text" }) {
  return (
    <div className="flex justify-between items-center">
      <label htmlFor={name} className="text-gray-600 w-1/2">
        {label}:
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="w-1/2 border rounded px-3 py-2 text-right"
      />
    </div>
  );
}