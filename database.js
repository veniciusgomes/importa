const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const { app, BrowserWindow, ipcMain } = require("electron");

// Caminho do banco (será criado no primeiro uso)
const dbPath = path.join(__dirname, "data.sqlite");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
  } else {
    console.log("Conectado ao banco SQLite");
  }
});

// Criar tabela exemplo
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS estoque (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_item TEXT,
    valor_compra FLOAT,
    valor_declarado FLOAT,
    peso FLOAT,
    quantidade INTEGER,
    data_compra date,
    valor_dolar float,
    taxas float
  )`);
});

ipcMain.handle("estoque:add", async (event, item) => {
  const stmt = db.prepare(`INSERT INTO estoque (
    nome_item, valor_compra, valor_declarado, peso,
    quantidade, data_compra, valor_dolar, taxas
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);

  return new Promise((resolve, reject) => {
    stmt.run(
      [
        item.nome_item,
        item.valor_compra,
        item.valor_declarado,
        item.peso,
        item.quantidade,
        item.data_compra,
        item.valor_dolar,
        item.taxas,
      ],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      }
    );
  });
});

ipcMain.handle("estoque:getAll", async () => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM estoque ORDER BY id DESC`, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
});

ipcMain.handle("estoque:delete", async (event, id) => {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM estoque WHERE id = ?`, [id], function (err) {
      if (err) reject(err);
      else resolve({ deleted: this.changes });
    });
  });
});

module.exports = db;
