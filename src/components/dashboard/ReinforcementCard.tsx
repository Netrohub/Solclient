import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Clock, AlertCircle, Paperclip } from "lucide-react";
import { formatRelativeTimestamp } from "@/lib/format";

/**
 * Reinforcement Card Component
 * 
 * Displays a single reinforcement request with all metadata.
 * Used in queue views and activity feeds.
 * 
 * @example
 * ```tsx
 * <ReinforcementCard
 *   id="req_123"
 *   user="Alex_Chen"
 *   request="Need help with Docker setup - permission errors"
 *   priority="high"
 *   status="queued"
 *   tags={["technical", "docker"]}
 *   timestamp="5m ago"
 *   hasAttachment={true}
 * />
 * ```
 */
interface ReinforcementCardProps {
  /** Unique identifier for the reinforcement */
  id: string;
  
  /** Discord username of the requester */
  user: string;
  
  /** Description of the reinforcement request */
  request: string;
  
  /** Priority level affects visual styling */
  priority: "low" | "medium" | "high" | "urgent";
  
  /** Current status in the workflow */
  status: "queued" | "in_progress" | "completed";
  
  /** Moderator username if assigned */
  assignee?: string;
  
  /** Array of tags for categorization */
  tags?: string[];
  
  /** Relative time string (e.g., "5m ago") or ISO date */
  timestamp: string;
  
  /** Shows paperclip icon if true */
  hasAttachment?: boolean;
}

const priorityConfig = {
  low: { color: "bg-muted text-muted-foreground border-border", label: "Low" },
  medium: { color: "bg-primary/10 text-primary border-primary/20", label: "Medium" },
  high: { color: "bg-warning/10 text-warning border-warning/20", label: "High" },
  urgent: { color: "bg-destructive/10 text-destructive border-destructive/20", label: "Urgent" },
};

const statusConfig = {
  queued: { color: "bg-muted text-muted-foreground border-border", label: "Queued" },
  in_progress: { color: "bg-primary/10 text-primary border-primary/20", label: "In Progress" },
  completed: { color: "bg-success/10 text-success border-success/20", label: "Completed" },
};

export const ReinforcementCard = ({
  user,
  request,
  priority,
  status,
  assignee,
  tags,
  timestamp,
  hasAttachment,
}: ReinforcementCardProps) => {
  const relativeTimestamp = formatRelativeTimestamp(timestamp);

  return (
    <Card className="shadow-card hover:shadow-hover transition-smooth">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                {user.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{user}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{relativeTimestamp}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge variant="outline" className={priorityConfig[priority].color}>
              {priorityConfig[priority].label}
            </Badge>
          </div>
        </div>

        {/* Request */}
        <p className="text-sm mb-3 line-clamp-2">{request}</p>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-border">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className={statusConfig[status].color}>
              {statusConfig[status].label}
            </Badge>
            {tags?.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {hasAttachment && <Paperclip className="w-3 h-3 text-muted-foreground" />}
          </div>
          {assignee ? (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="hidden sm:inline">Assigned:</span>
              <span className="font-medium">{assignee}</span>
            </div>
          ) : (
            <Button variant="outline" size="sm" className="h-7 text-xs">
              Assign
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
