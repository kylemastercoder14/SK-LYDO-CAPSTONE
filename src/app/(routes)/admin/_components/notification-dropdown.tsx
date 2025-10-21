"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, Paperclip, User, AlertCircle, CheckCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TicketWithUser } from "@/types/interface";

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState<TicketWithUser[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch notifications from backend
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/notifications/help-center");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const getFileName = (url: string) => {
    if (!url) return "No file attached";
    return url.split("/").pop() || "Unnamed file";
  };

  // 🟢 Icon logic for status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "OPEN":
        return <AlertCircle className="text-destructive size-4" />;
      case "IN_PROGRESS":
        return <AlertCircle className="text-yellow-500 size-4" />;
      case "RESOLVED":
        return <CheckCircle className="text-green-500 size-4" />;
      default:
        return null;
    }
  };

  // 🟠 Format Priority Badge Style
  const getBadgeVariant = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "destructive";
      case "MEDIUM":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative">
          <Bell />
          {notifications.length > 0 && (
            <div className="absolute size-2 bg-destructive rounded-full top-0.5 right-0.5"></div>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-[380px] max-h-[400px] overflow-hidden flex flex-col"
        align="end"
      >
        <DropdownMenuLabel>Help Center Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="overflow-y-auto flex-1">
          {loading ? (
            <div className="text-center text-sm text-muted-foreground py-4">
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground py-4">
              No new notifications
            </div>
          ) : (
            notifications.map((item) => (
              <DropdownMenuItem
                key={item.id}
                className="flex flex-col items-start space-y-1 py-2 cursor-pointer"
              >
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(item.status)}
                    <span className="font-medium text-sm">{item.title}</span>
                  </div>
                  <Badge variant={getBadgeVariant(item.priority)}>
                    {item.priority}
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>

                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <User className="size-3" />
                    {item.user?.username || "Unknown"}
                  </div>
                  {item.attachment && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Paperclip className="size-3" />
                      {getFileName(item.attachment)}
                    </div>
                  )}
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>

        <DropdownMenuSeparator />

        <div className="p-2 text-center">
          <Link
            href="/admin/help-center"
            className="text-sm text-primary hover:underline"
          >
            View all notifications
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
