
import { Card } from "@/components/ui/card";
import { StarRating } from "./StarRating";
import { Note } from "@/types/Note";
import { formatDistanceToNow } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

export const NoteCard = ({ note, onEdit, onDelete }: NoteCardProps) => {
  return (
    <Card className="p-6 space-y-4 animate-fade-in backdrop-blur-sm bg-white/90 hover:bg-white/95 transition-all duration-300">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{note.title}</h3>
          <p className="text-sm text-gray-500">
            {formatDistanceToNow(note.created_at, { addSuffix: true })}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(note)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Pencil className="h-4 w-4 text-gray-600" />
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="p-2 hover:bg-red-100 rounded-full transition-colors"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </button>
        </div>
      </div>
      <p className="text-gray-700">{note.description}</p>
      <StarRating rating={note.rating} readonly />
    </Card>
  );
};
