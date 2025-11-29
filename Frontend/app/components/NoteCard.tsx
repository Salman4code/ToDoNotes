"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Note } from "@/app/lib/types";
import { FaThumbtack, FaTrash, FaGripLines } from "react-icons/fa";

export default function NoteCard({ note, onDelete, onTogglePin }:
  { note: Note; onDelete?: (id: string) => void; onTogglePin?: (id: string) => void }) {

  // useSortable for this card
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: note._id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className="note-card inline-block w-full mb-4 rounded-lg shadow-sm p-3"
      // Allow native vertical scrolling (only the handle disables it)
      // NOTE: don't set touch-action: none on entire card
    >
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1">
          <h3 className="font-semibold text-sm text-slate-800">{note.title}</h3>
        </div>

        {/* Drag handle — attach listeners here to enable drag */}
        <button
          {...attributes}
          {...listeners}
          className="drag-handle p-2 rounded hover:bg-white/50 ml-2"
          aria-label="Drag note"
          style={{ touchAction: "none" }} // prevent browser gesture on handle
        >
          <FaGripLines />
        </button>
      </div>

      {note.type === "text" && <p className="mt-2 text-sm text-slate-700 whitespace-pre-line">{note.description}</p>}

      {note.type === "todo" && (
        <ul className="mt-2 text-sm space-y-1">
          {note.todos?.map((t, i) => (
            <li key={i} className={`${t.completed ? "line-through text-slate-400" : ""}`}>{t.text}</li>
          ))}
        </ul>
      )}

      <div className="flex justify-end gap-2 mt-3">
        <button onClick={() => onTogglePin && onTogglePin(note._id)} className="text-xs px-2 py-1 rounded bg-white/80">📌</button>
        <button onClick={() => onDelete && onDelete(note._id)} className="text-xs px-2 py-1 rounded bg-white/80">🗑</button>
      </div>
    </article>
  );
}
