"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, CheckCheck, Megaphone, Calendar, Reply, AlertCircle, Info, CheckCircle } from "lucide-react";
import { useNotificationStream } from "@/hooks/useNotificationStream";
import type { NotificationDTO, NotificationType } from "@/types";

const SEED_NOTIFICATIONS: NotificationDTO[] = [
  { id: "n-1", type: "REPLY", title: "New Reply — Sarah Chen", message: "Interested! Can we hop on a call this week?", actionUrl: "/dashboard/campaigns", isRead: false, createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString() },
  { id: "n-2", type: "CAMPAIGN", title: "Campaign Milestone", message: "SaaS Founders Outreach hit 40% open rate!", actionUrl: "/dashboard/campaigns", isRead: false, createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString() },
  { id: "n-3", type: "MEETING", title: "Meeting Booked", message: "Marcus Rivera scheduled a 30-min demo for tomorrow.", actionUrl: "/dashboard/calendar", isRead: true, createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString() },
  { id: "n-4", type: "INFO", title: "New Lead Added", message: "Priya Nair (Finbloom) was added from LinkedIn scrape.", actionUrl: "/dashboard/leads", isRead: true, createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() },
];

const TYPE_ICONS: Record<NotificationType, React.FC<{ className?: string }>> = {
  REPLY:    Reply,
  MEETING:  Calendar,
  CAMPAIGN: Megaphone,
  SUCCESS:  CheckCircle,
  WARNING:  AlertCircle,
  ERROR:    AlertCircle,
  INFO:     Info,
};

const TYPE_COLORS: Record<NotificationType, string> = {
  REPLY:    "bg-emerald-50 text-emerald-600",
  MEETING:  "bg-blue-50 text-blue-600",
  CAMPAIGN: "bg-purple-50 text-purple-600",
  SUCCESS:  "bg-emerald-50 text-emerald-600",
  WARNING:  "bg-amber-50 text-amber-600",
  ERROR:    "bg-red-50 text-red-600",
  INFO:     "bg-gray-50 text-gray-600",
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<NotificationDTO[]>(SEED_NOTIFICATIONS);
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Connect to SSE stream
  useNotificationStream({
    onNotification: (notification) => {
      setNotifications((prev) => [notification, ...prev].slice(0, 50));
    },
    enabled: true,
  });

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
  };

  return (
    <div ref={panelRef} className="relative">
      {/* Bell button */}
      <button
        id="notification-bell"
        onClick={() => setIsOpen((o) => !o)}
        className="relative p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#D84B68] text-white text-2xs font-bold rounded-full flex items-center justify-center"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="absolute right-0 top-full mt-2 w-[380px] bg-white rounded-2xl shadow-xl border border-gray-200 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-sm text-gray-900">Notifications</h3>
                <p className="text-2xs text-gray-400 font-medium">{unreadCount} unread</p>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="flex items-center gap-1.5 text-2xs text-[#D84B68] font-semibold hover:text-[#B73550] transition-colors cursor-pointer"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="max-h-[420px] overflow-y-auto divide-y divide-gray-50">
              {notifications.length === 0 ? (
                <div className="py-12 text-center text-sm text-gray-400">
                  No notifications yet
                </div>
              ) : (
                notifications.map((notification) => {
                  const Icon = TYPE_ICONS[notification.type] ?? Info;
                  return (
                    <motion.div
                      key={notification.id}
                      layout
                      className={`flex gap-3.5 px-5 py-4 cursor-pointer transition-colors hover:bg-gray-50 ${!notification.isRead ? "bg-[#D84B68]/3" : ""}`}
                      onClick={() => {
                        markRead(notification.id);
                        if (notification.actionUrl) window.location.href = notification.actionUrl;
                      }}
                    >
                      {/* Icon */}
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${TYPE_COLORS[notification.type]}`}>
                        <Icon className="h-4 w-4" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm font-semibold leading-tight truncate ${!notification.isRead ? "text-gray-900" : "text-gray-700"}`}>
                            {notification.title}
                          </p>
                          {!notification.isRead && (
                            <div className="w-2 h-2 rounded-full bg-[#D84B68] flex-shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{notification.message}</p>
                        <p className="text-2xs text-gray-400 font-medium mt-1.5">{timeAgo(notification.createdAt)}</p>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full text-center text-xs font-semibold text-[#D84B68] hover:text-[#B73550] transition-colors cursor-pointer"
              >
                View all notifications
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
