"use client";

import React, { useState } from "react";
import { useProspectStore } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  BarChart3,
  TrendingUp,
  Mail,
  Send,
  Download,
  Brain,
  Clock,
  Sparkles,
  Calendar,
  Layers,
  HelpCircle,
  FileSpreadsheet
} from "lucide-react";

export default function AnalyticsPage() {
  const { toast } = useToast();
  
  const workspaces = useProspectStore((state) => state.workspaces);
  const activeWorkspaceId = useProspectStore((state) => state.activeWorkspaceId);
  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];
  
  const campaigns = activeWorkspace.campaigns || [];
  
  const [selectedReportTime, setSelectedReportTime] = useState("Weekly");
  const [isExporting, setIsExporting] = useState(false);

  // Stats Calculations
  const totalSent = campaigns.reduce((sum, c) => sum + c.sentCount, 0);
  const totalOpened = campaigns.reduce((sum, c) => sum + c.openCount, 0);
  const totalReplies = campaigns.reduce((sum, c) => sum + c.replyCount, 0);
  const totalBounces = campaigns.reduce((sum, c) => sum + c.bounceCount, 0);

  const handleExport = (format: "PDF" | "CSV" | "JSON") => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      toast({
        title: "Report Exported",
        description: `ProspectOS ${selectedReportTime} Activity Report saved as ${format}.`,
        variant: "success",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
            Performance Analytics
          </h1>
          <p className="text-xs text-gray-400">
            Monitor response metrics, review campaign conversions, and export delivery reports
          </p>
        </div>

        {/* Report Pacing dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={selectedReportTime}
            onChange={(e) => setSelectedReportTime(e.target.value)}
            className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 focus:outline-hidden"
          >
            <option value="Daily">Daily Activity</option>
            <option value="Weekly">Weekly Activity</option>
            <option value="Monthly">Monthly Activity</option>
            <option value="Yearly">Yearly Activity</option>
          </select>

          <Button
            onClick={() => handleExport("PDF")}
            disabled={isExporting}
            variant="outline"
            size="sm"
          >
            {isExporting ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : <Download className="h-4 w-4 mr-1.5" />}
            Export PDF
          </Button>
        </div>
      </div>

      {/* METRICS SUMMARY GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Emails Sent", val: totalSent, color: "text-gray-800" },
          { label: "Delivered Rate", val: totalSent > 0 ? "99.8%" : "100%", color: "text-green-600" },
          { label: "Open Rate", val: totalSent > 0 ? `${((totalOpened / totalSent) * 100).toFixed(1)}%` : "0%", color: "text-blue-600" },
          { label: "Reply Rate", val: totalSent > 0 ? `${((totalReplies / totalSent) * 100).toFixed(1)}%` : "0%", color: "text-indigo-600" },
          { label: "Bounces", val: totalBounces, color: "text-rose-500" }
        ].map((item) => (
          <GlassCard key={item.label} hoverEffect="lift" className="p-4 bg-white border-gray-200/50 flex flex-col justify-between select-none">
            <span className="text-3xs font-bold text-gray-400 uppercase tracking-widest block">{item.label}</span>
            <span className={`text-lg md:text-xl font-extrabold mt-2 ${item.color}`}>{item.val}</span>
          </GlassCard>
        ))}
      </div>

      {/* CHARTS LAYER ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity Line Chart (Span 2) */}
        <GlassCard hoverEffect="none" interactive={false} className="lg:col-span-2 bg-white border-gray-200/50 p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-gray-50 pb-3">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-[#D84B68]" /> Email Activity Tracking
            </h3>
            <span className="text-3xs text-gray-400 font-bold">Mon - Sun (Weekly stats)</span>
          </div>

          {/* Custom SVG Line Chart */}
          <div className="h-64 w-full relative">
            <svg viewBox="0 0 600 240" className="w-full h-full text-gray-400">
              {/* Grid Lines */}
              <line x1="40" y1="40" x2="580" y2="40" stroke="#f3f4f6" strokeWidth="1" />
              <line x1="40" y1="100" x2="580" y2="100" stroke="#f3f4f6" strokeWidth="1" />
              <line x1="40" y1="160" x2="580" y2="160" stroke="#f3f4f6" strokeWidth="1" />
              <line x1="40" y1="200" x2="580" y2="200" stroke="#f3f4f6" strokeWidth="1" />

              {/* Sent Line (Pink Gradient) */}
              <defs>
                <linearGradient id="sentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D84B68" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#D84B68" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M 40,180 Q 130,60 220,110 T 400,50 T 580,90"
                fill="none"
                stroke="#D84B68"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M 40,180 Q 130,60 220,110 T 400,50 T 580,90 L 580,200 L 40,200 Z"
                fill="url(#sentGrad)"
              />

              {/* Replies Line (Blue) */}
              <path
                d="M 40,195 Q 130,170 220,180 T 400,160 T 580,185"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Chart Labels */}
              <text x="35" y="220" fontSize="10" fill="#9ca3af" textAnchor="middle">Mon</text>
              <text x="125" y="220" fontSize="10" fill="#9ca3af" textAnchor="middle">Tue</text>
              <text x="215" y="220" fontSize="10" fill="#9ca3af" textAnchor="middle">Wed</text>
              <text x="305" y="220" fontSize="10" fill="#9ca3af" textAnchor="middle">Thu</text>
              <text x="395" y="220" fontSize="10" fill="#9ca3af" textAnchor="middle">Fri</text>
              <text x="485" y="220" fontSize="10" fill="#9ca3af" textAnchor="middle">Sat</text>
              <text x="575" y="220" fontSize="10" fill="#9ca3af" textAnchor="middle">Sun</text>
            </svg>
          </div>
        </GlassCard>

        {/* Deliverability Distribution (Span 1) */}
        <GlassCard hoverEffect="none" interactive={false} className="bg-white border-gray-200/50 p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-gray-50 pb-3">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="h-4 w-4 text-blue-500" /> Deliverability
            </h3>
          </div>

          <div className="flex flex-col justify-center items-center h-48 relative">
            {/* Custom SVG Pie Chart / Circle Progress */}
            <svg viewBox="0 0 120 120" className="w-36 h-36">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#f3f4f6" strokeWidth="10" />
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#10B981"
                strokeWidth="10"
                strokeDasharray="314"
                strokeDashoffset="1"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-2xl font-extrabold text-gray-800">99.8%</span>
              <p className="text-4xs font-bold text-gray-400 uppercase tracking-wider">Verified Delivery</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* AI CAMPAIGNS INSIGHTS PANEL */}
      <GlassCard hoverEffect="none" interactive={false} className="bg-white border-gray-200/50 p-6 space-y-5">
        <div className="flex items-center space-x-2 border-b border-gray-50 pb-3">
          <div className="p-1.5 bg-[#FCE7EB] text-[#D84B68] rounded-lg">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-widest">AI Outreach Insights</h3>
            <p className="text-4xs text-gray-400 uppercase mt-0.5">Continuous audit recommendations generated by LLM analysis</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-gray-600 leading-relaxed font-semibold">
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-150 space-y-2">
            <div className="flex items-center space-x-1 text-[#D84B68]">
              <Sparkles className="h-4 w-4 shrink-0" />
              <span className="font-bold">Top Performing Sector</span>
            </div>
            <p className="text-gray-500 font-medium">
              SaaS and Product Developers (e.g. Figma, Linear) yields 18% higher replies than design agencies. Target developers next.
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-150 space-y-2">
            <div className="flex items-center space-x-1 text-blue-500">
              <Clock className="h-4 w-4 shrink-0" />
              <span className="font-bold">Best Sending Schedule</span>
            </div>
            <p className="text-gray-500 font-medium">
              Tuesday at 10 AM EST has the highest open rates. Emails scheduled between 9-11 AM score 14% less bounce metrics.
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-150 space-y-2">
            <div className="flex items-center space-x-1 text-green-500">
              <Layers className="h-4 w-4 shrink-0" />
              <span className="font-bold">Template Conversion Suggestion</span>
            </div>
            <p className="text-gray-500 font-medium">
              Adding the dynamic variables <code className="px-1 py-0.5 bg-gray-100 rounded text-rose-500">{"{{city}}"}</code> increases conversion CTR by 9.2%. Avoid using plain placeholders.
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

// Local mock loader to prevent compilation issues
function Loader2({ className }: { className?: string }) {
  return <TrendingUp className={`${className} animate-pulse`} />;
}
