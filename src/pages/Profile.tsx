import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowLeft, Camera, Loader2, Trash2, AlertTriangle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Header from "@/components/Header";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Profile = () => {
  const { user, profile, uploadAvatar, updateProfile, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setIsUploading(true);
    try {
      const { url, error: uploadError } = await uploadAvatar(file);
      if (uploadError) throw uploadError;
      
      if (url) {
        const { error: updateError } = await updateProfile({ avatar_url: url });
        if (updateError) throw updateError;
        toast.success("Profile picture updated!");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile picture");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      toast.error("Please type DELETE to confirm");
      return;
    }

    setIsDeleting(true);
    try {
      const { error } = await deleteAccount();
      if (error) throw error;
      
      toast.success("Account deleted successfully");
      navigate("/auth");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete account");
    } finally {
      setIsDeleting(false);
    }
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container max-w-lg">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>

          <div className="p-8 rounded-2xl bg-card border border-border soft-shadow-lg">
            <h1 className="text-2xl font-bold text-foreground mb-6">Profile Settings</h1>

            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4 mb-8">
              <div className="relative group">
                <Avatar className="h-24 w-24 border-4 border-border group-hover:border-primary transition-colors">
                  <AvatarImage src={profile?.avatar_url || undefined} alt="Profile" />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                    {user.email ? getInitials(user.email) : "U"}
                  </AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <Loader2 className="h-6 w-6 text-white animate-spin" />
                  ) : (
                    <Camera className="h-6 w-6 text-white" />
                  )}
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <p className="text-sm text-muted-foreground">
                Click to change profile picture
              </p>
            </div>

            {/* Email (Read-only) */}
            <div className="space-y-2 mb-8">
              <label className="text-sm font-semibold text-foreground">Email</label>
              <Input
                type="email"
                value={user.email || ""}
                disabled
                className="h-12 bg-muted border-border"
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed
              </p>
            </div>

            {/* Danger Zone */}
            <div className="pt-6 border-t border-border">
              <h2 className="text-lg font-semibold text-destructive mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Danger Zone
              </h2>
              
              <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/5">
                <p className="text-sm text-muted-foreground mb-4">
                  Permanently delete your account and all associated data including your profile, 
                  profile picture, and all generated thumbnails. This action cannot be undone.
                </p>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="h-5 w-5" />
                        Delete Account?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="space-y-3">
                        <p>
                          This will permanently delete your account and remove all your data from our servers:
                        </p>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          <li>Your profile information</li>
                          <li>Your profile picture</li>
                          <li>All your generated thumbnails</li>
                        </ul>
                        <p className="font-medium text-foreground pt-2">
                          Type <span className="text-destructive font-bold">DELETE</span> to confirm:
                        </p>
                        <Input
                          value={deleteConfirmText}
                          onChange={(e) => setDeleteConfirmText(e.target.value)}
                          placeholder="Type DELETE to confirm"
                          className="mt-2"
                        />
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setDeleteConfirmText("")}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        disabled={deleteConfirmText !== "DELETE" || isDeleting}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {isDeleting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          "Delete Account"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;