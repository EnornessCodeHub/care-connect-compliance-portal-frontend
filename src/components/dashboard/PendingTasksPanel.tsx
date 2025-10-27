import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  CheckSquare, 
  AlertTriangle, 
  MessageSquareWarning, 
  Shield, 
  GraduationCap,
  Clock,
  CheckCircle2,
  Calendar,
  User
} from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { formatDistanceToNow, isAfter, isBefore, addDays } from 'date-fns';
import { cn } from '@/lib/utils';

const taskIcons = {
  incident: AlertTriangle,
  complaint: MessageSquareWarning,
  compliance: Shield,
  training: GraduationCap,
  approval: CheckSquare
};

const priorityColors = {
  low: 'text-green-600 bg-green-50 border-green-200',
  medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  high: 'text-orange-600 bg-orange-50 border-orange-200',
  urgent: 'text-red-600 bg-red-50 border-red-200'
};

const statusColors = {
  pending: 'text-blue-600 bg-blue-50 border-blue-200',
  in_progress: 'text-purple-600 bg-purple-50 border-purple-200',
  completed: 'text-green-600 bg-green-50 border-green-200',
  overdue: 'text-red-600 bg-red-50 border-red-200'
};

export function PendingTasksPanel() {
  const { pendingTasks, markTaskAsComplete } = useUser();

  const activeTasks = pendingTasks.filter(task => task.status !== 'completed');
  const overdueTasks = activeTasks.filter(task => 
    isAfter(new Date(), task.dueDate) && task.status !== 'completed'
  );
  const urgentTasks = activeTasks.filter(task => 
    task.priority === 'urgent' || task.priority === 'high'
  );

  const completionRate = pendingTasks.length > 0 
    ? (pendingTasks.filter(task => task.status === 'completed').length / pendingTasks.length) * 100 
    : 100;

  const handleTaskComplete = (taskId: string) => {
    markTaskAsComplete(taskId);
  };

  const getTaskStatus = (task: any) => {
    if (task.status === 'completed') return 'completed';
    if (isAfter(new Date(), task.dueDate)) return 'overdue';
    if (isBefore(new Date(), addDays(task.dueDate, -1))) return 'pending';
    return 'in_progress';
  };

  return (
    <Card className="w-full max-w-md bg-gradient-to-br from-card via-card/95 to-card/80 backdrop-blur-sm border border-white/10 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-primary" />
            Pending Tasks
            {urgentTasks.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {urgentTasks.length} urgent
              </Badge>
            )}
          </CardTitle>
        </div>
        
        {/* Progress Overview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Completion Rate</span>
            <span className="font-medium">{Math.round(completionRate)}%</span>
          </div>
          <Progress value={completionRate} className="h-2" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{activeTasks.length} active</span>
            <span>{overdueTasks.length} overdue</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-96">
          <div className="space-y-2 p-4">
            {activeTasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No pending tasks</p>
                <p className="text-xs mt-1">All caught up!</p>
              </div>
            ) : (
              activeTasks.map((task) => {
                const IconComponent = taskIcons[task.type];
                const priorityClass = priorityColors[task.priority];
                const status = getTaskStatus(task);
                const statusClass = statusColors[status];
                const isOverdue = isAfter(new Date(), task.dueDate);
                
                return (
                  <div
                    key={task.id}
                    className={cn(
                      "p-3 rounded-lg border transition-all duration-200 hover:shadow-md group",
                      statusClass
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "p-2 rounded-lg flex-shrink-0",
                        isOverdue ? "bg-red-100" : "bg-primary/10"
                      )}>
                        <IconComponent className={cn(
                          "h-4 w-4",
                          isOverdue ? "text-red-600" : "text-primary"
                        )} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-medium truncate">
                            {task.title}
                          </h4>
                          <div className="flex items-center gap-1">
                            <Badge 
                              variant="outline" 
                              className={cn("text-xs", priorityClass)}
                            >
                              {task.priority}
                            </Badge>
                            {isOverdue && (
                              <Badge variant="destructive" className="text-xs">
                                Overdue
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-xs mt-1 line-clamp-2 text-muted-foreground">
                          {task.description}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>
                              Due {formatDistanceToNow(task.dueDate, { addSuffix: true })}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleTaskComplete(task.id)}
                          >
                            Complete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
        
        {activeTasks.length > 5 && (
          <div className="p-4 border-t border-border">
            <Button variant="outline" size="sm" className="w-full">
              View All Tasks
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
