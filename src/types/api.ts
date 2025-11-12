export interface DiscordUser {
  id: string;
  username: string;
  discriminator?: string;
  avatar?: string | null;
  global_name?: string | null;
}

export interface DiscordGuild {
  id: string;
  name: string;
  icon?: string | null;
  owner?: boolean;
  permissions?: string;
}

export interface GuildStats {
  totalMembers: number;
  totalMessages: number;
  totalPoints: number;
}

export interface ReinforcementItem {
  id: string;
  user: string;
  request: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "queued" | "in_progress" | "completed";
  assignee?: string;
  tags: string[];
  timestamp: string;
  hasAttachment?: boolean;
}

export interface AlertItem {
  id: string;
  type: "info" | "warning" | "urgent" | "resolved";
  title: string;
  description: string;
  channel?: string;
  user?: string;
  timestamp: string;
}

export interface ActivityItem {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  status: "success" | "pending" | "error";
}

export interface ModeratorWorkload {
  id: string;
  name: string;
  role: string;
  activeAssignments: number;
  completedToday: number;
  avgResponseMinutes: number;
  status: "online" | "away" | "offline";
  responseScore: number;
}

export interface DashboardMetrics {
  activeReinforcements: number;
  avgResponseMinutes: number;
  activeAlerts: number;
  completionRate: number;
  totalCompletedToday: number;
}

export interface ActivityTrendPoint {
  date: string;
  messages: number;
  images: number;
  attachments: number;
}

export interface LeaderboardEntry {
  position: number;
  userId: string;
  username: string;
  discriminator?: string | null;
  points: number;
  level?: number;
}

export interface ReinforcementFlowPoint {
  date: string;
  created: number;
  resolved: number;
}

export interface ResponseTrendPoint {
  date: string;
  avgResponseMinutes: number;
  inProgress: number;
}

export interface SentimentTrendPoint {
  date: string;
  positive: number;
  neutral: number;
  negative: number;
}

export interface ModeratorAssignmentLoad {
  name: string;
  assignments: number;
}

export interface AnalyticsPayload {
  reinforcementFlow: ReinforcementFlowPoint[];
  priorityDistribution: Record<\"low\" | \"medium\" | \"high\" | \"urgent\", number>;
  responseTrend: ResponseTrendPoint[];
  modAssignmentLoad: ModeratorAssignmentLoad[];
  sentimentTrend: SentimentTrendPoint[];
}
