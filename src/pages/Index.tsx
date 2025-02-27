
import { useState, useEffect } from "react";
import { Note } from "@/types/Note";
import { NoteCard } from "@/components/NoteCard";
import { NoteForm } from "@/components/NoteForm";
import { Button } from "@/components/ui/button";
import { Plus, LayoutDashboard, Save, Clock, Star, User, MessageSquare, Facebook, Youtube, Github, Linkedin, LogOut } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Index = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchNotes();
  }, [filter]);

  const fetchNotes = async () => {
    try {
      let query = supabase
        .from('notes')
        .select('*');
      
      // Apply filters based on dropdown selection
      if (filter === 'recent') {
        query = query.order('created_at', { ascending: false }).limit(5);
      } else if (filter === 'top-rated') {
        query = query.order('rating', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }
      
      const { data, error } = await query;

      if (error) throw error;

      setNotes(data.map(note => ({
        ...note,
        created_at: new Date(note.created_at)
      })));
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch notes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNote = async (noteData: Omit<Note, "id" | "user_id" | "created_at">) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to add notes.",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('notes')
        .insert([{ ...noteData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      setNotes([{ ...data, created_at: new Date(data.created_at) }, ...notes]);
      setIsAdding(false);
      toast({
        title: "Note added",
        description: "Your feedback note has been successfully added.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add note. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditNote = async (noteData: Omit<Note, "id" | "user_id" | "created_at">) => {
    if (!editingNote) return;

    try {
      const { data, error } = await supabase
        .from('notes')
        .update(noteData)
        .eq('id', editingNote.id)
        .select()
        .single();

      if (error) throw error;

      const updatedNotes = notes.map((note) =>
        note.id === editingNote.id
          ? { ...data, created_at: new Date(data.created_at) }
          : note
      );
      setNotes(updatedNotes);
      setEditingNote(null);
      toast({
        title: "Note updated",
        description: "Your feedback note has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update note. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setNotes(notes.filter((note) => note.id !== id));
      toast({
        title: "Note deleted",
        description: "Your feedback note has been removed.",
        variant: "destructive",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete note. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSaveNotes = async () => {
    toast({
      title: "Notes saved",
      description: "Your notes have been saved successfully.",
    });
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-700 via-gray-900 to-black flex flex-col">
      <nav className="backdrop-blur-md bg-black/30 border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-8 w-8 text-white animate-pulse" />
              <span className="text-2xl font-bold text-white tracking-tight">Muzammil.io</span>
            </div>
            <div className="flex items-center gap-6">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="text-white hover:bg-white/20 gap-2"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40">
                  <DropdownMenuItem onClick={handleSaveNotes}>
                    <Save className="mr-2 h-4 w-4" />
                    <span>Save Notes</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter('recent')}>
                    <Clock className="mr-2 h-4 w-4" />
                    <span>Recent Notes</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter('top-rated')}>
                    <Star className="mr-2 h-4 w-4" />
                    <span>Most Rated</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter(null)}>
                    <User className="mr-2 h-4 w-4" />
                    <span>All Notes</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="ghost"
                className="text-white hover:bg-white/20 gap-2"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-1 py-12">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">Feedback Notes</h1>
                <p className="text-white/80 mt-1">
                  {filter === 'recent' 
                    ? 'Your most recent feedback notes' 
                    : filter === 'top-rated' 
                      ? 'Your highest rated feedback notes'
                      : 'Capture and manage your feedback with AI assistance'}
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

            {notes.length === 0 && !isAdding && !isLoading && (
              <div className="text-center py-12">
                <p className="text-white/80">No feedback notes yet. Add your first note!</p>
              </div>
            )}

            {isLoading && (
              <div className="text-center py-12">
                <p className="text-white/80">Loading notes...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="backdrop-blur-md bg-black/30 border-t border-white/10 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-6 w-6 text-white" />
              <span className="text-lg font-semibold text-white">Muzammil.io</span>
            </div>
            <div className="flex space-x-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/80 transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/80 transition-colors">
                <Youtube className="h-6 w-6" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/80 transition-colors">
                <Github className="h-6 w-6" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/80 transition-colors">
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
            <p className="text-white/60 text-sm">© 2024 Muzammil.io. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
