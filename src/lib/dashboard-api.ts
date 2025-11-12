import { api } from "@/lib/api";
import type {
  ActivityItem,
  ActivityTrendPoint,
  AlertItem,
  AnalyticsPayload,
  DashboardMetrics,
  DiscordGuild,
  GuildStats,
  LeaderboardEntry,
  ModeratorWorkload,
  ReinforcementItem,
} from "@/types/api";

const toArray = <T>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);

export async function fetchCurrentUser() {
  const { data } = await api.get("/auth/user");
  return data ?? null;
}

export async function fetchGuilds(): Promise<DiscordGuild[]> {
  const { data } = await api.get<DiscordGuild[]>("/api/guilds");
  return toArray<DiscordGuild>(data);
}

export async function fetchGuildStats(guildId: string): Promise<GuildStats> {
  const { data } = await api.get<GuildStats>(`/api/guild/${guildId}/stats`);
  return data;
}

export async function fetchDashboardMetrics(guildId: string): Promise<DashboardMetrics> {
  const { data } = await api.get<DashboardMetrics>(`/api/guild/${guildId}/dashboard/metrics`);
  return data;
}

export async function fetchReinforcements(guildId: string): Promise<ReinforcementItem[]> {
  const { data } = await api.get<ReinforcementItem[]>(`/api/guild/${guildId}/reinforcements`);
  return toArray<ReinforcementItem>(data);
}

export async function fetchAlerts(guildId: string): Promise<AlertItem[]> {
  const { data } = await api.get<AlertItem[]>(`/api/guild/${guildId}/alerts`);
  return toArray<AlertItem>(data);
}

export async function fetchActivityFeed(guildId: string): Promise<ActivityItem[]> {
  const { data } = await api.get<ActivityItem[]>(`/api/guild/${guildId}/activity-feed`);
  return toArray<ActivityItem>(data);
}

export async function fetchModerators(guildId: string): Promise<ModeratorWorkload[]> {
  const { data } = await api.get<ModeratorWorkload[]>(`/api/guild/${guildId}/moderators`);
  return toArray<ModeratorWorkload>(data);
}

export async function fetchActivityTrend(guildId: string): Promise<ActivityTrendPoint[]> {
  const { data } = await api.get<ActivityTrendPoint[]>(`/api/guild/${guildId}/activity`);
  return toArray<ActivityTrendPoint>(data);
}

export async function fetchLeaderboard(
  guildId: string,
  metric: "points" | "level" | "messages" = "points"
): Promise<LeaderboardEntry[]> {
  const { data } = await api.get<LeaderboardEntry[]>(`/api/guild/${guildId}/leaderboard`, {
    params: {
      metric,
      limit: 25,
    },
  });
  return toArray<LeaderboardEntry>(data);
}

export async function fetchAnalytics(guildId: string): Promise<AnalyticsPayload> {
  const { data } = await api.get<AnalyticsPayload>(`/api/guild/${guildId}/analytics`);
  return {
    reinforcementFlow: toArray(data?.reinforcementFlow).map((point) => ({
      ...point,
    })),
    priorityDistribution: data?.priorityDistribution ?? {
      low: 0,
      medium: 0,
      high: 0,
      urgent: 0,
    },
    responseTrend: toArray(data?.responseTrend),
    modAssignmentLoad: toArray(data?.modAssignmentLoad),
    sentimentTrend: toArray(data?.sentimentTrend),
  };
}
