import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  id: string;
  user_id: string;
  email: string | null;
  avatar_url: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, avatarFile?: File) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
  uploadAvatar: (file: File) => Promise<{ url: string | null; error: Error | null }>;
  deleteAccount: () => Promise<{ error: Error | null }>;
}

const defaultContext: AuthContextType = {
  user: null,
  session: null,
  profile: null,
  loading: true,
  signUp: async () => ({ error: new Error("AuthProvider not initialized") }),
  signIn: async () => ({ error: new Error("AuthProvider not initialized") }),
  signOut: async () => {},
  updateProfile: async () => ({ error: new Error("AuthProvider not initialized") }),
  uploadAvatar: async () => ({ url: null, error: new Error("AuthProvider not initialized") }),
  deleteAccount: async () => ({ error: new Error("AuthProvider not initialized") }),
};

const AuthContext = createContext<AuthContextType>(defaultContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();
    
    if (!error && data) {
      setProfile(data);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const uploadAvatar = async (file: File): Promise<{ url: string | null; error: Error | null }> => {
    if (!user) return { url: null, error: new Error("Not authenticated") };
    
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });
    
    if (uploadError) return { url: null, error: uploadError as Error };
    
    const { data: { publicUrl } } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);
    
    return { url: publicUrl, error: null };
  };

  const updateProfile = async (updates: Partial<Profile>): Promise<{ error: Error | null }> => {
    if (!user) return { error: new Error("Not authenticated") };
    
    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("user_id", user.id);
    
    if (!error) {
      setProfile(prev => prev ? { ...prev, ...updates } : null);
    }
    
    return { error: error as Error | null };
  };

  const signUp = async (email: string, password: string, avatarFile?: File) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    
    if (!error && data.user && avatarFile) {
      const { url } = await uploadAvatar(avatarFile);
      if (url) {
        await supabase
          .from("profiles")
          .update({ avatar_url: url })
          .eq("user_id", data.user.id);
      }
    }
    
    return { error: error as Error | null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  const deleteAccount = async (): Promise<{ error: Error | null }> => {
    if (!user) return { error: new Error("Not authenticated") };
    
    try {
      // Delete user's avatar files from storage
      const { data: avatarFiles } = await supabase.storage
        .from("avatars")
        .list(user.id);
      
      if (avatarFiles && avatarFiles.length > 0) {
        const filePaths = avatarFiles.map(file => `${user.id}/${file.name}`);
        await supabase.storage.from("avatars").remove(filePaths);
      }

      // Delete user's thumbnails from database
      const { error: thumbnailsError } = await supabase
        .from("thumbnails")
        .delete()
        .eq("user_id", user.id);
      
      if (thumbnailsError) throw thumbnailsError;

      // Delete user's profile from database
      const { error: profileError } = await supabase
        .from("profiles")
        .delete()
        .eq("user_id", user.id);
      
      if (profileError) throw profileError;

      // Sign out the user (account deletion requires admin API, so we sign out)
      await supabase.auth.signOut();
      setProfile(null);
      setUser(null);
      setSession(null);
      
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signUp, signIn, signOut, updateProfile, uploadAvatar, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
