"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Search, X, LayoutDashboard, Users, Megaphone,
  FileText, Settings, BarChart2, Calendar, Folder, Link2,
  Bot, Zap, CreditCard, Shield, ChevronRight, Keyboard,
} from "lucide-react";
import type { CommandItem, CommandType } from "@/types";

const ALL_COMMANDS: CommandItem[] = [
  { id: "p-dashboard",    type: "page",    title: "Dashboard",           description: "Overview & KPIs",               href: "/dashboard",               icon: "LayoutDashboard" },
  { id: "p-leads",        type: "page",    title: "Lead Finder",          description: "Find and manage leads",         href: "/dashboard/leads",         icon: "Users" },
  { id: "p-campaigns",    type: "page",    title: "Campaigns",            description: "Email campaigns & sequences",   href: "/dashboard/campaigns",     icon: "Megaphone" },
  { id: "p-crm",          type: "page",    title: "CRM Pipeline",         description: "Deal stages & contacts",        href: "/dashboard/crm",           icon: "BarChart2" },
  { id: "p-ai",           type: "page",    title: "AI Copywriter",        description: "Generate personalized emails",  href: "/dashboard/ai",            icon: "Bot" },
  { id: "p-agent",        type: "page",    title: "AI Outreach Agent",    description: "Autonomous AI workflows",       href: "/dashboard/agent",         icon: "Zap" },
  { id: "p-templates",    type: "page",    title: "Email Templates",      description: "Manage email templates",        href: "/dashboard/templates",     icon: "FileText" },
  { id: "p-analytics",    type: "page",    title: "Analytics",            description: "Performance reports",           href: "/dashboard/analytics",     icon: "BarChart2" },
  { id: "p-calendar",     type: "page",    title: "Calendar",             description: "Meetings & schedule",           href: "/dashboard/calendar",      icon: "Calendar" },
  { id: "p-documents",    type: "page",    title: "File Manager",         description: "Documents & attachments",       href: "/dashboard/documents",     icon: "Folder" },
  { id: "p-billing",      type: "page",    title: "Billing & Proposals",  description: "Invoices, contracts, proposals", href: "/dashboard/billing",     icon: "CreditCard" },
  { id: "p-integrations", type: "page",    title: "Integrations & API",   description: "Webhooks & app connections",    href: "/dashboard/integrations",  icon: "Link2" },
  { id: "p-settings",     type: "page",    title: "Settings",             description: "Workspace preferences",         href: "/dashboard/settings",      icon: "Settings" },
  { id: "p-admin",        type: "page",    title: "Developer Admin",      description: "System health & feature flags", href: "/dashboard/admin",         icon: "Shield" },
  { id: "a-new-lead",     type: "action",  title: "Add New Lead",         description: "Create a lead manually",        href: "/dashboard/leads",         icon: "Users",     keywords: ["create", "add", "new"] },
  { id: "a-new-campaign", type: "action",  title: "Create Campaign",      description: "Start a new outreach campaign", href: "/dashboard/campaigns",     icon: "Megaphone", keywords: ["launch", "start", "new"] },
  { id: "a-new-proposal", type: "action",  title: "Generate AI Proposal", description: "Draft a client proposal",       href: "/dashboard/billing",       icon: "FileText",  keywords: ["proposal", "draft"] },
  { id: "a-new-invoice",  type: "action",  title: "Create Invoice",       description: "Generate a billing invoice",    href: "/dashboard/billing",       icon: "CreditCard", keywords: ["invoice", "bill"] },
];

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  LayoutDashboard, Users, Megaphone, FileText, Settings, BarChart2,
  Calendar, Folder, Link2, Bot, Zap, CreditCard, Shield,
};

const TYPE_LABELS: Record<CommandType, string> = {
  page: "Pages", lead: "Leads", campaign: "Campaigns",
  template: "Templates", action: "Actions", setting: "Settings",
};

