"use client";

import { useEffect, useState } from "react";
import NoteCard from "@/app/components/NoteCard";
import NoteForm from "@/app/components/NoteForm";

import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  closestCenter,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

interface Note {
  _id: string;
  title: string;
  content: string;
}

const NotesPage = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState("");

  // Fetch all notes
  const fetchNotes = async () => {
    const res = await fetch("http://localhost:8000/api/notes");
    const data = await res.json();
    setNotes(data);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = notes.findIndex((n) => n._id === active.id);
    const newIndex = notes.findIndex((n) => n._id === over.id);

    const newOrder = arrayMove(notes, oldIndex, newIndex);
    setNotes(newOrder);

    // Update backend
    await fetch("http://localhost:8000/api/notes/reorder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderedIds: newOrder.map((n) => n._id),
      }),
    });
  };

  // Filter notes based on search text
  // const filtered = notes.filter((n) =>
  //   (n.title + n.content).toLowerCase().includes(search.toLowerCase())
  // );

  const filtered = notes.filter((note) =>
  note.title.toLowerCase().includes(search.toLowerCase()) ||
  note.content.toLowerCase().includes(search.toLowerCase())
);
  return (
    <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
      {/* GOOGLE KEEP STYLE SEARCH BAR */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          background: "white",
          paddingBottom: "15px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#f1f3f4",
            borderRadius: "8px",
            padding: "10px 15px",
            border: "1px solid #ddd",
          }}
        >
          <span
            style={{
              marginRight: "10px",
              opacity: 0.6,
              fontSize: "18px",
            }}
          >
            🔍
          </span>

          <input
            type="text"
            placeholder="Search your notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: "16px",
            }}
          />
        </div>
      </div>

      {/* ADD NOTE */}
      <NoteForm onAdded={fetchNotes} />

      {/* DRAGGABLE NOTES */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={filtered.map((n) => n._id)}
          strategy={verticalListSortingStrategy}
        >
          {filtered.map((note) => (
            <NoteCard key={note._id} note={note} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default NotesPage;
