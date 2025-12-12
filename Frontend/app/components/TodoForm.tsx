"use client";

import { useState } from "react";

const TodoForm = ({ onSaved }: { onSaved?: () => void }) => {
  const [title, setTitle] = useState("");
  const [items, setItems] = useState<string[]>([""]);

  const addItem = () => setItems(s => [...s, ""]);
  const updateItem = (i: number, v: string) => setItems(s => s.map((x, idx) => idx === i ? v : x));
  const remove = (i: number) => setItems(s => s.filter((_, idx) => idx !== i));

  const save = async () => {
    if (!title) return alert("Add title");
    const todos = items.filter(Boolean).map(t => ({ text: t, completed: false }));
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, type: "todo", todos }),
    });
    setTitle(""); setItems([""]);
    onSaved && onSaved();
  };

  return (
    <div className="bg-white rounded-lg p-3 mb-4 shadow">
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Todo title" className="w-full mb-2" />
      {items.map((it, i) => (
        <div key={i} className="flex gap-2 items-center mb-2">
          <input value={it} onChange={e => updateItem(i, e.target.value)} className="flex-1" />
          <button onClick={() => remove(i)}>x</button>
        </div>
      ))}
      <div className="flex gap-2">
        <button onClick={addItem} className="px-3 py-1 bg-gray-100 rounded">+ Item</button>
        <button onClick={save} className="px-3 py-1 bg-blue-600 text-white rounded">Save</button>
      </div>
    </div>
  );
};

export default TodoForm;
