import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Play, LogOut, User, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/auth");
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container flex h-16 items-center justify-between">
        {/* Left - Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Play className="h-4 w-4 fill-primary-foreground text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">ThumbGen</span>
        </div>
        
        {/* Center/Right - Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            How it works
          </a>
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Examples
          </a>
        </nav>

        {/* Right - Auth */}
        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-1.5 rounded-full hover:bg-muted transition-colors group">
                  <Avatar className="h-8 w-8 border-2 border-transparent group-hover:border-primary/50 transition-colors">
                    <AvatarImage src={profile?.avatar_url || undefined} alt="Profile" />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {user.email ? getInitials(user.email) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-sm text-foreground max-w-[120px] truncate">
                    {user.email}
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="youtube"
              size="sm"
              onClick={() => navigate("/auth")}
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;