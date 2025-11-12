import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

/**
 * Moderator Workload Card
 * 
 * Displays comprehensive stats for a single moderator including
 * active assignments, completion rate, response time, and status.
 * 
 * @example
 * ```tsx
 * <ModWorkloadCard
 *   name="Sarah Chen"
 *   role="Lead Moderator"
 *   activeAssignments={8}
 *   completedToday={12}
 *   avgResponseTime="6.2min"
 *   status="online"
 *   responseScore={96}
 * />
 * ```
 */
interface ModWorkloadCardProps {
  /** Full name of the moderator */
  name: string;
  /** Role/title (e.g., "Lead Moderator", "Senior Moderator") */
  role: string;
  /** Number of currently assigned reinforcements */
  activeAssignments: number;
  /** Number of reinforcements completed today */
  completedToday: number;
  /** Average response time in minutes */
  avgResponseMinutes?: number | null;
  /** Current online status - shows as colored indicator */
  status: "online" | "away" | "offline";
  /** Performance score 0-100, displayed as progress bar */
  responseScore: number;
}

const statusConfig = {
  online: { color: "bg-success", label: "Online" },
  away: { color: "bg-warning", label: "Away" },
  offline: { color: "bg-muted", label: "Offline" },
};

export const ModWorkloadCard = ({
  name,
  role,
  activeAssignments,
  completedToday,
  avgResponseMinutes,
  status,
  responseScore,
}: ModWorkloadCardProps) => {
  const hasResponseValue =
    typeof avgResponseMinutes === "number" && !Number.isNaN(avgResponseMinutes);

  const responseTimeLabel = !hasResponseValue
    ? "—"
    : avgResponseMinutes! < 1
    ? `${Math.round(avgResponseMinutes! * 60)}s`
    : `${avgResponseMinutes!.toFixed(1)}min`;

  return (
    <Card className="shadow-card hover:shadow-hover transition-smooth">
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="relative">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {name.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card ${statusConfig[status].color}`}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{name}</h3>
            <p className="text-sm text-muted-foreground">{role}</p>
          </div>
        </div>

        {/* Workload Stats */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Active Assignments</span>
            <span className="font-semibold">{activeAssignments}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Completed Today</span>
            <span className="font-semibold text-success">{completedToday}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Avg Response</span>
            <span className="font-semibold">{responseTimeLabel}</span>
          </div>

          {/* Response Score */}
          <div className="pt-2 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Response Score</span>
              <span className="font-semibold">{responseScore}%</span>
            </div>
            <Progress value={responseScore} className="h-2" />
          </div>
        </div>

        {/* Status Badge */}
        <div className="mt-4 pt-3 border-t border-border">
          <Badge variant="outline" className="w-full justify-center">
            {statusConfig[status].label}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
