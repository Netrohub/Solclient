import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus } from "lucide-react";
import { ModWorkloadCard } from "@/components/dashboard/ModWorkloadCard";
import { useAuth } from "@/contexts/AuthContext";
import { fetchModerators } from "@/lib/dashboard-api";

const Team = () => {
  const { selectedGuildId } = useAuth();
  const [inviteOpen, setInviteOpen] = useState(false);

  const moderatorsQuery = useQuery({
    queryKey: ["guild", selectedGuildId, "moderators"],
    queryFn: () => fetchModerators(selectedGuildId!),
    enabled: Boolean(selectedGuildId),
    refetchInterval: 90000,
  });

  if (!selectedGuildId) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-center">
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold">Select a guild to view moderators</h1>
          <p className="text-muted-foreground max-w-md">
            Pick a server to review moderator workload, response scores, and active assignments.
          </p>
        </div>
      </div>
    );
  }

  const moderators = moderatorsQuery.data ?? [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Moderator Team</h1>
          <p className="text-muted-foreground mt-1">
            Monitor workload, performance, and assign reinforcements to keep response times low.
          </p>
        </div>

        <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-white" disabled>
              <UserPlus className="w-4 h-4 mr-2" />
              Add Moderator
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Moderator</DialogTitle>
              <DialogDescription>
                Invites are managed from the Discord developer portal. This workflow is coming soon.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="username">Discord Username</Label>
                <Input id="username" type="text" placeholder="username#0000" disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select defaultValue="moderator" disabled>
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lead">Lead Moderator</SelectItem>
                    <SelectItem value="senior">Senior Moderator</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="junior">Junior Moderator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setInviteOpen(false)}>
                Close
              </Button>
              <Button className="gradient-primary text-white" disabled>
                Send Invite
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Moderator Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {moderatorsQuery.isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-52 rounded-xl bg-secondary/40 animate-pulse" />
            ))
          : moderators.length > 0 ? (
              moderators.map(({ id, ...mod }) => (
                <ModWorkloadCard key={id ?? mod.name} {...mod} />
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-muted-foreground">
                No moderators found for this guild.
              </div>
            )}
      </div>
    </div>
  );
};

export default Team;
