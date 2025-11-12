import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Metric Card Component
 * 
 * Displays a single KPI/metric with optional change indicator.
 * Used on dashboard overview for key statistics.
 * 
 * @example
 * ```tsx
 * import { Activity } from "lucide-react";
 * 
 * <MetricCard
 *   title="Active Reinforcements"
 *   value={12}
 *   change="4 queued, 8 in progress"
 *   changeType="neutral"
 *   icon={Activity}
 * />
 * ```
 */
interface MetricCardProps {
  /** Display label for the metric */
  title: string;
  
  /** Primary value - can be string ("8.5min") or number (12) */
  value: string | number;
  
  /** Optional change/context text shown below value */
  change?: string;
  
  /** Visual styling for change text (green/red/muted) */
  changeType?: "positive" | "negative" | "neutral";
  
  /** Lucide icon component (from lucide-react) */
  icon: LucideIcon;
}

export const MetricCard = ({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
}: MetricCardProps) => {
  const changeColorClass = {
    positive: "text-success",
    negative: "text-destructive",
    neutral: "text-muted-foreground",
  }[changeType];

  return (
    <Card className="gradient-card shadow-card hover:shadow-hover transition-smooth">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl md:text-3xl font-semibold">{value}</p>
            {change && (
              <p className={`text-sm font-medium ${changeColorClass}`}>
                {change}
              </p>
            )}
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
