"use client";

import React, { useState } from "react";
import { useProspectStore } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import {
  Terminal,
  Activity,
  Cpu,
  Database,
  Sliders,
  Settings,
  RefreshCw,
  AlertOctagon,
  Network
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DeveloperAdminPage() {
  const { toast } = useToast();

  const featureFlags = useProspectStore((state) => state.featureFlags);
  const toggleFeatureFlag = useProspectStore((state) => state.toggleFeatureFlag);

  const [logs, setLogs] = useState([
    { ts: "2026-06-28 15:44:07", lvl: "INFO", msg: "Dev server compiled successfully and listening on port 3000" },
    { ts: "2026-06-28 15:45:12", lvl: "INFO", msg: "BullMQ worker initiated for queue: email_outbox" },
    { ts: "2026-06-28 16:10:32", lvl: "INFO", msg: "Redis connection established at 127.0.0.1:6379" },
    { ts: "2026-06-28 16:20:41", lvl: "WARN", msg: "SMTP handshake warning on validation: rate limit fallback initialized" },
    { ts: "2026-06-28 16:32:05", lvl: "INFO", msg: "Workspace databases synchronized via central Zustand store" }
  ]);

  const handleToggleFlag = (flagName: keyof typeof featureFlags, label: string) => {
    toggleFeatureFlag(flagName);
    const isNowEnabled = !featureFlags[flagName];
    toast({
      title: isNowEnabled ? "Feature Enabled" : "Feature Disabled",
      description: `Feature module "${label}" has been ${isNowEnabled ? "activated" : "deactivated"}.`,
      variant: isNowEnabled ? "success" : "warning",
    });
  };

  const handleClearLogs = () => {
    setLogs([]);
    toast({
      title: "Logs Cleared",
      description: "Console debugging screen was flushed.",
      variant: "info",
    });
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/50 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-1.5 bg-[#FCE7EB] text-[#D84B68] rounded-xl">
            <Terminal className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
              Developer Admin Panel
            </h1>
            <p className="text-xs text-gray-400">
              Monitor Redis queue threads, configure global module feature flags, and review server logs
            </p>
          </div>
        </div>
      </div>

      {/* METRICS & QUEUES GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CPU/Memory/Disk Health Ratings */}
        <GlassCard hoverEffect="none" interactive={false} className="bg-white border-gray-200/50 p-5 space-y-4">
          <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-2">
            <Cpu className="h-4 w-4 text-rose-500" /> Host System Health
          </h3>
          
          <div className="space-y-4 select-none">
            {/* CPU usage */}
            <div className="space-y-1">
              <div className="flex justify-between text-3xs font-bold text-gray-600">
                <span>CPU Processor Utilization</span>
                <span>12%</span>
              </div>
              <div className="h-1.5 w-full bg-gray-150 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: "12%" }} />
              </div>
            </div>

            {/* RAM usage */}
            <div className="space-y-1">
              <div className="flex justify-between text-3xs font-bold text-gray-600">
                <span>Memory Allocation (RAM)</span>
                <span>48%</span>
              </div>
              <div className="h-1.5 w-full bg-gray-150 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: "48%" }} />
              </div>
            </div>

            {/* Disk usage */}
            <div className="space-y-1">
              <div className="flex justify-between text-3xs font-bold text-gray-600">
                <span>Disk Storage Space</span>
                <span>62%</span>
              </div>
              <div className="h-1.5 w-full bg-gray-150 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: "62%" }} />
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Redis/BullMQ Queue stats */}
        <GlassCard hoverEffect="none" interactive={false} className="bg-white border-gray-200/50 p-5 space-y-4">
          <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-2">
            <Database className="h-4 w-4 text-blue-500" /> Redis BullMQ Queue Status
          </h3>

          <div className="grid grid-cols-2 gap-4 text-center font-bold text-xs select-none">
            <div className="p-3 bg-gray-50 border border-gray-150 rounded-2xl">
              <span className="text-3xs text-gray-400 block uppercase tracking-wider">Active Jobs</span>
              <span className="text-xl text-blue-600 font-extrabold mt-1 block">3</span>
            </div>

            <div className="p-3 bg-gray-50 border border-gray-150 rounded-2xl">
              <span className="text-3xs text-gray-400 block uppercase tracking-wider">Completed Jobs</span>
              <span className="text-xl text-green-600 font-extrabold mt-1 block">142,094</span>
            </div>

            <div className="p-3 bg-gray-50 border border-gray-150 rounded-2xl">
              <span className="text-3xs text-gray-400 block uppercase tracking-wider">Failed Jobs</span>
              <span className="text-xl text-rose-500 font-extrabold mt-1 block">1</span>
            </div>

            <div className="p-3 bg-gray-50 border border-gray-150 rounded-2xl">
              <span className="text-3xs text-gray-400 block uppercase tracking-wider">Queue Health</span>
              <span className="text-xl text-green-600 font-extrabold mt-1 block">100%</span>
            </div>
          </div>
        </GlassCard>

        {/* Feature Flags Module Toggles */}
        <GlassCard hoverEffect="none" interactive={false} className="bg-white border-gray-200/50 p-5 space-y-4">
          <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-2">
            <Sliders className="h-4 w-4 text-amber-500" /> Global Feature Flags
          </h3>

          <div className="space-y-3.5 text-xs font-bold text-gray-700">
            {/* AI Agent flag */}
            <div className="flex justify-between items-center">
              <span>Autonomous AI Agent Console</span>
              <button
                onClick={() => handleToggleFlag("aiAgent", "AI Agent")}
                className={cn(
                  "w-12 h-6 rounded-full transition-all relative focus:outline-hidden cursor-pointer",
                  featureFlags.aiAgent ? "bg-green-500" : "bg-gray-200"
                )}
              >
                <span className={cn("w-4.5 h-4.5 rounded-full bg-white absolute top-0.75 transition-all shadow-xs", featureFlags.aiAgent ? "left-6.5" : "left-1")} />
              </button>
            </div>

            {/* Proposal flag */}
            <div className="flex justify-between items-center">
              <span>AI Proposal PDF Generator</span>
              <button
                onClick={() => handleToggleFlag("proposals", "Proposal Generator")}
                className={cn(
                  "w-12 h-6 rounded-full transition-all relative focus:outline-hidden cursor-pointer",
                  featureFlags.proposals ? "bg-green-500" : "bg-gray-200"
                )}
              >
                <span className={cn("w-4.5 h-4.5 rounded-full bg-white absolute top-0.75 transition-all shadow-xs", featureFlags.proposals ? "left-6.5" : "left-1")} />
              </button>
            </div>

            {/* Contract templates flag */}
            <div className="flex justify-between items-center">
              <span>Contract Service Agreements</span>
              <button
                onClick={() => handleToggleFlag("contracts", "Contracts")}
                className={cn(
                  "w-12 h-6 rounded-full transition-all relative focus:outline-hidden cursor-pointer",
                  featureFlags.contracts ? "bg-green-500" : "bg-gray-200"
                )}
              >
                <span className={cn("w-4.5 h-4.5 rounded-full bg-white absolute top-0.75 transition-all shadow-xs", featureFlags.contracts ? "left-6.5" : "left-1")} />
              </button>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* SERVER LOG MONITOR */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-gray-800 uppercase tracking-wider block">Server System Logs Console</span>
          <button
            onClick={handleClearLogs}
            className="px-3 py-1.5 rounded-full bg-white hover:bg-gray-50 border border-gray-200 text-3xs font-bold text-gray-500 transition-colors focus:outline-hidden cursor-pointer"
          >
            Clear Log Console
          </button>
        </div>

        <GlassCard hoverEffect="none" interactive={false} className="bg-gray-900 border-gray-800 text-gray-100 rounded-3xl p-6 min-h-[220px]">
          <div className="font-mono text-xs leading-relaxed space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {logs.map((log, index) => {
              const isWarn = log.lvl === "WARN";
              
              return (
                <div key={index} className="flex items-start space-x-2">
                  <span className="text-gray-500 shrink-0 select-none">[{log.ts}]</span>
                  <span className={cn(isWarn ? "text-amber-400 font-bold" : "text-green-400 font-bold")}>
                    {log.lvl}
                  </span>
                  <span className="text-gray-300">{log.msg}</span>
                </div>
              );
            })}
            {logs.length === 0 && (
              <div className="py-12 text-center text-gray-500 select-none">
                Logs flushed. Output is standby.
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
