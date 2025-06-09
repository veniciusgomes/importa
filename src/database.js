const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const { ipcMain } = require("electron");

const dbPath = path.join(__dirname, "itens.sqlite");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Erro ao conectar ao banco:", err.message);
  } else {
    console.log("Banco conectado com sucesso!");
  }
});
// Criar uma tabela, se não existir
db.run(
  "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, email TEXT)"
);

module.exports = db;
