"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useProspectStore, Lead } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import {
  Users,
  Send,
  MailCheck,
  TrendingUp,
  Percent,
  CheckCircle2,
  DollarSign,
  Calendar,
  Zap,
  Target,
  ArrowRight,
  TrendingDown
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();

  const workspaces = useProspectStore((state) => state.workspaces);
  const activeWorkspaceId = useProspectStore((state) => state.activeWorkspaceId);
  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];
  const leads = activeWorkspace.leads;
  const activities = activeWorkspace.activities;

  const addLeadTask = useProspectStore((state) => state.addLeadTask);

  // Quick task modal state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskLeadId, setTaskLeadId] = useState("");
  const [taskPriority, setTaskPriority] = useState<"high" | "medium" | "low">("medium");

  // Calculations based on leads data
  const totalLeadsCount = leads.length;
  const wonLeadsCount = leads.filter((l) => l.stage === "Won").length;
  
  // Approximate pipeline value: assume a default contract values for demo
  const pipelineValue = leads.reduce((sum, lead) => {
    if (lead.stage === "Won") return sum + 5000;
    if (lead.stage === "Meeting" || lead.stage === "Proposal") return sum + 2000;
    return sum + 500;
  }, 0);

  const pendingTasksCount = leads.reduce(
    (sum, lead) => sum + lead.tasks.filter((t) => !t.completed).length,
    0
  );

  const handleQuickSequence = () => {
    toast({
      title: "Sequence Launched! 🚀",
      description: `Outreach auto-scheduler is now processing queue (${activeWorkspace.dailyGoal} emails/day limit).`,
      variant: "success",
    });
  };

  const handleCreateTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle || !taskLeadId) return;

    addLeadTask(taskLeadId, {
      title: taskTitle,
      dueDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10), // 2 days out
      priority: taskPriority
    });

    toast({
      title: "Follow-up Created",
      description: `Task scheduled for prospect.`,
      variant: "success",
    });

    // Reset and close
    setTaskTitle("");
    setTaskLeadId("");
    setIsTaskModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* 1. WELCOME HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            Welcome back, Alex Rivera 👋
          </h1>
          <p className="text-xs md:text-sm text-gray-400">
            Active Workspace: <span className="font-bold text-gray-600">{activeWorkspace.name}</span> • Today is {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => router.push("/dashboard/leads")} variant="outline" size="sm">
            Find Leads
          </Button>
          <Button onClick={handleQuickSequence} variant="primary" size="sm">
            <Zap className="h-4 w-4 mr-1.5 shrink-0" /> Launch Sequence
          </Button>
        </div>
      </div>

      {/* 2. STATS GRID METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard hoverEffect="lift" className="p-5 flex flex-col justify-between min-h-[120px] bg-white border-gray-200/50">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-2xs font-bold uppercase tracking-wider">Total Leads</span>
            <Users className="h-4 w-4" />
          </div>
          <div className="mt-3">
            <span className="text-2xl md:text-3xl font-extrabold text-gray-800">{totalLeadsCount}</span>
            <p className="text-3xs text-green-500 font-semibold mt-1">▲ 14% this week</p>
          </div>
        </GlassCard>

        <GlassCard hoverEffect="lift" className="p-5 flex flex-col justify-between min-h-[120px] bg-white border-gray-200/50">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-2xs font-bold uppercase tracking-wider">Campaign Outreach</span>
            <Send className="h-4 w-4" />
          </div>
          <div className="mt-3">
            <span className="text-2xl md:text-3xl font-extrabold text-gray-800">1,420</span>
            <p className="text-3xs text-gray-400 mt-1">Limit: {activeWorkspace.dailyGoal}/day</p>
          </div>
        </GlassCard>

        <GlassCard hoverEffect="lift" className="p-5 flex flex-col justify-between min-h-[120px] bg-white border-gray-200/50">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-2xs font-bold uppercase tracking-wider">Reply Rates</span>
            <Percent className="h-4 w-4" />
          </div>
          <div className="mt-3">
            <span className="text-2xl md:text-3xl font-extrabold text-gray-800">12.2%</span>
            <p className="text-3xs text-green-500 font-semibold mt-1">▲ 2.4% above avg</p>
          </div>
        </GlassCard>

        <GlassCard hoverEffect="lift" className="p-5 flex flex-col justify-between min-h-[120px] bg-white border-gray-200/50">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-2xs font-bold uppercase tracking-wider">Pipeline Revenue</span>
            <DollarSign className="h-4 w-4" />
          </div>
          <div className="mt-3">
            <span className="text-2xl md:text-3xl font-extrabold text-gray-800">
              ${pipelineValue.toLocaleString()}
            </span>
            <p className="text-3xs text-green-500 font-semibold mt-1">{wonLeadsCount} Client(s) Won</p>
          </div>
        </GlassCard>
      </div>

      {/* 3. CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Email Delivery line chart */}
        <GlassCard hoverEffect="none" interactive={false} className="lg:col-span-2 bg-white border-gray-200/50 flex flex-col justify-between p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-bold text-gray-800">Outreach Deliverability Trends</h3>
              <p className="text-3xs text-gray-400">Campaign performance over last 7 days</p>
            </div>
            <Badge variant="success">99.8% Inbox rate</Badge>
          </div>

          {/* Custom SVG Line Chart */}
          <div className="relative w-full h-[180px] pt-4">
            <svg viewBox="0 0 500 150" className="w-full h-full">
              {/* Grid lines */}
              <line x1="0" y1="20" x2="500" y2="20" stroke="#f3f4f6" strokeWidth="1" />
              <line x1="0" y1="70" x2="500" y2="70" stroke="#f3f4f6" strokeWidth="1" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="#f3f4f6" strokeWidth="1" />

              {/* Area Under Curve Gradient */}
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F4B6C2" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#F4B6C2" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 10 120 L 80 90 L 160 110 L 240 60 L 320 80 L 400 40 L 480 30 L 480 120 Z"
                fill="url(#chartGradient)"
              />

              {/* Smooth trend path */}
              <path
                d="M 10 120 Q 80 90, 160 110 T 320 80 T 480 30"
                fill="none"
                stroke="#D84B68"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Data points */}
              <circle cx="80" cy="90" r="4" fill="#D84B68" />
              <circle cx="160" cy="110" r="4" fill="#D84B68" />
              <circle cx="240" cy="60" r="4" fill="#D84B68" />
              <circle cx="320" cy="80" r="4" fill="#D84B68" />
              <circle cx="400" cy="40" r="4" fill="#D84B68" />
              <circle cx="480" cy="30" r="4" fill="#D84B68" />
            </svg>
            
            {/* Axis labels */}
            <div className="flex justify-between text-3xs text-gray-400 font-bold uppercase tracking-wider pt-2 select-none">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </GlassCard>

        {/* Lead Sources distribution */}
        <GlassCard hoverEffect="none" interactive={false} className="bg-white border-gray-200/50 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-800">Pipeline Stage Health</h3>
            <p className="text-3xs text-gray-400">Current active leads count distribution</p>
          </div>

          <div className="space-y-4 my-6">
            {[
              { label: "New Leads", count: leads.filter(l => l.stage === "New Lead").length, color: "bg-gray-200", total: leads.length },
              { label: "Outbox (Contacted)", count: leads.filter(l => l.stage === "Contacted" || l.stage === "Replied").length, color: "bg-blue-300", total: leads.length },
              { label: "Meetings Booked", count: leads.filter(l => l.stage === "Meeting").length, color: "bg-amber-300", total: leads.length },
              { label: "Contracts Closed", count: leads.filter(l => l.stage === "Won").length, color: "bg-green-300", total: leads.length }
            ].map((stageItem) => {
              const percentage = stageItem.total > 0 ? (stageItem.count / stageItem.total) * 100 : 0;
              return (
                <div key={stageItem.label} className="space-y-1">
                  <div className="flex justify-between text-2xs font-bold text-gray-600">
                    <span>{stageItem.label}</span>
                    <span>{stageItem.count} ({Math.round(percentage)}%)</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8 }}
                      className={cn("h-full rounded-full", stageItem.color)}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-3xs text-gray-400 leading-normal border-t border-gray-150 pt-3">
            * Automatically updates in real time based on Kanban movements.
          </div>
        </GlassCard>
      </div>

      {/* 4. ACTIONS & TIMELINE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions List */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={() => router.push("/dashboard/leads")}
              className="flex items-center justify-between p-4 bg-white border border-gray-200 hover:border-gray-300 rounded-2xl shadow-2xs hover:shadow-xs transition-all text-left cursor-pointer focus:outline-hidden"
            >
              <div className="flex items-center space-x-3.5">
                <div className="h-9 w-9 rounded-xl bg-green-50 text-green-700 flex items-center justify-center">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-800">Find B2B Prospects</h4>
                  <p className="text-3xs text-gray-400">Launch Google Maps / local categories scraper</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-300" />
            </button>

            <button
              onClick={() => setIsTaskModalOpen(true)}
              className="flex items-center justify-between p-4 bg-white border border-gray-200 hover:border-gray-300 rounded-2xl shadow-2xs hover:shadow-xs transition-all text-left cursor-pointer focus:outline-hidden"
            >
              <div className="flex items-center space-x-3.5">
                <div className="h-9 w-9 rounded-xl bg-[#FCE7EB] text-[#D84B68] flex items-center justify-center">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-800">Schedule Lead Follow-up</h4>
                  <p className="text-3xs text-gray-400">Create target reminder calls or task events</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-300" />
            </button>

            <button
              onClick={() => {
                toast({
                  title: "Generating Proposal...",
                  description: "Assembling document utilizing default template assets.",
                  variant: "info",
                });
              }}
              className="flex items-center justify-between p-4 bg-white border border-gray-200 hover:border-gray-300 rounded-2xl shadow-2xs hover:shadow-xs transition-all text-left cursor-pointer focus:outline-hidden"
            >
              <div className="flex items-center space-x-3.5">
                <div className="h-9 w-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-800">Generate PDF Proposal</h4>
                  <p className="text-3xs text-gray-400">Draft customized pricing pitch docs</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-300" />
            </button>
          </div>
        </div>

        {/* Activity Timeline List (Spans 2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Workspace Activity Logs</h3>
          <GlassCard hoverEffect="none" interactive={false} className="bg-white border-gray-200/50 p-6 min-h-[220px]">
            <div className="flow-root">
              <ul className="-mb-8">
                {activities.map((act, actIdx) => (
                  <li key={act.id}>
                    <div className="relative pb-8">
                      {actIdx !== activities.length - 1 ? (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-100" aria-hidden="true" />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span
                            className={cn(
                              "h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white",
                              act.type === "lead_won"
                                ? "bg-green-50 text-green-700"
                                : act.type === "email_replied"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-gray-100 text-gray-500"
                            )}
                          >
                            {act.type === "lead_won" ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : act.type === "email_replied" ? (
                              <MailCheck className="h-4 w-4" />
                            ) : (
                              <Target className="h-4 w-4" />
                            )}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-xs font-bold text-gray-800">{act.title}</p>
                          </div>
                          <div className="text-right text-3xs text-gray-400 font-semibold whitespace-nowrap">
                            <span>{act.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* 5. CREATE FOLLOW-UP DIALOG */}
      <Dialog isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)}>
        <form onSubmit={handleCreateTaskSubmit} className="space-y-5">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Add Lead Follow-up Task</h3>
            <p className="text-xs text-gray-500">Configure reminder tasks attached directly to CRM targets</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="task-title" className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">Task Title</label>
              <Input
                id="task-title"
                type="text"
                placeholder="e.g. Schedule introductory feedback call"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="task-lead" className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">Target Lead</label>
              <select
                id="task-lead"
                value={taskLeadId}
                onChange={(e) => setTaskLeadId(e.target.value)}
                className="flex w-full rounded-full border border-gray-200 bg-white px-4 py-2.5 text-xs md:text-sm text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-[#F4B6C2]/20"
                required
              >
                <option value="" disabled>-- Select Lead --</option>
                {leads.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} ({l.company})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">Priority</label>
              <div className="flex gap-2">
                {["low", "medium", "high"].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setTaskPriority(p as any)}
                    className={cn(
                      "flex-1 py-1.5 rounded-full border text-xs font-bold capitalize transition-all cursor-pointer focus:outline-hidden",
                      taskPriority === p
                        ? "border-[#F4B6C2] bg-[#FCE7EB]/30 text-[#D84B68]"
                        : "border-gray-200 text-gray-500 hover:bg-gray-50"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsTaskModalOpen(false)}
              className="px-4 py-2 rounded-full border border-gray-200 text-xs font-semibold text-gray-500 hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <Button type="submit" variant="primary" size="sm">
              Schedule Task
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
