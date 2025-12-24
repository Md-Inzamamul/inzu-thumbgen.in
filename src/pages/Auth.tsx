import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Mail, Lock, Play, Camera, X } from "lucide-react";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const authSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setAvatarPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const validation = authSchema.safeParse({ email, password });
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      setIsLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast.error("Invalid email or password");
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success("Welcome back!");
          navigate("/");
        }
      } else {
        const { error } = await signUp(email, password, avatarFile || undefined);
        if (error) {
          if (error.message.includes("User already registered")) {
            toast.error("This email is already registered. Please sign in instead.");
          } else if (error.message.includes("password") && error.message.includes("leak")) {
            toast.error("This password has been found in a data breach. Please choose a different, more secure password.");
          } else if (error.message.includes("weak_password") || error.message.includes("too weak")) {
            toast.error("Password is too weak. Please use a stronger password with at least 8 characters.");
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success("Account created successfully!");
          navigate("/");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
              <Play className="h-7 w-7 fill-primary-foreground text-primary-foreground" />
            </div>
            <span className="text-2xl font-extrabold text-foreground">ThumbGen</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {isLogin ? "Welcome back" : "Create account"}
          </h1>
          <p className="text-muted-foreground">
            {isLogin
              ? "Sign in to continue creating thumbnails"
              : "Sign up to start generating thumbnails"}
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-card border border-border soft-shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Avatar Upload - Only show on signup */}
            {!isLogin && (
              <div className="flex flex-col items-center gap-3">
                <div className="relative group">
                  <Avatar className="h-20 w-20 border-2 border-border group-hover:border-primary transition-colors">
                    <AvatarImage src={avatarPreview || undefined} alt="Profile" />
                    <AvatarFallback className="bg-muted text-muted-foreground">
                      <Camera className="h-8 w-8" />
                    </AvatarFallback>
                  </Avatar>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                  >
                    <Camera className="h-6 w-6 text-white" />
                  </button>
                  {avatarPreview && (
                    <button
                      type="button"
                      onClick={removeAvatar}
                      className="absolute -top-1 -right-1 h-6 w-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground">
                  Upload profile picture (optional)
                </p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="pl-10 h-12 bg-background border-border"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 h-12 bg-background border-border"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="youtube"
              size="xl"
              className="w-full glow-red"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {isLogin ? "Signing in..." : "Creating account..."}
                </>
              ) : (
                <>{isLogin ? "Sign In" : "Create Account"}</>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  removeAvatar();
                }}
                className="text-primary hover:underline font-semibold"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;