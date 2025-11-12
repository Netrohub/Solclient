import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, AlertTriangle, Info, XCircle } from "lucide-react";
import type { AlertItem } from "@/types/api";

const alertConfig = {
  info: {
    icon: Info,
    color: "bg-primary/10 text-primary border-primary/20",
    badgeColor: "bg-primary/10 text-primary border-primary/20",
  },
  warning: {
    icon: AlertTriangle,
    color: "bg-warning/10 text-warning border-warning/20",
    badgeColor: "bg-warning/10 text-warning border-warning/20",
  },
  urgent: {
    icon: AlertCircle,
    color: "bg-destructive/10 text-destructive border-destructive/20",
    badgeColor: "bg-destructive/10 text-destructive border-destructive/20",
  },
  resolved: {
    icon: XCircle,
    color: "bg-success/10 text-success border-success/20",
    badgeColor: "bg-success/10 text-success border-success/20",
  },
} as const;

interface AlertPanelProps {
  alerts: AlertItem[];
  isLoading?: boolean;
}

export const AlertPanel = ({ alerts, isLoading = false }: AlertPanelProps) => {
  return (
    <Card className="shadow-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl">Active Alerts</CardTitle>
        <Button variant="ghost" size="sm" className="text-xs opacity-60" disabled>
          View All
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-28 w-full rounded-xl" />
            ))
          : alerts.map((alert) => {
              const config = alertConfig[alert.type];
              const Icon = config.icon;

              return (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border ${config.color} transition-smooth hover:shadow-sm`}
                >
                  <div className="flex items-start gap-3">
                    <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="text-sm font-semibold">{alert.title}</h4>
                        <Badge variant="outline" className={`${config.badgeColor} text-xs`}>
                          {alert.type.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs mb-2">{alert.description}</p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        {alert.channel && <span className="font-medium">{alert.channel}</span>}
                        {alert.user && (
                          <>
                            <span>•</span>
                            <span>{alert.user}</span>
                          </>
                        )}
                        <span>•</span>
                        <span>{alert.timestamp}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm" className="h-7 text-xs flex-1" disabled>
                      Investigate
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 text-xs" disabled>
                      Dismiss
                    </Button>
                  </div>
                </div>
              );
            })}

        {!isLoading && alerts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No active alerts detected 🎉
          </div>
        )}
      </CardContent>
    </Card>
  );
};