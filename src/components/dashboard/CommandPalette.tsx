"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { useProspectStore } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { Search, Compass, ShieldCheck, GitBranch, Settings, RefreshCw, PlusCircle, Calendar } from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const { toast } = useToast();
  
  const workspaces = useProspectStore((state) => state.workspaces);
  const switchWorkspace = useProspectStore((state) => state.switchWorkspace);
  const addLead = useProspectStore((state) => state.addLead);

  const [query, setQuery] = useState("");

  const navigateTo = (path: string, label: string) => {
    router.push(path);
    onClose();
    toast({
      title: `Navigated to ${label}`,
      description: `Loaded page view.`,
      variant: "info",
    });
  };

  const handleSwitch = (id: string, name: string) => {
    switchWorkspace(id);
    onClose();
    toast({
      title: "Workspace Switched",
      description: `Active workspace: ${name}`,
      variant: "success",
    });
  };

  const handleAddMockLead = () => {
    const res = addLead({
      name: "Mock Lead " + Math.floor(Math.random() * 100),
      role: "Software Architect",
      company: "Stripe",
      email: `mock.lead.${Math.floor(Math.random() * 1000)}@stripe.com`,
      phone: "",
      website: "stripe.com",
      location: "San Francisco, CA",
      industry: "Fintech",
      companySize: "1,000-5,000",
      linkedin: "",
      stage: "New Lead",
      tags: ["Imported", "Hot"],
      owner: "Alex Rivera"
    });
    onClose();
    if (res.success) {
      toast({
        title: "Mock Lead Added",
        description: "Created in CRM database.",
        variant: "success",
      });
    }
  };

  const commands = [
    { category: "Navigation", items: [
      { label: "Go to Dashboard", action: () => navigateTo("/dashboard", "Dashboard"), icon: <Compass className="h-4 w-4" /> },
      { label: "Go to Lead Finder", action: () => navigateTo("/dashboard/leads", "Lead Finder"), icon: <Search className="h-4 w-4" /> },
      { label: "Go to Kanban CRM Pipeline", action: () => navigateTo("/dashboard/crm", "Kanban CRM"), icon: <GitBranch className="h-4 w-4" /> },
      { label: "Go to Workspace Settings", action: () => navigateTo("/dashboard/settings", "Settings"), icon: <Settings className="h-4 w-4" /> },
    ]},
    { category: "Workspace Switching", items: workspaces.map((w) => ({
      label: `Switch to "${w.name}" Workspace`,
      action: () => handleSwitch(w.id, w.name),
      icon: <RefreshCw className="h-4 w-4" />
    }))},
    { category: "Quick Operations", items: [
      { label: "Create / Add a Mock CRM Lead", action: handleAddMockLead, icon: <PlusCircle className="h-4 w-4" /> },
    ]}
  ];

  // Filter commands by query search
  const filteredCommands = commands.map(cat => ({
    category: cat.category,
    items: cat.items.filter(item => item.label.toLowerCase().includes(query.toLowerCase()))
  })).filter(cat => cat.items.length > 0);

  return (
    <Dialog isOpen={isOpen} onClose={onClose} className="max-w-lg p-0">
      <div className="flex flex-col">
        {/* Search header input */}
        <div className="relative p-4 border-b border-gray-100 flex items-center">
          <Search className="absolute left-7 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Type a command or page search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-4 w-full"
            autoFocus
          />
        </div>

        {/* Command list */}
        <div className="max-h-[350px] overflow-y-auto p-4 space-y-4">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cat, catIdx) => (
              <div key={catIdx} className="space-y-2">
                <h4 className="text-3xs font-bold text-gray-400 uppercase tracking-widest px-2">
                  {cat.category}
                </h4>
                <div className="space-y-1">
                  {cat.items.map((item, itemIdx) => (
                    <button
                      key={itemIdx}
                      onClick={item.action}
                      className="w-full text-left flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors focus:outline-hidden cursor-pointer"
                    >
                      <span className="text-gray-400 shrink-0">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-gray-400 font-medium">
              No matching commands or navigation matches found.
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center text-3xs text-gray-400 font-mono">
          <span>Navigate with mouse/click</span>
          <span>ESC to close</span>
        </div>
      </div>
    </Dialog>
  );
}
