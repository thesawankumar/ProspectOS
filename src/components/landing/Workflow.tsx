"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs } from "@/components/ui/Tabs";
import { GlassCard } from "@/components/ui/GlassCard";
import { Search, Mail, ShieldCheck, Cpu, Play, Calendar, UserCheck, CheckCircle2, ChevronRight, Sparkles } from "lucide-react";

export default function Workflow() {
  const [activeStep, setActiveStep] = useState("source");
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const steps = [
    { id: "source", label: "1. Lead Sourcing", icon: <Search className="h-4 w-4" /> },
    { id: "verify", label: "2. Verify & Validate", icon: <ShieldCheck className="h-4 w-4" /> },
    { id: "personalize", label: "3. AI Personalize", icon: <Cpu className="h-4 w-4" /> },
    { id: "sequence", label: "4. Smart Outreach", icon: <Play className="h-4 w-4" /> },
    { id: "convert", label: "5. Close & CRM", icon: <UserCheck className="h-4 w-4" /> },
  ];

  // Auto-play cycle to make page feel alive
  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [activeStep]);

  const startAutoPlay = () => {
    stopAutoPlay();
    autoPlayRef.current = setTimeout(() => {
      const currentIndex = steps.findIndex((s) => s.id === activeStep);
      const nextIndex = (currentIndex + 1) % steps.length;
      setActiveStep(steps[nextIndex].id);
    }, 9000); // cycle every 9 seconds
  };

  const stopAutoPlay = () => {
    if (autoPlayRef.current) {
      clearTimeout(autoPlayRef.current);
    }
  };

  const handleStepChange = (id: string) => {
    stopAutoPlay();
    setActiveStep(id);
  };

  return (
    <section id="workflow" className="py-24 bg-[#F7F7F8] relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-radial from-[#F4B6C2]/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#FCE7EB] border border-[#F4B6C2]/30 text-xs font-bold text-[#D84B68]">
            <Sparkles className="h-3 w-3" />
            <span>Interactive Workflow Demonstration</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
            One Unified Operating System for B2B Client Acquisition
          </h2>
          <p className="text-sm md:text-lg text-gray-500">
            Ditch the duct-tape setup. Find targets, clean databases, personalize communications, and close deals inside a single interface.
          </p>
        </div>

        {/* Dynamic Tab Navigation */}
        <div className="flex justify-center mb-10">
          <Tabs tabs={steps} activeTab={activeStep} onChange={handleStepChange} />
        </div>

        {/* Interactive Mockups Screen Box */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              <GlassCard hoverEffect="none" interactive={false} className="border-gray-200 shadow-xl bg-white p-0 overflow-hidden">
                {/* Mock Window Bar */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-red-400/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-400/80" />
                    <span className="w-3 h-3 rounded-full bg-green-400/80" />
                  </div>
                  <span className="text-xs text-gray-400 font-mono tracking-wider select-none">
                    app.prospectos.com/pipeline/{activeStep}
                  </span>
                  <div className="w-12" />
                </div>

                {/* Content Renderers */}
                <div className="p-6 md:p-8 min-h-[380px] flex flex-col justify-between">
                  {activeStep === "source" && <SourceMockup />}
                  {activeStep === "verify" && <VerifyMockup />}
                  {activeStep === "personalize" && <PersonalizeMockup />}
                  {activeStep === "sequence" && <SequenceMockup />}
                  {activeStep === "convert" && <ConvertMockup />}
                </div>
              </GlassCard>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* 1. SOURCE MOCKUP SCREEN */
function SourceMockup() {
  const leads = [
    { name: "Sarah Jenkins", role: "Head of Marketing", company: "Figma", location: "San Francisco", checked: true },
    { name: "David Chen", role: "VP of Sales", company: "Linear", location: "New York", checked: true },
    { name: "Amanda Ross", role: "Co-Founder", company: "Raycast", location: "London", checked: false },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-lg text-gray-900">Lead Sourcing Engine</h3>
          <p className="text-xs text-gray-500">Querying global databases for verified B2B criteria</p>
        </div>
        <div className="flex items-center space-x-2 bg-gray-100 px-3.5 py-1.5 rounded-full border border-gray-200/50">
          <Search className="h-3.5 w-3.5 text-gray-400" />
          <span className="text-xs font-semibold text-gray-700">Tech SaaS, Series B+</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-gray-400 font-bold uppercase">
              <th className="py-2.5">Name</th>
              <th className="py-2.5">Company</th>
              <th className="py-2.5">Location</th>
              <th className="py-2.5 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {leads.map((lead, idx) => (
              <tr key={idx} className="group">
                <td className="py-3 font-semibold text-gray-800">
                  <div className="flex items-center space-x-2">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    <span>{lead.name}</span>
                  </div>
                </td>
                <td className="py-3 text-gray-500">{lead.company} ({lead.role})</td>
                <td className="py-3 text-gray-400">{lead.location}</td>
                <td className="py-3 text-right">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-semibold bg-[#FCE7EB] text-[#D84B68]">
                    Found
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-xs text-gray-400 italic">
        * Scrapes and compiles live company databases based on custom industrial filters.
      </div>
    </div>
  );
}

/* 2. VERIFY MOCKUP SCREEN */
function VerifyMockup() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-lg text-gray-900">Multi-Layer Email Verification</h3>
        <p className="text-xs text-gray-500">SMTP handshakes, MX record checks, and spam trap filters</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-green-50 border border-green-200/50 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-green-800">Safe Deliverability</span>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-green-900">99.4%</span>
            <p className="text-2xs text-green-700/80 mt-1">SMTP handshake checks completed</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/50 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800">Catch-All Protected</span>
            <ShieldCheck className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-amber-900">Filter Out</span>
            <p className="text-2xs text-amber-700/80 mt-1">Bypasses unreliable domains</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/50 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-700">Verification Speed</span>
            <Sparkles className="h-4 w-4 text-gray-500" />
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-gray-900">&lt; 0.4s</span>
            <p className="text-2xs text-gray-500 mt-1">Average validation time per record</p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3.5 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-xs font-mono text-gray-500">sarah@figma.com</span>
        <ChevronRight className="h-3 w-3 text-gray-300" />
        <span className="text-xs font-semibold text-green-700">Verified Match (Mailbox Active)</span>
      </div>
    </div>
  );
}

/* 3. PERSONALIZE MOCKUP SCREEN */
function PersonalizeMockup() {
  const [typedLine, setTypedLine] = useState("");
  const fullText = "loved your recent talk on building open-source plugins at Config! I noticed Figma's product team...";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedLine((prev) => prev + fullText[index]);
      index++;
      if (index >= fullText.length - 1) {
        clearInterval(interval);
      }
    }, 45);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-lg text-gray-900">Generative AI Personalizer</h3>
          <p className="text-xs text-gray-500">Inject dynamic context based on LinkedIn posts & company news</p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FCE7EB] text-[#D84B68] text-2xs font-bold">
          <Sparkles className="h-3 w-3 animate-pulse" /> AI Draft
        </span>
      </div>

      <div className="space-y-2 border border-gray-200/80 rounded-2xl p-4 bg-gray-50/20">
        <div className="flex items-center text-xs text-gray-400 space-x-1.5">
          <span className="font-bold text-gray-600">To:</span>
          <span>sarah@figma.com</span>
        </div>
        <div className="flex items-center text-xs text-gray-400 space-x-1.5 pb-2 border-b border-gray-100">
          <span className="font-bold text-gray-600">Subject:</span>
          <span>Open source scaling at Figma</span>
        </div>
        
        <div className="pt-2 text-xs leading-relaxed text-gray-700 min-h-[100px]">
          <p>Hi Sarah,</p>
          <p className="mt-2 text-gray-800">
            I <span className="bg-[#FCE7EB] px-1 py-0.5 rounded-sm border-b border-[#F4B6C2] font-medium">{typedLine}</span>
          </p>
          <p className="mt-2 text-gray-400">
            Would you be open to a quick discussion on how we might streamline plugin onboarding?
          </p>
        </div>
      </div>
    </div>
  );
}

