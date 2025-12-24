import ThumbnailCard from "./ThumbnailCard";
import { ImageIcon, Sparkles } from "lucide-react";

interface ThumbnailGalleryProps {
  thumbnails: string[];
  isLoading: boolean;
}

const ThumbnailGallery = ({ thumbnails, isLoading }: ThumbnailGalleryProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          Generating...
        </h2>
        <div className="grid gap-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="thumbnail-aspect rounded-xl animate-shimmer border border-border"
            />
          ))}
        </div>
      </div>
    );
  }

  if (thumbnails.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border-2 border-dashed border-border bg-muted/30">
        <div className="mb-4 rounded-2xl bg-primary/10 p-6">
          <ImageIcon className="h-10 w-10 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Preview Area
        </h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Your generated thumbnails will appear here. Enter your video topic and click generate to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">
          Generated Thumbnails
        </h2>
        <span className="text-sm font-medium text-primary px-3 py-1 rounded-full bg-primary/10">
          {thumbnails.length} thumbnail{thumbnails.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="grid gap-4">
        {thumbnails.map((url, index) => (
          <ThumbnailCard key={`${url}-${index}`} imageUrl={url} index={index} />
        ))}
      </div>
    </div>
  );
};

export default ThumbnailGallery;
