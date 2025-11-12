import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReinforcementCard } from "./ReinforcementCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { ReinforcementItem } from "@/types/api";

interface ReinforcementQueueProps {
  reinforcements: ReinforcementItem[];
  isLoading?: boolean;
}

export const ReinforcementQueue = ({ reinforcements, isLoading = false }: ReinforcementQueueProps) => {
  const queued = reinforcements.filter((reinforcement) => reinforcement.status === "queued");
  const inProgress = reinforcements.filter((reinforcement) => reinforcement.status === "in_progress");

  const renderSkeletons = () =>
    Array.from({ length: 3 }).map((_, index) => (
      <Skeleton key={index} className="h-24 w-full rounded-xl" />
    ));

  return (
    <Card className="shadow-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl">Reinforcement Queue</CardTitle>
        <Button size="sm" variant="outline" className="text-xs sm:text-sm" disabled>
          <Plus className="w-4 h-4 mr-1.5" />
          <span className="hidden sm:inline">Create Request</span>
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="queued" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="queued" className="text-xs sm:text-sm">
              Queued ({queued.length})
            </TabsTrigger>
            <TabsTrigger value="in_progress" className="text-xs sm:text-sm">
              In Progress ({inProgress.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="queued" className="space-y-3 mt-0">
            {isLoading ? (
              renderSkeletons()
            ) : queued.length > 0 ? (
              queued.map((reinforcement) => (
                <ReinforcementCard key={reinforcement.id} {...reinforcement} />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No queued reinforcements
              </div>
            )}
          </TabsContent>

          <TabsContent value="in_progress" className="space-y-3 mt-0">
            {isLoading ? (
              renderSkeletons()
            ) : inProgress.length > 0 ? (
              inProgress.map((reinforcement) => (
                <ReinforcementCard key={reinforcement.id} {...reinforcement} />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No reinforcements in progress
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};