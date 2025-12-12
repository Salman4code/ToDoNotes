"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/app/components/Navbar";
import Sidebar from "@/app/components/Sidebar";
// import SearchBar from "@/app/components/SearchBar";
import NoteForm from "@/app/components/NoteForm";
import SortableNote from "@/app/components/SortableNote";
import TodoForm from "@/app/components/TodoForm";

import {
  DndContext,
  DragEndEvent,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy } from "@dnd-kit/sortable";

type Note = {
  _id: string;
  title: string;
  description?: string;
  type?: "text" | "todo";
  todos?: { text: string; completed: boolean }[];
  color?: string;
  isPinned?: boolean;
  order?: number;
  createdAt?: string;
};

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const NotesPage = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState("");
  const [showTodoForm, setShowTodoForm] = useState(false);

  // Sensors: pointer + touch (long press)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 170, tolerance: 5 } })
  );

  const fetchNotes = async () => {
    try {
      const res = await fetch(`${API}/notes`);
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.error("Fetch notes error:", err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // pinned first, then order asc, then createdAt desc
  const sortedNotes = useMemo(() => {
    return [...notes].sort((a, b) => {
      const pa = a.isPinned ? 1 : 0;
      const pb = b.isPinned ? 1 : 0;
      if (pa !== pb) return pb - pa; // pinned first
      const oa = typeof a.order === "number" ? a.order : 0;
      const ob = typeof b.order === "number" ? b.order : 0;
      if (oa !== ob) return oa - ob;
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
  }, [notes]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sortedNotes;
    return sortedNotes.filter((n) =>
      ((n.title || "") + " " + (n.description || "") + " " + (n.todos?.map(t => t.text).join(" ") || ""))
        .toLowerCase()
        .includes(q)
    );
  }, [sortedNotes, search]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeIndex = filtered.findIndex((n) => n._id === active.id);
    const overIndex = filtered.findIndex((n) => n._id === over.id);
    if (activeIndex === -1 || overIndex === -1) return;

    // We need to compute new global order array
    // We'll reorder the current sortedNotes array according to the visible filtered move.
    const newSorted = [...sortedNotes];
    // find positions in sortedNotes
    const fromGlobalIndex = newSorted.findIndex(n => n._id === filtered[activeIndex]._id);
    const toGlobalIndex = newSorted.findIndex(n => n._id === filtered[overIndex]._id);

    const reOrdered = arrayMove(newSorted, fromGlobalIndex, toGlobalIndex);
    setNotes(reOrdered);

    // persist order to backend (bulk)
    try {
      const orderedIds = reOrdered.map(n => n._id);
      await fetch(`${API}/notes/reorder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds }),
      });
    } catch (err) {
      console.error("Failed to persist order:", err);
    }
  };

  const pinnedNotes = filtered.filter(n => n.isPinned);
  const otherNotes = filtered.filter(n => !n.isPinned);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar search={search} onSearchChange={setSearch} />
      <div className="text-4xl font-bold text-green-500 p-10">
      Tailwind is working! 🚀
    </div>

      <div className="flex">
        <aside className="hidden md:block w-64 sticky top-16 h-[calc(100vh-64px)]">
          <Sidebar />
        </aside>

        <main className="flex-1 p-4 max-w-6xl mx-auto">
          {/* Collapsed note input */}
          <NoteForm onSaved={fetchNotes} onToggleTodo={() => setShowTodoForm(s => !s)} />

          {showTodoForm && <TodoForm onSaved={fetchNotes} />}

          {/* Pinned Section */}
          {pinnedNotes.length > 0 && (
            <section className="mb-6">
              <h3 className="text-sm text-gray-600 mb-3">Pinned</h3>

              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={pinnedNotes.map(n => n._id)} strategy={rectSortingStrategy}>
                  <div className="columns-1 sm:columns-2 md:columns-3 gap-4">
                    {pinnedNotes.map(n => <SortableNote key={n._id} note={n} />)}
                  </div>
                </SortableContext>
              </DndContext>
            </section>
          )}

          {/* All notes grid */}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={otherNotes.map(n => n._id)} strategy={rectSortingStrategy}>
              <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
                {otherNotes.map(n => <SortableNote key={n._id} note={n} />)}
              </div>
            </SortableContext>
          </DndContext>
        </main>
      </div>
    </div>
  );
};

export default NotesPage;
