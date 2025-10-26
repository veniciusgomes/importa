import React from "react";

// Este é um "componente controlado".
// Ele não tem estado próprio, apenas recebe props do componente pai.
export default function EditNomeLoteModal({
  isOpen,         // Booleano: está aberto ou fechado?
  onClose,        // Função: o que fazer ao clicar em "Cancelar" ou fora
  onSave,         // Função: o que fazer ao clicar em "Salvar"
  value,          // String: o valor atual do input (novoNomeLote)
  onChange,       // Função: o que fazer quando o usuário digita (setNovoNomeLote)
  isLoading,      // Booleano: o app está salvando?
}) {

  // Se não estiver aberto, não renderiza nada
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose} // Fecha ao clicar fora
    >
      <div
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()} // Impede de fechar ao clicar dentro
      >
        <h3 className="text-xl font-bold mb-4">Editar Nome do Lote</h3>
        <label htmlFor="loteNomeInput" className="block text-sm font-medium mb-1">
          Novo Nome
        </label>
        <input
          id="loteNomeInput"
          type="text"
          className="w-full border rounded px-3 py-2"
          value={value}
          onChange={onChange}
        />
        <div className="mt-6 text-right">
          <button
            onClick={onSave}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2 disabled:bg-gray-400"
          >
            {isLoading ? "Salvando..." : "Salvar"}
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