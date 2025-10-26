const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  // --- Funções do Estoque ---
  getItems: () => ipcRenderer.invoke("estoque:getAll"),
  addItem: (item) => ipcRenderer.invoke("estoque:add", item),
  deleteItem: (id) => ipcRenderer.invoke("estoque:delete", id),
  updateItem: (item) => ipcRenderer.invoke("estoque:update", item),

  // --- Funções dos Lotes ---
  getLotesComItens: () => ipcRenderer.invoke("getLotesComItens"),
  salvarLote: (lote, itens) => ipcRenderer.invoke("salvar-lote", lote, itens),
  excluirLote: (id) => ipcRenderer.invoke("excluirLote", id),
  updateLoteNome: (id, nome) => ipcRenderer.invoke("lote:updateNome", { id, nome }),

  // --- Funções de Configuração ---
  getConfig: () => ipcRenderer.invoke("config:get"),
});