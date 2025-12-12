"use client";

import { useState } from "react";

type Props = {
  onSaved: () => void;
  onToggleTodo?: () => void;
};

const COLORS = [
  "#ffffff", "#f28b82", "#fbbc04", "#fff475", "#ccff90",
  "#a7ffeb", "#cbf0f8", "#aecbfa", "#d7aefb", "#fdcfe8"
];

const NoteForm = ({ onSaved, onToggleTodo }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [color, setColor] = useState("#ffffff");
  const [isPinned, setIsPinned] = useState(false);

  const submit = async () => {
    if (!title && !desc) {
      setExpanded(false);
      return;
    }
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description: desc, color, isPinned, type: "text" }),
      });
      setTitle("");
      setDesc("");
      setColor("#ffffff");
      setExpanded(false);
      onSaved();
    } catch (err) {
      console.error("Save note failed", err);
    }
  };

  return (
    <div className="mb-4">
      {!expanded ? (
        <div
          onClick={() => setExpanded(true)}
          className="bg-white rounded-lg shadow px-4 py-3 cursor-text hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">💡</div>
            <div className="text-gray-600">Take a note…</div>
            <div className="ml-auto flex items-center gap-2 text-gray-500">
              <button onClick={(e) => { e.stopPropagation(); onToggleTodo && onToggleTodo(); }} aria-label="New todo">☑️</button>
              <button onClick={(e) => { e.stopPropagation(); setExpanded(true); }} aria-label="Draw">✏️</button>
              <button onClick={(e) => e.stopPropagation()} aria-label="Image">🖼️</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full border-none outline-none text-lg font-medium mb-2"
          />
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Take a note..."
            className="w-full border-none outline-none resize-none text-sm mb-3"
            rows={4}
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* color palette */}
              <div className="flex gap-1 items-center">
                {COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    style={{ background: c }}
                    className={`w-6 h-6 rounded-full border ${color === c ? "ring-2 ring-offset-1 ring-yellow-400" : "border-gray-200"}`}
                    aria-label="Pick color"
                  />
                ))}
              </div>
              <button className="text-gray-600" onClick={() => setIsPinned(p => !p)}>{isPinned ? "📌" : "📍"}</button>
            </div>

            <div className="flex items-center gap-2">
              <button className="text-gray-600" onClick={() => { setExpanded(false); setTitle(""); setDesc(""); }}>Close</button>
              <button className="bg-yellow-500 text-white px-3 py-1 rounded" onClick={submit}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteForm;
