"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Workflow", href: "#workflow" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-40 transition-all duration-300 px-4 md:px-8",
        scrolled ? "top-4" : "top-0"
      )}
    >
      <nav
        className={cn(
          "mx-auto max-w-7xl transition-all duration-300",
          scrolled
            ? "glass-nav rounded-full px-6 py-3 shadow-lg shadow-gray-200/10 border border-white/80"
            : "bg-transparent py-6 border-b border-transparent"
        )}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center space-x-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-[#F4B6C2] flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
              <span className="font-extrabold text-base text-gray-900 leading-none">P</span>
            </div>
            <span className="font-bold text-lg md:text-xl tracking-tight text-gray-900">
              Prospect<span className="text-[#EC9EB2]">OS</span>
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={() =>
                toast({
                  title: "Book a Demo",
                  description: "Calendar interface is opening in a new tab.",
                  variant: "info",
                })
              }
              className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2 cursor-pointer focus:outline-hidden"
            >
              Book Demo
            </button>
            <Button
              onClick={() =>
                toast({
                  title: "Redirecting...",
                  description: "Launching the ProspectOS sign up dashboard.",
                  variant: "success",
                })
              }
              variant="primary"
              size="sm"
              className="group"
            >
              <span>Start Free</span>
              <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors focus:outline-hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[76px] z-30 md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 flex flex-col p-6 animate-fade-in">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-semibold text-gray-800 hover:text-gray-900"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="mt-auto flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                toast({
                  title: "Book a Demo",
                  description: "Contact calendar loading.",
                  variant: "info",
                });
              }}
              className="w-full text-center py-3 font-semibold text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
            >
              Book Demo
            </button>
            <Button
              onClick={() => {
                setMobileMenuOpen(false);
                toast({
                  title: "Starting Trial",
                  description: "Loading sign up form.",
                  variant: "success",
                });
              }}
              variant="primary"
              className="w-full"
            >
              Start Free
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
