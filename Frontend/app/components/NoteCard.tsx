"use client";

type NoteType = {
  _id: string;
  title?: string;
  description?: string;
  color?: string;
  isPinned?: boolean;
  todos?: { text: string; completed: boolean }[];
  createdAt?: string;
};

const NoteCard = ({ note }: { note: NoteType }) => {
  return (
    <article style={{ background: note.color || "#fff" }} className="rounded-lg p-4 shadow-sm border border-gray-100">
      <div className="flex items-start">
        <h3 className="font-semibold text-gray-800 flex-1">{note.title}</h3>
        <button className="text-gray-500 ml-2">📌</button>
      </div>

      {note.description && <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">{note.description}</p>}

      {note.todos && note.todos.length > 0 && (
        <ul className="mt-2 space-y-1">
          {note.todos.map((t, i) => (
            <li key={i} className={`flex items-center gap-2 text-sm ${t.completed ? "line-through text-gray-400" : ""}`}>
              <input type="checkbox" readOnly checked={t.completed} />
              <span>{t.text}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 border-t pt-2 flex items-center justify-between text-gray-500">
        <div className="flex items-center gap-3 text-sm">
          <button>🎨</button>
          <button>🔔</button>
          <button>👥</button>
          <button>🖼️</button>
          <button>⋯</button>
        </div>
        <div className="text-xs text-gray-400">{note.createdAt ? new Date(note.createdAt).toLocaleString() : ""}</div>
      </div>
    </article>
  );
};

export default NoteCard;
