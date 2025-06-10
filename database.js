const sqlite3 = require("sqlite3").verbose();
const path = require("path");

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
  db.run(`CREATE TABLE IF NOT EXISTS importacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    categoria TEXT,
    pais_origem TEXT,
    valor REAL
  )`);
});

module.exports = db;
