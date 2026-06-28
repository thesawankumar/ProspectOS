"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { useProspectStore } from "@/lib/store";
import { Sparkles, ArrowRight, ArrowLeft, Mail, CheckCircle2, CloudUpload, Link2, Target } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const addWorkspace = useProspectStore((state) => state.addWorkspace);
  const session = useProspectStore((state) => state.session);

  const [step, setStep] = useState(1);

  // Form states
  const [role, setRole] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [emailProvider, setEmailProvider] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [dailyGoal, setDailyGoal] = useState<number>(50);
  const [csvFile, setCsvFile] = useState<string | null>(null);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleFinish = () => {
    // Generate workspace slug
    const id = companyName.toLowerCase().replace(/\s+/g, "-") || "my-workspace";
    
    // Add workspace to store
    addWorkspace({
      id,
      name: companyName || "My Workspace",
      website,
      industry,
      teamSize,
      role,
      dailyGoal,
      smtpConnected: emailProvider ? true : false,
      smtpSettings: emailProvider
        ? { host: `smtp.${emailProvider.toLowerCase()}.com`, email: emailAddress || "outreach@company.com", provider: emailProvider }
        : undefined,
      members: [{ name: session.name, email: session.email, role: "Owner" }]
    });

    toast({
      title: "Workspace Configured! 🎉",
      description: "Welcome to your ProspectOS Workspace Dashboard.",
      variant: "success",
    });

    router.push("/dashboard");
  };

  const roles = ["Freelancer", "Agency", "Sales Team", "Startup", "Consultant"];
  const goals = [
    { value: 20, label: "20 / day (Warm-up)" },
    { value: 50, label: "50 / day (Recommended)" },
    { value: 100, label: "100 / day (Scale)" }
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-50/50 px-6 py-12 overflow-hidden">
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[350px] h-[350px] bg-radial-gradient from-[#F4B6C2]/15 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 translate-x-1/2 w-[350px] h-[350px] bg-radial-gradient from-[#EC9EB2]/10 to-transparent blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl relative z-10 space-y-6">
        {/* Step Indicator Header */}
        <div className="flex items-center justify-between px-2">
          <span className="text-xs font-bold text-[#D84B68] uppercase tracking-wider">
            Step {step} of 5
          </span>
          <div className="flex space-x-1.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-1.5 w-6 rounded-full transition-all duration-300 ${
                  s <= step ? "bg-[#F4B6C2]" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        <GlassCard hoverEffect="none" interactive={false} className="border-gray-200 shadow-xl bg-white p-8 min-h-[460px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-6 flex-grow"
            >
              {/* STEP 1: CHOOSE ROLE */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">What best describes your role?</h2>
                    <p className="text-xs md:text-sm text-gray-400">We'll tailor your outreach workspace recommendations based on this.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-3 pt-2">
                    {roles.map((r) => {
                      const isSelected = role === r;
                      return (
                        <button
                          key={r}
                          onClick={() => setRole(r)}
                          className={`flex items-center justify-between p-4 rounded-2xl border text-left transition-all cursor-pointer focus:outline-hidden ${
                            isSelected
                              ? "border-[#F4B6C2] bg-[#FCE7EB]/30 ring-1 ring-[#F4B6C2]"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                        >
                          <span className="text-sm font-semibold text-gray-800">{r}</span>
                          {isSelected && <CheckCircle2 className="h-5 w-5 text-[#D84B68]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: BUSINESS INFORMATION */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">Tell us about your business</h2>
                    <p className="text-xs md:text-sm text-gray-400">This configures your default sending workspace profile.</p>
                  </div>
                  <div className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                      <label htmlFor="company-name" className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">Company Name</label>
                      <Input
                        id="company-name"
                        type="text"
                        placeholder="VelStudio"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="website" className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">Website URL</label>
                      <Input
                        id="website"
                        type="url"
                        placeholder="https://velstudio.com"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label htmlFor="industry" className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">Industry</label>
                        <Input
                          id="industry"
                          type="text"
                          placeholder="Design Agency"
                          value={industry}
                          onChange={(e) => setIndustry(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="team-size" className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">Team Size</label>
                        <Input
                          id="team-size"
                          type="text"
                          placeholder="2-10 members"
                          value={teamSize}
                          onChange={(e) => setTeamSize(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: CONNECT EMAIL */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">Connect sending mailboxes</h2>
                    <p className="text-xs md:text-sm text-gray-400">Add an inbox to start sending outreach sequences directly.</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    {["Gmail", "Outlook", "Custom SMTP"].map((p) => {
                      const isSelected = emailProvider === p;
                      return (
                        <button
                          key={p}
                          onClick={() => setEmailProvider(p)}
                          className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all cursor-pointer focus:outline-hidden ${
                            isSelected
                              ? "border-[#F4B6C2] bg-[#FCE7EB]/30 ring-1 ring-[#F4B6C2]"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                        >
                          <Mail className="h-6 w-6 text-gray-400 mb-2" />
                          <span className="text-xs font-semibold text-gray-800">{p}</span>
                        </button>
                      );
                    })}
                  </div>

                  {emailProvider && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3 pt-2"
                    >
                      <div className="space-y-1.5">
                        <label htmlFor="email-address" className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">Sending Email Address</label>
                        <Input
                          id="email-address"
                          type="email"
                          placeholder="outreach@company.com"
                          value={emailAddress}
                          onChange={(e) => setEmailAddress(e.target.value)}
                          required
                        />
                      </div>
                      <p className="text-3xs text-gray-400">
                        * Clicking 'Next' will simulate SMTP connection test handshakes.
                      </p>
                    </motion.div>
                  )}
                </div>
              )}

              {/* STEP 4: DAILY OUTREACH GOAL */}
              {step === 4 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">Set daily outreach goal</h2>
                    <p className="text-xs md:text-sm text-gray-400">We'll pacing email deliveries across connected channels automatically.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-3 pt-2">
                    {goals.map((g) => {
                      const isSelected = dailyGoal === g.value;
                      return (
                        <button
                          key={g.value}
                          onClick={() => setDailyGoal(g.value)}
                          className={`flex items-center justify-between p-4.5 rounded-2xl border text-left transition-all cursor-pointer focus:outline-hidden ${
                            isSelected
                              ? "border-[#F4B6C2] bg-[#FCE7EB]/30 ring-1 ring-[#F4B6C2]"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <Target className="h-5 w-5 text-gray-400" />
                            <span className="text-sm font-semibold text-gray-800">{g.label}</span>
                          </div>
                          {isSelected && <CheckCircle2 className="h-5 w-5 text-[#D84B68]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 5: IMPORT LEADS */}
              {step === 5 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">Import existing lead contacts</h2>
                    <p className="text-xs md:text-sm text-gray-400">Upload your lead lists (.csv or .xlsx) to initialize CRM stages.</p>
                  </div>
                  <div
                    onClick={() => {
                      setCsvFile("leads_dump.csv");
                      toast({
                        title: "File Loaded",
                        description: "Parsed 42 leads. Column mapping complete.",
                        variant: "success",
                      });
                    }}
                    className={`border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                      csvFile
                        ? "border-green-300 bg-green-50/20"
                        : "border-gray-200 hover:border-gray-300 bg-gray-50/50"
                    }`}
                  >
                    <CloudUpload className={`h-10 w-10 mb-3 ${csvFile ? "text-green-500 animate-pulse" : "text-gray-400"}`} />
                    {csvFile ? (
                      <div>
                        <span className="text-sm font-bold text-green-700">{csvFile}</span>
                        <p className="text-2xs text-green-600 mt-1">42 prospects ready for validation and campaign import</p>
                      </div>
                    ) : (
                      <div>
                        <span className="text-sm font-bold text-gray-800 block">Click to upload spreadsheet</span>
                        <span className="text-2xs text-gray-400 mt-1 block">Supports CSV, Excel, or Google Sheets dumps</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-8">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className="flex items-center space-x-1 px-4 py-2 rounded-full border border-gray-200 text-xs font-semibold text-gray-500 hover:text-gray-900 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </button>

            {step < 5 ? (
              <Button
                onClick={nextStep}
                disabled={step === 1 && !role}
                variant="primary"
                size="sm"
                className="group"
              >
                <span>Continue</span>
                <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleFinish}
                  className="px-5 py-2 rounded-full border border-gray-200 text-xs font-semibold text-gray-500 hover:text-gray-900 cursor-pointer"
                >
                  Skip Import
                </button>
                <Button onClick={handleFinish} variant="primary" size="sm">
                  Finish Setup
                </Button>
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
