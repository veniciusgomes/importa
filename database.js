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
  db.run(`CREATE TABLE IF NOT EXISTS lotes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  data_criacao DATE,
  valor_dolar FLOAT,
  valor_caixa_uscloser FLOAT,
  peso_caixa_uscloser FLOAT,
  frete_declarado FLOAT,
  frete_lote FLOAT,
  valor_importacao FLOAT,
  valor_icms FLOAT,
  seguro FLOAT
);`);

  db.run(`CREATE TABLE IF NOT EXISTS lote_itens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lote_id INTEGER,
  item_id INTEGER,
  FOREIGN KEY (lote_id) REFERENCES lotes(id),
  FOREIGN KEY (item_id) REFERENCES estoque(id)
);`);
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
    db.all(
      `
    SELECT * FROM estoque
    WHERE id NOT IN (
      SELECT item_id FROM lote_itens
    )
    ORDER BY data_compra DESC
  `,
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
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

ipcMain.handle("salvar-lote", async (event, lote, itens) => {
  const loteId = await new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO lotes (
  data_criacao, valor_dolar, valor_caixa_uscloser, peso_caixa_uscloser,
  frete_declarado, seguro, frete_lote, valor_importacao, valor_icms
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        lote.data_criacao,
        lote.valor_dolar,
        lote.valor_caixa_uscloser,
        lote.peso_caixa_uscloser,
        lote.frete_declarado,
        lote.seguro,
        lote.frete_lote,
        lote.valor_importacao,
        lote.valor_icms,
      ],
      function (err) {
        if (err) return reject(err);
        resolve(this.lastID);
      }
    );
  });

  for (const item of itens) {
    await db.run(`INSERT INTO lote_itens (lote_id, item_id) VALUES (?, ?)`, [
      loteId,
      item.id,
    ]);
  }

  return { id: loteId };
});

ipcMain.handle("getLotesComItens", async () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        l.id as lote_id, 
        l.data_criacao, 
        l.valor_dolar,
        l.valor_caixa_uscloser,
        l.peso_caixa_uscloser,
        l.frete_declarado,
        l.seguro,
        l.frete_lote,
        l.valor_importacao,
        l.valor_icms,
        e.id as item_id, 
        e.nome_item, 
        e.peso, 
        e.quantidade,
        e.valor_compra,
        e.valor_declarado
      FROM lotes l
      JOIN lote_itens li ON l.id = li.lote_id
      JOIN estoque e ON li.item_id = e.id
      ORDER BY l.data_criacao DESC
    `;
    db.all(query, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
});

ipcMain.handle("excluirLote", async (event, loteId) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(
        `DELETE FROM lote_itens WHERE lote_id = ?`,
        [loteId],
        function (err) {
          if (err) return reject(err);
          db.run(`DELETE FROM lotes WHERE id = ?`, [loteId], function (err2) {
            if (err2) return reject(err2);
            resolve({ deleted: this.changes });
          });
        }
      );
    });
  });
});

module.exports = db;
