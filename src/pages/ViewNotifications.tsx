import React, { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Loader2, Check } from "lucide-react";
import notificationService, { UserNotification } from "@/services/notificationService";
import authService from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function ViewNotifications() {
  const nav = useNavigate();
  const { toast } = useToast();
  const [filter, setFilter] = useState<"unread" | "read">("unread");
  const [items, setItems] = useState<UserNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAsRead, setMarkingAsRead] = useState<number | null>(null);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const userData = authService.getUserData();
      if (!userData) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "User not found. Please login again."
        });
        return;
      }

      const response = await notificationService.getNotificationsByUserId(userData.id);
      if (response.success && response.data) {
        setItems(response.data);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load notifications"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      setMarkingAsRead(notificationId);
      const userData = authService.getUserData();
      if (!userData) return;

      const response = await notificationService.markAsRead(notificationId, userData.id);
      if (response.success) {
        // Update the local state
        setItems(prev => prev.map(item => 
          item.id === notificationId ? { ...item, is_read: true } : item
        ));
        
        // Dispatch event to update header notifications
        window.dispatchEvent(new Event('notificationsUpdated'));
        
        toast({
          title: "Success",
          description: "Notification marked as read"
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to mark notification as read"
      });
    } finally {
      setMarkingAsRead(null);
    }
  };

  const list = useMemo(() => 
    items.filter((i) => filter === "read" ? i.is_read : !i.is_read), 
    [items, filter]
  );

  const unreadCount = useMemo(() => items.filter(i => !i.is_read).length, [items]);
  const readCount = useMemo(() => items.filter(i => i.is_read).length, [items]);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Notifications</h2>
        <div className="flex items-center gap-2">
          <Button 
            variant={filter === "unread" ? "default" : "outline"} 
            onClick={() => setFilter("unread")}
          >
            Unread {unreadCount > 0 && `(${unreadCount})`}
          </Button>
          <Button 
            variant={filter === "read" ? "default" : "outline"} 
            onClick={() => setFilter("read")}
          >
            Read {readCount > 0 && `(${readCount})`}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
          <p className="text-sm text-muted-foreground">Loading notifications...</p>
        </div>
      ) : list.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            You have no {filter} notifications.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {list.map((n) => (
            <Card key={n.id} className={!n.is_read ? "border-primary/50" : ""}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      {!n.is_read && <Badge>New</Badge>}
                      <h3 className="font-semibold">{n.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{n.message}</p>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(n.createdAt), 'PPp')}
                    </div>
                  </div>
                  
                  {!n.is_read && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMarkAsRead(n.id)}
                      disabled={markingAsRead === n.id}
                    >
                      {markingAsRead === n.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          Mark as read
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
