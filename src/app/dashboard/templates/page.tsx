"use client";

import React, { useState } from "react";
import { useProspectStore, Template } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Dialog } from "@/components/ui/Dialog";
import { Badge } from "@/components/ui/Badge";
import {
  Folder,
  Layers,
  Star,
  Copy,
  PlusCircle,
  Trash2,
  FileCode,
  Sparkles,
  ClipboardCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function TemplatesPage() {
  const { toast } = useToast();
  
  const workspaces = useProspectStore((state) => state.workspaces);
  const activeWorkspaceId = useProspectStore((state) => state.activeWorkspaceId);
  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];
  
  const templates = activeWorkspace.templates || [];

  const addTemplate = useProspectStore((state) => state.addTemplate);
  const toggleTemplateFavorite = useProspectStore((state) => state.toggleTemplateFavorite);
  const duplicateTemplate = useProspectStore((state) => state.duplicateTemplate);
  const deleteTemplate = useProspectStore((state) => state.deleteTemplate);

  // Folder states
  const [selectedFolder, setSelectedFolder] = useState<string>("All");
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [folder, setFolder] = useState("Cold Outreach");

  const folders = ["All", "Cold Outreach", "Follow-ups", "Re-engagement"];

  const variableChips = [
    { label: "First Name", code: "{{first_name}}" },
    { label: "Company", code: "{{company}}" },
    { label: "Website", code: "{{website}}" },
    { label: "Industry", code: "{{industry}}" },
    { label: "City", code: "{{city}}" },
    { label: "Pain Point", code: "{{pain_point}}" },
    { label: "Sender Name", code: "{{sender_name}}" }
  ];

  const handleCopyVariable = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Variable Copied",
      description: `"${code}" copied to clipboard.`,
      variant: "success",
    });
  };

  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !subject || !body) return;

    addTemplate({
      name,
      subject,
      body,
      folder
    });

    toast({
      title: "Template Saved",
      description: `"${name}" added to library.`,
      variant: "success",
    });

    // Reset and Close
    setName("");
    setSubject("");
    setBody("");
    setIsFormOpen(false);
  };

  const handleDuplicate = (id: string, name: string) => {
    duplicateTemplate(id);
    toast({
      title: "Template Duplicated",
      description: `Created copy of "${name}".`,
      variant: "success",
    });
  };

  const handleDelete = (id: string, name: string) => {
    deleteTemplate(id);
    toast({
      title: "Template Deleted",
      description: `"${name}" removed from library.`,
      variant: "danger",
    });
  };

  const filteredTemplates = selectedFolder === "All"
    ? templates
    : templates.filter(t => t.folder === selectedFolder);

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/50 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
            Email Template Library
          </h1>
          <p className="text-xs text-gray-400">
            Organize templates by folder, duplicate snippets, and use dynamic outreach variables
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} variant="primary" size="sm">
          <PlusCircle className="h-4 w-4 mr-1.5 shrink-0" /> New Template
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* FOLDERS & VARIABLES LEFT PANEL (Span 1) */}
        <div className="space-y-6">
          {/* Folders filter */}
          <GlassCard hoverEffect="none" interactive={false} className="bg-white border-gray-200/50 p-5 space-y-4">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-2">
              <Folder className="h-4 w-4 text-gray-400" /> Folders
            </h3>
            <div className="flex flex-col space-y-1">
              {folders.map((f) => (
                <button
                  key={f}
                  onClick={() => setSelectedFolder(f)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer focus:outline-hidden",
                    selectedFolder === f
                      ? "bg-[#FCE7EB] text-[#D84B68]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </GlassCard>

          {/* Variables helper */}
          <GlassCard hoverEffect="none" interactive={false} className="bg-white border-gray-200/50 p-5 space-y-4">
            <div>
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-2">
                <FileCode className="h-4 w-4 text-[#D84B68]" /> Dynamic Variables
              </h3>
              <p className="text-3xs text-gray-400 mt-1">Click to copy variable tags</p>
            </div>
            
            <div className="flex flex-wrap gap-1.5">
              {variableChips.map((chip) => (
                <button
                  key={chip.code}
                  onClick={() => handleCopyVariable(chip.code)}
                  className="px-2.5 py-1.5 bg-gray-50 hover:bg-[#FCE7EB]/30 border border-gray-200 hover:border-[#F4B6C2]/40 rounded-lg text-3xs font-mono font-bold text-gray-600 hover:text-[#D84B68] flex items-center gap-1 transition-all cursor-pointer focus:outline-hidden"
                  title={`Copy ${chip.code}`}
                >
                  <ClipboardCheck className="h-3 w-3 text-gray-400" />
                  <span>{chip.label}</span>
                </button>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* TEMPLATE CARDS GRID COLUMN (Span 3) */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTemplates.map((temp) => (
            <GlassCard
              key={temp.id}
              hoverEffect="lift"
              interactive={false}
              className="bg-white border-gray-200/50 flex flex-col justify-between p-6 min-h-[260px] relative"
            >
              {/* Header favorites toggle */}
              <div className="flex items-center justify-between">
                <span className="text-3xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 border border-gray-150 rounded-md px-2 py-0.5 select-none">
                  {temp.folder}
                </span>
                
                <div className="flex space-x-1.5">
                  <button
                    onClick={() => toggleTemplateFavorite(temp.id)}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors focus:outline-hidden cursor-pointer"
                    aria-label="Favorite Template"
                  >
                    <Star
                      className={cn(
                        "h-4.5 w-4.5",
                        temp.isFavorite
                          ? "fill-amber-400 text-amber-400 animate-pulse"
                          : "text-gray-300"
                      )}
                    />
                  </button>
                </div>
              </div>

              {/* Preview content */}
              <div className="space-y-2 mt-4 flex-grow">
                <h3 className="font-bold text-sm text-gray-800">{temp.name}</h3>
                <p className="text-xs font-semibold text-gray-500 line-clamp-1 border-b border-gray-50 pb-1">
                  Subject: <span className="text-gray-700">{temp.subject}</span>
                </p>
                <div className="text-2xs text-gray-400 font-medium leading-relaxed font-mono line-clamp-4 whitespace-pre-line pt-1">
                  {temp.body}
                </div>
              </div>

              {/* Actions footer */}
              <div className="flex justify-end items-center gap-1.5 pt-4 border-t border-gray-100 mt-4 text-gray-400">
                <button
                  onClick={() => handleDuplicate(temp.id, temp.name)}
                  className="px-2.5 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-2xs font-bold text-gray-600 flex items-center gap-1 cursor-pointer focus:outline-hidden"
                >
                  <Copy className="h-3.5 w-3.5" /> Duplicate
                </button>
                <button
                  onClick={() => handleDelete(temp.id, temp.name)}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors cursor-pointer focus:outline-hidden"
                  aria-label="Delete template"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </GlassCard>
          ))}
          
          {filteredTemplates.length === 0 && (
            <div className="col-span-2 py-20 border border-dashed border-gray-200 rounded-3xl text-center text-xs text-gray-400 font-semibold select-none bg-gray-50/10">
              No templates in folder "{selectedFolder}".
            </div>
          )}
        </div>
      </div>

      {/* CREATE TEMPLATE DIALOG */}
      <Dialog isOpen={isFormOpen} onClose={() => setIsFormOpen(false)}>
        <form onSubmit={handleCreateTemplate} className="space-y-5">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-[#FCE7EB] text-[#D84B68] rounded-xl">
              <PlusCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Create Email Template</h3>
              <p className="text-xs text-gray-500">Draft reusable email sequence stages and followups</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="temp-name" className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">Template Name</label>
                <Input
                  id="temp-name"
                  type="text"
                  placeholder="e.g. Cold Pitch - Agency"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="temp-folder" className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">Folder Category</label>
                <select
                  id="temp-folder"
                  value={folder}
                  onChange={(e) => setFolder(e.target.value)}
                  className="flex w-full rounded-full border border-gray-200 bg-white px-4 py-2.5 text-xs md:text-sm text-gray-900 focus:outline-hidden"
                >
                  <option value="Cold Outreach">Cold Outreach</option>
                  <option value="Follow-ups">Follow-ups</option>
                  <option value="Re-engagement">Re-engagement</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="temp-sub" className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">Subject Line</label>
              <Input
                id="temp-sub"
                type="text"
                placeholder="e.g. Quick idea about {{company}}"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="temp-body" className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">Email Body</label>
                <span className="text-3xs text-gray-400 font-mono">Use variable blocks tags like {"{{first_name}}"}</span>
              </div>
              <Textarea
                id="temp-body"
                placeholder="Hi {{first_name}}, I noticed..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="min-h-[140px]"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 rounded-full border border-gray-200 text-xs font-semibold text-gray-500 hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <Button type="submit" variant="primary" size="sm">
              Save Template
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
