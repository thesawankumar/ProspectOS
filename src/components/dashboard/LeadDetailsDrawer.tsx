"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProspectStore } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  X,
  User,
  Briefcase,
  Calendar,
  Sparkles,
  ClipboardList,
  MessageSquareText,
  Clock,
  Plus,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LeadDetailsDrawerProps {
  leadId: string | null;
  onClose: () => void;
}

export default function LeadDetailsDrawer({ leadId, onClose }: LeadDetailsDrawerProps) {
  const { toast } = useToast();

  const workspaces = useProspectStore((state) => state.workspaces);
  const activeWorkspaceId = useProspectStore((state) => state.activeWorkspaceId);
  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];
  const lead = activeWorkspace.leads.find((l) => l.id === leadId);

  const addLeadNote = useProspectStore((state) => state.addLeadNote);
  const addLeadTask = useProspectStore((state) => state.addLeadTask);
  const toggleLeadTask = useProspectStore((state) => state.toggleLeadTask);
  const scheduleLeadMeeting = useProspectStore((state) => state.scheduleLeadMeeting);

  // Form states
  const [newNote, setNewNote] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"high" | "medium" | "low">("medium");
  const [newMeetTitle, setNewMeetTitle] = useState("");
  const [newMeetDate, setNewMeetDate] = useState("");
  const [newMeetTime, setNewMeetTime] = useState("");

  if (!lead) return null;

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    addLeadNote(lead.id, newNote);
    toast({ title: "Note Added", description: "Saved directly in prospect notes timeline.", variant: "success" });
    setNewNote("");
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addLeadTask(lead.id, {
      title: newTaskTitle,
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10), // 3 days out
      priority: newTaskPriority
    });
    toast({ title: "Task Created", description: "Appended to lead TODO list.", variant: "success" });
    setNewTaskTitle("");
  };

  const handleAddMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeetTitle || !newMeetDate || !newMeetTime) return;
    scheduleLeadMeeting(lead.id, {
      title: newMeetTitle,
      date: newMeetDate,
      time: newMeetTime,
      link: "https://meet.google.com/outreach-" + Math.random().toString(36).substring(2, 5)
    });
    toast({ title: "Meeting Scheduled", description: "Calendar invite triggers generated.", variant: "success" });
    setNewMeetTitle("");
    setNewMeetDate("");
    setNewMeetTime("");
  };

  return (
    <AnimatePresence>
      {leadId && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/20 backdrop-blur-xs cursor-pointer"
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            {/* Sliding Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="w-screen max-w-2xl bg-white border-l border-gray-200 flex flex-col shadow-2xl h-full"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-gray-150 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-xl bg-[#FCE7EB] text-[#D84B68] flex items-center justify-center font-bold text-sm">
                    {lead.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-gray-900">{lead.name}</h3>
                    <p className="text-3xs text-gray-400 font-semibold">{lead.role} at {lead.company}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full hover:bg-gray-150 text-gray-400 hover:text-gray-900 cursor-pointer focus:outline-hidden"
                  aria-label="Close panel"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable Content Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* 1. KEY CONTACT DATA CARDS */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3 bg-gray-50/50 p-4 border border-gray-150 rounded-2xl">
                    <h4 className="text-3xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" /> Core Profile
                    </h4>
                    <div className="space-y-2 text-xs text-gray-600">
                      <p><span className="font-bold text-gray-800">Email:</span> {lead.email || "N/A"}</p>
                      <p><span className="font-bold text-gray-800">Phone:</span> {lead.phone || "N/A"}</p>
                      <p><span className="font-bold text-gray-800">Location:</span> {lead.location || "N/A"}</p>
                    </div>
                  </div>

                  <div className="space-y-3 bg-gray-50/50 p-4 border border-gray-150 rounded-2xl">
                    <h4 className="text-3xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Briefcase className="h-3.5 w-3.5" /> Company Details
                    </h4>
                    <div className="space-y-2 text-xs text-gray-600">
                      <p><span className="font-bold text-gray-800">Website:</span> {lead.website || "N/A"}</p>
                      <p><span className="font-bold text-gray-800">Industry:</span> {lead.industry || "N/A"}</p>
                      <p><span className="font-bold text-gray-800">Size:</span> {lead.companySize || "N/A"}</p>
                    </div>
                  </div>
                </div>

                {/* 2. AI LEAD SCORING BREAKDOWN */}
                <div className="bg-linear-to-br from-[#FCE7EB]/30 to-white border border-[#F4B6C2]/40 rounded-2xl p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-[#D84B68]" /> AI Lead Scoring Insights
                    </h4>
                    <Badge variant="accent" className="font-bold text-sm">
                      Score: {lead.leadScore}/100
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-gray-400 font-semibold block">Email Deliverability Confidence</span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500" style={{ width: "95%" }} />
                        </div>
                        <span className="font-bold text-green-600">95%</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400 font-semibold block">Company Fit Score</span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#D84B68]" style={{ width: `${lead.leadScore}%` }} />
                        </div>
                        <span className="font-bold text-[#D84B68]">{lead.leadScore}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. NOTES SEGMENT */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <MessageSquareText className="h-4 w-4 text-gray-400" /> Interaction Notes
                  </h4>
                  <form onSubmit={handleAddNote} className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Add an activity note (e.g. sent demo brief on Monday)..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                    />
                    <Button type="submit" variant="secondary" size="sm">
                      Add
                    </Button>
                  </form>
                  <div className="space-y-2 max-h-[140px] overflow-y-auto">
                    {lead.notes.map((n, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 border border-gray-200/60 rounded-xl text-xs text-gray-700">
                        {n}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. TASK MANAGER SEGMENT */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <ClipboardList className="h-4 w-4 text-gray-400" /> Action Items
                  </h4>
                  <form onSubmit={handleAddTask} className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="New follow-up task title..."
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                    />
                    <select
                      value={newTaskPriority}
                      onChange={(e) => setNewTaskPriority(e.target.value as any)}
                      className="border border-gray-200 rounded-full px-3 text-xs bg-white focus:outline-hidden"
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                    <Button type="submit" variant="secondary" size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </form>

                  <div className="space-y-2">
                    {lead.tasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => toggleLeadTask(lead.id, task.id)}
                        className={cn(
                          "p-3 rounded-xl border flex items-center justify-between text-xs cursor-pointer select-none transition-all",
                          task.completed
                            ? "bg-gray-50/50 border-gray-100 text-gray-400 line-through"
                            : "bg-white border-gray-200 hover:border-gray-300 text-gray-700"
                        )}
                      >
                        <div className="flex items-center space-x-2.5">
                          <div
                            className={cn(
                              "h-4 w-4 rounded-sm border flex items-center justify-center",
                              task.completed ? "bg-green-500 border-green-500 text-white" : "border-gray-300 bg-white"
                            )}
                          >
                            {task.completed && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                          </div>
                          <span>{task.title}</span>
                        </div>
                        <Badge variant={task.priority === "high" ? "danger" : task.priority === "medium" ? "warning" : "neutral"}>
                          {task.priority}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. MEETINGS SCHEDULER SEGMENT */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-gray-400" /> Booked Meetings
                  </h4>
                  <form onSubmit={handleAddMeeting} className="grid grid-cols-3 gap-2">
                    <Input
                      type="text"
                      placeholder="Meeting Title"
                      value={newMeetTitle}
                      onChange={(e) => setNewMeetTitle(e.target.value)}
                      className="col-span-1"
                      required
                    />
                    <Input
                      type="date"
                      value={newMeetDate}
                      onChange={(e) => setNewMeetDate(e.target.value)}
                      className="col-span-1"
                      required
                    />
                    <div className="flex gap-1.5 col-span-1">
                      <Input
                        type="text"
                        placeholder="11:00 AM"
                        value={newMeetTime}
                        onChange={(e) => setNewMeetTime(e.target.value)}
                        required
                      />
                      <Button type="submit" variant="secondary" size="sm">
                        Go
                      </Button>
                    </div>
                  </form>

                  <div className="space-y-2">
                    {lead.meetings.map((meet) => (
                      <div key={meet.id} className="p-3.5 bg-gray-50 border border-gray-150 rounded-xl flex justify-between items-center text-xs text-gray-700">
                        <div className="space-y-1">
                          <p className="font-bold text-gray-800">{meet.title}</p>
                          <p className="text-3xs text-gray-400 font-semibold">{meet.date} at {meet.time}</p>
                        </div>
                        <a
                          href={meet.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-2xs font-bold text-[#D84B68] hover:text-[#EC9EB2]"
                        >
                          Join Meeting
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 6. LEAD TIMELINE HISTORY */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-gray-400" /> Activity Timeline
                  </h4>
                  <div className="border-l-2 border-gray-100 pl-4 space-y-4">
                    {lead.timeline.map((time) => (
                      <div key={time.id} className="text-xs space-y-0.5 relative">
                        <div className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-[#F4B6C2] ring-4 ring-white" />
                        <p className="font-bold text-gray-800">{time.description}</p>
                        <p className="text-3xs text-gray-400 font-semibold">{time.date}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
