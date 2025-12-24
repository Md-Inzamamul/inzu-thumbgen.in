import { useThumbnailHistory } from "@/hooks/useThumbnailHistory";
import ThumbnailCard from "./ThumbnailCard";
import { History, ImageIcon, Loader2 } from "lucide-react";

const ThumbnailHistory = () => {
  const { thumbnails, loading, count } = useThumbnailHistory();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (thumbnails.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center rounded-2xl border-2 border-dashed border-border bg-muted/30">
        <div className="mb-4 rounded-2xl bg-primary/10 p-4">
          <ImageIcon className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No history yet
        </h3>
        <p className="text-sm text-muted-foreground">
          Your generated thumbnails will be saved here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Your History</h2>
        </div>
        <span className="text-sm font-medium text-primary px-3 py-1 rounded-full bg-primary/10">
          {count} total
        </span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {thumbnails.map((thumbnail, index) => (
          <ThumbnailCard
            key={thumbnail.id}
            imageUrl={thumbnail.image_url}
            index={index}
            topic={thumbnail.topic}
            createdAt={thumbnail.created_at}
            showMeta
          />
        ))}
      </div>
    </div>
  );
};

export default ThumbnailHistory;
