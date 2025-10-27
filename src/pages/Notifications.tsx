import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Search, Plus, X } from 'lucide-react';

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  userIds: string[];
  scheduledAt?: string; // ISO string
  createdAt: string; // ISO string
  status: 'Scheduled' | 'Draft' | 'Sent';
};

type UserOption = { id: string; name: string; email: string };

const MOCK_USERS: UserOption[] = [
  { id: 'u1', name: 'Jane Smith', email: 'jane@example.com' },
  { id: 'u2', name: 'John Doe', email: 'john@example.com' },
  { id: 'u3', name: 'Alex Johnson', email: 'alex@example.com' },
  { id: 'u4', name: 'Priya Patel', email: 'priya@example.com' },
  { id: 'u5', name: 'Liam Chen', email: 'liam@example.com' },
];

function loadStored(): NotificationItem[] {
  try {
    const raw = localStorage.getItem('cc_notifications');
    return raw ? (JSON.parse(raw) as NotificationItem[]) : [];
  } catch {
    return [];
  }
}

function saveStored(items: NotificationItem[]) {
  localStorage.setItem('cc_notifications', JSON.stringify(items));
}

const Notifications = () => {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<NotificationItem[]>(() => loadStored());
  const [isOpen, setIsOpen] = useState(false);

  // form state
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>();
  const [scheduledTime, setScheduledTime] = useState<string>('09:00');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return items;
    return items.filter(i => i.title.toLowerCase().includes(q) || i.message.toLowerCase().includes(q));
  }, [items, query]);

  const resetForm = () => {
    setTitle('');
    setMessage('');
    setSelectedUsers([]);
    setScheduledDate(undefined);
    setScheduledTime('09:00');
  };

  const toggleUser = (id: string) => {
    setSelectedUsers(prev => (prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]));
  };

  const handleCreate = async () => {
    if (!title.trim() || !message.trim() || selectedUsers.length === 0) return;
    setIsSubmitting(true);
    try {
      let scheduledAt: string | undefined;
      if (scheduledDate) {
        const [hh, mm] = scheduledTime.split(':');
        const d = new Date(scheduledDate);
        d.setHours(Number(hh));
        d.setMinutes(Number(mm));
        d.setSeconds(0);
        scheduledAt = d.toISOString();
      }

      const now = new Date().toISOString();
      const newItem: NotificationItem = {
        id: `n_${Date.now()}`,
        title: title.trim(),
        message: message.trim(),
        userIds: selectedUsers,
        scheduledAt,
        createdAt: now,
        status: scheduledAt ? 'Scheduled' : 'Sent',
      };

      const next = [newItem, ...items];
      setItems(next);
      saveStored(next);
      setIsOpen(false);
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  const usersLabel = (ids: string[]) => {
    if (ids.length === 0) return '—';
    if (ids.length === 1) return MOCK_USERS.find(u => u.id === ids[0])?.name ?? '1 user';
    return `${ids.length} users`;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Notifications</h2>
        <Button onClick={() => setIsOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Add Notification
        </Button>
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

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="py-2 pr-4">Title</th>
                  <th className="py-2 pr-4">Message</th>
                  <th className="py-2 pr-4">Audience</th>
                  <th className="py-2 pr-4">Scheduled For</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Created</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">No notifications found</td>
                  </tr>
                )}
                {filtered.map(n => (
                  <tr key={n.id} className="border-t">
                    <td className="py-3 pr-4 font-medium">{n.title}</td>
                    <td className="py-3 pr-4 max-w-[480px] truncate">{n.message}</td>
                    <td className="py-3 pr-4">{usersLabel(n.userIds)}</td>
                    <td className="py-3 pr-4">{n.scheduledAt ? format(new Date(n.scheduledAt), 'PPp') : '—'}</td>
                    <td className="py-3 pr-4">{n.status}</td>
                    <td className="py-3 pr-4">{format(new Date(n.createdAt), 'PP p')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={(o) => { setIsOpen(o); if (!o) resetForm(); }}>
        <DialogContent className="sm:max-w-lg">
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
                  <Button variant="outline" className="justify-between w-full">
                    {selectedUsers.length === 0 ? 'Select users' : usersLabel(selectedUsers)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-80">
                  <div className="max-h-64 overflow-auto pr-1">
                    {MOCK_USERS.map(u => {
                      const active = selectedUsers.includes(u.id);
                      return (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => toggleUser(u.id)}
                          className={cn(
                            'w-full text-left px-3 py-2 rounded-md hover:bg-muted',
                            active && 'bg-primary/10'
                          )}
                        >
                          <div className="font-medium">{u.name}</div>
                          <div className="text-xs text-muted-foreground">{u.email}</div>
                        </button>
                      );
                    })}
                  </div>
                  {selectedUsers.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {selectedUsers.map(id => {
                        const u = MOCK_USERS.find(x => x.id === id);
                        if (!u) return null;
                        return (
                          <span key={id} className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs">
                            {u.name}
                            <button className="hover:text-destructive" onClick={() => toggleUser(id)}>
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Schedule Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn('justify-start w-full', !scheduledDate && 'text-muted-foreground')}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {scheduledDate ? format(scheduledDate, 'PPP') : 'Pick a date (optional)'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0" align="start">
                    <Calendar mode="single" selected={scheduledDate} onSelect={setScheduledDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Schedule Time</Label>
                <Input type="time" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => { setIsOpen(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleCreate} disabled={isSubmitting || !title.trim() || !message.trim() || selectedUsers.length === 0}>
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Notifications;