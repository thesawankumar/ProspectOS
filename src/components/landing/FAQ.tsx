"use client";

import React from "react";
import { Accordion } from "@/components/ui/Accordion";
import { Badge } from "@/components/ui/Badge";

export default function FAQ() {
  const faqs = [
    {
      title: "How does ProspectOS verify emails?",
      content: "We use a multi-layered verification system. Every search result undergoes real-time SMTP handshakes (pinging mail servers without sending actual emails), MX record analysis, syntax checking, and catch-all validation. This keeps your bounce rates under 1%.",
    },
    {
      title: "Can I connect multiple Google Workspace or Outlook accounts?",
      content: "Absolutely. ProspectOS supports unlimited connected mailboxes via OAuth for Google and Outlook, as well as direct SMTP/IMAP configurations for other custom mail servers. We automatically rotate sending across connected accounts to protect sender reputation.",
    },
    {
      title: "Is there a limit to the number of sending domains?",
      content: "No. You can add as many sending domains and inboxes as you'd like on any plan. We encourage domain rotation (spreading outreach across multiple domains) to maintain optimal inbox placements and keep campaigns running safely.",
    },
    {
      title: "Is ProspectOS compliant with data protection laws like GDPR?",
      content: "Yes, ProspectOS is fully GDPR and CCPA compliant. We only scrape and aggregate public B2B business profiles. Every email sequence includes automated unsubscribe triggers and headers, allowing prospects to opt out instantly.",
    },
    {
      title: "Can I import list databases from external tools?",
      content: "Yes, you can import CSV files containing leads from tools like Apollo, Clay, or CSV databases directly. Our system will automatically clean and enrichment-check the lists before launching campaigns.",
    },
  ];

  return (
    <section id="faq" className="py-24 bg-[#F7F7F8] relative">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* FAQ Header Column */}
          <div className="space-y-4">
            <Badge variant="accent">Common Questions</Badge>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm md:text-base text-gray-500 leading-relaxed">
              Have questions about email rotations, integrations, or billing? Reach out to our 24/7 team in chat if you don't find answers here.
            </p>
          </div>

          {/* FAQ Accordion Column (Spans 2 columns) */}
          <div className="md:col-span-2">
            <Accordion items={faqs} />
          </div>
        </div>
      </div>
    </section>
  );
}
