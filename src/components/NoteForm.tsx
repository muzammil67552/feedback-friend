
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "./StarRating";
import { Note } from "@/types/Note";
import { Card } from "@/components/ui/card";
import { Wand2 } from "lucide-react";

interface NoteFormProps {
  initialNote?: Note;
  onSubmit: (note: Omit<Note, "id" | "timestamp">) => void;
  onCancel?: () => void;
}

export const NoteForm = ({ initialNote, onSubmit, onCancel }: NoteFormProps) => {
  const [title, setTitle] = useState(initialNote?.title ?? "");
  const [description, setDescription] = useState(initialNote?.description ?? "");
  const [rating, setRating] = useState(initialNote?.rating ?? 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description, rating });
  };

  const generateAIFeedback = async () => {
    // TODO: Implement AI feedback generation
    console.log("AI feedback generation to be implemented");
  };

  return (
    <Card className="p-6 animate-slide-up backdrop-blur-sm bg-white/90">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-semibold"
          />
        </div>
        <div>
          <Textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        <div className="flex items-center justify-between">
          <StarRating rating={rating} onRatingChange={setRating} />
          <Button
            type="button"
            variant="outline"
            onClick={generateAIFeedback}
            className="gap-2"
          >
            <Wand2 className="h-4 w-4" />
            AI Assist
          </Button>
        </div>
        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Card>
  );
};
