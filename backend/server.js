const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432", 10),
  database: process.env.DB_NAME || "appdb",
  user: process.env.DB_USER || "appuser",
  password: process.env.DB_PASSWORD || "apppass"
});

async function initDb() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS todos(
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        done BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
  } finally {
    client.release();
  }
}

app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok" });
  } catch (e) {
    res.status(500).json({ status: "error", error: e.message });
  }
});

app.get("/api/todos", async (req, res) => {
  const r = await pool.query("SELECT * FROM todos ORDER BY id DESC LIMIT 50");
  res.json(r.rows);
});

app.post("/api/todos", async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: "title required" });
  const r = await pool.query("INSERT INTO todos(title) VALUES($1) RETURNING *", [title]);
  res.status(201).json(r.rows[0]);
});

app.patch("/api/todos/:id/toggle", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const r = await pool.query("UPDATE todos SET done = NOT done WHERE id=$1 RETURNING *", [id]);
  if (!r.rowCount) return res.status(404).json({ error: "not found" });
  res.json(r.rows[0]);
});

(async () => {
  await initDb();
  app.listen(PORT, () => console.log(`Backend running on ${PORT}`));
})();
