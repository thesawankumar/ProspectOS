"use client";

import React, { useState } from "react";
import { useProspectStore, WebhookEndpoint, WebhookDeliveryLog } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Dialog } from "@/components/ui/Dialog";
import { Badge } from "@/components/ui/Badge";
import {
  Link2,
  Cpu,
  PlusCircle,
  Trash2,
  RefreshCw,
  MessageSquare,
  CreditCard,
  Layers,
  Webhook,
  Activity,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function IntegrationsPage() {
  const { toast } = useToast();

  const workspaces = useProspectStore((state) => state.workspaces);
  const activeWorkspaceId = useProspectStore((state) => state.activeWorkspaceId);
  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];

  const webhooks = activeWorkspace.webhooks || [];
  const webhookLogs = activeWorkspace.webhookLogs || [];

  const addWebhookEndpoint = useProspectStore((state) => state.addWebhookEndpoint);
  const testWebhookEndpoint = useProspectStore((state) => state.testWebhookEndpoint);
  const deleteWebhookEndpoint = useProspectStore((state) => state.deleteWebhookEndpoint);

  const [isWebOpen, setIsWebOpen] = useState(false);
  const [isTestingId, setIsTestingId] = useState<string | null>(null);

  // Form State
  const [webhookUrl, setWebhookUrl] = useState("");
  const [eventLeadCreated, setEventLeadCreated] = useState(true);
  const [eventEmailReplied, setEventEmailReplied] = useState(false);

  // Integrations state toggles
  const [connectedApps, setConnectedApps] = useState<{ [key: string]: boolean }>({
    slack: true,
    stripe: false,
    google: true,
    zapier: false
  });

  const handleToggleApp = (app: string) => {
    const isConnected = connectedApps[app];
    setConnectedApps((prev) => ({ ...prev, [app]: !isConnected }));

    toast({
      title: isConnected ? "Integration Terminated" : "App Connected Successfully 🔌",
      description: `${app.toUpperCase()} auth token updated in workspace parameters.`,
      variant: isConnected ? "warning" : "success",
    });
  };

  const handleCreateWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!webhookUrl) return;

    const events: string[] = [];
    if (eventLeadCreated) events.push("lead_created");
    if (eventEmailReplied) events.push("email_replied");

    addWebhookEndpoint({
      url: webhookUrl,
      events
    });

    toast({
      title: "Webhook Created",
      description: `Active endpoint configured for: ${webhookUrl}`,
      variant: "success",
    });

    setWebhookUrl("");
    setIsWebOpen(false);
  };

  const handleTestWebhook = (id: string, url: string) => {
    setIsTestingId(id);

    setTimeout(() => {
      setIsTestingId(null);
      testWebhookEndpoint(id);
      toast({
        title: "Webhook Delivered 🟢",
        description: `HTTP 200 OK returned from ${url.substring(0, 30)}...`,
        variant: "success",
      });
    }, 1200);
  };

  const handleDeleteWebhook = (id: string) => {
    deleteWebhookEndpoint(id);
    toast({
      title: "Webhook Deleted",
      description: "Endpoint removed from webhook engine.",
      variant: "danger",
    });
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/50 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
            Integrations & Webhooks
          </h1>
          <p className="text-xs text-gray-400">
            Connect Stripe checkout billing, setup Slack alert triggers, and manage REST API endpoints
          </p>
        </div>
      </div>

      {/* SYSTEM INTEGRATIONS GRID */}
      <div className="space-y-4">
        <span className="text-xs font-bold text-gray-800 uppercase tracking-wider block">Workspace App Ecosystem</span>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Slack Card */}
          <GlassCard hoverEffect="lift" interactive={false} className="bg-white border-gray-200/50 p-5 flex flex-col justify-between min-h-[160px]">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <MessageSquare className="h-7 w-7 text-indigo-500" />
                <Badge variant={connectedApps.slack ? "success" : "neutral"}>
                  {connectedApps.slack ? "Connected" : "Inactive"}
                </Badge>
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-gray-800">Slack Alerts</h3>
                <p className="text-3xs text-gray-400 font-semibold">Post channel notifications for new lead replies.</p>
              </div>
            </div>
            <button
              onClick={() => handleToggleApp("slack")}
              className="mt-4 w-full py-1.5 rounded-full border border-gray-200 hover:bg-gray-50 text-2xs font-bold text-gray-600 focus:outline-hidden cursor-pointer"
            >
              {connectedApps.slack ? "Disconnect" : "Authorize"}
            </button>
          </GlassCard>

          {/* Stripe Card */}
          <GlassCard hoverEffect="lift" interactive={false} className="bg-white border-gray-200/50 p-5 flex flex-col justify-between min-h-[160px]">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <CreditCard className="h-7 w-7 text-indigo-600" />
                <Badge variant={connectedApps.stripe ? "success" : "neutral"}>
                  {connectedApps.stripe ? "Connected" : "Inactive"}
                </Badge>
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-gray-800">Stripe Billing</h3>
                <p className="text-3xs text-gray-400 font-semibold">Synchronize outreach campaigns to customer invoice checkouts.</p>
              </div>
            </div>
            <button
              onClick={() => handleToggleApp("stripe")}
              className="mt-4 w-full py-1.5 rounded-full border border-gray-200 hover:bg-gray-50 text-2xs font-bold text-gray-600 focus:outline-hidden cursor-pointer"
            >
              {connectedApps.stripe ? "Disconnect" : "Authorize"}
            </button>
          </GlassCard>

          {/* Google Workspace */}
          <GlassCard hoverEffect="lift" interactive={false} className="bg-white border-gray-200/50 p-5 flex flex-col justify-between min-h-[160px]">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Globe className="h-7 w-7 text-emerald-500" />
                <Badge variant={connectedApps.google ? "success" : "neutral"}>
                  {connectedApps.google ? "Connected" : "Inactive"}
                </Badge>
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-gray-800">Google Calendar</h3>
                <p className="text-3xs text-gray-400 font-semibold">Automatically insert demo meeting bookings.</p>
              </div>
            </div>
            <button
              onClick={() => handleToggleApp("google")}
              className="mt-4 w-full py-1.5 rounded-full border border-gray-200 hover:bg-gray-50 text-2xs font-bold text-gray-600 focus:outline-hidden cursor-pointer"
            >
              {connectedApps.google ? "Disconnect" : "Authorize"}
            </button>
          </GlassCard>

          {/* Zapier */}
          <GlassCard hoverEffect="lift" interactive={false} className="bg-white border-gray-200/50 p-5 flex flex-col justify-between min-h-[160px]">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Cpu className="h-7 w-7 text-amber-500" />
                <Badge variant={connectedApps.zapier ? "success" : "neutral"}>
                  {connectedApps.zapier ? "Connected" : "Inactive"}
                </Badge>
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-gray-800">Zapier Automate</h3>
                <p className="text-3xs text-gray-400 font-semibold">Map webhook payloads to 5000+ business connectors.</p>
              </div>
            </div>
            <button
              onClick={() => handleToggleApp("zapier")}
              className="mt-4 w-full py-1.5 rounded-full border border-gray-200 hover:bg-gray-50 text-2xs font-bold text-gray-600 focus:outline-hidden cursor-pointer"
            >
              {connectedApps.zapier ? "Disconnect" : "Authorize"}
            </button>
          </GlassCard>
        </div>
      </div>

      {/* WEBHOOKS ENGINE PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Endpoints manager (Span 2) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-800 uppercase tracking-wider block">Webhook Endpoints</span>
            <Button onClick={() => setIsWebOpen(true)} variant="primary" size="sm">
              <PlusCircle className="h-4 w-4 mr-1.5 shrink-0" /> Add Endpoint
            </Button>
          </div>

          <GlassCard hoverEffect="none" interactive={false} className="bg-white border-gray-200/50 p-0 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs md:text-sm text-gray-600">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50 text-3xs text-gray-400 font-bold uppercase select-none">
                    <th className="py-4 px-6">Endpoint URL</th>
                    <th className="py-4 px-6">Events</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 font-semibold text-gray-600">
                  {webhooks.map((w) => (
                    <tr key={w.id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="py-4 px-6">
                        <span className="text-gray-900 font-bold font-mono">{w.url}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1">
                          {w.events.map((e) => (
                            <Badge key={e} variant="neutral">{e}</Badge>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end items-center space-x-2">
                          <button
                            onClick={() => handleTestWebhook(w.id, w.url)}
                            disabled={isTestingId === w.id}
                            className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 focus:outline-hidden cursor-pointer"
                            aria-label="Test Webhook"
                          >
                            {isTestingId === w.id ? (
                              <RefreshCw className="h-3.5 w-3.5 animate-spin text-gray-400" />
                            ) : (
                              <Activity className="h-3.5 w-3.5 text-blue-500" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteWebhook(w.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                            aria-label="Delete Webhook"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {webhooks.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-12 text-center text-xs text-gray-400 font-medium">
                        No webhook endpoints configured. Click 'Add Endpoint' to start.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        {/* Webhook logs column (Span 1) */}
        <div className="space-y-4">
          <span className="text-xs font-bold text-gray-800 uppercase tracking-wider block">Webhook Delivery logs</span>
          
          <GlassCard hoverEffect="none" interactive={false} className="bg-white border-gray-200/50 p-5 space-y-4 min-h-[220px]">
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {webhookLogs.map((log) => (
                <div key={log.id} className="p-3 bg-gray-50 border border-gray-150 rounded-2xl flex flex-col justify-between text-3xs font-semibold">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900 font-bold truncate max-w-[120px]" title={log.url}>{log.url}</span>
                    <Badge variant={log.statusCode === 200 ? "success" : "danger"}>
                      HTTP {log.statusCode}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center text-gray-400 mt-2">
                    <span>Event: {log.event}</span>
                    <span>{log.timestamp}</span>
                  </div>
                </div>
              ))}
              {webhookLogs.length === 0 && (
                <div className="py-10 text-center text-xs text-gray-400 font-medium select-none">
                  No delivery logs recorded.
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* CREATE WEBHOOK DIALOG */}
      <Dialog isOpen={isWebOpen} onClose={() => setIsWebOpen(false)}>
        <form onSubmit={handleCreateWebhook} className="space-y-5">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-[#FCE7EB] text-[#D84B68] rounded-xl">
              <Webhook className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Add Webhook Endpoint</h3>
              <p className="text-xs text-gray-500">Configure payload URLs to trigger outreach event alerts</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="w-url" className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">Endpoint Payload Destination URL</label>
              <Input
                id="w-url"
                type="url"
                placeholder="https://api.yourdomain.com/v1/webhooks"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wider block">Events Subscription</span>
              <div className="flex space-x-6 text-xs text-gray-700">
                <label className="flex items-center space-x-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={eventLeadCreated}
                    onChange={(e) => setEventLeadCreated(e.target.checked)}
                    className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                  />
                  <span>Lead Discovered (lead_created)</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={eventEmailReplied}
                    onChange={(e) => setEventEmailReplied(e.target.checked)}
                    className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                  />
                  <span>Email Replied (email_replied)</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsWebOpen(false)}
              className="px-4 py-2 rounded-full border border-gray-200 text-xs font-semibold text-gray-500 hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <Button type="submit" variant="primary" size="sm">
              Save Webhook
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
