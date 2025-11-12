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

export async function fetchCurrentUser() {
  const { data } = await api.get("/auth/user");
  return data ?? null;
}

export async function fetchGuilds(): Promise<DiscordGuild[]> {
  const { data } = await api.get<DiscordGuild[]>("/api/guilds");
  return data;
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
  return data;
}

export async function fetchAlerts(guildId: string): Promise<AlertItem[]> {
  const { data } = await api.get<AlertItem[]>(`/api/guild/${guildId}/alerts`);
  return data;
}

export async function fetchActivityFeed(guildId: string): Promise<ActivityItem[]> {
  const { data } = await api.get<ActivityItem[]>(`/api/guild/${guildId}/activity-feed`);
  return data;
}

export async function fetchModerators(guildId: string): Promise<ModeratorWorkload[]> {
  const { data } = await api.get<ModeratorWorkload[]>(`/api/guild/${guildId}/moderators`);
  return data;
}

export async function fetchActivityTrend(guildId: string): Promise<ActivityTrendPoint[]> {
  const { data } = await api.get<ActivityTrendPoint[]>(`/api/guild/${guildId}/activity`);
  return data;
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
  return data;
}

export async function fetchAnalytics(guildId: string): Promise<AnalyticsPayload> {
  const { data } = await api.get<AnalyticsPayload>(`/api/guild/${guildId}/analytics`);
  return data;
}
