"use client";

import React, { useState } from "react";
import { useProspectStore, Proposal, Invoice, Contract } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { Dialog } from "@/components/ui/Dialog";
import { Tabs } from "@/components/ui/Tabs";
import {
  FileText,
  CreditCard,
  Briefcase,
  PlusCircle,
  Download,
  Sparkles,
  DollarSign,
  User,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

const billingTabs = [
  { id: "proposals", label: "Proposals", icon: <FileText className="h-4 w-4" /> },
  { id: "invoices", label: "Invoices", icon: <CreditCard className="h-4 w-4" /> },
  { id: "contracts", label: "Contracts", icon: <Briefcase className="h-4 w-4" /> }
];

export default function BillingPage() {
  const { toast } = useToast();

  const workspaces = useProspectStore((state) => state.workspaces);
  const activeWorkspaceId = useProspectStore((state) => state.activeWorkspaceId);
  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];

  const proposals = activeWorkspace.proposals || [];
  const invoices = activeWorkspace.invoices || [];
  const contracts = activeWorkspace.contracts || [];

  const addProposal = useProspectStore((state) => state.addProposal);
  const addInvoice = useProspectStore((state) => state.addInvoice);
  const addContract = useProspectStore((state) => state.addContract);

  const [activeTab, setActiveTab] = useState("proposals");

  // Modals state
  const [isPropOpen, setIsPropOpen] = useState(false);
  const [isInvOpen, setIsInvOpen] = useState(false);
  const [isConOpen, setIsConOpen] = useState(false);

  // Proposal Form State
  const [propClient, setPropClient] = useState("");
  const [propCompany, setPropCompany] = useState("");
  const [propServices, setPropServices] = useState("");
  const [propPricing, setPropPricing] = useState("");
  const [propText, setPropText] = useState("");
  const [isGeneratingProp, setIsGeneratingProp] = useState(false);

  // Invoice Form State
  const [invClient, setInvClient] = useState("");
  const [invAmount, setInvAmount] = useState(1500);
  const [invDate, setInvDate] = useState("");

  // Contract Form State
  const [conClient, setConClient] = useState("");
  const [conType, setConType] = useState<"Freelance" | "Agency" | "Retainer" | "Consulting">("Retainer");

  // Document generators
  const handleAIGenerateProposal = () => {
    if (!propClient || !propCompany) return;
    setIsGeneratingProp(true);

    setTimeout(() => {
      setIsGeneratingProp(false);
      setPropText(
        `PROPOSAL OF SERVICES\nFor: ${propClient} (${propCompany})\n\n1. Project Scope: Custom outbound sales sequence setup and domain optimization campaigns.\n2. Milestones:\n   - Week 1: Cold email mailbox setups and warmups.\n   - Week 2: AI writer persona models training.\n   - Week 3: CRM pipeline integrations.\n3. Pricing: ${propPricing || "$3,000/mo"}\n4. Support: Slack channel dedicated, 24-hr turnaround.\n\nSigned by Alex Rivera, VelStudio.`
      );
      toast({
        title: "Proposal Text Assembled",
        description: "AI Writer has generated legal and service milestone clauses.",
        variant: "success",
      });
    }, 1500);
  };

  const handleCreateProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propClient || !propCompany) return;

    addProposal({
      clientName: propClient,
      company: propCompany,
      services: propServices,
      pricing: propPricing,
      text: propText || "Agreement Details..."
    });

    toast({
      title: "Proposal Created",
      description: `Draft proposals saved for ${propClient}.`,
      variant: "success",
    });

    setPropClient("");
    setPropCompany("");
    setPropServices("");
    setPropPricing("");
    setPropText("");
    setIsPropOpen(false);
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invClient || !invAmount) return;

    addInvoice({
      invoiceNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      clientName: invClient,
      amount: invAmount,
      dueDate: invDate || "2026-07-30"
    });

    toast({
      title: "Invoice Generated",
      description: "Billing invoice added with Pending status.",
      variant: "success",
    });

    setInvClient("");
    setInvAmount(1500);
    setIsInvOpen(false);
  };

  const handleCreateContract = (e: React.FormEvent) => {
    e.preventDefault();
    if (!conClient) return;

    addContract({
      clientName: conClient,
      type: conType
    });

    toast({
      title: "Agreement Draft Saved",
      description: `New ${conType} agreement saved to workspace database.`,
      variant: "success",
    });

    setConClient("");
    setIsConOpen(false);
  };

  const handleDownloadPDF = (name: string, type: string) => {
    toast({
      title: "Downloading PDF Document 📄",
      description: `Saving ${type} for ${name} to local downloads folder.`,
      variant: "info",
    });
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/50 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
            Billing & Service Documents
          </h1>
          <p className="text-xs text-gray-400">
            Generate custom invoices, structure legal contracts, and write AI project proposals
          </p>
        </div>
      </div>

      {/* Tabs list */}
      <div className="mb-6">
        <Tabs tabs={billingTabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {/* PROPOSALS VIEW */}
      {activeTab === "proposals" && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-800 uppercase tracking-wider block">Outreach Proposals</span>
            <Button onClick={() => setIsPropOpen(true)} variant="primary" size="sm">
              <PlusCircle className="h-4 w-4 mr-1.5 shrink-0" /> AI Proposal
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {proposals.map((prop) => (
              <GlassCard key={prop.id} hoverEffect="lift" interactive={false} className="bg-white border-gray-200/50 p-6 flex flex-col justify-between min-h-[190px]">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Badge variant={prop.status === "Accepted" ? "success" : "neutral"}>{prop.status}</Badge>
                    <span className="text-3xs text-gray-400 font-bold">{prop.date}</span>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-gray-800">{prop.company}</h3>
                    <p className="text-2xs text-gray-400 font-bold">Client Contact: {prop.clientName}</p>
                    <p className="text-xs text-gray-500 font-semibold mt-1">Services: {prop.services}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-gray-50 pt-4 mt-4 text-xs">
                  <span className="font-bold text-[#D84B68]">{prop.pricing}</span>
                  <button
                    onClick={() => handleDownloadPDF(prop.clientName, "Proposal PDF")}
                    className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-[#D84B68] hover:text-[#B73550] flex items-center gap-1 text-2xs font-bold cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" /> PDF
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* INVOICES VIEW */}
      {activeTab === "invoices" && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-800 uppercase tracking-wider block">Billing Invoices</span>
            <Button onClick={() => setIsInvOpen(true)} variant="primary" size="sm">
              <PlusCircle className="h-4 w-4 mr-1.5 shrink-0" /> Add Invoice
            </Button>
          </div>

          <GlassCard hoverEffect="none" interactive={false} className="bg-white border-gray-200/50 p-0 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs md:text-sm text-gray-600">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50 text-3xs text-gray-400 font-bold uppercase select-none">
                    <th className="py-4 px-6">Invoice ID</th>
                    <th className="py-4 px-6">Client</th>
                    <th className="py-4 px-6">Due Date</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Amount</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 font-semibold">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="py-4 px-6 text-gray-900 font-bold">{inv.invoiceNumber}</td>
                      <td className="py-4 px-6 text-gray-600">{inv.clientName}</td>
                      <td className="py-4 px-6 text-gray-400">{inv.dueDate}</td>
                      <td className="py-4 px-6">
                        <Badge variant={inv.status === "Paid" ? "success" : "warning"}>{inv.status}</Badge>
                      </td>
                      <td className="py-4 px-6 text-right text-gray-900 font-bold">${inv.amount.toLocaleString()}</td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleDownloadPDF(inv.clientName, "Invoice PDF")}
                          className="px-2.5 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-600 cursor-pointer"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      )}

      {/* CONTRACTS VIEW */}
      {activeTab === "contracts" && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-800 uppercase tracking-wider block">Service Agreements</span>
            <Button onClick={() => setIsConOpen(true)} variant="primary" size="sm">
              <PlusCircle className="h-4 w-4 mr-1.5 shrink-0" /> Draft Contract
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contracts.map((con) => (
              <GlassCard key={con.id} hoverEffect="lift" interactive={false} className="bg-white border-gray-200/50 p-6 flex flex-col justify-between min-h-[170px]">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Badge variant={con.status === "Signed" ? "success" : "neutral"}>{con.status}</Badge>
                    <span className="text-3xs text-gray-400 font-bold">{con.date}</span>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-gray-800">{con.clientName}</h3>
                    <p className="text-3xs text-gray-400 font-bold uppercase tracking-widest mt-1">Agreement Type: {con.type}</p>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-50 mt-4">
                  <button
                    onClick={() => handleDownloadPDF(con.clientName, "Contract Agreement")}
                    className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 flex items-center gap-1 text-2xs font-bold cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" /> Download Contract
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* PROPOSAL AI BUILDER DIALOG */}
      <Dialog isOpen={isPropOpen} onClose={() => setIsPropOpen(false)}>
        <form onSubmit={handleCreateProposal} className="space-y-5">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-[#FCE7EB] text-[#D84B68] rounded-xl">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">AI Proposal Generator</h3>
              <p className="text-xs text-gray-500">Generate client pitch templates using customized AI variables</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="p-cname" className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">Client Contact Name</label>
                <Input
                  id="p-cname"
                  type="text"
                  placeholder="Sarah Jenkins"
                  value={propClient}
                  onChange={(e) => setPropClient(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="p-comp" className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">Company Name</label>
                <Input
                  id="p-comp"
                  type="text"
                  placeholder="Figma Inc"
                  value={propCompany}
                  onChange={(e) => setPropCompany(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="p-serv" className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">Target Service Deliverables</label>
                <Input
                  id="p-serv"
                  type="text"
                  placeholder="Outreach & Lead Gen integrations"
                  value={propServices}
                  onChange={(e) => setPropServices(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="p-price" className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">Project Pricing ($/mo)</label>
                <Input
                  id="p-price"
                  type="text"
                  placeholder="$4,500/mo"
                  value={propPricing}
                  onChange={(e) => setPropPricing(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button
              type="button"
              onClick={handleAIGenerateProposal}
              disabled={isGeneratingProp || !propClient}
              variant="outline"
              className="w-full justify-center"
            >
              {isGeneratingProp ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : <Sparkles className="h-4 w-4 mr-1.5" />}
              Draft Legal & Milestone Clauses
            </Button>

            {propText && (
              <div className="space-y-1.5 animate-fade-in">
                <label htmlFor="p-text" className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">Agreement Document Preview</label>
                <Textarea
                  id="p-text"
                  value={propText}
                  onChange={(e) => setPropText(e.target.value)}
                  className="min-h-[140px] text-xs font-mono"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsPropOpen(false)}
              className="px-4 py-2 rounded-full border border-gray-200 text-xs font-semibold text-gray-500 hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <Button type="submit" variant="primary" size="sm">
              Save Proposal Draft
            </Button>
          </div>
        </form>
      </Dialog>

      {/* CREATE INVOICE DIALOG */}
      <Dialog isOpen={isInvOpen} onClose={() => setIsInvOpen(false)}>
        <form onSubmit={handleCreateInvoice} className="space-y-5">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-[#FCE7EB] text-[#D84B68] rounded-xl">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Generate Invoice</h3>
              <p className="text-xs text-gray-500">Record billing transactions and schedule client payouts</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="inv-client" className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">Billing Client Name</label>
              <Input
                id="inv-client"
                type="text"
                placeholder="David Chen (Linear)"
                value={invClient}
                onChange={(e) => setInvClient(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="inv-amount" className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">Billing Value Amount ($)</label>
                <Input
                  id="inv-amount"
                  type="number"
                  value={invAmount}
                  onChange={(e) => setInvAmount(parseInt(e.target.value))}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="inv-due" className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">Due Date Deadline</label>
                <Input
                  id="inv-due"
                  type="date"
                  value={invDate}
                  onChange={(e) => setInvDate(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsInvOpen(false)}
              className="px-4 py-2 rounded-full border border-gray-200 text-xs font-semibold text-gray-500 hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <Button type="submit" variant="primary" size="sm">
              Publish Invoice
            </Button>
          </div>
        </form>
      </Dialog>

      {/* CREATE CONTRACT DIALOG */}
      <Dialog isOpen={isConOpen} onClose={() => setIsConOpen(false)}>
        <form onSubmit={handleCreateContract} className="space-y-5">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-[#FCE7EB] text-[#D84B68] rounded-xl">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Draft Agreement Contract</h3>
              <p className="text-xs text-gray-500">Draft legal agency terms, retainer models, and support provisions</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="con-client" className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">Client Representative Name</label>
              <Input
                id="con-client"
                type="text"
                placeholder="Amanda Ross (Raycast)"
                value={conClient}
                onChange={(e) => setConClient(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="con-type" className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">Contract Template Type</label>
              <select
                id="con-type"
                value={conType}
                onChange={(e) => setConType(e.target.value as any)}
                className="flex w-full rounded-full border border-gray-200 bg-white px-4 py-2.5 text-xs md:text-sm text-gray-900 focus:outline-hidden"
              >
                <option value="Freelance">Freelance Consulting Agreement</option>
                <option value="Agency">Agency Services Framework</option>
                <option value="Retainer">Monthly Outreach Retainer</option>
                <option value="Consulting">Consulting Advisory Mandate</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsConOpen(false)}
              className="px-4 py-2 rounded-full border border-gray-200 text-xs font-semibold text-gray-500 hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <Button type="submit" variant="primary" size="sm">
              Create Contract Draft
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
