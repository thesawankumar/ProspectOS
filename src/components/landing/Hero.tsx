"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import Background3D from "@/components/three/Background3D";
import { Play, Sparkles, ArrowRight, Search, Check, Mail, Loader2, Target } from "lucide-react";

export default function Hero() {
  const { toast } = useToast();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  // Interactive preview states
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleStartFree = () => {
    toast({
      title: "Welcome to ProspectOS!",
      description: "Setting up your demo sandbox workspace.",
      variant: "success",
    });
  };

  const handleSearchPreview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    setIsSearching(true);
    setSearchResults([]);

    setTimeout(() => {
      setIsSearching(false);
      setSearchResults([
        { id: "1", name: "Alice Thompson", role: "CTO", company: "NextGen Corp", email: "alice@nextgen.io" },
        { id: "2", name: "Ben Sullivan", role: "VP Marketing", company: "ClickFlow", email: "b.sullivan@clickflow.com" },
        { id: "3", name: "Clara Ortiz", role: "Founder", company: "Zeta AI", email: "clara@zeta.ai" },
      ]);
      setSelectedLeads(["1", "2", "3"]);
      toast({
        title: "Search Complete",
        description: "Found 3 relevant decision makers in our global index.",
        variant: "info",
      });
    }, 1500);
  };

  const toggleLead = (id: string) => {
    setSelectedLeads((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleVerifyPreview = () => {
    if (selectedLeads.length === 0) return;
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      toast({
        title: "Leads Exported & Verified! 🛡️",
        description: `${selectedLeads.length} contact mailboxes validated (Safe-to-send: 100%).`,
        variant: "success",
      });
      // Close preview modal after success
      setTimeout(() => {
        setIsPreviewOpen(false);
        // Reset states
        setSearchQuery("");
        setSearchResults([]);
      }, 1000);
    }, 2000);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* 3D Canvas Background */}
      <Background3D />

      {/* Backdrop Gradients */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 w-[350px] h-[350px] bg-radial-gradient from-[#F4B6C2]/15 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 w-[300px] h-[300px] bg-radial-gradient from-[#EC9EB2]/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 text-center relative z-10 space-y-8">
        {/* Top Accent Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center space-x-2 bg-[#FCE7EB] border border-[#F4B6C2]/30 px-3 py-1 rounded-full text-xs font-bold text-[#D84B68] shadow-xs"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Next.js 15 Outbound Platform</span>
        </motion.div>

        {/* Large Premium Headline */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-gray-900 leading-[1.1]"
          >
            The AI Operating System For{" "}
            <span className="text-accent-gradient">Winning More Clients.</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-sm sm:text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed"
          >
            Find leads, verify emails, personalize outreach, automate follow-ups and manage your complete sales pipeline from one beautiful workspace.
          </motion.p>
        </div>

        {/* Hero Actions Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4"
        >
          <Button onClick={handleStartFree} variant="primary" size="lg" className="w-full sm:w-auto shadow-md">
            <span>Start Free</span>
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>

          <Button
            onClick={() => setIsPreviewOpen(true)}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 border-gray-200 hover:border-gray-300"
          >
            <Play className="h-3.5 w-3.5 text-gray-600 fill-current" />
            <span>Live Product Preview</span>
          </Button>
        </motion.div>

        {/* Mini Preview Dialog (Lightbox Modal) */}
        <Dialog isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} className="max-w-xl">
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-[#FCE7EB] text-[#D84B68] rounded-xl">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">ProspectOS Interactive Search</h3>
                <p className="text-xs text-gray-500">Query global databases and enrich target information</p>
              </div>
            </div>

            {/* Step 1: Input query */}
            <form onSubmit={handleSearchPreview} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="e.g. Founders in San Francisco"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  disabled={isSearching || isVerifying}
                  required
                />
              </div>
              <Button type="submit" variant="primary" disabled={isSearching || isVerifying}>
                {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
              </Button>
            </form>

            {/* Step 2: Query results list */}
            {isSearching && (
              <div className="py-8 flex flex-col items-center justify-center space-y-3">
                <Loader2 className="h-8 w-8 animate-spin text-[#D84B68]" />
                <p className="text-xs text-gray-500">Enriching results and parsing LinkedIn directory...</p>
              </div>
            )}

            {!isSearching && searchResults.length > 0 && (
              <div className="space-y-4 animate-fade-in">
                <div className="border border-gray-150 rounded-2xl overflow-hidden bg-gray-50/50">
                  <div className="divide-y divide-gray-100">
                    {searchResults.map((lead) => {
                      const isSelected = selectedLeads.includes(lead.id);
                      return (
                        <div
                          key={lead.id}
                          onClick={() => !isVerifying && toggleLead(lead.id)}
                          className={`flex items-center justify-between p-3.5 transition-colors cursor-pointer hover:bg-gray-100 ${
                            isSelected ? "bg-[#FCE7EB]/30" : ""
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`h-5 w-5 rounded-md border flex items-center justify-center transition-colors ${
                                isSelected
                                  ? "bg-[#D84B68] border-[#D84B68] text-white"
                                  : "border-gray-300 bg-white"
                              }`}
                            >
                              {isSelected && <Check className="h-3.5 w-3.5" />}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-800">{lead.name}</p>
                              <p className="text-3xs text-gray-400 font-medium">
                                {lead.role} at {lead.company}
                              </p>
                            </div>
                          </div>
                          <span className="text-3xs text-gray-500 font-mono">{lead.email}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs text-gray-400 font-medium">
                    {selectedLeads.length} leads selected
                  </span>
                  <Button
                    onClick={handleVerifyPreview}
                    disabled={selectedLeads.length === 0 || isVerifying}
                    variant="primary"
                    size="sm"
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                        <span>Verifying Mailboxes...</span>
                      </>
                    ) : (
                      <>
                        <Mail className="h-3.5 w-3.5 mr-1.5" />
                        <span>Export & Verify Leads</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Dialog>
      </div>
    </section>
  );
}
