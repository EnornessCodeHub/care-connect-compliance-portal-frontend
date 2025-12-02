import React, { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Loader2, Check, Link as LinkIcon, File, Download, ExternalLink, Eye } from "lucide-react";
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
  // Track which notifications have had their attachments viewed/downloaded
  const [attachmentsViewed, setAttachmentsViewed] = useState<Set<number>>(new Set());

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

  // Check if notification has attachments
  const hasAttachments = (notification: UserNotification): boolean => {
    return !!(notification.attachment_link || notification.attachment_file);
  };

  // Handle attachment view/download - enables confirmation button
  const handleAttachmentAction = (notificationId: number) => {
    setAttachmentsViewed(prev => new Set(prev).add(notificationId));
  };

  // Check if attachments have been viewed for a notification
  const areAttachmentsViewed = (notificationId: number): boolean => {
    return attachmentsViewed.has(notificationId);
  };

  // Get full file URL for viewing
  const getFileViewUrl = (filePath: string): string => {
    if (!filePath) return '';
    // If it's already a full URL, return as is
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      return filePath;
    }
    // Get base URL and remove /api/v1 if present (static files are served from root)
    let baseUrl = import.meta.env.VITE_BASE_URL || window.location.origin;
    // Remove /api/v1 from base URL for static file serving
    baseUrl = baseUrl.replace('/api/v1', '');
    // Ensure base URL doesn't end with slash
    baseUrl = baseUrl.replace(/\/$/, '');
    // File path should start with / (backend saves it as /notifications/filename)
    const cleanPath = filePath.startsWith('/') ? filePath : `/${filePath}`;
    return `${baseUrl}${cleanPath}`;
  };

  // Handle view file
  const handleViewFile = (notificationId: number, filePath: string) => {
    const viewUrl = getFileViewUrl(filePath);
    if (viewUrl) {
      window.open(viewUrl, '_blank');
      handleAttachmentAction(notificationId);
    }
  };

  // Handle download file
  const handleDownloadFile = (e: React.MouseEvent<HTMLAnchorElement>, notificationId: number) => {
    e.preventDefault();
    handleAttachmentAction(notificationId);
    
    const filePath = e.currentTarget.getAttribute('href');
    const fileName = e.currentTarget.getAttribute('download');
    
    if (filePath) {
      // Create a temporary anchor to trigger download
      const link = document.createElement('a');
      link.href = filePath;
      if (fileName) {
        link.download = fileName;
      }
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Handle view link
  const handleViewLink = (notificationId: number, link: string) => {
    handleAttachmentAction(notificationId);
    // The link will open via the anchor tag
    // This function just tracks that the user interacted with the attachment
  };

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
          {list.map((n) => {
            const hasAttachment = hasAttachments(n);
            return (
              <Card key={n.id} className={!n.is_read ? "border-primary/50" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        {!n.is_read && <Badge>New</Badge>}
                        <h3 className="font-semibold">{n.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">{n.message}</p>
                      
                      {/* Attachments Section */}
                      {hasAttachment && (
                        <div className="space-y-2 pt-2 border-t">
                          <div className="text-xs font-medium text-muted-foreground">Attachments:</div>
                          <div className="space-y-2">
                            {/* Attachment Link */}
                            {n.attachment_link && (
                              <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors">
                                <LinkIcon className="h-4 w-4 text-primary flex-shrink-0" />
                                <span className="flex-1 truncate text-sm text-muted-foreground">{n.attachment_link}</span>
                                <a
                                  href={n.attachment_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => handleViewLink(n.id, n.attachment_link!)}
                                  className="flex items-center gap-1 text-sm text-primary hover:underline"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                  <span>Open</span>
                                </a>
                              </div>
                            )}
                            
                            {/* Attachment File */}
                            {n.attachment_file && (
                              <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors">
                                <File className="h-4 w-4 text-primary flex-shrink-0" />
                                <span className="flex-1 truncate text-sm text-muted-foreground">
                                  {n.attachment_file_name || 'Download Attachment'}
                                </span>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 text-xs"
                                    onClick={() => handleViewFile(n.id, n.attachment_file!)}
                                  >
                                    <Eye className="h-3 w-3 mr-1" />
                                    View
                                  </Button>
                                  <a
                                    href={getFileViewUrl(n.attachment_file)}
                                    download={n.attachment_file_name}
                                    onClick={(e) => handleDownloadFile(e, n.id)}
                                    className="flex items-center gap-1 text-sm text-primary hover:underline"
                                  >
                                    <Download className="h-3 w-3" />
                                    <span className="text-xs">Download</span>
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(n.createdAt), 'PPp')}
                      </div>
                    </div>
                    
                    {/* Action Button */}
                    {!n.is_read && (
                      <div className="flex-shrink-0">
                        {hasAttachment ? (
                          // Workflow B: Actionable Notification with confirmation button
                          // Button is enabled after attachments are viewed/downloaded
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkAsRead(n.id)}
                            disabled={!areAttachmentsViewed(n.id) || markingAsRead === n.id}
                            className={!areAttachmentsViewed(n.id) ? "cursor-not-allowed opacity-60" : ""}
                          >
                            {markingAsRead === n.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <Check className="h-4 w-4 mr-1" />
                                I confirm I have read and understood
                              </>
                            )}
                          </Button>
                        ) : (
                          // Workflow A: Simple Notification with Mark as Read button
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
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
