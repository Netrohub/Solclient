import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Users, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchAnalytics, fetchReinforcements } from "@/lib/dashboard-api";
import { formatNumber } from "@/lib/format";

const PRIORITY_COLORS = {
  low: "#9CA3AF",
  medium: "#6366F1",
  high: "#F97316",
  urgent: "#EF4444",
};

const SENTIMENT_COLORS = {
  positive: "#10B981",
  neutral: "#6366F1",
  negative: "#EF4444",
};

const Analytics = () => {
  const { selectedGuildId } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const analyticsQuery = useQuery({
    queryKey: ["guild", selectedGuildId, "analytics"],
    queryFn: () => fetchAnalytics(selectedGuildId!),
    enabled: Boolean(selectedGuildId),
    refetchInterval: 120000,
  });

  const reinforcementsQuery = useQuery({
    queryKey: ["guild", selectedGuildId, "reinforcements"],
    queryFn: () => fetchReinforcements(selectedGuildId!),
    enabled: Boolean(selectedGuildId),
    refetchInterval: 60000,
  });

  if (!selectedGuildId) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-center">
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold">Select a guild to view analytics</h1>
          <p className="text-muted-foreground max-w-md">
            Choose a server to explore reinforcement trends, priority distribution, response times, and moderator workload analytics.
          </p>
        </div>
      </div>
    );
  }

  const analytics = analyticsQuery.data;
  const priorityDistribution = useMemo(() => {
    if (!analytics) return [];
    return (Object.entries(analytics.priorityDistribution) as [keyof typeof PRIORITY_COLORS, number][])
      .map(([key, value]) => ({ name: key.toUpperCase(), value }))
      .filter((entry) => entry.value > 0);
  }, [analytics]);

  const assignmentLoad = analytics?.modAssignmentLoad ?? [];

  const reinforcementPriorities = useMemo(() => {
    if (!reinforcementsQuery.data) return { low: 0, medium: 0, high: 0, urgent: 0 };
    return reinforcementsQuery.data.reduce(
      (acc, item) => {
        acc[item.priority] += 1;
        return acc;
      },
      { low: 0, medium: 0, high: 0, urgent: 0 } as Record<"low" | "medium" | "high" | "urgent", number>
    );
  }, [reinforcementsQuery.data]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Track reinforcement performance, moderator workload, and community sentiment trends.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" disabled>
            Last 14 days
          </Button>
          <Button variant="outline" disabled>
            Export
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="response">Response Times</TabsTrigger>
          <TabsTrigger value="workload">Mod Workload</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Reinforcement Flow
                </CardTitle>
              </CardHeader>
              <CardContent className="h-72">
                {analytics ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics.reinforcementFlow}>
                      <defs>
                        <linearGradient id="created" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="resolved" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22C55E" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                      <Area type="monotone" dataKey="created" stroke="#6366F1" fill="url(#created)" />
                      <Area type="monotone" dataKey="resolved" stroke="#22C55E" fill="url(#resolved)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    Loading reinforcement analytics…
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-4 h-4 text-accent" />
                  Priority Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="h-72">
                {analytics ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={priorityDistribution}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={4}
                      >
                        {priorityDistribution.map((entry) => (
                          <Cell key={entry.name} fill={PRIORITY_COLORS[entry.name.toLowerCase() as keyof typeof PRIORITY_COLORS]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    Loading priority insights…
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Active Reinforcements by Priority
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(reinforcementPriorities).map(([key, value]) => (
                  <div key={key} className="bg-secondary/40 rounded-xl p-4">
                    <p className="text-xs text-muted-foreground mb-1">{key.toUpperCase()}</p>
                    <p className="text-xl font-semibold">{formatNumber(value)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="response" className="mt-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Average Response Time Trend</CardTitle>
              <p className="text-sm text-muted-foreground">How quickly moderators resolve reinforcements</p>
            </CardHeader>
            <CardContent className="h-96">
              {analytics ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.responseTrend}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="avgResponseMinutes" stroke="#6366F1" strokeWidth={2} name="Avg Minutes" />
                    <Line type="monotone" dataKey="inProgress" stroke="#F97316" strokeWidth={2} name="Open Queue" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Loading response analytics…
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workload" className="mt-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Mod Assignment Load</CardTitle>
              <p className="text-sm text-muted-foreground">Active reinforcements per assigned moderator</p>
            </CardHeader>
            <CardContent className="h-96">
              {analytics && assignmentLoad.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={assignmentLoad}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} interval={0} angle={-25} dy={10} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Bar dataKey="assignments" fill="#6366F1" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No active moderator assignments detected.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sentiment" className="mt-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Community Sentiment Trends</CardTitle>
              <p className="text-sm text-muted-foreground">
                Positive, neutral, and negative signals derived from notifications
              </p>
            </CardHeader>
            <CardContent className="h-96">
              {analytics ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.sentimentTrend}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="positive" stackId="1" stroke={SENTIMENT_COLORS.positive} fill={SENTIMENT_COLORS.positive} fillOpacity={0.25} />
                    <Area type="monotone" dataKey="neutral" stackId="1" stroke={SENTIMENT_COLORS.neutral} fill={SENTIMENT_COLORS.neutral} fillOpacity={0.2} />
                    <Area type="monotone" dataKey="negative" stackId="1" stroke={SENTIMENT_COLORS.negative} fill={SENTIMENT_COLORS.negative} fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Sentiment metrics will appear once notifications are captured.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
