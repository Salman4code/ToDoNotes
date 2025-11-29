// lib/types.ts
export interface TodoItem {
  text: string;
  completed: boolean;
}

export type NoteType = "text" | "todo";

export interface Note {
  content: any;
  _id: string;
  title: string;
  description?: string;
  type: NoteType;
  todos?: TodoItem[];
  color?: string;
  isPinned?: boolean;
  isArchived?: boolean;
  createdAt?: string;
}
