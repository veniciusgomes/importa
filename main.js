const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");
const db = require("./database.js");

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  win.loadFile("public/index.html");
  //mostrar console
  win.webContents.openDevTools();
}
Menu.setApplicationMenu(false);

app.whenReady().then(createWindow);
