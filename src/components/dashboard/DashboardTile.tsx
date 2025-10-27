import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface DashboardTileProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  status?: "critical" | "warning" | "success" | "info";
  trend?: {
    direction: "up" | "down" | "neutral";
    value: string;
  };
  onClick?: () => void;
  className?: string;
}

export function DashboardTile({
  title,
  value,
  subtitle,
  icon,
  status,
  trend,
  onClick,
  className,
}: DashboardTileProps) {
  const statusColors = {
    critical: "border-l-status-critical bg-status-critical-light",
    warning: "border-l-status-warning bg-status-warning-light",
    success: "border-l-status-success bg-status-success-light",
    info: "border-l-status-info bg-status-info-light",
  };

  const statusBadgeColors = {
    critical: "bg-status-critical text-status-critical-foreground",
    warning: "bg-status-warning text-status-warning-foreground",
    success: "bg-status-success text-status-success-foreground",
    info: "bg-status-info text-status-info-foreground",
  };

  return (
    <Card
      className={cn(
        "group relative border-l-4 border-l-transparent transition-all duration-300 hover:shadow-lg cursor-pointer bg-gradient-to-br from-card via-card/95 to-card/80 backdrop-blur-sm overflow-hidden",
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:via-accent/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100",
        "border border-white/10 shadow-md hover:border-white/20",
        status && statusColors[status],
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2 relative z-10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
            {title}
          </CardTitle>
          {icon && (
            <div className="text-muted-foreground opacity-70 group-hover:opacity-100 group-hover:text-primary transition-all duration-300">
              {icon}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0 relative z-10">
        <div className="flex items-baseline justify-between">
          <div className="space-y-1">
            <div className="text-3xl font-bold group-hover:text-primary transition-colors duration-300">{value}</div>
            {subtitle && (
              <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">{subtitle}</p>
            )}
          </div>
          <div className="flex flex-col items-end space-y-1">
            {status && (
              <Badge 
                variant="secondary" 
                className={cn(
                  "text-xs transition-colors duration-300", 
                  statusBadgeColors[status]
                )}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Badge>
            )}
            {trend && (
              <div className={cn(
                "text-xs flex items-center",
                trend.direction === "up" && "text-status-success",
                trend.direction === "down" && "text-status-critical",
                trend.direction === "neutral" && "text-muted-foreground"
              )}>
                {trend.direction === "up" && "↗"}
                {trend.direction === "down" && "↘"}
                {trend.direction === "neutral" && "→"}
                <span className="ml-1">{trend.value}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}