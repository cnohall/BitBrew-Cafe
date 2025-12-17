import sqlite3 from 'sqlite3';

// Connect to the database
const dbRaw = new sqlite3.Database('cafe.db', (err) => {
  if (err) console.error("Database connection error:", err.message);
  else console.log("Connected to SQLite database.");
});

// Initialize table if it doesn't exist
dbRaw.serialize(() => {
  dbRaw.run(`
    CREATE TABLE IF NOT EXISTS orders (
      address TEXT PRIMARY KEY,
      status TEXT DEFAULT 'pending',
      txid TEXT,
      value INTEGER,
      confirmations INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// Helper functions converted to Promises
const db = {
  createOrder: (address) => {
    return new Promise((resolve, reject) => {
      dbRaw.run(`INSERT INTO orders (address) VALUES (?)`, [address], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  },

  getOrder: (address) => {
    return new Promise((resolve, reject) => {
      dbRaw.get(`SELECT * FROM orders WHERE address = ?`, [address], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  updateOrder: (address, data) => {
    return new Promise((resolve, reject) => {
      dbRaw.run(
        `UPDATE orders SET status = ?, txid = ?, value = ?, confirmations = ? WHERE address = ?`,
        [data.status, data.txid, data.value, data.confirmations, address],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  },

  getOrderCount: () => {
    return new Promise((resolve, reject) => {
      dbRaw.get(`SELECT COUNT(*) as count FROM orders`, [], (err, row) => {
        if (err) reject(err);
        else resolve(row?.count || 0);
      });
    });
  }
};

export default db;