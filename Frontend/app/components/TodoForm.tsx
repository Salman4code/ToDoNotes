// components/TodoForm.tsx
"use client";

import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default function TodoForm({ onSaved }: { onSaved: () => void }) {
  const [title, setTitle] = useState("");
  const [items, setItems] = useState<string[]>([""]);

  const addItem = () => setItems((s) => [...s, ""]);
  const updateItem = (idx: number, val: string) => setItems((s) => s.map((v, i) => (i === idx ? val : v)));
  const removeItem = (idx: number) => setItems((s) => s.filter((_, i) => i !== idx));

  const save = async () => {
    if (!title.trim()) return alert("Add a title");
    const todos = items.filter(Boolean).map((t) => ({ text: t, completed: false }));
    try {
      const res = await fetch(`${API}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, type: "todo", todos }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setTitle("");
      setItems([""]);
      onSaved();
    } catch (e) {
      console.error(e);
      alert("Error saving");
    }
  };

  return (
    <div className="p-3 mb-3 rounded-lg bg-white shadow">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full mb-2 font-medium"
        placeholder="Todo title..."
      />

      <div className="space-y-1">
        {items.map((it, idx) => (
          <div key={idx} className="flex gap-2">
            <input
              value={it}
              onChange={(e) => updateItem(idx, e.target.value)}
              className="flex-1 text-sm"
              placeholder={`Item ${idx + 1}`}
            />
            <button type="button" onClick={() => removeItem(idx)} className="px-2">x</button>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-3">
        <button onClick={addItem} className="px-3 py-1 rounded bg-slate-100">+ Item</button>
        <button onClick={save} className="px-3 py-1 rounded bg-blue-600 text-white">Save</button>
      </div>
    </div>
  );
}
