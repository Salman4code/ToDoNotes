import { Schema, model, Document } from "mongoose";

export interface ITodoItem {
  text: string;
  completed: boolean;
}

export interface INote extends Document {
  title: string;
  description?: string;
  type: "text" | "todo";
  todos?: ITodoItem[];
  color: string;
  isPinned: boolean;
  isArchived: boolean;
  createdAt: Date;
  order: number; 
}

const TodoItemSchema = new Schema<ITodoItem>({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const NoteSchema = new Schema<INote>(
  {
    title: { type: String, required: true },
    description: String,
    type: { type: String, enum: ["text", "todo"], default: "text" },
    todos: [TodoItemSchema],
    color: { type: String, default: "#ffffff" },
    isPinned: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    order: { type: Number, default: 0 }, // 👈 added
  },
  { timestamps: true }
);

export default model<INote>("Note", NoteSchema);
