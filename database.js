const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const { app, BrowserWindow, ipcMain } = require("electron");
const fs = require("fs");

// Caminho do banco (será criado no primeiro uso)
const userDataPath = app.getPath("userData");
const dbPath = path.join(userDataPath, "data.sqlite");

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
  nome TEXT,
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
 nome, data_criacao, valor_dolar, valor_caixa_uscloser, peso_caixa_uscloser,
  frete_declarado, seguro, frete_lote, valor_importacao, valor_icms
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        lote.nome, // <-- Novo
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
        l.nome as lote_nome,
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

ipcMain.handle("lote:updateNome", async (event, { id, nome }) => {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE lotes SET nome = ? WHERE id = ?`,
      [nome, id],
      function (err) {
        if (err) {
          console.error("Erro ao atualizar nome do lote:", err);
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      }
    );
  });
});

ipcMain.handle("estoque:update", async (event, item) => {
  // 'item' aqui é o objeto camelCase vindo do React
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE estoque SET
        nome_item = ?,
        valor_compra = ?,
        valor_declarado = ?,
        peso = ?,
        quantidade = ?,
        data_compra = ?,
        taxas = ?,
        valor_dolar = ?
      WHERE id = ?`,
      [
        // AJUSTE: Ler as propriedades camelCase (ex: item.nome)
        item.nome,
        item.valorCompra,
        item.valorDeclarado,
        item.peso,
        item.quantidade,
        item.dataCompra,
        item.taxas,
        item.valorDolar,
        item.id,
      ],
      function (err) {
        if (err) {
          console.error("Erro ao atualizar item:", err.message);
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      }
    );
  });
});

// --- LÓGICA DE CONFIGURAÇÃO ---
const configPath = path.join(userDataPath, "config.json");
const defaultConfig = {
  taxa_icms: 20,
  taxa_importacao: 60,
  default_valor_por_libra: 9.132666666666667,
};

function getConfig() {
  try {
    // Verifica se o arquivo existe
    if (fs.existsSync(configPath)) {
      // Se existe, lê
      const rawdata = fs.readFileSync(configPath);
      return JSON.parse(rawdata);
    } else {
      // Se não existe, cria com os padrões
      fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
      return defaultConfig;
    }
  } catch (error) {
    console.error("Erro ao ler/criar config.json:", error);
    return defaultConfig;
  }
}

// Novo IPC Handler para o frontend pedir a configuração
ipcMain.handle("config:get", () => {
  return getConfig();
});

ipcMain.handle("excluirLote", async (event, loteId) => {
  console.log(`[BACKEND] Recebido pedido para excluir lote ID: ${loteId}`);

  // db.serialize garante que os comandos rodem em ordem,
  // um após o outro, na mesma "fila".
  return new Promise((resolve, reject) => {

    db.serialize(() => {
      // 1. Inicia a transação
      db.run("BEGIN TRANSACTION;", (err) => {
        if (err) {
          console.error("[BACKEND] Erro ao iniciar transação:", err.message);
          return reject(err);
        }
      });

      // 2. Primeiro delete
      db.run("DELETE FROM lote_itens WHERE lote_id = ?", [loteId], (err) => {
        if (err) {
          console.error("[BACKEND] Erro ao deletar de lote_itens:", err.message);
          db.run("ROLLBACK;"); // Desfaz a transação
          return reject(err);
        }
      });

      // 3. Segundo delete
      db.run("DELETE FROM lotes WHERE id = ?", [loteId], (err) => {
        if (err) {
          console.error("[BACKEND] Erro ao deletar de lotes:", err.message);
          db.run("ROLLBACK;");
          return reject(err);
        }
      });

      // 4. Finaliza a transação
      // O 'callback' final do db.run("COMMIT") só roda
      // quando tudo acima na fila do 'serialize' terminar.
      db.run("COMMIT;", (err) => {
        if (err) {
          console.error("[BACKEND] Erro ao comitar transação:", err.message);
          db.run("ROLLBACK;");
          return reject(err);
        }

        // SÓ RESOLVEMOS A PROMISE AQUI
        console.log("[BACKEND] Transação concluída com sucesso (via serialize).");
        resolve({ deleted: true });
      });
    });
  });
});


module.exports = db;
