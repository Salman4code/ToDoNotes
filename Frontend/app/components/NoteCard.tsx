import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface NoteCardProps {
  note: {
    _id: string;
    title: string;
    content: string;
  };
}

const NoteCard = ({ note }: NoteCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: note._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: "16px",
    background: "#fff",
    borderRadius: "10px",
    marginBottom: "12px",
    border: "1px solid #ddd",
    cursor: "grab",
    boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <h3 style={{ margin: 0, fontSize: "18px" }}>{note.title}</h3>
      <p style={{ marginTop: "6px", fontSize: "15px", whiteSpace: "pre-wrap" }}>
        {note.content}
      </p>
    </div>
  );
};

export default NoteCard;
