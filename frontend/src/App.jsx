import React, { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");

  async function load() {
    const r = await fetch(`${API_BASE}/api/todos`);
    setTodos(await r.json());
  }

  async function add(e) {
    e.preventDefault();
    if (!title.trim()) return;
    await fetch(`${API_BASE}/api/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title })
    });
    setTitle("");
    await load();
  }

  async function toggle(id) {
    await fetch(`${API_BASE}/api/todos/${id}/toggle`, { method: "PATCH" });
    await load();
  }

  useEffect(() => { load(); }, []);

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", fontFamily: "Arial" }}>
      <h1>Todo App (React + Node + Postgres)</h1>

      <form onSubmit={add} style={{ display: "flex", gap: 8 }}>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="New todo..."
          style={{ flex: 1, padding: 10 }} />
        <button style={{ padding: "10px 14px" }}>Add</button>
      </form>

      <ul style={{ marginTop: 20 }}>
        {todos.map(t => (
          <li key={t.id} style={{ margin: "10px 0" }}>
            <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />
              <span style={{ textDecoration: t.done ? "line-through" : "none" }}>{t.title}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
