import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import type { ActivityItem } from "@/types/api";

const statusConfig = {
  success: { color: "bg-success/10 text-success border-success/20", label: "Success" },
  pending: { color: "bg-warning/10 text-warning border-warning/20", label: "Pending" },
  error: { color: "bg-destructive/10 text-destructive border-destructive/20", label: "Error" },
} as const;

interface ActivityFeedProps {
  activities: ActivityItem[];
  isLoading?: boolean;
}

export const ActivityFeed = ({ activities, isLoading = false }: ActivityFeedProps) => {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-20 w-full rounded-xl" />
            ))
          : activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0"
              >
                <Avatar className="w-9 h-9">
                  <AvatarFallback className="text-xs bg-secondary text-foreground">
                    {activity.user
                      .split(" ")
                      .filter(Boolean)
                      .map((n) => n[0])
                      .join("") || "--"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{activity.user}</p>
                  <p className="text-sm text-muted-foreground truncate">{activity.action}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                </div>
                <Badge
                  variant="outline"
                  className={statusConfig[activity.status].color}
                >
                  {statusConfig[activity.status].label}
                </Badge>
              </div>
            ))}

        {!isLoading && activities.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No recent audit events recorded for this guild.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
