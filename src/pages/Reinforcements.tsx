import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ReinforcementQueue } from "@/components/dashboard/ReinforcementQueue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchActivityFeed,
  fetchDashboardMetrics,
  fetchReinforcements,
} from "@/lib/dashboard-api";
import { formatNumber, formatRelativeTimestamp } from "@/lib/format";

const Reinforcements = () => {
  const { selectedGuildId } = useAuth();

  const metricsQuery = useQuery({
    queryKey: ["guild", selectedGuildId, "metrics"],
    queryFn: () => fetchDashboardMetrics(selectedGuildId!),
    enabled: Boolean(selectedGuildId),
    refetchInterval: 60000,
  });

  const reinforcementsQuery = useQuery({
    queryKey: ["guild", selectedGuildId, "reinforcements"],
    queryFn: () => fetchReinforcements(selectedGuildId!),
    enabled: Boolean(selectedGuildId),
    refetchInterval: 45000,
  });

  const activityQuery = useQuery({
    queryKey: ["guild", selectedGuildId, "activity-feed"],
    queryFn: () => fetchActivityFeed(selectedGuildId!),
    enabled: Boolean(selectedGuildId),
    refetchInterval: 60000,
  });

  const metrics = metricsQuery.data;
  const reinforcements = reinforcementsQuery.data ?? [];
  const activeQueue = reinforcements.length ?? null;
  const avgResponseMinutes =
    typeof metrics?.avgResponseMinutes === "number" ? metrics.avgResponseMinutes : null;
  const totalCompletedToday =
    typeof metrics?.totalCompletedToday === "number" ? metrics.totalCompletedToday : null;
  const highPriorityCount = reinforcements.filter(
    (item) => item.status === "queued" && (item.priority === "urgent" || item.priority === "high")
  ).length;

  const overdueCount = useMemo(
    () =>
      reinforcements.filter(
        (item) => item.status === "queued" && (item.priority === "urgent" || item.priority === "high")
      ).length,
    [reinforcements]
  );

  const recentActions = useMemo(
    () =>
      (activityQuery.data ?? [])
        .slice(0, 6)
        .map((item) => ({
          id: item.id,
          mod: item.user,
          action: item.action,
          time: formatRelativeTimestamp(item.timestamp),
        })),
    [activityQuery.data]
  );

  if (!selectedGuildId) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-center">
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold">Select a guild to manage reinforcements</h1>
          <p className="text-muted-foreground max-w-md">
            Choose a server to view the current reinforcement queue, assignment load, and recent moderator actions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Reinforcement Queue</h1>
          <p className="text-muted-foreground mt-1">
            Monitor, prioritize, and assign reinforcement requests from your community.
          </p>
        </div>
        <Button variant="outline" className="self-start md:self-center" disabled>
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Queue Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Active Queue</p>
            <p className="text-2xl font-bold">
              {activeQueue !== null ? formatNumber(activeQueue) : "—"}
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Avg Response</p>
            <p className="text-2xl font-bold">
              {avgResponseMinutes !== null ? `${avgResponseMinutes.toFixed(1)}m` : "—"}
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Completed Today</p>
            <p className="text-2xl font-bold text-success">
              {totalCompletedToday !== null ? formatNumber(totalCompletedToday) : "—"}
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-1">High Priority</p>
            <p className="text-2xl font-bold text-destructive">
              {formatNumber(highPriorityCount)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Queue */}
      <ReinforcementQueue
        reinforcements={reinforcements}
        isLoading={reinforcementsQuery.isLoading}
      />

      {/* Recent Activity */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Recent Moderator Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activityQuery.isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-12 rounded-lg bg-secondary/40 animate-pulse" />
              ))
            ) : recentActions.length > 0 ? (
              recentActions.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">{activity.mod}</span>
                    <span className="text-muted-foreground">{activity.action}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">
                No recent reinforcement actions logged.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reinforcements;
