"use client";

import { useEffect, useState } from "react";
import { Note } from "@/app/lib/types";
import NoteCard from "@/app/components/NoteCard";
import NoteForm from "@/app/components/NoteForm";
import TodoForm from "@/app/components/TodoForm";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [showTodoForm, setShowTodoForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sensors: Pointer for mouse, Touch for mobile (with delay), Keyboard for accessibility
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 180,        // long press for mobile (ms)
        tolerance: 5,      // small finger movement allowed
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: undefined as any, // optional - default is fine
    })
  );

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/notes`);
      const data = await res.json();
      // pinned first then newest
      data.sort((a: Note, b: Note) => {
        if ((a.isPinned ? 1 : 0) !== (b.isPinned ? 1 : 0))
          return (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0);
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      });
      setNotes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotes(); }, []);

  const handleDragEnd = async (event: DragEndEvent) => {
  const { active, over } = event;
  if (!over || active.id === over.id) return;

  const oldIndex = notes.findIndex((n) => n._id === active.id);
  const newIndex = notes.findIndex((n) => n._id === over.id);

  const newNotes = arrayMove(notes, oldIndex, newIndex);
  setNotes(newNotes);

  // Save to backend
  const orderedIds = newNotes.map((n) => n._id);

  await fetch(`${API}/notes/reorder`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ orderedIds }),
  });
};

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Notes</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => { setShowNoteForm(s => !s); setShowTodoForm(false); }} className="px-3 py-1 rounded bg-white shadow text-sm">New Note</button>
          <button onClick={() => { setShowTodoForm(s => !s); setShowNoteForm(false); }} className="px-3 py-1 rounded bg-white shadow text-sm">New Todo</button>
        </div>
      </header>

      {showNoteForm && <NoteForm onSaved={() => { setShowNoteForm(false); fetchNotes(); }} />}
      {showTodoForm && <TodoForm onSaved={() => { setShowTodoForm(false); fetchNotes(); }} />}

      <main>
        {loading ? (
          <div className="text-center text-sm text-slate-500">Loading…</div>
        ) : notes.length === 0 ? (
          <div className="text-center text-slate-500">No notes yet</div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={notes.map(n => n._id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="masonry cols">
                {notes.map((note) => (
                  <NoteCard
                    key={note._id}
                    note={note}
                    // pass id so NoteCard's handle can use it
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </main>
    </div>
  );
}
