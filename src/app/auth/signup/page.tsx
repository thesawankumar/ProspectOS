"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { useProspectStore } from "@/lib/store";
import { ArrowRight } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const setSession = useProspectStore((state) => state.setSession);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setSession({ email, name });
      toast({
        title: "Registration Successful 🎉",
        description: "Let's personalize your ProspectOS outreach workspace.",
        variant: "success",
      });
      router.push("/onboarding");
    }, 1200);
  };

  const handleOAuth = (provider: string) => {
    toast({
      title: `Connecting ${provider}...`,
      description: "Redirecting to OAuth authentication portal.",
      variant: "info",
    });
    setTimeout(() => {
      setSession({ email: `new${provider.toLowerCase()}@prospectos.com`, name: `${provider} Client` });
      toast({
        title: "Account Created!",
        description: "Moving to onboarding wizard.",
        variant: "success",
      });
      router.push("/onboarding");
    }, 1000);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-50/50 px-6 py-12 overflow-hidden">
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[300px] h-[300px] bg-radial-gradient from-[#F4B6C2]/15 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 translate-x-1/2 w-[300px] h-[300px] bg-radial-gradient from-[#EC9EB2]/10 to-transparent blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8 space-y-2">
          <a href="/" className="inline-flex items-center space-x-2.5">
            <div className="h-9 w-9 rounded-xl bg-[#F4B6C2] flex items-center justify-center">
              <span className="font-extrabold text-base text-gray-900">P</span>
            </div>
            <span className="font-bold text-xl text-gray-900 tracking-tight">
              Prospect<span className="text-[#EC9EB2]">OS</span>
            </span>
          </a>
          <h2 className="text-xl font-bold text-gray-800 tracking-tight pt-2">Create Workspace</h2>
          <p className="text-xs text-gray-400">Get started with your 14-day free trial</p>
        </div>

        <GlassCard hoverEffect="none" interactive={false} className="border-gray-200/80 shadow-xl bg-white/80 p-6 md:p-8">
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">
                Full Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Alex Rivera"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">
                Work Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="alex@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <Button type="submit" variant="primary" className="w-full justify-center group" isLoading={isLoading}>
              <span>Get Started</span>
              <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-gray-100" />
            <span className="relative bg-white px-3 text-3xs font-semibold text-gray-400 uppercase tracking-widest select-none">
              Or Sign Up with
            </span>
          </div>

          {/* Social OAuth Buttons */}
          <div className="grid grid-cols-3 gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleOAuth("Google")}
              className="py-2.5 flex items-center justify-center border-gray-200 hover:bg-gray-50 rounded-full cursor-pointer text-xs"
              aria-label="Sign up with Google"
            >
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleOAuth("GitHub")}
              className="py-2.5 flex items-center justify-center border-gray-200 hover:bg-gray-50 rounded-full cursor-pointer text-xs"
              aria-label="Sign up with GitHub"
            >
              GitHub
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleOAuth("Microsoft")}
              className="py-2.5 flex items-center justify-center border-gray-200 hover:bg-gray-50 rounded-full cursor-pointer text-xs"
              aria-label="Sign up with Microsoft"
            >
              Office
            </Button>
          </div>
        </GlassCard>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6 font-medium">
          Already have an account?{" "}
          <a href="/auth/login" className="text-[#D84B68] font-bold hover:text-[#EC9EB2]">
            Log In
          </a>
        </p>
      </motion.div>
    </div>
  );
}
