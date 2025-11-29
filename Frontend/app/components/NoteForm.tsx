// components/NoteForm.tsx
"use client";

import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default function NoteForm({ onSaved }: { onSaved: () => void }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [color, setColor] = useState("#ffffff");

  const save = async () => {
    if (!title.trim()) return alert("Add title");
    try {
      const res = await fetch(`${API}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description: desc, type: "text", color }),
      });
      if (!res.ok) throw new Error("Failed");
      setTitle("");
      setDesc("");
      setColor("#ffffff");
      onSaved();
    } catch (e) {
      console.error(e);
      alert("Error saving note");
    }
  };

  return (
    <div className="p-3 mb-3 rounded-lg bg-white shadow">
      <input
        className="w-full mb-2 font-medium"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="w-full text-sm h-20"
        placeholder="Description"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />

      <div className="flex items-center gap-2 mt-2">
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-8 h-8 p-0 border-0" />
        <button onClick={save} className="px-3 py-1 rounded bg-blue-600 text-white">Save</button>
      </div>
    </div>
  );
}