const TYPE_COLORS: Record<CommandType, string> = {
  page: "bg-blue-50 text-blue-600",
  lead: "bg-emerald-50 text-emerald-600",
  campaign: "bg-purple-50 text-purple-600",
  template: "bg-amber-50 text-amber-600",
  action: "bg-rose-50 text-rose-600",
  setting: "bg-gray-50 text-gray-600",
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = query.trim()
    ? ALL_COMMANDS.filter((cmd) => {
        const q = query.toLowerCase();
        return (
          cmd.title.toLowerCase().includes(q) ||
          cmd.description?.toLowerCase().includes(q) ||
          cmd.keywords?.some((k) => k.includes(q))
        );
      })
    : ALL_COMMANDS;

  const grouped = filtered.reduce<Record<string, CommandItem[]>>((acc, cmd) => {
    const label = TYPE_LABELS[cmd.type];
    if (!acc[label]) acc[label] = [];
    acc[label].push(cmd);
    return acc;
  }, {});

  const selectItem = useCallback(
    (item: CommandItem) => {
      if (item.action) { item.action(); }
      else if (item.href) { router.push(item.href); }
      onClose();
    },
    [router, onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex((i) => Math.min(i + 1, filtered.length - 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIndex((i) => Math.max(i - 1, 0)); }
      else if (e.key === "Enter") { e.preventDefault(); if (filtered[activeIndex]) selectItem(filtered[activeIndex]); }
      else if (e.key === "Escape") { onClose(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, filtered, activeIndex, selectItem, onClose]);

  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  useEffect(() => {
    if (isOpen) {
      setQuery(""); setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => { setActiveIndex(0); }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ type: "spring", damping: 30, stiffness: 380 }}
            className="fixed left-1/2 top-[15%] -translate-x-1/2 w-full max-w-2xl z-50 rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
              <Search className="h-5 w-5 text-gray-400 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pages, leads, campaigns, commands..."
                className="flex-1 text-base text-gray-900 placeholder-gray-400 outline-none bg-transparent font-medium"
              />
              {query && (
                <button onClick={() => setQuery("")} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                  <X className="h-4 w-4" />
                </button>
              )}
              <kbd className="hidden sm:flex px-2 py-1 rounded-lg bg-gray-100 text-gray-500 text-xs font-mono">esc</kbd>
            </div>

            {/* Results */}
            <div ref={listRef} className="max-h-[440px] overflow-y-auto py-2">
              {filtered.length === 0 ? (
                <div className="py-12 text-center text-sm text-gray-400 font-medium">
                  No results for &ldquo;{query}&rdquo;
                </div>
              ) : (
                Object.entries(grouped).map(([group, items]) => (
                  <div key={group}>
                    <p className="px-5 pt-3 pb-1.5 text-2xs font-bold text-gray-400 uppercase tracking-widest">{group}</p>
                    {items.map((item) => {
                      const globalIdx = filtered.indexOf(item);
                      const Icon = ICON_MAP[item.icon ?? ""] ?? LayoutDashboard;
                      const isActive = globalIdx === activeIndex;
                      return (
                        <motion.button
                          key={item.id}
                          data-index={globalIdx}
                          onClick={() => selectItem(item)}
                          onMouseEnter={() => setActiveIndex(globalIdx)}
                          whileTap={{ scale: 0.98 }}
                          className={`w-full flex items-center gap-3.5 px-5 py-3 text-left transition-colors cursor-pointer ${isActive ? "bg-[#D84B68]/5" : "hover:bg-gray-50"}`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${TYPE_COLORS[item.type]}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-semibold truncate ${isActive ? "text-[#D84B68]" : "text-gray-800"}`}>{item.title}</p>
                            {item.description && <p className="text-xs text-gray-400 truncate">{item.description}</p>}
                          </div>
                          <span className={`hidden sm:flex text-2xs font-bold px-2 py-0.5 rounded-full ${TYPE_COLORS[item.type]}`}>{item.type}</span>
                          {isActive && <ChevronRight className="h-4 w-4 text-[#D84B68] flex-shrink-0" />}
                        </motion.button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-4 text-2xs text-gray-400 font-medium">
                {[["↑↓", "Navigate"], ["↵", "Select"], ["esc", "Close"]].map(([key, label]) => (
                  <span key={key} className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-gray-200 text-gray-600 font-mono">{key}</kbd> {label}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-1 text-2xs text-gray-400">
                <Keyboard className="h-3.5 w-3.5" />
                <span>{filtered.length} results</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
