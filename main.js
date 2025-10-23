const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");
const db = require("./database.js");

function createWindow() {
  const win = new BrowserWindow({
    show: false, // impede flicker durante maximização
    //width: 1000,
    //height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.maximize(); // maximiza a janela
  win.show(); // mostra a janela após maximizar
  //win.loadFile("public/index.html");
  win.loadFile(path.join(__dirname, "public/index.html"));

  //mostrar console
  //win.webContents.openDevTools();
}
Menu.setApplicationMenu(false);

app.whenReady().then(createWindow);
