"use client";

import React, { useState, useEffect, useRef } from "react";
import { useProspectStore } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { Dialog } from "@/components/ui/Dialog";
import {
  Zap,
  Terminal,
  Play,
  CheckCircle2,
  Loader2,
  Bot,
  ListTodo,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LogEntry {
  text: string;
  status: "pending" | "running" | "success" | "info";
}

export default function AIAgentPage() {
  const { toast } = useToast();
  
  const addLead = useProspectStore((state) => state.addLead);
  const addCampaign = useProspectStore((state) => state.addCampaign);
  
  const [prompt, setPrompt] = useState("Find 3 SaaS companies in London, verify emails, write cold outreach, and save everything as a draft campaign.");
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Scroll terminal logs to bottom
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  const runAgentPipeline = () => {
    if (!prompt.trim() || isRunning) return;
    
    setIsRunning(true);
    setCurrentStep(0);
    setLogs([
      { text: "Initializing Autonomous AI Agent session...", status: "info" },
      { text: "Parsing natural language intent parameters...", status: "pending" }
    ]);

    const steps = [
      {
        text: "Step 1: Scraping Google Maps directory listings and tech stack APIs...",
        action: () => {
          setLogs(prev => [
            ...prev.slice(0, -1),
            { text: "Step 1: Scraped 3 SaaS Companies (London Office leads list compiled).", status: "success" },
            { text: "Enriching target profiles and fetching business email lists...", status: "pending" }
          ]);
        }
      },
      {
        text: "Step 2: Performing multi-layer SMTP handshake check on mailboxes...",
        action: () => {
          setLogs(prev => [
            ...prev.slice(0, -1),
            { text: "Step 2: SMTP checks done. (Safe-to-send: 3. Bounced: 0).", status: "success" },
            { text: "Analyzing domains and drafting personalized AI introductory hooks...", status: "pending" }
          ]);
        }
      },
      {
        text: "Step 3: Compiling sequence draft campaigns...",
        action: () => {
          // Push mockup scraped leads to store
          addLead({
            name: "Edward Sterling",
            role: "Co-Founder",
            company: "Sterling Flow London",
            email: "e.sterling@sterlingflow.co.uk",
            phone: "",
            website: "sterlingflow.co.uk",
            location: "London, UK",
            industry: "Fintech",
            companySize: "11-50",
            linkedin: "",
            stage: "New Lead",
            tags: ["AI Agent", "London SaaS"],
            owner: "Alex Rivera"
          });

          addLead({
            name: "Rebecca Cross",
            role: "VP Operations",
            company: "Hexa Tech",
            email: "rebecca@hexatech.io",
            phone: "",
            website: "hexatech.io",
            location: "London, UK",
            industry: "Developer Tools",
            companySize: "10-50",
            linkedin: "",
            stage: "New Lead",
            tags: ["AI Agent", "London SaaS"],
            owner: "Alex Rivera"
          });

          // Create draft campaign
          addCampaign({
            name: "Agent Search - London SaaS",
            status: "Draft",
            audienceSize: 2,
            dailyLimit: 20,
            delaySeconds: 15,
            timezone: "UTC+0 (GMT)"
          });

          setLogs(prev => [
            ...prev.slice(0, -1),
            { text: "Step 3: Created draft campaign 'Agent Search - London SaaS'.", status: "success" },
            { text: "Workspace databases synchronized. Confirming pipeline records...", status: "pending" }
          ]);
        }
      },
      {
        text: "Pipeline execution success!",
        action: () => {
          setLogs(prev => [
            ...prev.slice(0, -1),
            { text: "Step 4: All tasks completed successfully! Draft campaign is ready in campaigns panel. Saved 2 leads in CRM.", status: "success" }
          ]);
          setIsRunning(false);
          toast({
            title: "Agent Actions Completed! 🤖",
            description: "New draft campaign and verified leads saved to your active workspace.",
            variant: "success",
          });
        }
      }
    ];

    // Trigger step sequences on timer increments
    let current = 0;
    const interval = setInterval(() => {
      if (current < steps.length) {
        steps[current].action();
        current++;
      } else {
        clearInterval(interval);
      }
    }, 2000);
  };

  const suggestions = [
    "Find 3 restaurants in New York, verify emails, write cold sequences",
    "Find dentists in Austin, verify deliverability, prepare draft campaign",
    "Find agencies in San Francisco, enrich contact stack, export leads"
  ];

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div>
        <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
          Autonomous AI Outreach Agent
        </h1>
        <p className="text-xs text-gray-400">
          Enter natural language prompts to scrape listings, check SMTP bounces, write personalizations, and launch draft campaigns
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* PROMPTS CONFIGURATION COLUMN (Span 1) */}
        <GlassCard hoverEffect="none" interactive={false} className="bg-white border-gray-200/50 p-5 flex flex-col justify-between min-h-[460px]">
          <div className="space-y-5">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-2">
              <Bot className="h-4.5 w-4.5 text-[#D84B68]" /> Agent Commands
            </h3>

            <div className="space-y-1.5">
              <label htmlFor="agent-prompt" className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">Prompt Instructions</label>
              <Textarea
                id="agent-prompt"
                placeholder="Find local businesses, verify..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isRunning}
                className="min-h-[140px] text-xs leading-relaxed"
              />
            </div>

            {/* Quick Suggestions */}
            <div className="space-y-2 pt-2">
              <span className="text-3xs font-bold text-gray-400 uppercase tracking-widest block">Quick Suggestions</span>
              <div className="flex flex-col gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => setPrompt(s)}
                    disabled={isRunning}
                    className="text-3xs text-left p-2.5 rounded-xl border border-gray-200 hover:border-[#F4B6C2]/40 bg-gray-50/50 hover:bg-[#FCE7EB]/30 font-semibold text-gray-600 hover:text-[#D84B68] transition-all cursor-pointer focus:outline-hidden"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 mt-6">
            <Button
              onClick={runAgentPipeline}
              disabled={isRunning || !prompt.trim()}
              variant="primary"
              className="w-full justify-center group"
            >
              {isRunning ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-1.5 shrink-0" />
                  <span>Agent Running...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-1.5 shrink-0" />
                  <span>Launch Agent</span>
                </>
              )}
            </Button>
          </div>
        </GlassCard>

        {/* AGENT PROGRESS TERMINAL LOG (Span 2) */}
        <div className="lg:col-span-2 flex flex-col h-full">
          <GlassCard
            hoverEffect="none"
            interactive={false}
            className="flex-grow flex flex-col bg-gray-900 border-gray-800 text-gray-100 rounded-3xl p-6 min-h-[460px] relative overflow-hidden"
          >
            {/* Terminal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-800 mb-4 select-none">
              <div className="flex items-center space-x-1.5">
                <Terminal className="h-4 w-4 text-green-400" />
                <span className="text-xs font-mono font-bold text-gray-400">outreach-agent.sh</span>
              </div>
              <Badge variant="neutral" className="bg-gray-800 text-gray-400 border border-gray-700 font-mono text-3xs">
                {isRunning ? "RUNNING" : "STANDBY"}
              </Badge>
            </div>

            {/* Terminal Console Logs */}
            <div className="flex-grow overflow-y-auto space-y-3 font-mono text-xs text-gray-300 leading-relaxed pr-2">
              {logs.map((log, index) => {
                const isPending = log.status === "pending";
                const isSuccess = log.status === "success";
                const isInfo = log.status === "info";
                
                return (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-gray-500 shrink-0 select-none">&gt;</span>
                    <div className="flex-1">
                      <span
                        className={cn(
                          isSuccess
                            ? "text-green-400"
                            : isPending
                            ? "text-[#EC9EB2] animate-pulse"
                            : isInfo
                            ? "text-blue-400 font-bold"
                            : "text-gray-300"
                        )}
                      >
                        {log.text}
                      </span>
                      {isPending && <Loader2 className="inline-block h-3.5 w-3.5 animate-spin ml-2 text-[#EC9EB2]" />}
                    </div>
                  </div>
                );
              })}

              {!isRunning && logs.length === 0 && (
                <div className="h-48 flex flex-col items-center justify-center text-center text-gray-500 text-xs py-10 select-none">
                  <Bot className="h-8 w-8 text-gray-700 mb-2 animate-bounce" />
                  <p>AI Agent Console Standby.</p>
                  <p className="text-3xs text-gray-600 mt-1">Configure command prompts on left pane and launch.</p>
                </div>
              )}
              
              <div ref={terminalEndRef} />
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
