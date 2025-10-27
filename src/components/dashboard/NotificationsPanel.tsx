import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bell, 
  AlertTriangle, 
  MessageSquareWarning, 
  Shield, 
  GraduationCap,
  FileText,
  Clock,
  CheckCircle2,
  X
} from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

const notificationIcons = {
  incidents: AlertTriangle,
  complaints: MessageSquareWarning,
  compliance: Shield,
  training: GraduationCap,
  general: Bell,
  documents: FileText
};

const notificationColors = {
  info: 'text-blue-600 bg-blue-50 border-blue-200',
  warning: 'text-orange-600 bg-orange-50 border-orange-200',
  error: 'text-red-600 bg-red-50 border-red-200',
  success: 'text-green-600 bg-green-50 border-green-200'
};

export function NotificationsPanel() {
  const { notifications, markNotificationAsRead } = useUser();

  const unreadNotifications = notifications.filter(n => !n.isRead);
  const recentNotifications = notifications.slice(0, 10);

  const handleMarkAsRead = (notificationId: string) => {
    markNotificationAsRead(notificationId);
  };

  const handleMarkAllAsRead = () => {
    unreadNotifications.forEach(notification => {
      markNotificationAsRead(notification.id);
    });
  };

  return (
    <Card className="w-full max-w-md bg-gradient-to-br from-card via-card/95 to-card/80 backdrop-blur-sm border border-white/10 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notifications
            {unreadNotifications.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadNotifications.length}
              </Badge>
            )}
          </CardTitle>
          {unreadNotifications.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleMarkAllAsRead}
              className="text-xs"
            >
              Mark all read
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-96">
          <div className="space-y-2 p-4">
            {recentNotifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No notifications</p>
              </div>
            ) : (
              recentNotifications.map((notification) => {
                const IconComponent = notificationIcons[notification.category as keyof typeof notificationIcons] || Bell;
                const colorClass = notificationColors[notification.type];
                
                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-3 rounded-lg border transition-all duration-200 hover:shadow-md cursor-pointer group",
                      notification.isRead 
                        ? "bg-muted/30 border-muted" 
                        : "bg-background border-border shadow-sm",
                      colorClass
                    )}
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "p-2 rounded-lg flex-shrink-0",
                        notification.isRead ? "bg-muted" : "bg-primary/10"
                      )}>
                        <IconComponent className={cn(
                          "h-4 w-4",
                          notification.isRead ? "text-muted-foreground" : "text-primary"
                        )} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className={cn(
                            "text-sm font-medium truncate",
                            notification.isRead ? "text-muted-foreground" : "text-foreground"
                          )}>
                            {notification.title}
                          </h4>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />
                          )}
                        </div>
                        <p className={cn(
                          "text-xs mt-1 line-clamp-2",
                          notification.isRead ? "text-muted-foreground" : "text-foreground/80"
                        )}>
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                          </span>
                          {notification.actionUrl && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle action
                              }}
                            >
                              {notification.actionText || 'View'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
        
        {notifications.length > 10 && (
          <div className="p-4 border-t border-border">
            <Button variant="outline" size="sm" className="w-full">
              View All Notifications
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
