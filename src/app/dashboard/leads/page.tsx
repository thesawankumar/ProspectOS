"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useProspectStore } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import LeadDetailsDrawer from "@/components/dashboard/LeadDetailsDrawer";
import {
  Search,
  Filter,
  Trash2,
  CheckCircle,
  AlertTriangle,
  UserCheck,
  PlusCircle,
  Database,
  ArrowDownToLine,
  Mail,
  Loader2,
  Locate,
  Check,
  MailWarning
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ScrapedLead {
  id: string;
  name: string;
  role: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  location: string;
  category: string;
  companySize: string;
  verifiedStatus: "verified" | "invalid" | "unverified";
}

export default function LeadsPage() {
  const { toast } = useToast();

  const workspaces = useProspectStore((state) => state.workspaces);
  const activeWorkspaceId = useProspectStore((state) => state.activeWorkspaceId);
  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];
  const crmLeads = activeWorkspace.leads;

  const addLead = useProspectStore((state) => state.addLead);

  // Scraper search states
  const [keyword, setKeyword] = useState("");
  const [city, setCity] = useState("");
  const [isScraping, setIsScraping] = useState(false);
  const [leadsList, setLeadsList] = useState<ScrapedLead[]>([]);

  // Selection states
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [isVerifyingBulk, setIsVerifyingBulk] = useState(false);

  // Details slide drawer
  const [selectedCrmLeadId, setSelectedCrmLeadId] = useState<string | null>(null);

  const handleScrapeSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword) return;

    setIsScraping(true);
    setLeadsList([]);
    setSelectedLeadIds([]);

    // Simulate Google Maps + Website scraper pipeline
    setTimeout(() => {
      setIsScraping(false);
      const category = keyword.toLowerCase();
      const location = city || "Austin, TX";

      const newResults: ScrapedLead[] = [
        {
          id: "scr-1",
          name: "Thomas Miller",
          role: "Practice Lead",
          company: `${keyword.toUpperCase()} Center`,
          email: `t.miller@${category.replace(/\s+/g, "")}center.com`,
          phone: "+1 (555) 302-9845",
          website: `${category.replace(/\s+/g, "")}center.com`,
          location,
          category: keyword,
          companySize: "11-50",
          verifiedStatus: "unverified"
        },
        {
          id: "scr-2",
          name: "Rachel Green",
          role: "Operations Manager",
          company: `Elite ${keyword}`,
          email: `rachel@elite${category.replace(/\s+/g, "")}.io`,
          phone: "+1 (555) 492-3841",
          website: `elite${category.replace(/\s+/g, "")}.io`,
          location,
          category: keyword,
          companySize: "2-10",
          verifiedStatus: "unverified"
        },
        {
          id: "scr-3",
          name: "James Carter",
          role: "Co-Founder",
          company: `Apex ${keyword} Group`,
          email: `j.carter@apex${category.replace(/\s+/g, "")}.com`,
          phone: "+1 (555) 782-1290",
          website: `apex${category.replace(/\s+/g, "")}.com`,
          location,
          category: keyword,
          companySize: "51-200",
          verifiedStatus: "unverified"
        }
      ];

      setLeadsList(newResults);
      toast({
        title: "Prospect Scrape Complete",
        description: `Discovered 3 leads matching "${keyword}".`,
        variant: "success",
      });
    }, 2000);
  };

  const toggleSelectLead = (id: string) => {
    setSelectedLeadIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedLeadIds.length === leadsList.length) {
      setSelectedLeadIds([]);
    } else {
      setSelectedLeadIds(leadsList.map((l) => l.id));
    }
  };

  // Bulk operations
  const handleBulkVerify = () => {
    if (selectedLeadIds.length === 0) return;
    setIsVerifyingBulk(true);

    setTimeout(() => {
      setIsVerifyingBulk(false);
      setLeadsList((prev) =>
        prev.map((l) =>
          selectedLeadIds.includes(l.id)
            ? { ...l, verifiedStatus: Math.random() > 0.15 ? "verified" : "invalid" }
            : l
        )
      );
      toast({
        title: "SMTP Verification Completed",
        description: "Checked deliverability headers successfully.",
        variant: "success",
      });
    }, 1800);
  };

  const handleBulkImport = () => {
    if (selectedLeadIds.length === 0) return;

    let addedCount = 0;
    let dupCount = 0;

    selectedLeadIds.forEach((id) => {
      const scraped = leadsList.find((l) => l.id === id);
      if (!scraped) return;

      const res = addLead({
        name: scraped.name,
        role: scraped.role,
        company: scraped.company,
        email: scraped.email,
        phone: scraped.phone,
        website: scraped.website,
        location: scraped.location,
        industry: scraped.category,
        companySize: scraped.companySize,
        linkedin: `linkedin.com/company/${scraped.company.toLowerCase().replace(/\s+/g, "")}`,
        stage: "New Lead",
        tags: ["Scraped", scraped.category],
        owner: "Alex Rivera"
      });

      if (res.success) addedCount++;
      if (res.isDuplicate) dupCount++;
    });

    toast({
      title: "CRM Sync Complete",
      description: `Synced: ${addedCount} lead(s). Duplicates merged: ${dupCount}.`,
      variant: "success",
    });

    // Remove successfully imported leads from scraper list
    setLeadsList((prev) => prev.filter((l) => !selectedLeadIds.includes(l.id)));
    setSelectedLeadIds([]);
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div>
        <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
          AI Lead Finder
        </h1>
        <p className="text-xs text-gray-400">
          Scrape coordinates, enrich contacts, and import verified targets in bulk to active CRM pipelines
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* SCRAPER PARAMETERS COLUMN (Span 1) */}
        <GlassCard hoverEffect="none" interactive={false} className="bg-white border-gray-200/50 p-5 space-y-4">
          <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-2">
            <Locate className="h-4 w-4 text-[#D84B68]" /> Scrape Criteria
          </h3>

          <form onSubmit={handleScrapeSearch} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="category" className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">Keyword/Category</label>
              <Input
                id="category"
                type="text"
                placeholder="e.g. Dentist, Gym, Tech Agency"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                required
                disabled={isScraping}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="city" className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">City/Region</label>
              <Input
                id="city"
                type="text"
                placeholder="e.g. Austin, TX"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={isScraping}
              />
            </div>

            <Button type="submit" variant="primary" className="w-full justify-center" isLoading={isScraping}>
              Scrape Leads
            </Button>
          </form>

          {/* Connected CRM leads overview */}
          <div className="border-t border-gray-100 pt-4 space-y-2">
            <span className="text-3xs font-bold text-gray-400 uppercase tracking-widest block">Active Pipeline Contacts</span>
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Verified Leads:</span>
              <span className="font-bold text-gray-800">{crmLeads.length}</span>
            </div>
          </div>
        </GlassCard>

        {/* RESULTS TABLE GRID COLUMN (Span 3) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Bulk Action Header bar */}
          {selectedLeadIds.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-[#FCE7EB] border border-[#F4B6C2]/40 rounded-2xl flex items-center justify-between shadow-xs"
            >
              <span className="text-xs font-bold text-[#D84B68]">
                {selectedLeadIds.length} scraped target(s) checked
              </span>
              <div className="flex space-x-2">
                <Button
                  onClick={handleBulkVerify}
                  disabled={isVerifyingBulk}
                  variant="outline"
                  size="sm"
                  className="bg-white hover:bg-gray-50 border-gray-200/50 py-1.5 text-xs text-gray-700"
                >
                  {isVerifyingBulk ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  ) : (
                    <Mail className="h-3.5 w-3.5 mr-1" />
                  )}
                  Verify Emails
                </Button>
                <Button
                  onClick={handleBulkImport}
                  variant="primary"
                  size="sm"
                  className="py-1.5 text-xs text-gray-900"
                >
                  <PlusCircle className="h-3.5 w-3.5 mr-1 text-gray-900" />
                  Sync to CRM
                </Button>
              </div>
            </motion.div>
          )}

          {/* Results box */}
          <GlassCard hoverEffect="none" interactive={false} className="bg-white border-gray-200/50 p-0 overflow-hidden shadow-xs">
            {isScraping ? (
              <div className="py-20 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-[#D84B68]" />
                <div className="text-center">
                  <h4 className="text-sm font-bold text-gray-800">Scraping Local Listings...</h4>
                  <p className="text-2xs text-gray-400 mt-0.5">Fetching website coordinates, scraping email strings & domains...</p>
                </div>
              </div>
            ) : leadsList.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs md:text-sm text-gray-600">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50 text-3xs text-gray-400 font-bold uppercase select-none">
                      <th className="py-4 px-6 w-12">
                        <button
                          onClick={handleSelectAll}
                          className="h-4.5 w-4.5 rounded-sm border border-gray-300 flex items-center justify-center bg-white cursor-pointer focus:outline-hidden"
                          aria-label="Select all leads"
                        >
                          {selectedLeadIds.length === leadsList.length && (
                            <Check className="h-3.5 w-3.5 text-[#D84B68]" />
                          )}
                        </button>
                      </th>
                      <th className="py-4 px-6">Name</th>
                      <th className="py-4 px-6">Company / Category</th>
                      <th className="py-4 px-6">Contact / Web</th>
                      <th className="py-4 px-6 text-right">Email Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {leadsList.map((lead) => {
                      const isSelected = selectedLeadIds.includes(lead.id);
                      return (
                        <tr
                          key={lead.id}
                          onClick={() => toggleSelectLead(lead.id)}
                          className={cn(
                            "hover:bg-gray-50/50 transition-colors cursor-pointer",
                            isSelected && "bg-[#FCE7EB]/10"
                          )}
                        >
                          <td className="py-3.5 px-6">
                            <div
                              className={cn(
                                "h-4.5 w-4.5 rounded-sm border flex items-center justify-center transition-colors",
                                isSelected ? "bg-[#D84B68] border-[#D84B68] text-white" : "border-gray-300 bg-white"
                              )}
                            >
                              {isSelected && <Check className="h-3.5 w-3.5 text-white" />}
                            </div>
                          </td>
                          <td className="py-3.5 px-6 font-bold text-gray-800">
                            {lead.name}
                            <p className="text-3xs text-gray-400 font-semibold">{lead.role}</p>
                          </td>
                          <td className="py-3.5 px-6 text-gray-500 font-medium">
                            {lead.company}
                            <p className="text-3xs text-gray-400 uppercase tracking-widest">{lead.category}</p>
                          </td>
                          <td className="py-3.5 px-6 space-y-0.5">
                            <span className="text-xs text-gray-700 block">{lead.email}</span>
                            <span className="text-3xs text-gray-400 font-semibold block">{lead.website}</span>
                          </td>
                          <td className="py-3.5 px-6 text-right">
                            {lead.verifiedStatus === "verified" ? (
                              <Badge variant="success" className="gap-1">
                                <CheckCircle className="h-3 w-3" /> Safe
                              </Badge>
                            ) : lead.verifiedStatus === "invalid" ? (
                              <Badge variant="danger" className="gap-1">
                                <MailWarning className="h-3 w-3" /> Bounces
                              </Badge>
                            ) : (
                              <Badge variant="neutral">Unverified</Badge>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                <div className="p-4 bg-gray-50 text-gray-400 rounded-full border border-gray-100">
                  <Database className="h-8 w-8" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-800">Zero search results loaded</h4>
                  <p className="text-2xs text-gray-400 mt-0.5">Input search query parameters on the left pane to extract prospect maps.</p>
                </div>
              </div>
            )}
          </GlassCard>
        </div>
      </div>

      {/* LEAD DETAILS DRAWER SLIDER */}
      <LeadDetailsDrawer leadId={selectedCrmLeadId} onClose={() => setSelectedCrmLeadId(null)} />
    </div>
  );
}
