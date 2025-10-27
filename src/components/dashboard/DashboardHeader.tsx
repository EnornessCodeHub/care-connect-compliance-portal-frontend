import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, Download, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DashboardHeaderProps {
  onRefresh: () => void;
  onExport: (type: "excel" | "pdf") => void;
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  lastUpdated: string;
}

export function DashboardHeader({
  onRefresh,
  onExport,
  dateRange,
  onDateRangeChange,
  lastUpdated,
}: DashboardHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-card via-card to-card/95 border-b border-border/50 px-6 py-6 shadow-sm backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="space-y-2">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              CareConnect
            </h1>
            <p className="text-sm text-muted-foreground/80 font-medium tracking-wide">
              By Provider Compliance
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-xs font-medium bg-primary/10 text-primary border-primary/20 px-3 py-1">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Live Data
            </Badge>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-1 h-1 bg-muted-foreground/40 rounded-full"></div>
              <span className="font-medium">Last updated: {lastUpdated}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 p-1 bg-background/50 rounded-lg border border-border/50 shadow-sm">
            <Select value={dateRange} onValueChange={onDateRangeChange}>
              <SelectTrigger className="w-40 border-0 bg-transparent hover:bg-accent/50 transition-colors">
                <CalendarDays className="h-4 w-4 mr-2 text-primary" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>

            <div className="w-px h-6 bg-border/50"></div>

            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onRefresh}
              className="hover:bg-accent/50 hover:text-primary transition-all duration-200"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>

            <div className="w-px h-6 bg-border/50"></div>

            <Select onValueChange={(value) => onExport(value as "excel" | "pdf")}>
              <SelectTrigger className="w-32 border-0 bg-transparent hover:bg-accent/50 transition-colors">
                <Download className="h-4 w-4 mr-2 text-primary" />
                <SelectValue placeholder="Export" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}