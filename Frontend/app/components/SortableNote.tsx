"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import NoteCard from "./NoteCard";

const SortableNote = ({ note }: { note: any }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: note._id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: isDragging ? "grabbing" : "grab",
    breakInside: "avoid",
    // WebkitColumnBreakInside: "avoid"
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-4">
      <NoteCard note={note} />
    </div>
  );
};

export default SortableNote;
