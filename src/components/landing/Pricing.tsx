"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { Check, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const { toast } = useToast();

  const handleSelectPlan = (planName: string, isPro: boolean) => {
    if (isPro) {
      // Trigger canvas-confetti burst
      confetti({
        particleCount: 120,
        spread: 75,
        origin: { y: 0.6 },
        colors: ["#F4B6C2", "#EC9EB2", "#ffffff"]
      });
      toast({
        title: "Excellent Choice! 🎉",
        description: `You've selected the ${planName} plan. Loading checkout...`,
        variant: "success",
      });
    } else {
      toast({
        title: `${planName} Selected`,
        description: "Moving to checkout setup.",
        variant: "info",
      });
    }
  };

  const plans = [
    {
      name: "Starter",
      description: "Ideal for freelancers and consultants launching outreach.",
      price: billingCycle === "monthly" ? 49 : 39,
      features: [
        "1,000 Verified Email Searches/mo",
        "2,000 Email Verification checks",
        "1 Active Sequence Pipeline",
        "Basic AI Personalization hooks",
        "Unlimited Connected Inboxes",
      ],
      isPopular: false,
    },
    {
      name: "Pro",
      description: "Perfect for scaling agencies and growing startups.",
      price: billingCycle === "monthly" ? 99 : 79,
      features: [
        "5,000 Verified Email Searches/mo",
        "10,000 Email Verification checks",
        "5 Active Sequence Pipelines",
        "Advanced AI Personalization (Full Engine)",
        "Unified Reply Inbox",
        "Priority SMTP/MX domain checks",
      ],
      isPopular: true,
    },
    {
      name: "Scale",
      description: "Built for sales teams requiring high volume client acquisition.",
      price: billingCycle === "monthly" ? 249 : 199,
      features: [
        "25,000 Verified Email Searches/mo",
        "50,000 Email Verification checks",
        "Unlimited Sequence Pipelines",
        "API access & Webhooks integrations",
        "Dedicated Account Manager",
        "Custom workspace branding",
      ],
      isPopular: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-5">
          <Badge variant="accent">Simple Pricing</Badge>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
            Transparent Pricing Built for Every Scale
          </h2>
          <p className="text-sm md:text-lg text-gray-500">
            Start with our free trial. Upgrade, downgrade, or cancel anytime. Save 20% on yearly plans.
          </p>

          {/* Toggle Switch */}
          <div className="flex justify-center pt-4">
            <div className="p-1 bg-gray-100 rounded-full inline-flex border border-gray-200/40 relative">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-5 py-2 text-xs md:text-sm font-semibold rounded-full transition-colors cursor-pointer focus:outline-hidden ${
                  billingCycle === "monthly" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-5 py-2 text-xs md:text-sm font-semibold rounded-full transition-colors cursor-pointer focus:outline-hidden ${
                  billingCycle === "yearly" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Yearly Billing (Save 20%)
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => (
            <GlassCard
              key={plan.name}
              hoverEffect={plan.isPopular ? "tilt" : "lift"}
              interactive={false}
              className={`flex flex-col justify-between p-8 bg-white border relative ${
                plan.isPopular ? "border-[#F4B6C2] shadow-lg ring-1 ring-[#F4B6C2]/40" : "border-gray-200/60 shadow-xs"
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge variant="accent" className="flex items-center gap-1 shadow-xs px-3.5 py-1">
                    <Sparkles className="h-3 w-3" /> Most Popular
                  </Badge>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">{plan.description}</p>
                </div>

                <div className="flex items-baseline text-gray-900">
                  <span className="text-3xl md:text-5xl font-extrabold tracking-tight">${plan.price}</span>
                  <span className="ml-1 text-sm font-semibold text-gray-500">/month</span>
                </div>

                <ul className="space-y-3.5 border-t border-gray-100 pt-6">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start text-xs md:text-sm text-gray-600">
                      <Check className="h-4 w-4 text-[#D84B68] shrink-0 mr-2.5 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <Button
                  onClick={() => handleSelectPlan(plan.name, plan.isPopular)}
                  variant={plan.isPopular ? "primary" : "outline"}
                  className="w-full text-center py-3"
                >
                  Start Free Trial
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
