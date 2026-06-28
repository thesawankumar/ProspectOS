"use client";

import React, { useState } from "react";
import { useProspectStore, CalendarEvent } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Dialog } from "@/components/ui/Dialog";
import { Badge } from "@/components/ui/Badge";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Video,
  ListTodo,
  Send,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function CalendarPage() {
  const { toast } = useToast();

  const workspaces = useProspectStore((state) => state.workspaces);
  const activeWorkspaceId = useProspectStore((state) => state.activeWorkspaceId);
  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];

  const calendarEvents = activeWorkspace.calendarEvents || [];
  const addCalendarEvent = useProspectStore((state) => state.addCalendarEvent);

  const [currentMonth, setCurrentMonth] = useState("June 2026");
  const [activeView, setActiveView] = useState("Month");
  const [isEventOpen, setIsEventOpen] = useState(false);

  // Form State
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("2026-06-28");
  const [eventType, setEventType] = useState<"meeting" | "task" | "sequence">("meeting");

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle || !eventDate) return;

    addCalendarEvent({
      title: eventTitle,
      date: eventDate,
      type: eventType
    });

    toast({
      title: "Event Scheduled 🗓️",
      description: `"${eventTitle}" added to workspace calendar.`,
      variant: "success",
    });

    setEventTitle("");
    setIsEventOpen(false);
  };

  // Mock Calendar June 2026 layout data: starts on Monday June 1st. Ends Tuesday June 30th.
  // We represent days as an array of objects
  const daysInJune = Array.from({ length: 30 }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `2026-06-${dayNum < 10 ? `0${dayNum}` : dayNum}`;
    const dayEvents = calendarEvents.filter((e) => e.date === dateStr);
    return { dayNum, dateStr, events: dayEvents };
  });

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/50 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-1.5 bg-[#FCE7EB] text-[#D84B68] rounded-xl">
            <CalendarIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
              Outreach Calendar
            </h1>
            <p className="text-xs text-gray-400">
              Track active client meetings, lead sequence schedules, and custom checklists
            </p>
          </div>
        </div>

        <Button onClick={() => setIsEventOpen(true)} variant="primary" size="sm">
          <PlusCircle className="h-4 w-4 mr-1.5 shrink-0" /> Add Event
        </Button>
      </div>

      {/* CALENDAR CONTROLLER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50 p-3.5 border border-gray-200/60 rounded-3xl">
        <div className="flex items-center space-x-2">
          <button className="p-1.5 rounded-full hover:bg-gray-150 border border-gray-200 text-gray-600 cursor-pointer focus:outline-hidden">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="font-bold text-sm text-gray-800 w-24 text-center">{currentMonth}</span>
          <button className="p-1.5 rounded-full hover:bg-gray-150 border border-gray-200 text-gray-600 cursor-pointer focus:outline-hidden">
            <ChevronRight className="h-4 w-4" />
          </button>
          <button className="px-3 py-1.5 rounded-full bg-white hover:bg-gray-50 border border-gray-200 text-3xs font-bold text-gray-600 cursor-pointer">
            Today
          </button>
        </div>

        <div className="flex items-center space-x-1.5 text-3xs font-bold">
          {["Month", "Week", "Day", "Agenda"].map((view) => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              className={cn(
                "px-3 py-1.5 rounded-full border cursor-pointer focus:outline-hidden",
                activeView === view
                  ? "bg-white text-[#D84B68] border-[#F4B6C2]/40 shadow-xs"
                  : "text-gray-600 border-gray-200 hover:bg-gray-50"
              )}
            >
              {view}
            </button>
          ))}
        </div>
      </div>

      {/* MONTH GRID VIEW */}
      <GlassCard hoverEffect="none" interactive={false} className="bg-white border-gray-200/50 p-0 overflow-hidden shadow-xs">
        {/* Days of week header */}
        <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/30 text-center font-bold text-3xs text-gray-400 py-3 uppercase select-none">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 divide-x divide-y divide-gray-100 border-t border-gray-100">
          {daysInJune.map((day) => (
            <div
              key={day.dateStr}
              className="min-h-[110px] p-3 hover:bg-gray-50/20 transition-colors flex flex-col justify-between"
            >
              <span className="text-xs font-bold text-gray-400">{day.dayNum}</span>
              
              <div className="space-y-1.5 mt-2 flex-grow overflow-y-auto max-h-[80px] scrollbar-none">
                {day.events.map((e) => {
                  const isMeeting = e.type === "meeting";
                  const isTask = e.type === "task";
                  
                  return (
                    <div
                      key={e.id}
                      className={cn(
                        "px-2 py-1 rounded-sm text-3xs font-bold truncate flex items-center space-x-1",
                        isMeeting
                          ? "bg-green-50 text-green-700"
                          : isTask
                          ? "bg-blue-50 text-blue-700"
                          : "bg-rose-50 text-rose-700"
                      )}
                      title={e.title}
                    >
                      {isMeeting ? (
                        <Video className="h-3 w-3 shrink-0" />
                      ) : isTask ? (
                        <ListTodo className="h-3 w-3 shrink-0" />
                      ) : (
                        <Send className="h-3 w-3 shrink-0" />
                      )}
                      <span className="truncate">{e.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* SCHEDULE EVENT DIALOG */}
      <Dialog isOpen={isEventOpen} onClose={() => setIsEventOpen(false)}>
        <form onSubmit={handleAddEvent} className="space-y-5">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-[#FCE7EB] text-[#D84B68] rounded-xl">
              <CalendarIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Schedule Event / Task</h3>
              <p className="text-xs text-gray-500">Insert new pipeline reminders and meetings inside active workspace</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="ev-title" className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">Event Description</label>
              <Input
                id="ev-title"
                type="text"
                placeholder="e.g. Figma Proposal Review Call"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="ev-type" className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">Event Type</label>
                <select
                  id="ev-type"
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value as any)}
                  className="flex w-full rounded-full border border-gray-200 bg-white px-4 py-2.5 text-xs md:text-sm text-gray-900 focus:outline-hidden"
                >
                  <option value="meeting">Client Meeting Call</option>
                  <option value="task">Internal TO-DO Checklist</option>
                  <option value="sequence">Campaign Sequence Launch</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="ev-date" className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">Event Target Date</label>
                <Input
                  id="ev-date"
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEventOpen(false)}
              className="px-4 py-2 rounded-full border border-gray-200 text-xs font-semibold text-gray-500 hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <Button type="submit" variant="primary" size="sm">
              Schedule Event
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
