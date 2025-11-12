import { useMemo } from "react";
import { Search, Bell, Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";

interface TopBarProps {
  onMenuClick: () => void;
}

export const TopBar = ({ onMenuClick }: TopBarProps) => {
  const { user, guilds, selectedGuildId, setSelectedGuildId, logout } = useAuth();

  const initials = useMemo(() => {
    if (!user?.username) return "NA";
    const parts = (user.global_name ?? user.username).split(" ").filter(Boolean);
    if (parts.length === 0) return user.username.slice(0, 2).toUpperCase();
    return parts.map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  }, [user]);

  return (
    <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        {/* Left: Menu Button (mobile) + Search */}
        <div className="flex items-center gap-2 flex-1 max-w-2xl">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div className="relative flex-1 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-10 bg-secondary/50 border-0 focus-visible:ring-primary"
            />
          </div>

          <div className="hidden md:flex items-center gap-2 min-w-[220px]">
            <Select
              value={selectedGuildId ?? undefined}
              onValueChange={setSelectedGuildId}
              disabled={guilds.length === 0}
            >
              <SelectTrigger className="bg-secondary/60 border-0 focus:ring-primary focus:ring-offset-0">
                <SelectValue placeholder="Select guild" />
              </SelectTrigger>
              <SelectContent>
                {guilds.map((guild) => (
                  <SelectItem key={guild.id} value={guild.id}>
                    {guild.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Right: Notifications + Profile */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex"
            onClick={logout}
            title="Sign out"
          >
            <LogOut className="w-5 h-5" />
          </Button>

          <Avatar className="w-9 h-9 border border-primary/40">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};
