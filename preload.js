const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getItems: () => ipcRenderer.invoke("estoque:getAll"),
  addItem: (item) => ipcRenderer.invoke("estoque:add", item),
  deleteItem: (id) => ipcRenderer.invoke("estoque:delete", id),
  salvarLote: (lote, itens) => ipcRenderer.invoke("salvar-lote", lote, itens),
  getLotesComItens: () => ipcRenderer.invoke("getLotesComItens"),
  excluirLote: (id) => ipcRenderer.invoke("excluirLote", id),
});
