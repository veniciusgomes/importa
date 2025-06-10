const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  enviarProduto: (dados) => ipcRenderer.invoke("inserir-produto", dados),
});
