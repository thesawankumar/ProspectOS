"use client";

import React, { useState, useEffect } from "react";
import { useProspectStore, Lead } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Textarea } from "@/components/ui/Textarea";
import {
  Sparkles,
  Server,
  ShieldCheck,
  Zap,
  Globe,
  Gauge,
  Percent,
  MessageSquare,
  RefreshCw,
  MailWarning,
  Eye,
  AlertTriangle,
  Monitor,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AIPersonalizationPage() {
  const { toast } = useToast();

  const workspaces = useProspectStore((state) => state.workspaces);
  const activeWorkspaceId = useProspectStore((state) => state.activeWorkspaceId);
  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];
  const leads = activeWorkspace.leads || [];

  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [activeLead, setActiveLead] = useState<Lead | null>(null);

  // Scraper states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isWriting, setIsWriting] = useState(false);

  // AI draft options
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("Medium");
  const [emailType, setEmailType] = useState("Cold Email");

  // Output outputs
  const [openingLine, setOpeningLine] = useState("");
  const [icebreaker, setIcebreaker] = useState("");
  const [generatedSubject, setGeneratedSubject] = useState("");
  const [generatedBody, setGeneratedBody] = useState("");
  
  // Spam score
  const [spamScore, setSpamScore] = useState<number | null>(null);
  const [spamFlags, setSpamFlags] = useState<string[]>([]);

  // Reply assistant mockup
  const [inboundReply, setInboundReply] = useState("Hey Alex, thanks for reaching out. Your audit suggestion looks interesting. Do you have time for a quick 10-minute demo this Thursday at 3 PM EST?");
  const [replyDraft, setReplyDraft] = useState("");

  // Update active lead details on selection
  useEffect(() => {
    if (selectedLeadId) {
      const target = leads.find((l) => l.id === selectedLeadId);
      if (target) {
        setActiveLead(target);
        setSpamScore(null);
        setGeneratedBody("");
      }
    } else if (leads.length > 0) {
      setSelectedLeadId(leads[0].id);
      setActiveLead(leads[0]);
    }
  }, [selectedLeadId, leads]);

  const handleRunAnalysis = () => {
    if (!activeLead) return;
    setIsAnalyzing(true);

    setTimeout(() => {
      setIsAnalyzing(false);
      toast({
        title: "Domain Scraper Completed 🌐",
        description: `Retrieved SSL, speed scores, and page templates for ${activeLead.website}.`,
        variant: "success",
      });
    }, 1500);
  };

  const handleGenerateEmail = () => {
    if (!activeLead) return;
    setIsWriting(true);

    setTimeout(() => {
      setIsWriting(false);
      
      const first = activeLead.name.split(" ")[0];
      const company = activeLead.company;
      const web = activeLead.website;

      const openingLines = {
        Professional: `Hi ${first}, I was inspecting ${company}'s digital setup and noticed your engineering pacing...`,
        Casual: `Hey ${first}! Hope you're having a great week. Loved the recent updates on ${web}...`,
        Premium: `Dear ${first}, Congratulations on ${company}'s recent industry recognitions. I noticed...`,
        Direct: `Hi ${first}, I'm reaching out because I noticed a small deliverability gap on ${web}...`
      };

      const icebreakers = {
        Professional: `Loved your recent post detailing plugin onboarding. It aligns perfectly with what you build.`,
        Casual: `Congrats on the product expansion! Pacing looks extremely neat.`,
        Premium: `Your dedication to seamless integrations across developer channels is highly inspiring.`,
        Direct: `Thought this quick suggestion might help improve domain speed metrics.`
      };

      const line = (openingLines as any)[tone] || openingLines.Professional;
      const ice = (icebreakers as any)[tone] || icebreakers.Professional;

      setOpeningLine(line);
      setIcebreaker(ice);
      setGeneratedSubject(`Quick idea for ${company}`);
      setGeneratedBody(
        `${line}\n\n${ice}\n\nI was looking at ${web} and noticed that you guys could improve site accessibility by adding live chat tools. We've built an API sequencer that does this in one click. We helped ScaleAgency book 42 demos in 30 days doing this.\n\nWould you be open to a brief call this Thursday?\n\nBest,\nAlex Rivera`
      );

      // Audit spam score
      setSpamScore(9.2);
      setSpamFlags(["Unsubscribe link present", "Good image-to-text balance", "No uppercase spam trigger words"]);

      toast({
        title: "AI Draft Assembled",
        description: `Generated ${tone} ${emailType}.`,
        variant: "success",
      });
    }, 2000);
  };

  const handleGenerateReply = (type: "meeting" | "friendly") => {
    if (type === "meeting") {
      setReplyDraft(
        `Hi ${activeLead?.name.split(" ")[0] || "Sarah"},\n\nSounds great! Thursday at 3 PM EST works perfectly for me. I've sent a calendar invite with a Zoom link to your email.\n\nLooking forward to speaking.\n\nBest,\nAlex Rivera`
      );
    } else {
      setReplyDraft(
        `Hi ${activeLead?.name.split(" ")[0] || "Sarah"},\n\nThanks for checking this out. Glad to hear you found the audit interesting. Let me know what date next week works best for your team.\n\nBest,\nAlex Rivera`
      );
    }
    toast({
      title: "Reply Assistant Output",
      description: "Appended response draft to composer.",
      variant: "info",
    });
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div>
        <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
          AI Email Intelligence
        </h1>
        <p className="text-xs text-gray-400">
          Run deep audits on company domains, write personalized introductions, and check deliverability spam markers
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* DOMAIN AUDITOR & SCREENSHOT PANEL (Span 1) */}
        <div className="space-y-6">
          {/* Target dropdown Selector */}
          <GlassCard hoverEffect="none" interactive={false} className="bg-white border-gray-200/50 p-5 space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="lead-select" className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">Target Lead Profile</label>
              <select
                id="lead-select"
                value={selectedLeadId}
                onChange={(e) => setSelectedLeadId(e.target.value)}
                className="flex w-full rounded-full border border-gray-200 bg-white px-4 py-2.5 text-xs md:text-sm text-gray-900 focus:outline-hidden"
              >
                {leads.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} ({l.company})
                  </option>
                ))}
              </select>
            </div>

            {activeLead && (
              <Button onClick={handleRunAnalysis} disabled={isAnalyzing} variant="outline" className="w-full justify-center text-xs">
                {isAnalyzing ? <RefreshCw className="h-3.5 w-3.5 animate-spin mr-1.5" /> : <Globe className="h-3.5 w-3.5 mr-1.5" />}
                Analyze Domain Web
              </Button>
            )}
          </GlassCard>

          {/* Domain Analyzer Dashboard */}
          {activeLead && (
            <GlassCard hoverEffect="none" interactive={false} className="bg-white border-gray-200/50 p-5 space-y-5">
              <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                <span className="text-xs font-bold text-gray-800">{activeLead.company} Analyzer</span>
                <Badge variant="success">SSL Secure</Badge>
              </div>

              {/* Mock browser screenshot viewport */}
              <div className="border border-gray-200 rounded-2xl overflow-hidden bg-gray-50 text-center relative select-none">
                <div className="flex items-center space-x-1.5 px-3 py-2 bg-gray-150 border-b border-gray-250">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-3xs text-gray-400 font-mono tracking-wider pl-4 truncate">{activeLead.website}</span>
                </div>
                {/* Mock Screenshot Body */}
                <div className="h-32 bg-linear-to-br from-[#FCE7EB]/30 to-white flex flex-col items-center justify-center p-4">
                  <span className="font-extrabold text-sm text-gray-800 tracking-tight">{activeLead.company}</span>
                  <p className="text-3xs text-gray-400 leading-normal max-w-[160px] mt-1.5">
                    Premium agency platforms and collaborative setups.
                  </p>
                </div>
              </div>

              {/* Technical Ratings lists */}
              <div className="space-y-3">
                <span className="text-3xs font-bold text-gray-400 uppercase tracking-widest block">Audit Health Ratings</span>
                {[
                  { label: "Performance Speed", score: 89, color: "bg-amber-400" },
                  { label: "UX Conversion Rate", score: 92, color: "bg-green-500" },
                  { label: "SEO Optimizations", score: 76, color: "bg-amber-400" }
                ].map((rating) => (
                  <div key={rating.label} className="space-y-1">
                    <div className="flex justify-between text-3xs font-bold text-gray-600">
                      <span>{rating.label}</span>
                      <span>{rating.score}/100</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full", rating.color)} style={{ width: `${rating.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Opportunities list */}
              <div className="space-y-2 border-t border-gray-100 pt-4">
                <span className="text-3xs font-bold text-gray-400 uppercase tracking-widest block">Opportunities Detected</span>
                <ul className="space-y-1.5 text-3xs text-gray-500 leading-relaxed font-semibold">
                  <li className="flex items-start gap-1">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                    <span>Slow mobile loading speed index (&gt;3.4s)</span>
                  </li>
                  <li className="flex items-start gap-1">
                    <AlertTriangle className="h-3.5 w-3.5 text-[#D84B68] shrink-0" />
                    <span>No active live chat widget present</span>
                  </li>
                </ul>
              </div>
            </GlassCard>
          )}
        </div>

        {/* AI EMAIL COMPOSER PANEL (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard hoverEffect="none" interactive={false} className="bg-white border-gray-200/50 p-6 md:p-8 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-gray-800">Generative AI Writer</h3>
              <p className="text-3xs text-gray-400">Generate highly custom intros, icebreakers, and spam evaluations</p>
            </div>

            {/* Composer configs */}
            <div className="grid grid-cols-3 gap-3 bg-gray-50/50 p-3 rounded-2xl border border-gray-200/60 text-xs font-semibold">
              <div>
                <label className="text-3xs font-bold text-gray-400 uppercase block mb-1">Outreach Tone</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full bg-transparent border-none p-0 cursor-pointer focus:outline-hidden"
                >
                  <option value="Professional">Professional</option>
                  <option value="Casual">Casual</option>
                  <option value="Premium">Premium</option>
                  <option value="Direct">Direct</option>
                </select>
              </div>

              <div>
                <label className="text-3xs font-bold text-gray-400 uppercase block mb-1">Email Length</label>
                <select
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="w-full bg-transparent border-none p-0 cursor-pointer focus:outline-hidden"
                >
                  <option value="Short">Short</option>
                  <option value="Medium">Medium</option>
                  <option value="Long">Long</option>
                </select>
              </div>

              <div>
                <label className="text-3xs font-bold text-gray-400 uppercase block mb-1">Template Type</label>
                <select
                  value={emailType}
                  onChange={(e) => setEmailType(e.target.value)}
                  className="w-full bg-transparent border-none p-0 cursor-pointer focus:outline-hidden"
                >
                  <option value="Cold Email">Cold Email</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Proposal">Proposal</option>
                </select>
              </div>
            </div>

            {/* Generate Action */}
            <Button onClick={handleGenerateEmail} disabled={isWriting || !activeLead} variant="primary" className="w-full justify-center">
              {isWriting ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : <Sparkles className="h-4 w-4 mr-1.5" />}
              Generate Personalized Draft
            </Button>

            {/* Draft outputs */}
            {generatedBody && (
              <div className="space-y-4 pt-4 border-t border-gray-150 animate-fade-in">
                <div className="grid grid-cols-2 gap-4 text-xs bg-gray-50/50 p-4 border border-gray-150 rounded-2xl">
                  <div>
                    <span className="text-3xs font-bold text-gray-400 block uppercase">Personalized Opening</span>
                    <p className="mt-1 text-gray-700 font-semibold">{openingLine}</p>
                  </div>
                  <div>
                    <span className="text-3xs font-bold text-gray-400 block uppercase">Icebreaker Opportunities</span>
                    <p className="mt-1 text-gray-700 font-semibold">{icebreaker}</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="gen-sub" className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">Generated Subject Line</label>
                  <Input
                    id="gen-sub"
                    type="text"
                    value={generatedSubject}
                    onChange={(e) => setGeneratedSubject(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="gen-body" className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">Email Composer Body</label>
                  <Textarea
                    id="gen-body"
                    value={generatedBody}
                    onChange={(e) => setGeneratedBody(e.target.value)}
                    className="min-h-[220px]"
                  />
                </div>

                {/* Spam Score Audit details */}
                {spamScore !== null && (
                  <div className="p-4 bg-green-50/20 border border-green-200/50 rounded-2xl flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-green-50 text-green-700 flex items-center justify-center font-bold text-sm shrink-0">
                      {spamScore}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-green-800">Spam Deliverability Score: Safe</span>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {spamFlags.map((flag) => (
                          <span key={flag} className="text-3xs px-2 py-0.5 rounded-sm bg-green-50 text-green-700 font-bold">
                            ✓ {flag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </GlassCard>

          {/* AI REPLY ASSISTANT VIEWPORT */}
          {activeLead && (
            <GlassCard hoverEffect="none" interactive={false} className="bg-white border-gray-200/50 p-6 space-y-5 shadow-xs">
              <div>
                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                  <MessageSquare className="h-4.5 w-4.5 text-blue-500" /> AI Reply Assistant
                </h3>
                <p className="text-3xs text-gray-400">Instantly draft responses to client follow-up replies</p>
              </div>

              {/* Inbound Email panel */}
              <div className="p-4 border border-gray-150 rounded-2xl bg-gray-50/30 text-xs">
                <div className="flex items-center justify-between text-3xs text-gray-400 pb-2 border-b border-gray-100 mb-2 font-bold select-none">
                  <span>From: {activeLead.email}</span>
                  <span>Inbound Response</span>
                </div>
                <p className="text-gray-700 italic">"{inboundReply}"</p>
              </div>

              {/* Action triggers */}
              <div className="flex gap-2">
                <Button
                  onClick={() => handleGenerateReply("meeting")}
                  variant="outline"
                  size="sm"
                  className="flex-1 py-2 text-xs border-gray-200 text-gray-700"
                >
                  Draft Meeting Schedule
                </Button>
                <Button
                  onClick={() => handleGenerateReply("friendly")}
                  variant="outline"
                  size="sm"
                  className="flex-1 py-2 text-xs border-gray-200 text-gray-700"
                >
                  Friendly Affirmation
                </Button>
              </div>

              {/* Draft Output */}
              {replyDraft && (
                <div className="space-y-1.5 animate-fade-in">
                  <label htmlFor="rep-draft" className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">Generated Response Draft</label>
                  <Textarea
                    id="rep-draft"
                    value={replyDraft}
                    onChange={(e) => setReplyDraft(e.target.value)}
                    className="min-h-[120px] text-xs"
                  />
                  <div className="flex justify-end pt-1">
                    <Button
                      onClick={() => {
                        toast({ title: "Email Sent Successfully", description: `Delivered response to ${activeLead.name}.`, variant: "success" });
                        setReplyDraft("");
                      }}
                      variant="primary"
                      size="sm"
                    >
                      Send Reply
                    </Button>
                  </div>
                </div>
              )}
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
