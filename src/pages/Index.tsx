
import { useState } from "react";
import { Note } from "@/types/Note";
import { NoteCard } from "@/components/NoteCard";
import { NoteForm } from "@/components/NoteForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const { toast } = useToast();

  const handleAddNote = (noteData: Omit<Note, "id" | "timestamp">) => {
    const newNote: Note = {
      ...noteData,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    };
    setNotes([newNote, ...notes]);
    setIsAdding(false);
    toast({
      title: "Note added",
      description: "Your feedback note has been successfully added.",
    });
  };

  const handleEditNote = (noteData: Omit<Note, "id" | "timestamp">) => {
    if (!editingNote) return;
    const updatedNotes = notes.map((note) =>
      note.id === editingNote.id
        ? { ...note, ...noteData }
        : note
    );
    setNotes(updatedNotes);
    setEditingNote(null);
    toast({
      title: "Note updated",
      description: "Your feedback note has been successfully updated.",
    });
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
    toast({
      title: "Note deleted",
      description: "Your feedback note has been removed.",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Feedback Notes</h1>
              <p className="text-gray-500 mt-1">
                Capture and manage your feedback with AI assistance
              </p>
            </div>
            {!isAdding && !editingNote && (
              <Button onClick={() => setIsAdding(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Note
              </Button>
            )}
          </div>

          {(isAdding || editingNote) && (
            <NoteForm
              initialNote={editingNote ?? undefined}
              onSubmit={editingNote ? handleEditNote : handleAddNote}
              onCancel={() => {
                setIsAdding(false);
                setEditingNote(null);
              }}
            />
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={setEditingNote}
                onDelete={handleDeleteNote}
              />
            ))}
          </div>

          {notes.length === 0 && !isAdding && (
            <div className="text-center py-12">
              <p className="text-gray-500">No feedback notes yet. Add your first note!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
