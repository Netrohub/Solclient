import { Activity, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { ReinforcementQueue } from "@/components/dashboard/ReinforcementQueue";
import { AlertPanel } from "@/components/dashboard/AlertPanel";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchActivityFeed,
  fetchAlerts,
  fetchDashboardMetrics,
  fetchGuildStats,
  fetchReinforcements,
} from "@/lib/dashboard-api";
import { formatNumber, formatRelativeTimestamp } from "@/lib/format";

const Overview = () => {
  const { selectedGuildId } = useAuth();

  const metricsQuery = useQuery({
    queryKey: ["guild", selectedGuildId, "metrics"],
    queryFn: () => fetchDashboardMetrics(selectedGuildId!),
    enabled: Boolean(selectedGuildId),
    refetchInterval: 60000,
  });

  const statsQuery = useQuery({
    queryKey: ["guild", selectedGuildId, "stats"],
    queryFn: () => fetchGuildStats(selectedGuildId!),
    enabled: Boolean(selectedGuildId),
    refetchInterval: 300000,
  });

  const reinforcementsQuery = useQuery({
    queryKey: ["guild", selectedGuildId, "reinforcements"],
    queryFn: () => fetchReinforcements(selectedGuildId!),
    enabled: Boolean(selectedGuildId),
    refetchInterval: 60000,
  });

  const alertsQuery = useQuery({
    queryKey: ["guild", selectedGuildId, "alerts"],
    queryFn: () => fetchAlerts(selectedGuildId!),
    enabled: Boolean(selectedGuildId),
    refetchInterval: 60000,
  });

  const activityQuery = useQuery({
    queryKey: ["guild", selectedGuildId, "activity-feed"],
    queryFn: () => fetchActivityFeed(selectedGuildId!),
    enabled: Boolean(selectedGuildId),
    refetchInterval: 60000,
  });

  const formattedActivities = useMemo(
    () =>
      (activityQuery.data ?? []).map((activity) => ({
        ...activity,
        timestamp: formatRelativeTimestamp(activity.timestamp),
      })),
    [activityQuery.data]
  );

  if (!selectedGuildId) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-center">
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold">Select a guild to get started</h1>
          <p className="text-muted-foreground max-w-md">
            Choose a Discord server from the selector above to load live reinforcement metrics,
            alerts, and moderator performance data.
          </p>
        </div>
      </div>
    );
  }

  const metrics = metricsQuery.data;
  const activeReinforcements =
    typeof metrics?.activeReinforcements === "number" ? metrics.activeReinforcements : null;
  const avgResponseMinutes =
    typeof metrics?.avgResponseMinutes === "number" ? metrics.avgResponseMinutes : null;
  const activeAlerts =
    typeof metrics?.activeAlerts === "number" ? metrics.activeAlerts : null;
  const completionRate =
    typeof metrics?.completionRate === "number" ? metrics.completionRate : null;
  const totalCompletedToday =
    typeof metrics?.totalCompletedToday === "number" ? metrics.totalCompletedToday : null;
  const guildStats = statsQuery.data;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="gradient-primary rounded-xl p-6 md:p-8 text-white shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Discord Reinforcement Command Center
        </h1>
        <p className="text-white/90 text-sm md:text-base max-w-2xl">
          Monitoring reinforcement requests, alerts, and community health in real time to keep your guild running smoothly.
        </p>
        {guildStats && (
          <div className="mt-4 flex flex-wrap gap-4 text-xs md:text-sm text-white/80">
            <span>{formatNumber(guildStats.totalMembers)} members</span>
            <span>•</span>
            <span>{formatNumber(guildStats.totalMessages)} tracked messages</span>
            <span>•</span>
            <span>{formatNumber(guildStats.totalPoints)} total reinforcement points</span>
          </div>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Reinforcements"
          value={
            activeReinforcements !== null ? formatNumber(activeReinforcements) : "—"
          }
          change={
            totalCompletedToday !== null
              ? `${formatNumber(totalCompletedToday)} completed today`
              : undefined
          }
          changeType="neutral"
          icon={Activity}
        />
        <MetricCard
          title="Avg Response Time"
          value={
            avgResponseMinutes !== null ? `${avgResponseMinutes.toFixed(1)} min` : "—"
          }
          change={avgResponseMinutes !== null ? "Based on active assignments" : undefined}
          changeType="positive"
          icon={Clock}
        />
        <MetricCard
          title="Active Alerts"
          value={activeAlerts !== null ? formatNumber(activeAlerts) : "—"}
          change={
            activeAlerts !== null
              ? activeAlerts > 0
                ? "Needs attention"
                : "All clear"
              : undefined
          }
          changeType={
            activeAlerts !== null && activeAlerts > 0 ? "negative" : "positive"
          }
          icon={AlertCircle}
        />
        <MetricCard
          title="Completion Rate"
          value={completionRate !== null ? `${completionRate.toFixed(1)}%` : "—"}
          change={completionRate !== null ? "Resolved warnings vs total" : undefined}
          changeType="positive"
          icon={CheckCircle2}
        />
      </div>

      {/* Alerts & Queue Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AlertPanel alerts={alertsQuery.data ?? []} isLoading={alertsQuery.isLoading} />
        <ReinforcementQueue
          reinforcements={reinforcementsQuery.data ?? []}
          isLoading={reinforcementsQuery.isLoading}
        />
      </div>

      {/* Activity Feed */}
      <ActivityFeed activities={formattedActivities} isLoading={activityQuery.isLoading} />
    </div>
  );
};

export default Overview;
