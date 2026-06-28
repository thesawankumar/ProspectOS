"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { Send } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast({
      title: "Subscribed successfully!",
      description: "Welcome to the ProspectOS dispatch. Check your inbox soon.",
      variant: "success",
    });
    setEmail("");
  };

  const footerLinks = [
    {
      title: "Product",
      links: [
        { label: "Search Leads", href: "#" },
        { label: "Enrichment API", href: "#" },
        { label: "Email Verifier", href: "#" },
        { label: "AI Sequencer", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Outreach Guide", href: "#" },
        { label: "SaaS Playbook", href: "#" },
        { label: "Help Center", href: "#" },
        { label: "API Reference", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Press Kit", href: "#" },
        { label: "Contact", href: "#" },
      ],
    },
  ];

  return (
    <footer className="bg-[#F7F7F8] border-t border-gray-200/80 pt-20 pb-12 px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-10 md:gap-8 pb-16">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-6">
            <a href="#" className="flex items-center space-x-2.5">
              <div className="h-8 w-8 rounded-lg bg-[#F4B6C2] flex items-center justify-center">
                <span className="font-extrabold text-sm text-gray-900">P</span>
              </div>
              <span className="font-bold text-lg text-gray-900 tracking-tight">
                Prospect<span className="text-[#EC9EB2]">OS</span>
              </span>
            </a>
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
              The smart outreach operating system. Find, verify, and close B2B clients at scale in a single premium workspace.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2.5 max-w-sm">
              <label htmlFor="newsletter-email" className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Subscribe to our newsletter
              </label>
              <div className="relative flex items-center">
                <Input
                  id="newsletter-email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pr-12"
                  required
                />
                <Button
                  type="submit"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 px-3 py-1.5 h-auto text-[#D84B68] hover:text-[#EC9EB2]"
                  aria-label="Submit subscribe email"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>

          {/* Links Columns */}
          {footerLinks.map((column) => (
            <div key={column.title} className="space-y-4">
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                {column.title}
              </h4>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-xs md:text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Legal Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#" className="text-xs md:text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-xs md:text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-xs md:text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  Security Details
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200/40 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400">
          <p>© {new Date().getFullYear()} ProspectOS Inc. All rights reserved.</p>
          <p className="mt-4 md:mt-0 flex items-center space-x-1">
            <span>Built for B2B Growth.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
