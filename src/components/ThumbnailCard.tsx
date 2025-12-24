import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Check } from "lucide-react";
import { toast } from "sonner";

interface ThumbnailCardProps {
  imageUrl: string;
  index: number;
  topic?: string;
  createdAt?: string;
  onRegenerate?: () => void;
  showMeta?: boolean;
}

const ThumbnailCard = ({ 
  imageUrl, 
  index, 
  topic, 
  createdAt, 
  onRegenerate,
  showMeta = false 
}: ThumbnailCardProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `thumbnail-${index + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      setDownloaded(true);
      toast.success("Thumbnail downloaded!");
      setTimeout(() => setDownloaded(false), 2000);
    } catch (error) {
      toast.error("Failed to download thumbnail");
    } finally {
      setIsDownloading(false);
    }
  };

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div 
      className="group relative overflow-hidden rounded-xl border border-border bg-card animate-scale-in soft-shadow hover:soft-shadow-lg transition-all duration-300"
      style={{ 
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Glowing border effect on hover */}
      <div 
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ring-2 ring-primary/30"
      />
      
      <div className="thumbnail-aspect overflow-hidden relative">
        {/* Placeholder skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 animate-shimmer rounded-lg" />
        )}
        
        <img
          src={imageUrl}
          alt={topic || `Generated thumbnail ${index + 1}`}
          className={`h-full w-full object-cover transition-all duration-500 group-hover:scale-105 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
        />
      </div>
      
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
        {showMeta && (
          <div className="text-left">
            {topic && (
              <p className="text-sm font-medium text-background truncate mb-1">
                {topic}
              </p>
            )}
            {formattedDate && (
              <p className="text-xs text-background/70">{formattedDate}</p>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-background">
            {showMeta ? "" : `Thumbnail ${index + 1}`}
          </span>
          <div className="flex gap-2">
            {onRegenerate && (
              <Button
                variant="secondary"
                size="sm"
                onClick={onRegenerate}
                className="h-9"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="youtube"
              size="sm"
              onClick={handleDownload}
              disabled={isDownloading}
              className="h-10 px-4 font-semibold glow-red"
            >
              {downloaded ? (
                <>
                  <Check className="h-4 w-4" />
                  Done
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Download
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThumbnailCard;
