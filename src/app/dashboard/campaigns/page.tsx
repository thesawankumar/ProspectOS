"use client";

import React, { useState } from "react";
import { useProspectStore, Campaign } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Dialog } from "@/components/ui/Dialog";
import {
  Send,
  PlusCircle,
  Play,
  Pause,
  Trash2,
  Users,
  Percent,
  CheckCircle,
  Clock,
  Sparkles,
  HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function CampaignsPage() {
  const { toast } = useToast();
  
  const workspaces = useProspectStore((state) => state.workspaces);
  const activeWorkspaceId = useProspectStore((state) => state.activeWorkspaceId);
  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];
  
  const campaigns = activeWorkspace.campaigns || [];
  const templates = activeWorkspace.templates || [];
  const leads = activeWorkspace.leads || [];

  const addCampaign = useProspectStore((state) => state.addCampaign);
  const toggleCampaignStatus = useProspectStore((state) => state.toggleCampaignStatus);
  const deleteCampaign = useProspectStore((state) => state.deleteCampaign);

  // Wizard state
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [name, setName] = useState("");
  const [audienceFilter, setAudienceFilter] = useState("all");
  const [templateId, setTemplateId] = useState("");
  const [dailyLimit, setDailyLimit] = useState(50);
  const [delaySeconds, setDelaySeconds] = useState(30);
  const [timezone, setTimezone] = useState("UTC-5 (EST)");

  // Calculations
  const totalSent = campaigns.reduce((sum, c) => sum + c.sentCount, 0);
  const totalOpened = campaigns.reduce((sum, c) => sum + c.openCount, 0);
  const totalReplies = campaigns.reduce((sum, c) => sum + c.replyCount, 0);
  const totalBounces = campaigns.reduce((sum, c) => sum + c.bounceCount, 0);

  const averageOpenRate = totalSent > 0 ? (totalOpened / totalSent) * 100 : 0;
  const averageReplyRate = totalSent > 0 ? (totalReplies / totalSent) * 100 : 0;
  const averageBounceRate = totalSent > 0 ? (totalBounces / totalSent) * 100 : 0;

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    // Determine target size
    let size = leads.length;
    if (audienceFilter === "scraped") {
      size = leads.filter(l => l.tags.includes("Scraped")).length || 5;
    } else if (audienceFilter === "new") {
      size = leads.filter(l => l.stage === "New Lead").length || 3;
    }

    addCampaign({
      name,
      status: "Draft",
      audienceSize: size || 10,
      dailyLimit,
      delaySeconds,
      timezone
    });

    toast({
      title: "Campaign Draft Saved",
      description: `Sequence "${name}" added to list.`,
      variant: "success",
    });

    // Reset and Close
    setName("");
    setAudienceFilter("all");
    setTemplateId("");
    setIsWizardOpen(false);
  };

  const handleToggleStatus = (id: string, currentStatus: string, campaignName: string) => {
    toggleCampaignStatus(id);
    const nextStatus = currentStatus === "Active" ? "Paused" : "Active";
    toast({
      title: `Campaign ${nextStatus}`,
      description: `Outreach pacing scheduler updated for "${campaignName}".`,
      variant: nextStatus === "Active" ? "success" : "warning",
    });
  };

  const handleDeleteCampaign = (id: string, campaignName: string) => {
    deleteCampaign(id);
    toast({
      title: "Campaign Deleted",
      description: `"${campaignName}" was archived.`,
      variant: "danger",
    });
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
            Email Campaigns & Sequences
          </h1>
          <p className="text-xs text-gray-400">
            Build branching sequences, adjust humanized sending delay variables, and review analytics
          </p>
        </div>
        <Button onClick={() => setIsWizardOpen(true)} variant="primary" size="sm">
          <PlusCircle className="h-4 w-4 mr-1.5 shrink-0" /> Create Campaign
        </Button>
      </div>

      {/* METRICS CARD SUMMARY */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard hoverEffect="lift" className="p-4 bg-white border-gray-200/50 flex flex-col justify-between">
          <span className="text-3xs font-bold text-gray-400 uppercase tracking-wider block">Total Emails Sent</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl md:text-2xl font-extrabold text-gray-800">{totalSent.toLocaleString()}</span>
            <Send className="h-4 w-4 text-gray-300" />
          </div>
        </GlassCard>

        <GlassCard hoverEffect="lift" className="p-4 bg-white border-gray-200/50 flex flex-col justify-between">
          <span className="text-3xs font-bold text-gray-400 uppercase tracking-wider block">Avg Open Rate</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl md:text-2xl font-extrabold text-gray-800">
              {averageOpenRate > 0 ? `${averageOpenRate.toFixed(1)}%` : "N/A"}
            </span>
            <Percent className="h-4 w-4 text-gray-300" />
          </div>
        </GlassCard>

        <GlassCard hoverEffect="lift" className="p-4 bg-white border-gray-200/50 flex flex-col justify-between">
          <span className="text-3xs font-bold text-gray-400 uppercase tracking-wider block">Avg Reply Rate</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl md:text-2xl font-extrabold text-gray-800">
              {averageReplyRate > 0 ? `${averageReplyRate.toFixed(1)}%` : "N/A"}
            </span>
            <CheckCircle className="h-4 w-4 text-gray-300" />
          </div>
        </GlassCard>

        <GlassCard hoverEffect="lift" className="p-4 bg-white border-gray-200/50 flex flex-col justify-between">
          <span className="text-3xs font-bold text-gray-400 uppercase tracking-wider block">Bounce Rate</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl md:text-2xl font-extrabold text-[#D84B68]">
              {averageBounceRate > 0 ? `${averageBounceRate.toFixed(2)}%` : "0.00%"}
            </span>
            <HelpCircle className="h-4 w-4 text-gray-300" />
          </div>
        </GlassCard>
      </div>

      {/* CAMPAIGNS LIST TABLE */}
      <GlassCard hoverEffect="none" interactive={false} className="bg-white border-gray-200/50 p-0 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm text-gray-600">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-3xs text-gray-400 font-bold uppercase select-none">
                <th className="py-4 px-6">Campaign Info</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-center">Audience</th>
                <th className="py-4 px-6 text-center">Sent</th>
                <th className="py-4 px-6 text-center">Opened</th>
                <th className="py-4 px-6 text-center">Replied</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {campaigns.map((camp) => (
                <tr key={camp.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="py-4 px-6">
                    <p className="font-bold text-gray-800">{camp.name}</p>
                    <p className="text-3xs text-gray-400 font-semibold">
                      Daily Limit: {camp.dailyLimit} • Zone: {camp.timezone}
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant={camp.status === "Active" ? "success" : camp.status === "Paused" ? "warning" : "neutral"}>
                      {camp.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 text-center font-semibold text-gray-600">{camp.audienceSize}</td>
                  <td className="py-4 px-6 text-center font-semibold text-gray-600">{camp.sentCount}</td>
                  <td className="py-4 px-6 text-center font-semibold text-green-600">
                    {camp.sentCount > 0 ? `${Math.round((camp.openCount / camp.sentCount) * 100)}%` : "0%"}
                  </td>
                  <td className="py-4 px-6 text-center font-semibold text-blue-600">
                    {camp.sentCount > 0 ? `${Math.round((camp.replyCount / camp.sentCount) * 100)}%` : "0%"}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end items-center space-x-2">
                      <button
                        onClick={() => handleToggleStatus(camp.id, camp.status, camp.name)}
                        className={cn(
                          "p-2 rounded-full hover:bg-gray-150 transition-colors cursor-pointer focus:outline-hidden",
                          camp.status === "Active" ? "text-amber-500" : "text-green-500"
                        )}
                        aria-label={camp.status === "Active" ? "Pause" : "Play"}
                      >
                        {camp.status === "Active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => handleDeleteCampaign(camp.id, camp.name)}
                        className="p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors cursor-pointer focus:outline-hidden"
                        aria-label="Delete Campaign"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {campaigns.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-gray-400 font-medium">
                    No campaigns created yet. Click 'Create Campaign' to start.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* CREATE CAMPAIGN WIZARD DIALOG */}
      <Dialog isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)}>
        <form onSubmit={handleCreateCampaign} className="space-y-5">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-[#FCE7EB] text-[#D84B68] rounded-xl">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Configure Outreach Sequence</h3>
              <p className="text-xs text-gray-500">Configure campaign targets, pacing rules, and templates</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="camp-name" className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">Campaign Name</label>
              <Input
                id="camp-name"
                type="text"
                placeholder="e.g. Q3 Design Services Pitch"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="audience-filter" className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">Audience Target</label>
                <select
                  id="audience-filter"
                  value={audienceFilter}
                  onChange={(e) => setAudienceFilter(e.target.value)}
                  className="flex w-full rounded-full border border-gray-200 bg-white px-4 py-2.5 text-xs md:text-sm text-gray-900 focus:outline-hidden"
                >
                  <option value="all">All Contacts ({leads.length})</option>
                  <option value="scraped">Scraped Leads ({leads.filter(l => l.tags.includes("Scraped")).length})</option>
                  <option value="new">New CRM stage ({leads.filter(l => l.stage === "New Lead").length})</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="seq-temp" className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">Active Email Template</label>
                <select
                  id="seq-temp"
                  value={templateId}
                  onChange={(e) => setTemplateId(e.target.value)}
                  className="flex w-full rounded-full border border-gray-200 bg-white px-4 py-2.5 text-xs md:text-sm text-gray-900 focus:outline-hidden"
                  required
                >
                  <option value="" disabled>-- Select Template --</option>
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="daily-lim" className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">Daily Pacing Limit</label>
                <Input
                  id="daily-lim"
                  type="number"
                  value={dailyLimit}
                  onChange={(e) => setDailyLimit(parseInt(e.target.value))}
                  min={1}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="pacing-delay" className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">Human Jitter Delay (Secs)</label>
                <Input
                  id="pacing-delay"
                  type="number"
                  value={delaySeconds}
                  onChange={(e) => setDelaySeconds(parseInt(e.target.value))}
                  min={5}
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsWizardOpen(false)}
              className="px-4 py-2 rounded-full border border-gray-200 text-xs font-semibold text-gray-500 hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <Button type="submit" variant="primary" size="sm">
              Save Draft Campaign
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
