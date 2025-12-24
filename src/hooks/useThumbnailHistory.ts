import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface ThumbnailRecord {
  id: string;
  image_url: string;
  topic: string;
  context: string | null;
  style: string;
  created_at: string;
}

export const useThumbnailHistory = () => {
  const { user } = useAuth();
  const [thumbnails, setThumbnails] = useState<ThumbnailRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);

  const fetchThumbnails = async () => {
    if (!user) {
      setThumbnails([]);
      setCount(0);
      setLoading(false);
      return;
    }

    try {
      const { data, error, count: totalCount } = await supabase
        .from("thumbnails")
        .select("*", { count: "exact" })
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setThumbnails(data || []);
      setCount(totalCount || 0);
    } catch (error) {
      console.error("Error fetching thumbnails:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveThumbnail = async (
    imageUrl: string,
    topic: string,
    context: string,
    style: string
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase.from("thumbnails").insert({
        user_id: user.id,
        image_url: imageUrl,
        topic,
        context: context || null,
        style,
      });

      if (error) throw error;

      // Refresh the list
      fetchThumbnails();
    } catch (error) {
      console.error("Error saving thumbnail:", error);
    }
  };

  useEffect(() => {
    fetchThumbnails();
  }, [user]);

  return { thumbnails, loading, count, saveThumbnail, refetch: fetchThumbnails };
};
