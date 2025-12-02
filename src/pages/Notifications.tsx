import React, { useMemo, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Search, Plus, X, Loader2, RefreshCw, UploadCloud, Link as LinkIcon, File, Trash2 } from 'lucide-react';
import staffService, { Staff } from '@/services/staffService';
import notificationService, { NotificationItem } from '@/services/notificationService';
import { useToast } from '@/hooks/use-toast';
import authService from '@/services/authService';

const Notifications = () => {
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loadingStaff, setLoadingStaff] = useState(false);

  // form state
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // attachment state
  const [attachmentLink, setAttachmentLink] = useState('');
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Load notifications on mount
  useEffect(() => {
    loadNotifications();
  }, []);

  // Load staff list when dialog opens
  useEffect(() => {
    if (isOpen && staffList.length === 0) {
      loadStaffList();
    }
  }, [isOpen]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getAllNotifications();
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

  const loadStaffList = async () => {
    try {
      setLoadingStaff(true);
      const response = await staffService.listStaff();
      if (response.success && response.data) {
        setStaffList(response.data);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load staff list"
      });
    } finally {
      setLoadingStaff(false);
    }
  };

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return items;
    return items.filter(i => i.title.toLowerCase().includes(q) || i.message.toLowerCase().includes(q));
  }, [items, query]);

  const resetForm = () => {
    setTitle('');
    setMessage('');
    setSelectedUsers([]);
    setAttachmentLink('');
    setAttachmentFile(null);
    setDragActive(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleUser = (id: number) => {
    setSelectedUsers(prev => (prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type - only allow: docx, pdf, png, jpeg
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
        'image/png',
        'image/jpeg',
        'image/jpg'
      ];
      
      const allowedExtensions = ['.pdf', '.docx', '.png', '.jpeg', '.jpg'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Only DOCX, PDF, PNG, and JPEG files are allowed"
        });
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      
      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast({
          variant: "destructive",
          title: "File Too Large",
          description: "File size must be less than 10MB"
        });
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      setAttachmentFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      // Validate file type - only allow: docx, pdf, png, jpeg
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
        'image/png',
        'image/jpeg',
        'image/jpg'
      ];
      
      const allowedExtensions = ['.pdf', '.docx', '.png', '.jpeg', '.jpg'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Only DOCX, PDF, PNG, and JPEG files are allowed"
        });
        return;
      }
      
      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast({
          variant: "destructive",
          title: "File Too Large",
          description: "File size must be less than 10MB"
        });
        return;
      }
      setAttachmentFile(file);
    }
  };

  const removeAttachmentFile = () => {
    setAttachmentFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCreate = async () => {
    if (!title.trim() || !message.trim() || selectedUsers.length === 0) return;
    setIsSubmitting(true);
    try {
      const requestData: any = {
        user_ids: selectedUsers,
        title: title.trim(),
        message: message.trim(),
      };

      // Add attachment link if provided
      if (attachmentLink.trim()) {
        requestData.attachment_link = attachmentLink.trim();
      }

      // Add attachment file if provided
      if (attachmentFile) {
        requestData.attachment_file = attachmentFile;
        requestData.attachment_file_name = attachmentFile.name;
      }

      const response = await notificationService.createNotification(requestData);

      if (response.success) {
        toast({
          title: "Success",
          description: "Notification sent successfully"
        });
        setIsOpen(false);
        resetForm();
        // Reload notifications to get the latest list
        loadNotifications();
        // Dispatch event to update header notifications for recipients
        window.dispatchEvent(new Event('notificationsUpdated'));
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send notification"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRecipientsLabel = (notification: NotificationItem) => {
    if (!notification.recipients || notification.recipients.length === 0) {
      return `${notification.user_ids.length} user${notification.user_ids.length !== 1 ? 's' : ''}`;
    }
    if (notification.recipients.length === 1) {
      return notification.recipients[0].fullname || notification.recipients[0].username;
    }
    return `${notification.recipients.length} users`;
  };

  const getSelectedUsersLabel = () => {
    if (selectedUsers.length === 0) return 'Select staff members';
    if (selectedUsers.length === 1) {
      const staff = staffList.find(s => s.id === selectedUsers[0]);
      return staff?.fullname || staff?.username || '1 user';
    }
    return `${selectedUsers.length} users selected`;
  };

  const isAdmin = authService.isAdmin();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Send Notifications</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadNotifications} disabled={loading}>
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </Button>
          {isAdmin && (
            <Button onClick={() => setIsOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" /> Add Notification
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">All Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search notifications"
                className="pl-9"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
              <p className="text-sm text-muted-foreground">Loading notifications...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground">
                    <th className="py-2 pr-4">Title</th>
                    <th className="py-2 pr-4">Message</th>
                    <th className="py-2 pr-4">Recipients</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2 pr-4">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-muted-foreground">
                        {query ? 'No notifications found matching your search' : 'No notifications yet'}
                      </td>
                    </tr>
                  )}
                  {filtered.map(n => (
                    <tr key={n.id} className="border-t">
                      <td className="py-3 pr-4 font-medium">{n.title}</td>
                      <td className="py-3 pr-4 max-w-[480px] truncate">{n.message}</td>
                      <td className="py-3 pr-4">{getRecipientsLabel(n)}</td>
                      <td className="py-3 pr-4 capitalize">{n.status}</td>
                      <td className="py-3 pr-4">{format(new Date(n.createdAt), 'PP p')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={(o) => { setIsOpen(o); if (!o) resetForm(); }}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Notification</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="n-title">Title</Label>
              <Input id="n-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter title" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="n-message">Message</Label>
              <Textarea id="n-message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write your message" rows={5} />
            </div>

            <div className="space-y-2">
              <Label>Recipients</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-between w-full" disabled={loadingStaff}>
                    {loadingStaff ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Loading staff...
                      </>
                    ) : (
                      getSelectedUsersLabel()
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-80">
                  {loadingStaff ? (
                    <div className="py-8 text-center text-muted-foreground">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                      Loading staff...
                    </div>
                  ) : staffList.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">
                      No staff members found
                    </div>
                  ) : (
                    <>
                      <div className="max-h-64 overflow-auto pr-1">
                        {staffList.map(staff => {
                          const active = selectedUsers.includes(staff.id);
                          return (
                            <button
                              key={staff.id}
                              type="button"
                              onClick={() => toggleUser(staff.id)}
                              className={cn(
                                'w-full text-left px-3 py-2 rounded-md hover:bg-muted',
                                active && 'bg-primary/10'
                              )}
                            >
                              <div className="font-medium">{staff.fullname || staff.username}</div>
                              <div className="text-xs text-muted-foreground">{staff.email}</div>
                            </button>
                          );
                        })}
                      </div>
                      {selectedUsers.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t">
                          {selectedUsers.map(id => {
                            const staff = staffList.find(s => s.id === id);
                            if (!staff) return null;
                            return (
                              <span key={id} className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs">
                                {staff.fullname || staff.username}
                                <button className="hover:text-destructive" onClick={() => toggleUser(id)}>
                                  <X className="h-3 w-3" />
                                </button>
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </>
                  )}
                </PopoverContent>
              </Popover>
            </div>

            {/* Attachments Section */}
            <div className="space-y-3 pt-2 border-t">
              <Label className="text-base font-semibold">Attachments (Optional)</Label>
              
              {/* Attach Link */}
              <div className="space-y-2">
                <Label htmlFor="n-link" className="text-sm font-normal flex items-center gap-2">
                  <LinkIcon className="h-4 w-4" />
                  Attach Link
                </Label>
                <Input
                  id="n-link"
                  type="url"
                  value={attachmentLink}
                  onChange={(e) => setAttachmentLink(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full"
                />
              </div>

              {/* Attach Document */}
              <div className="space-y-2">
                <Label className="text-sm font-normal flex items-center gap-2">
                  <File className="h-4 w-4" />
                  Attach Document
                </Label>
                {attachmentFile ? (
                  <div className="flex items-center justify-between p-3 border rounded-md bg-muted/50">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <File className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{attachmentFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(attachmentFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 flex-shrink-0"
                      onClick={removeAttachmentFile}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors",
                      dragActive ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50"
                    )}
                  >
                    <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <div className="text-sm font-medium mb-1">Click or drag file to upload</div>
                    <div className="text-xs text-muted-foreground">Allowed: DOCX, PDF, PNG, JPEG • Max size: 10MB</div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      onChange={handleFileSelect}
                      accept=".pdf,.docx,.png,.jpeg,.jpg"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => { setIsOpen(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleCreate} disabled={isSubmitting || !title.trim() || !message.trim() || selectedUsers.length === 0}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                'Add'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Notifications;