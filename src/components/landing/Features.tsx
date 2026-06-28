"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Database, ShieldCheck, MessageSquareText, GitBranch, ArrowUpRight, Zap, Target, Lock } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export default function Features() {
  const { toast } = useToast();

  const handleFeatureClick = (featureName: string) => {
    toast({
      title: `${featureName} Feature`,
      description: "More specifications on this feature can be detailed in a consultation call.",
      variant: "info",
    });
  };

  return (
    <section id="features" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <Badge variant="accent">Features Specs</Badge>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
            Engineered to Scale Your Client Acquisition
          </h2>
          <p className="text-sm md:text-lg text-gray-500 leading-relaxed">
            Eliminate complex multi-tool configurations. Everything you need to scale cold outbound outreach is built into a single, high-fidelity workspace.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Lead Database (Col Span 2) */}
          <GlassCard
            hoverEffect="tilt"
            onClick={() => handleFeatureClick("Lead Database")}
            className="md:col-span-2 flex flex-col justify-between min-h-[320px] bg-linear-to-br from-white/90 to-[#F7F7F8]/80 border-gray-200/60 shadow-xs"
          >
            <div className="flex justify-between items-start">
              <div className="p-3 bg-[#FCE7EB] rounded-2xl text-[#D84B68]">
                <Database className="h-6 w-6" />
              </div>
              <span className="text-gray-400 group-hover:text-gray-900">
                <ArrowUpRight className="h-5 w-5" />
              </span>
            </div>
            
            <div className="space-y-3 mt-8">
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-bold text-gray-900">Global B2B Database Search</h3>
                <Badge variant="success">Active</Badge>
              </div>
              <p className="text-sm text-gray-500 max-w-xl leading-relaxed">
                Search through over 250M verified B2B profiles. Filter by company size, location, exact job titles, funding rounds, and technology stacks with instant accuracy.
              </p>
            </div>
          </GlassCard>

          {/* Card 2: Verification (Col Span 1) */}
          <GlassCard
            hoverEffect="tilt"
            onClick={() => handleFeatureClick("Email Verification")}
            className="flex flex-col justify-between min-h-[320px] bg-linear-to-br from-white/90 to-[#F7F7F8]/80 border-gray-200/60 shadow-xs"
          >
            <div className="flex justify-between items-start">
              <div className="p-3 bg-green-50 rounded-2xl text-green-700">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <ArrowUpRight className="h-5 w-5 text-gray-400" />
            </div>

            <div className="space-y-3 mt-8">
              <h3 className="text-xl font-bold text-gray-900 font-sans">Multi-layer Verifier</h3>
              <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
                Run automated MX, SMTP, and syntax checks to ensure sub-1% bounce rates. Protect your domains from spam listings.
              </p>
            </div>
          </GlassCard>

          {/* Card 3: AI Copywriter (Col Span 1) */}
          <GlassCard
            hoverEffect="tilt"
            onClick={() => handleFeatureClick("AI Personalization")}
            className="flex flex-col justify-between min-h-[320px] bg-linear-to-br from-white/90 to-[#F7F7F8]/80 border-gray-200/60 shadow-xs"
          >
            <div className="flex justify-between items-start">
              <div className="p-3 bg-purple-50 rounded-2xl text-purple-700">
                <MessageSquareText className="h-6 w-6" />
              </div>
              <ArrowUpRight className="h-5 w-5 text-gray-400" />
            </div>

            <div className="space-y-3 mt-8">
              <h3 className="text-xl font-bold text-gray-900">Hyper-Personalized AI</h3>
              <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
                Automatically draft relevant introductory hooks based on social profiles, product updates, and news milestones in seconds.
              </p>
            </div>
          </GlassCard>

          {/* Card 4: Sequencer (Col Span 2) */}
          <GlassCard
            hoverEffect="tilt"
            onClick={() => handleFeatureClick("Automated Sequencer")}
            className="md:col-span-2 flex flex-col justify-between min-h-[320px] bg-linear-to-br from-white/90 to-[#F7F7F8]/80 border-gray-200/60 shadow-xs"
          >
            <div className="flex justify-between items-start">
              <div className="p-3 bg-amber-50 rounded-2xl text-amber-700">
                <GitBranch className="h-6 w-6" />
              </div>
              <ArrowUpRight className="h-5 w-5 text-gray-400" />
            </div>

            <div className="space-y-3 mt-8">
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-bold text-gray-900">Campaign Outbox Sequencer</h3>
                <Badge variant="accent">Autopilot</Badge>
              </div>
              <p className="text-sm text-gray-500 max-w-xl leading-relaxed">
                Build advanced, branching sequences with conditional wait actions, auto-followups, and dynamic variable inserts. Never miss another hot reply.
              </p>
            </div>
          </GlassCard>
        </div>

        {/* Small highlights row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-12 border-t border-gray-100">
          <div className="flex items-center space-x-3">
            <Zap className="h-5 w-5 text-[#D84B68] shrink-0" />
            <span className="text-xs md:text-sm font-semibold text-gray-700">Instant Setup</span>
          </div>
          <div className="flex items-center space-x-3">
            <Target className="h-5 w-5 text-[#D84B68] shrink-0" />
            <span className="text-xs md:text-sm font-semibold text-gray-700">Accurate Leads</span>
          </div>
          <div className="flex items-center space-x-3">
            <Lock className="h-5 w-5 text-[#D84B68] shrink-0" />
            <span className="text-xs md:text-sm font-semibold text-gray-700">Security Ready</span>
          </div>
          <div className="flex items-center space-x-3">
            <ShieldCheck className="h-5 w-5 text-[#D84B68] shrink-0" />
            <span className="text-xs md:text-sm font-semibold text-gray-700">GDPR/CCPA Compliant</span>
          </div>
        </div>
      </div>
    </section>
  );
}
