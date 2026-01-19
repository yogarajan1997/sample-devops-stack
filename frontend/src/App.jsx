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
        <div style={{ maxWidth: 900, margin: "60px auto", fontFamily: "Arial" }}>

            {/* ===== CI/CD DEMO HEADER ===== */}
            <div style={{ marginBottom: 40 }}>
                <h1 style={{ marginBottom: 10 }}>
                    Hello Mr. Pascal Haunreiter 👋
                </h1>

                <h3 style={{ marginTop: 0, fontWeight: "normal", color: "#444" }}>
                    Welcome to CI/CD Automation
                </h3>

                <p style={{ marginTop: 10, color: "#666" }}>
                    Docker · Helm · Kubernetes · GitHub · Jenkins
                </p>

                <p style={{ marginTop: 15, fontStyle: "italic", color: "#888" }}>
                    Built & automated by <strong>Yoga</strong>
                </p>

                <hr style={{ marginTop: 30 }} />
            </div>

            {/* ===== TODO APP ===== */}
            <form onSubmit={add} style={{ display: "flex", gap: 8 }}>
                <input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="New todo..."
                    style={{ flex: 1, padding: 10 }}
                />
                <button style={{ padding: "10px 14px" }}>Add</button>
            </form>

            <ul style={{ marginTop: 20 }}>
                {todos.map(t => (
                    <li key={t.id} style={{ margin: "10px 0" }}>
                        <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
                            <input
                                type="checkbox"
                                checked={t.done}
                                onChange={() => toggle(t.id)}
                            />
                            <span style={{ textDecoration: t.done ? "line-through" : "none" }}>
                                {t.title}
                            </span>
                        </label>
                    </li>
                ))}
            </ul>

        </div>
    );
}
