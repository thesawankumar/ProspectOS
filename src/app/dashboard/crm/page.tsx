"use client";

import React, { useState } from "react";
import { useProspectStore, Lead } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { Tabs } from "@/components/ui/Tabs";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import LeadDetailsDrawer from "@/components/dashboard/LeadDetailsDrawer";
import {
  Sparkles,
  Layers,
  ListFilter,
  CheckCircle2,
  Trash2,
  DollarSign,
  MessageSquare,
  ListTodo,
  Calendar,
  Grid
} from "lucide-react";
import { cn } from "@/lib/utils";

const PIPELINE_STAGES: Lead["stage"][] = [
  "New Lead",
  "Contacted",
  "Replied",
  "Meeting",
  "Proposal",
  "Won"
];

export default function CRMPage() {
  const { toast } = useToast();
  
  const workspaces = useProspectStore((state) => state.workspaces);
  const activeWorkspaceId = useProspectStore((state) => state.activeWorkspaceId);
  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];
  const leads = activeWorkspace.leads;

  const updateLeadStage = useProspectStore((state) => state.updateLeadStage);
  const deleteLead = useProspectStore((state) => state.deleteLead);

  // View state: kanban or list
  const [viewTab, setViewTab] = useState("kanban");
  
  // Selected lead for detail drawer
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e: React.DragEvent, targetStage: Lead["stage"]) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (!id) return;

    const lead = leads.find((l) => l.id === id);
    if (!lead) return;

    if (lead.stage !== targetStage) {
      updateLeadStage(id, targetStage);
      toast({
        title: "Stage Shifted",
        description: `${lead.name} moved to ${targetStage}.`,
        variant: "success",
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDelete = (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation(); // prevent opening details drawer
    deleteLead(id);
    toast({
      title: "Lead Removed",
      description: `${name} has been archived.`,
      variant: "warning",
    });
  };

  // View tabs configs
  const viewTabs = [
    { id: "kanban", label: "Kanban Board", icon: <Grid className="h-4 w-4" /> },
    { id: "list", label: "List Table", icon: <ListFilter className="h-4 w-4" /> }
  ];

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
            Deals & CRM Pipeline
          </h1>
          <p className="text-xs text-gray-400">
            Drag prospects across stages to update conversion value metrics
          </p>
        </div>

        {/* View toggle */}
        <Tabs tabs={viewTabs} activeTab={viewTab} onChange={setViewTab} />
      </div>

      {/* KANBAN CRM BOARD VIEW */}
      {viewTab === "kanban" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4 items-start overflow-x-auto pb-4">
          {PIPELINE_STAGES.map((stage) => {
            const stageLeads = leads.filter((l) => l.stage === stage);
            
            // Calculate column total contract value
            const columnVal = stageLeads.reduce((sum, l) => {
              if (l.stage === "Won") return sum + 5000;
              if (l.stage === "Meeting" || l.stage === "Proposal") return sum + 2000;
              return sum + 500;
            }, 0);

            return (
              <div
                key={stage}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage)}
                className="bg-gray-100/50 border border-gray-200/50 rounded-2xl p-4 min-h-[500px] flex flex-col space-y-3.5"
              >
                {/* Column header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-bold text-gray-800">{stage}</span>
                    <span className="h-4.5 px-1.5 rounded-full bg-gray-200/60 flex items-center justify-center font-bold text-3xs text-gray-500">
                      {stageLeads.length}
                    </span>
                  </div>
                  <span className="text-3xs text-gray-400 font-bold">${columnVal.toLocaleString()}</span>
                </div>

                {/* Cards Container */}
                <div className="space-y-2.5 flex-grow">
                  {stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead.id)}
                      onClick={() => setSelectedLeadId(lead.id)}
                      className="p-4 bg-white border border-gray-200/60 rounded-xl shadow-2xs hover:shadow-md hover:border-gray-300 transition-all cursor-pointer select-none active:scale-[0.98] active:rotate-1"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-start gap-1">
                          <p className="text-xs font-bold text-gray-800 line-clamp-1">{lead.name}</p>
                          <Badge variant="neutral" className="text-3xs font-extrabold shrink-0 px-1 py-0 select-none">
                            {lead.leadScore}
                          </Badge>
                        </div>
                        <p className="text-3xs text-gray-400 font-semibold truncate">
                          {lead.role} at {lead.company}
                        </p>

                        {/* Tags */}
                        {lead.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {lead.tags.map((t) => (
                              <span
                                key={t}
                                className="text-3xs px-1.5 py-0.5 rounded-sm bg-[#FCE7EB] text-[#D84B68] font-bold select-none"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Interactive items counters */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-50 text-gray-400">
                          <div className="flex items-center space-x-2.5 text-3xs">
                            {lead.notes.length > 0 && (
                              <span className="flex items-center gap-0.5">
                                <MessageSquare className="h-3 w-3" /> {lead.notes.length}
                              </span>
                            )}
                            {lead.tasks.length > 0 && (
                              <span className="flex items-center gap-0.5">
                                <ListTodo className="h-3 w-3" /> {lead.tasks.length}
                              </span>
                            )}
                            {lead.meetings.length > 0 && (
                              <span className="flex items-center gap-0.5">
                                <Calendar className="h-3 w-3" /> {lead.meetings.length}
                              </span>
                            )}
                          </div>
                          
                          <button
                            onClick={(e) => handleDelete(e, lead.id, lead.name)}
                            className="p-1 rounded-sm hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors"
                            aria-label="Remove lead"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {stageLeads.length === 0 && (
                    <div className="py-12 border border-dashed border-gray-200 rounded-xl text-center text-3xs text-gray-400 select-none">
                      Drag here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* CRM LIST TABLE VIEW */
        <GlassCard hoverEffect="none" interactive={false} className="bg-white border-gray-200/50 p-0 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs md:text-sm text-gray-600">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50 text-3xs text-gray-400 font-bold uppercase select-none">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Company</th>
                  <th className="py-4 px-6">Stage</th>
                  <th className="py-4 px-6 text-center">Score</th>
                  <th className="py-4 px-6">Owner</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => setSelectedLeadId(lead.id)}
                    className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-6 font-bold text-gray-800">{lead.name}</td>
                    <td className="py-3 px-6 text-gray-500">{lead.company} ({lead.role})</td>
                    <td className="py-3 px-6">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-3xs font-semibold bg-gray-100 text-gray-700">
                        {lead.stage}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <Badge variant="accent" className="font-extrabold">{lead.leadScore}</Badge>
                    </td>
                    <td className="py-3 px-6 text-gray-400 font-medium">{lead.owner}</td>
                    <td className="py-3 px-6 text-right">
                      <button
                        onClick={(e) => handleDelete(e, lead.id, lead.name)}
                        className="p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* LEAD DETAILS SLIDER DRAWER PANEL */}
      <LeadDetailsDrawer leadId={selectedLeadId} onClose={() => setSelectedLeadId(null)} />
    </div>
  );
}