/* 4. SEQUENCE MOCKUP SCREEN */
function SequenceMockup() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-lg text-gray-900">Campaign Outbox & Follow-up Rules</h3>
        <p className="text-xs text-gray-500">Set conditional branching paths based on prospect activity</p>
      </div>

      <div className="space-y-3 max-w-xl">
        {/* Node 1 */}
        <div className="flex items-center space-x-4">
          <div className="h-8 w-8 rounded-full bg-[#FCE7EB] flex items-center justify-center text-xs font-bold text-[#D84B68]">1</div>
          <div className="flex-1 p-3.5 rounded-2xl bg-white border border-gray-200 shadow-2xs flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-gray-800">Send Initial Email (AI Personalized)</p>
              <p className="text-3xs text-gray-400">Trigger: Immediately upon verification</p>
            </div>
            <span className="text-2xs font-semibold text-gray-500">Sent: 1,420</span>
          </div>
        </div>

        {/* Connector */}
        <div className="w-8 flex justify-center py-0.5">
          <div className="w-0.5 h-6 bg-gray-200" />
        </div>

        {/* Node 2 */}
        <div className="flex items-center space-x-4">
          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">2</div>
          <div className="flex-1 p-3.5 rounded-2xl bg-white border border-gray-200 shadow-2xs flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-gray-800">Conditional Split: If No Reply</p>
              <p className="text-3xs text-gray-400">Wait duration: 3 Business Days</p>
            </div>
            <span className="text-2xs font-semibold text-gray-400">Follow-up: 890</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 5. CONVERT MOCKUP SCREEN */
