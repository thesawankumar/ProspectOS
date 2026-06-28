"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Send, Bot, User, Sparkles, Zap, ChevronRight,
  Loader2, RotateCcw, Copy, Check
} from "lucide-react";
import type { AIChatMessage } from "@/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_CHIPS = [
  { label: "Show today's replies", icon: "📬" },
  { label: "Find top leads", icon: "🏆" },
  { label: "Generate proposal", icon: "📄" },
  { label: "Launch campaign", icon: "🚀" },
  { label: "Create invoice", icon: "💳" },
  { label: "Analyze website", icon: "🔍" },
];

export default function AIChatPanel({ isOpen, onClose }: Props) {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm your **ProspectOS AI Assistant** 👋\n\nI can help you find leads, generate emails and proposals, launch campaigns, analyze websites, and much more.\n\nWhat would you like to do today?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg: AIChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/v1/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: messages.slice(-6), // send last 6 for context
        }),
      });

      if (!res.ok) throw new Error("API error");
      const { data } = await res.json();

      const assistantMsg: AIChatMessage = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: data.response,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // Handle navigation actions
      if (data.action?.type === "navigate" && data.action.payload?.href) {
        setTimeout(() => {
          window.location.href = data.action.payload.href as string;
        }, 1500);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleCopy = async (id: string, content: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome-reset",
        role: "assistant",
        content: "Chat cleared. How can I help you?",
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const renderContent = (content: string) => {
    // Simple markdown-like rendering
    return content
      .split("\n")
      .map((line, i) => {
        // Bold **text**
        const formatted = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        // Bullet points
        if (line.startsWith("•") || line.startsWith("-") || /^\d+\./.test(line)) {
          return (
            <p
              key={i}
              className="pl-2 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: formatted }}
            />
          );
        }
        if (line.startsWith("#")) {
          return (
            <p
              key={i}
              className="font-bold text-sm mt-1"
              dangerouslySetInnerHTML={{ __html: formatted.replace(/^#+\s/, "") }}
            />
          );
        }
        if (!line.trim()) return <br key={i} />;
        return (
          <p
            key={i}
            className="text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatted }}
          />
        );
      });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 h-screen w-[420px] max-w-[95vw] bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-[#D84B68]/5 to-[#FF6B6B]/5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D84B68] to-[#FF6B6B] flex items-center justify-center shadow-sm">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-sm text-gray-900">AI Assistant</h2>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-2xs text-gray-400 font-medium">Gemini 2.5 Pro · Online</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={clearChat}
                  title="Clear chat"
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold ${
                        msg.role === "assistant"
                          ? "bg-gradient-to-br from-[#D84B68] to-[#FF6B6B]"
                          : "bg-gray-800"
                      }`}
                    >
                      {msg.role === "assistant" ? (
                        <Sparkles className="h-3.5 w-3.5" />
                      ) : (
                        <User className="h-3.5 w-3.5" />
                      )}
                    </div>

                    {/* Bubble */}
                    <div
                      className={`group relative max-w-[82%] rounded-2xl px-4 py-3 ${
                        msg.role === "user"
                          ? "bg-gray-900 text-white"
                          : "bg-gray-50 border border-gray-100 text-gray-800"
                      }`}
                    >
                      <div className="space-y-0.5">{renderContent(msg.content)}</div>

                      {/* Copy button */}
                      {msg.role === "assistant" && (
                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="absolute -bottom-7 left-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-2xs text-gray-400 hover:text-gray-600 cursor-pointer"
                        >
                          {copiedId === msg.id ? (
                            <><Check className="h-3 w-3 text-emerald-500" /><span className="text-emerald-500">Copied</span></>
                          ) : (
                            <><Copy className="h-3 w-3" />Copy</>
                          )}
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Loading bubble */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2.5"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#D84B68] to-[#FF6B6B] flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Quick chips */}
            {messages.length === 1 && (
              <div className="px-4 pb-3">
                <p className="text-2xs text-gray-400 font-semibold mb-2 uppercase tracking-wider">Quick Actions</p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_CHIPS.map((chip) => (
                    <button
                      key={chip.label}
                      onClick={() => sendMessage(chip.label)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-2xs font-semibold text-gray-700 hover:bg-gray-100 hover:border-[#D84B68]/30 transition-colors cursor-pointer"
                    >
                      <span>{chip.icon}</span>
                      <span>{chip.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input area */}
            <div className="px-4 pb-4 pt-2 border-t border-gray-100">
              <div className="flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-[#D84B68]/40 focus-within:ring-2 focus-within:ring-[#D84B68]/10 transition-all">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything..."
                  rows={1}
                  style={{ resize: "none", minHeight: "24px", maxHeight: "120px" }}
                  className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none focus:outline-none font-medium leading-relaxed"
                  onInput={(e) => {
                    const t = e.currentTarget;
                    t.style.height = "auto";
                    t.style.height = Math.min(t.scrollHeight, 120) + "px";
                  }}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isLoading}
                  className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-[#D84B68] to-[#FF6B6B] flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md transition-all cursor-pointer"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
              <p className="text-2xs text-gray-400 text-center mt-2 font-medium">
                Press Enter to send · Shift+Enter for new line
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
