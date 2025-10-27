import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

type Item = { id: string; title: string; read: boolean; createdAt: string };

function load(): Item[] {
  try {
    const raw = localStorage.getItem("cc_notifications");
    if (!raw) return [];
    const parsed = JSON.parse(raw) as any[];
    return parsed.map((n) => ({ id: n.id, title: n.title, read: n.status !== "Scheduled" ? true : false, createdAt: n.createdAt }));
  } catch {
    return [];
  }
}

export default function ViewNotifications() {
  const nav = useNavigate();
  const [filter, setFilter] = useState<"unread" | "read">("read");
  const [items] = useState<Item[]>(() => load());
  const list = useMemo(() => items.filter((i) => (filter === "read" ? i.read : !i.read)), [items, filter]);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-extrabold tracking-tight">Notifications</h1>
        <div className="flex items-center gap-2">
          <Button variant={filter === "unread" ? "default" : "outline"} onClick={() => setFilter("unread")}>Unread</Button>
          <Button variant={filter === "read" ? "default" : "outline"} onClick={() => setFilter("read")}>Read</Button>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="border rounded-md p-4 text-muted-foreground flex items-center gap-3">
          <span>You have no {filter} notifications.</span>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((n) => (
            <div key={n.id} className="border rounded-md p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {!n.read && <Badge>New</Badge>}
                <div className="font-medium">{n.title}</div>
              </div>
              <div className="text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}

      <div className="pt-6">
        <Button variant="link" onClick={() => nav("/notifications")}>Create Notification</Button>
      </div>
    </div>
  );
}


