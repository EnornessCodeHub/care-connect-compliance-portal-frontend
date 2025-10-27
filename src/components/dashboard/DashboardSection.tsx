import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DashboardSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function DashboardSection({ title, children, className }: DashboardSectionProps) {
  return (
    <div className={cn("animate-slide-up", className)}>
      <h2 className="text-lg font-semibold text-foreground mb-6 pb-3 border-b-2 border-gradient-to-r from-primary/20 via-primary/40 to-primary/20 relative">
        <span className="relative z-10 bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
          {title}
        </span>
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {children}
      </div>
    </div>
  );
}