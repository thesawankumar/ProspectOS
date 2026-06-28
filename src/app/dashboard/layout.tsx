"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useProspectStore } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import CommandPalette from "@/components/dashboard/CommandPalette";
import {
  Search,
  Compass,
  GitBranch,
  Settings,
  Bell,
  ChevronDown,
  LogOut,
  User,
  PlusCircle,
  Menu,
  X,
  Keyboard,
  ShieldAlert,
  Send,
  Layers,
  Sparkles,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const workspaces = useProspectStore((state) => state.workspaces);
  const activeWorkspaceId = useProspectStore((state) => state.activeWorkspaceId);
  const switchWorkspace = useProspectStore((state) => state.switchWorkspace);
  const session = useProspectStore((state) => state.session);

  const notifications = useProspectStore((state) => state.notifications);
  const markNotificationsRead = useProspectStore((state) => state.markNotificationsRead);
  const clearNotifications = useProspectStore((state) => state.clearNotifications);

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];

  // Component UI toggles
  const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Bind keyboard shortcut CTRL+K to Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navLinks = [
    { label: "Dashboard", href: "/dashboard", icon: <Compass className="h-4.5 w-4.5" /> },
    { label: "Lead Finder", href: "/dashboard/leads", icon: <Search className="h-4.5 w-4.5" /> },
    { label: "Kanban CRM", href: "/dashboard/crm", icon: <GitBranch className="h-4.5 w-4.5" /> },
    { label: "Campaigns", href: "/dashboard/campaigns", icon: <Send className="h-4.5 w-4.5" /> },
    { label: "Template Library", href: "/dashboard/templates", icon: <Layers className="h-4.5 w-4.5" /> },
    { label: "AI Copywriter", href: "/dashboard/ai", icon: <Sparkles className="h-4.5 w-4.5" /> },
    { label: "AI Outreach Agent", href: "/dashboard/agent", icon: <Zap className="h-4.5 w-4.5" /> },
    { label: "Workspace Settings", href: "/dashboard/settings", icon: <Settings className="h-4.5 w-4.5" /> }
  ];

  const handleLogout = () => {
    toast({
      title: "Logged Out Successfully",
      description: "Redirecting to landing page...",
      variant: "info",
    });
    router.push("/");
  };

  const handleSwitchWorkspace = (id: string, name: string) => {
    switchWorkspace(id);
    setWorkspaceDropdownOpen(false);
    toast({
      title: "Workspace Changed",
      description: `Switched active account to ${name}.`,
      variant: "success",
    });
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen flex bg-gray-50/50">
      {/* 1. DESKTOP SIDEBAR PANEL */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-gray-200/80 bg-white shrink-0 h-screen sticky top-0 p-4">
        {/* Workspace Switcher */}
        <div className="relative mb-6">
          <button
            onClick={() => setWorkspaceDropdownOpen(!workspaceDropdownOpen)}
            className="w-full flex items-center justify-between p-2 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-200/50 transition-all select-none cursor-pointer focus:outline-hidden"
          >
            <div className="flex items-center space-x-2.5">
              <div className="h-8.5 w-8.5 rounded-xl bg-[#F4B6C2] flex items-center justify-center font-bold text-gray-900 shadow-2xs">
                {activeWorkspace.name.substring(0, 1).toUpperCase()}
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-gray-800 block leading-tight">
                  {activeWorkspace.name}
                </span>
                <span className="text-3xs text-gray-400 font-semibold uppercase tracking-wider block">
                  Workspace
                </span>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>

          {/* Workspace Switcher Dropdown */}
          <AnimatePresence>
            {workspaceDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setWorkspaceDropdownOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 right-0 mt-2 z-20 bg-white border border-gray-200/80 rounded-2xl shadow-xl p-2.5 space-y-1"
                >
                  <span className="text-3xs font-bold text-gray-400 uppercase tracking-widest block px-2 py-1">
                    My Workspaces
                  </span>
                  {workspaces.map((w) => (
                    <button
                      key={w.id}
                      onClick={() => handleSwitchWorkspace(w.id, w.name)}
                      className={cn(
                        "w-full text-left px-2.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer focus:outline-hidden",
                        w.id === activeWorkspaceId
                          ? "bg-[#FCE7EB] text-[#D84B68]"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <span className="h-5 w-5 rounded-md bg-gray-100 flex items-center justify-center font-bold text-3xs text-gray-800 border border-gray-200">
                        {w.name.substring(0, 1).toUpperCase()}
                      </span>
                      <span>{w.name}</span>
                    </button>
                  ))}
                  <div className="border-t border-gray-100 my-1 pt-1.5">
                    <button
                      onClick={() => {
                        setWorkspaceDropdownOpen(false);
                        router.push("/dashboard/settings#workspaces");
                        toast({
                          title: "Create Workspace",
                          description: "Redirecting to workspaces configuration panel.",
                          variant: "info"
                        });
                      }}
                      className="w-full flex items-center space-x-2 px-2.5 py-2 rounded-xl text-xs font-semibold text-[#D84B68] hover:bg-[#FCE7EB]/30 transition-all cursor-pointer focus:outline-hidden"
                    >
                      <PlusCircle className="h-4 w-4" />
                      <span>Create New Workspace</span>
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop Sidebar Navigation */}
        <nav className="space-y-1 flex-grow">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <a
                key={link.label}
                href={link.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all",
                  isActive
                    ? "bg-[#FCE7EB]/40 text-[#D84B68]"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                <span className={isActive ? "text-[#D84B68]" : "text-gray-400"}>
                  {link.icon}
                </span>
                <span>{link.label}</span>
              </a>
            );
          })}
        </nav>

        {/* User profile card & Logout action */}
        <div className="pt-4 border-t border-gray-200/50 space-y-3">
          {/* Quick Command Help */}
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-150 rounded-xl text-3xs font-semibold text-gray-500 transition-colors select-none cursor-pointer focus:outline-hidden"
          >
            <span className="flex items-center gap-1.5">
              <Keyboard className="h-3.5 w-3.5" /> Open Commands
            </span>
            <span className="border border-gray-300 px-1 py-0.5 rounded-sm bg-white shadow-2xs font-mono font-bold select-none">
              Ctrl+K
            </span>
          </button>

          {/* Profile Card */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50/50 border border-gray-150">
            <div className="flex items-center space-x-2">
              <div className="h-9 w-9 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center font-bold text-xs text-gray-700">
                {session.avatar}
              </div>
              <div className="text-left max-w-[100px] truncate">
                <span className="text-xs font-bold text-gray-800 block truncate">
                  {session.name}
                </span>
                <span className="text-3xs text-gray-400 font-semibold uppercase tracking-wider block">
                  {session.role}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors cursor-pointer focus:outline-hidden"
              aria-label="Logout account"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN VIEWPORT WRAPPER */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Sticky Header Bar */}
        <header className="sticky top-0 z-30 h-16 border-b border-gray-200/80 bg-white/80 backdrop-filter backdrop-blur-md px-6 flex items-center justify-between">
          {/* Mobile view toggle */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-500 focus:outline-hidden cursor-pointer"
              aria-label="Open navigation sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="font-bold text-sm text-gray-800">
              Prospect<span className="text-[#EC9EB2]">OS</span>
            </span>
          </div>

          <div className="hidden lg:block text-xs font-semibold text-gray-400">
            <span>Active: </span>
            <Badge variant="accent" className="font-bold">
              {activeWorkspace.name} Workspace
            </Badge>
          </div>

          {/* Quick Header Actions (Notification Center, Search triggers) */}
          <div className="flex items-center space-x-3.5">
            {/* Search triggers Command Palette */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="hidden sm:flex items-center space-x-2 px-3 py-1.5 w-44 rounded-full border border-gray-200 bg-gray-50 hover:bg-gray-100 text-2xs text-gray-400 font-semibold text-left select-none cursor-pointer focus:outline-hidden"
            >
              <Search className="h-3.5 w-3.5 text-gray-400" />
              <span>Search / Actions</span>
            </button>

            {/* Notification Badge Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors relative cursor-pointer focus:outline-hidden"
                aria-label="Open notifications"
              >
                <Bell className="h-4.5 w-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#EC9EB2] ring-2 ring-white" />
                )}
              </button>

              {/* Notifications Panel Box */}
              <AnimatePresence>
                {notificationsOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setNotificationsOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 z-20 w-80 bg-white border border-gray-200/80 rounded-2xl shadow-2xl p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <span className="text-xs font-bold text-gray-800">
                          Inbox Alerts ({unreadCount})
                        </span>
                        <div className="flex space-x-2 text-3xs font-semibold">
                          <button
                            onClick={() => {
                              markNotificationsRead();
                              toast({ title: "Notifications Read", description: "Cleared unread counts", variant: "info" });
                            }}
                            className="text-[#D84B68] hover:text-[#EC9EB2]"
                          >
                            Mark Read
                          </button>
                          <span className="text-gray-200">|</span>
                          <button
                            onClick={() => {
                              clearNotifications();
                              toast({ title: "Alerts Cleared", description: "Cleared inbox list", variant: "info" });
                            }}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            Clear
                          </button>
                        </div>
                      </div>

                      <div className="divide-y divide-gray-50 max-h-[220px] overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((n) => (
                            <div
                              key={n.id}
                              className={cn(
                                "py-2 px-1 text-xs text-gray-600 leading-normal flex items-start gap-2",
                                !n.read && "font-semibold bg-[#FCE7EB]/10"
                              )}
                            >
                              <div className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                              <div className="flex-1">
                                <p className="text-gray-800">{n.title}</p>
                                <p className="text-3xs text-gray-400">{n.message}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="py-6 text-center text-xs text-gray-400">
                            Zero unread messages. Good job!
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Avatar Trigger */}
            <div className="h-8 w-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center font-bold text-xs text-gray-700 select-none">
              {session.avatar}
            </div>
          </div>
        </header>

        {/* Child Routes Viewport */}
        <main className="flex-grow p-6 md:p-8 bg-gray-50/20 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* 3. MOBILE SIDEBAR DRAWER OVERLAY */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute inset-0 bg-black/30 backdrop-blur-xs"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="absolute inset-y-0 left-0 w-64 bg-white p-4 flex flex-col justify-between border-r border-gray-200 shadow-2xl"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg text-gray-800">
                    Prospect<span className="text-[#EC9EB2]">OS</span>
                  </span>
                  <button
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-1 rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer"
                    aria-label="Close sidebar"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <a
                        key={link.label}
                        href={link.href}
                        onClick={() => setMobileSidebarOpen(false)}
                        className={cn(
                          "flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all",
                          isActive
                            ? "bg-[#FCE7EB]/40 text-[#D84B68]"
                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                        )}
                      >
                        <span className={isActive ? "text-[#D84B68]" : "text-gray-400"}>
                          {link.icon}
                        </span>
                        <span>{link.label}</span>
                      </a>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-gray-200/50 flex items-center justify-between p-2 rounded-xl bg-gray-50">
                <div className="flex items-center space-x-2">
                  <div className="h-9 w-9 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center font-bold text-xs text-gray-700">
                    {session.avatar}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-800 block leading-none">
                      {session.name}
                    </span>
                    <span className="text-3xs text-gray-400 font-semibold tracking-wider">
                      {session.role}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 cursor-pointer"
                  aria-label="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. MODAL DIALOG COMMAND PALETTE */}
      <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
    </div>
  );
}
