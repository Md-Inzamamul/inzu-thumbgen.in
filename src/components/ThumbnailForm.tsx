import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Sparkles, Loader2 } from "lucide-react";

interface ThumbnailFormProps {
  onGenerate: (topic: string, context: string, style: string) => void;
  isLoading: boolean;
}

const styles = [
  { id: "vibrant", label: "Vibrant & Bold", description: "High contrast, bright colors" },
  { id: "minimal", label: "Minimal", description: "Clean, simple design" },
  { id: "dramatic", label: "Dramatic", description: "Dark, intense mood" },
  { id: "playful", label: "Playful", description: "Fun, colorful aesthetic" },
];

const ThumbnailForm = ({ onGenerate, isLoading }: ThumbnailFormProps) => {
  const [topic, setTopic] = useState("");
  const [context, setContext] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("vibrant");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onGenerate(topic, context, selectedStyle);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <label className="text-sm font-semibold text-foreground">
          Video Topic <span className="text-primary">*</span>
        </label>
        <Input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., How to Build a Gaming PC in 2024"
          className="h-12 bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary"
          required
        />
      </div>

      <div className="space-y-3">
        <label className="text-sm font-semibold text-foreground">
          Additional Context
        </label>
        <Textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="Describe the vibe, key elements, or specific imagery you want in your thumbnail..."
          className="min-h-[100px] bg-background border-border text-foreground placeholder:text-muted-foreground resize-none focus:ring-primary focus:border-primary"
        />
        <p className="text-xs text-muted-foreground">
          <span className="font-medium">Tip:</span> Write the exact text you want on the thumbnail, for example: 
          <span className="text-foreground"> "Big bold text: Earn ₹10,000 Daily"</span>
        </p>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-semibold text-foreground">Style</label>
        <div className="grid grid-cols-2 gap-3">
          {styles.map((style) => (
            <button
              key={style.id}
              type="button"
              onClick={() => setSelectedStyle(style.id)}
              className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                selectedStyle === style.id
                  ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                  : "border-border bg-background hover:border-primary/30 hover:bg-muted/30"
              }`}
            >
              <span className="block text-sm font-semibold text-foreground">
                {style.label}
              </span>
              <span className="block text-xs text-muted-foreground mt-1">
                {style.description}
              </span>
            </button>
          ))}
        </div>
      </div>

      <Button
        type="submit"
        variant="youtube"
        size="xl"
        className="w-full glow-red"
        disabled={isLoading || !topic.trim()}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5" />
            Generate Thumbnails
          </>
        )}
      </Button>
    </form>
  );
};

export default ThumbnailForm;