function ConvertMockup() {
  const deals = [
    { title: "Figma Contract", company: "Figma", value: "$4,500/mo", stage: "Replied" },
    { title: "Linear Pilot", company: "Linear", value: "$2,200/mo", stage: "Meeting" },
    { title: "Raycast Deal", company: "Raycast", value: "$5,000/mo", stage: "Won" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-bold text-lg text-gray-900">Deals & Pipeline CRM</h3>
          <p className="text-xs text-gray-500">Track and manage leads inside the custom visual board</p>
        </div>
        <div className="flex space-x-2 text-xs font-semibold">
          <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-200/50 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Closed: $11,700/mo
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Stage 1 Column */}
        <div className="space-y-3">
          <span className="text-2xs font-bold text-gray-400 uppercase tracking-wider block">Replied (1)</span>
          <div className="p-3 bg-gray-50 border border-gray-200/80 rounded-2xl space-y-1.5 shadow-2xs">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-800">{deals[0].company}</span>
              <span className="text-3xs text-gray-400 font-mono">{deals[0].value}</span>
            </div>
            <p className="text-3xs text-gray-500">Sarah Jenkins</p>
            <span className="inline-block px-1.5 py-0.5 rounded-sm bg-blue-50 text-blue-700 text-3xs font-semibold">Hot Lead</span>
          </div>
        </div>

        {/* Stage 2 Column */}
        <div className="space-y-3">
          <span className="text-2xs font-bold text-gray-400 uppercase tracking-wider block">Demo Scheduled (1)</span>
          <div className="p-3 bg-white border border-[#F4B6C2] rounded-2xl space-y-1.5 shadow-xs relative">
            <div className="absolute top-2 right-2 flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EC9EB2] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#F4B6C2]"></span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-800">{deals[1].company}</span>
              <span className="text-3xs text-gray-400 font-mono">{deals[1].value}</span>
            </div>
            <p className="text-3xs text-gray-500">David Chen</p>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-amber-50 text-amber-700 text-3xs font-semibold">
              <Calendar className="h-2.5 w-2.5" /> Tomorrow 10am
            </span>
          </div>
        </div>

        {/* Stage 3 Column */}
        <div className="space-y-3">
          <span className="text-2xs font-bold text-gray-400 uppercase tracking-wider block">Closed Won (1)</span>
          <div className="p-3 bg-green-50/50 border border-green-200/50 rounded-2xl space-y-1.5 shadow-2xs">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-800">{deals[2].company}</span>
              <span className="text-3xs text-gray-400 font-mono">{deals[2].value}</span>
            </div>
            <p className="text-3xs text-gray-500">Amanda Ross</p>
            <span className="inline-block px-1.5 py-0.5 rounded-sm bg-green-50 text-green-700 text-3xs font-semibold">Contract Signed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
