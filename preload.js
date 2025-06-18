const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  addItem: (item) => ipcRenderer.invoke("estoque:add", item),
  getItems: () => ipcRenderer.invoke("estoque:getAll"),
  deleteItem: (id) => ipcRenderer.invoke("estoque:delete", id),
});
