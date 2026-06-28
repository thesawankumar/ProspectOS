"use client";

import React, { useState } from "react";
import { useProspectStore, Workspace } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import {
  User,
  Mail,
  Users,
  ShieldCheck,
  Trash2,
  PlusCircle,
  Smartphone,
  Save,
  CheckCircle,
  ToggleLeft,
  ToggleRight,
  Server
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { toast } = useToast();

  const workspaces = useProspectStore((state) => state.workspaces);
  const activeWorkspaceId = useProspectStore((state) => state.activeWorkspaceId);
  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];

  const session = useProspectStore((state) => state.session);
  const setSession = useProspectStore((state) => state.setSession);
  
  const inviteMember = useProspectStore((state) => state.inviteMember);
  const connectSMTP = useProspectStore((state) => state.connectSMTP);
  const disconnectSMTP = useProspectStore((state) => state.disconnectSMTP);

  // Settings view tabs
  const [activeTab, setActiveTab] = useState("profile");

  // Profile forms
  const [profileName, setProfileName] = useState(session.name);
  const [profileEmail, setProfileEmail] = useState(session.email);
  const [is2Fa, setIs2Fa] = useState(session.twoFactorEnabled);

  // SMTP form
  const [smtpProvider, setSmtpProvider] = useState("Gmail");
  const [smtpEmail, setSmtpEmail] = useState("");
  const [smtpHost, setSmtpHost] = useState("");

  // Team invite form
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<any>("Sales");

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSession({ name: profileName, email: profileEmail, twoFactorEnabled: is2Fa });
    toast({
      title: "Profile Saved",
      description: "User details updated successfully.",
      variant: "success",
    });
  };

  const handleConnectSMTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!smtpEmail || !smtpHost) return;

    connectSMTP(activeWorkspace.id, {
      host: smtpHost,
      email: smtpEmail,
      provider: smtpProvider
    });

    toast({
      title: "Mailbox Connected",
      description: `${smtpEmail} is now active for sequence deliveries.`,
      variant: "success",
    });

    setSmtpEmail("");
    setSmtpHost("");
  };

  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName || !inviteEmail) return;

    inviteMember(activeWorkspace.id, {
      name: inviteName,
      email: inviteEmail,
      role: inviteRole
    });

    toast({
      title: "Invitation Sent",
      description: `Invited ${inviteName} to join workspace as ${inviteRole}.`,
      variant: "success",
    });

    setInviteName("");
    setInviteEmail("");
  };

  const handleTerminateOtherDevices = () => {
    // Modify store sessions
    setSession({
      activeDevices: session.activeDevices.filter(d => d.active)
    });
    toast({
      title: "Sessions Revoked",
      description: "Logged out from all other connected devices.",
      variant: "warning",
    });
  };

  const settingsTabs = [
    { id: "profile", label: "My Profile", icon: <User className="h-4 w-4" /> },
    { id: "smtp", label: "SMTP Mailboxes", icon: <Server className="h-4 w-4" /> },
    { id: "team", label: "Team Members", icon: <Users className="h-4 w-4" /> },
    { id: "security", label: "Security & Devices", icon: <ShieldCheck className="h-4 w-4" /> }
  ];

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/50 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
            Workspace Settings
          </h1>
          <p className="text-xs text-gray-400">
            Configure connected inboxes, security audits, team members, and user profile parameters
          </p>
        </div>

        {/* Settings tabs switcher */}
        <Tabs tabs={settingsTabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {/* RENDER ACTIVE SETTINGS VIEW */}
      <div className="max-w-3xl mx-auto">
        {/* 1. PROFILE SETTINGS */}
        {activeTab === "profile" && (
          <GlassCard hoverEffect="none" interactive={false} className="bg-white border-gray-200/50 p-6 md:p-8 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-gray-800">User Profile Parameters</h3>
              <p className="text-3xs text-gray-400">Update your default contact alias details</p>
            </div>

            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="flex items-center space-x-4 pb-4 border-b border-gray-50">
                <div className="h-12 w-12 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center font-bold text-sm text-gray-700 select-none">
                  {session.avatar}
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-800 block">Avatar Frame</span>
                  <button type="button" className="text-3xs font-bold text-[#D84B68] hover:text-[#EC9EB2] mt-0.5 cursor-pointer">
                    Upload Avatar image
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="profile-name" className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">Full Name</label>
                <Input
                  id="profile-name"
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="profile-email" className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">Profile Email Address</label>
                <Input
                  id="profile-email"
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" variant="primary" className="gap-1.5">
                  <Save className="h-4 w-4" /> Save Profile Details
                </Button>
              </div>
            </form>
          </GlassCard>
        )}

        {/* 2. SMTP INBOXES SETTINGS */}
        {activeTab === "smtp" && (
          <div className="space-y-6">
            {/* Connection Form */}
            <GlassCard hoverEffect="none" interactive={false} className="bg-white border-gray-200/50 p-6 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-gray-800">Add SMTP Outbox channel</h3>
                <p className="text-3xs text-gray-400">Configure connection details for sequences delivery</p>
              </div>

              <form onSubmit={handleConnectSMTP} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">Email Provider</label>
                    <select
                      value={smtpProvider}
                      onChange={(e) => setSmtpProvider(e.target.value)}
                      className="flex w-full rounded-full border border-gray-200 bg-white px-4 py-2.5 text-xs md:text-sm text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-[#F4B6C2]/20"
                    >
                      <option value="Gmail">Google Workspace</option>
                      <option value="Outlook">Office 365 Outlook</option>
                      <option value="SMTP">Custom SMTP Port</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="smtp-email" className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">Email Address</label>
                    <Input
                      id="smtp-email"
                      type="email"
                      placeholder="outreach@company.com"
                      value={smtpEmail}
                      onChange={(e) => setSmtpEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="smtp-host" className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">SMTP Server Host</label>
                  <Input
                    id="smtp-host"
                    type="text"
                    placeholder="e.g. smtp.gmail.com or mail.company.com"
                    value={smtpHost}
                    onChange={(e) => setSmtpHost(e.target.value)}
                    required
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" variant="primary">
                    Connect Mailbox
                  </Button>
                </div>
              </form>
            </GlassCard>

            {/* List Active Senders */}
            <GlassCard hoverEffect="none" interactive={false} className="bg-white border-gray-200/50 p-6 space-y-4 shadow-xs">
              <span className="text-xs font-bold text-gray-800 block">Connected Outreach Channels</span>
              <div className="divide-y divide-gray-50">
                {activeWorkspace.smtpConnected && activeWorkspace.smtpSettings ? (
                  <div className="py-3.5 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-9 w-9 rounded-xl bg-green-50 text-green-700 flex items-center justify-center">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800">{activeWorkspace.smtpSettings.email}</p>
                        <p className="text-3xs text-gray-400 font-semibold">
                          Provider: {activeWorkspace.smtpSettings.provider} • Host: {activeWorkspace.smtpSettings.host}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        disconnectSMTP(activeWorkspace.id);
                        toast({ title: "SMTP Disconnected", description: "Cleared connection parameters", variant: "warning" });
                      }}
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:bg-red-50"
                    >
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-gray-400 font-medium">
                    No active SMTP channels connected. Campaigns will not deliver.
                  </div>
                )}
              </div>
            </GlassCard>
          </div>
        )}

        {/* 3. TEAM MEMBERS SETTINGS */}
        {activeTab === "team" && (
          <div className="space-y-6">
            {/* Invite Form */}
            <GlassCard hoverEffect="none" interactive={false} className="bg-white border-gray-200/50 p-6 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-gray-800">Invite Team Member</h3>
                <p className="text-3xs text-gray-400">Add users to collaborate inside active workspace</p>
              </div>

              <form onSubmit={handleInviteMember} className="grid grid-cols-3 gap-2.5">
                <Input
                  type="text"
                  placeholder="Collaborator Name"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  required
                />
                <Input
                  type="email"
                  placeholder="name@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                />
                <div className="flex gap-1.5">
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as any)}
                    className="flex-1 border border-gray-200 rounded-full px-3 text-xs bg-white focus:outline-hidden"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Sales">Sales</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                  <Button type="submit" variant="secondary" size="sm">
                    Invite
                  </Button>
                </div>
              </form>
            </GlassCard>

            {/* Members table list */}
            <GlassCard hoverEffect="none" interactive={false} className="bg-white border-gray-200/50 p-0 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs md:text-sm text-gray-600">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50 text-3xs text-gray-400 font-bold uppercase select-none">
                      <th className="py-3 px-5">Name</th>
                      <th className="py-3 px-5">Email</th>
                      <th className="py-3 px-5">Role Permission</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {activeWorkspace.members.map((mem) => (
                      <tr key={mem.email}>
                        <td className="py-3 px-5 font-bold text-gray-800">{mem.name}</td>
                        <td className="py-3 px-5 text-gray-400 font-semibold">{mem.email}</td>
                        <td className="py-3 px-5">
                          <Badge variant={mem.role === "Owner" || mem.role === "Admin" ? "accent" : "neutral"}>
                            {mem.role}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </div>
        )}

        {/* 4. SECURITY & DEVICE MANAGEMENT */}
        {activeTab === "security" && (
          <div className="space-y-6">
            {/* 2FA Toggle settings */}
            <GlassCard hoverEffect="none" interactive={false} className="bg-white border-gray-200/50 p-6 space-y-4 shadow-xs">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-gray-800">Two Factor Authentication (2FA)</h3>
                  <p className="text-3xs text-gray-400">Increase account shielding protocol security</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIs2Fa(!is2Fa);
                    toast({
                      title: is2Fa ? "2FA Disabled" : "2FA Configured (Mock)",
                      description: is2Fa ? "Security code requirement deactivated." : "OTP code generated.",
                      variant: "info"
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600 focus:outline-hidden cursor-pointer"
                  aria-label="Toggle two factor authentication"
                >
                  {is2Fa ? (
                    <ToggleRight className="h-9 w-9 text-[#D84B68]" />
                  ) : (
                    <ToggleLeft className="h-9 w-9 text-gray-300" />
                  )}
                </button>
              </div>
            </GlassCard>

            {/* Active session grids */}
            <GlassCard hoverEffect="none" interactive={false} className="bg-white border-gray-200/50 p-6 space-y-4 shadow-xs">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-gray-800">Active Device Login Logs</h3>
                  <p className="text-3xs text-gray-400">Revoke access sessions on secondary browsers</p>
                </div>
                <button
                  onClick={handleTerminateOtherDevices}
                  disabled={session.activeDevices.length <= 1}
                  className="text-2xs font-bold text-[#D84B68] hover:text-[#EC9EB2] disabled:opacity-50 cursor-pointer"
                >
                  Terminate Other Devices
                </button>
              </div>

              <div className="divide-y divide-gray-50 pt-2">
                {session.activeDevices.map((dev) => (
                  <div key={dev.id} className="py-3.5 flex justify-between items-center text-xs">
                    <div className="flex items-center space-x-3.5">
                      <Smartphone className={cn("h-5 w-5", dev.active ? "text-[#D84B68]" : "text-gray-400")} />
                      <div>
                        <p className="font-bold text-gray-800">
                          {dev.device} {dev.active && <Badge variant="success">Active Now</Badge>}
                        </p>
                        <p className="text-3xs text-gray-400 font-semibold">
                          IP: {dev.ip} • Region: {dev.location}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
}
