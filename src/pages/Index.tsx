
import { useState } from "react";
import { Note } from "@/types/Note";
import { NoteCard } from "@/components/NoteCard";
import { NoteForm } from "@/components/NoteForm";
import { Button } from "@/components/ui/button";
import { Plus, LayoutDashboard } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-green-300 to-blue-500">
      {/* Navbar */}
      <nav className="backdrop-blur-md bg-white/30 border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <span className="text-2xl font-bold text-white">Muzammil.io</span>
            <div className="flex items-center gap-6">
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/20 gap-2"
                onClick={() => console.log("Dashboard clicked")}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-12">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">Feedback Notes</h1>
                <p className="text-white/80 mt-1">
                  Capture and manage your feedback with AI assistance
                </p>
              </div>
              {!isAdding && !editingNote && (
                <Button 
                  onClick={() => setIsAdding(true)} 
                  className="gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-white/20"
                >
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
                <p className="text-white/80">No feedback notes yet. Add your first note!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
