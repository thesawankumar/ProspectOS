"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: "success" | "warning" | "danger" | "info" | "default";
}

interface ToastContextType {
  toast: (props: Omit<Toast, "id">) => void;
  toasts: Toast[];
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(({ title, description, variant = "default" }: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, variant }]);
    
    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      dismiss(id);
    }, 4000);
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ toast, toasts, dismiss }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 w-full max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => {
            const icons = {
              success: <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />,
              warning: <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />,
              danger: <XCircle className="h-5 w-5 text-red-500 shrink-0" />,
              info: <Info className="h-5 w-5 text-blue-500 shrink-0" />,
              default: <Info className="h-5 w-5 text-gray-500 shrink-0" />
            };

            const styles = {
              success: "border-green-100 bg-white/95 text-gray-900 shadow-lg shadow-green-500/5",
              warning: "border-amber-100 bg-white/95 text-gray-900 shadow-lg shadow-amber-500/5",
              danger: "border-red-100 bg-white/95 text-gray-900 shadow-lg shadow-red-500/5",
              info: "border-blue-100 bg-white/95 text-gray-900 shadow-lg shadow-blue-500/5",
              default: "border-gray-100 bg-white/95 text-gray-900 shadow-lg shadow-gray-500/5"
            };

            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.15 } }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className={cn(
                  "pointer-events-auto flex items-start gap-3 w-full rounded-2xl border p-4 shadow-xl glass-effect",
                  styles[t.variant || "default"]
                )}
              >
                {icons[t.variant || "default"]}
                <div className="flex-1 space-y-1">
                  <h4 className="text-sm font-semibold leading-none">{t.title}</h4>
                  {t.description && (
                    <p className="text-xs text-gray-500 leading-normal">{t.description}</p>
                  )}
                </div>
                <button
                  onClick={() => dismiss(t.id)}
                  className="shrink-0 rounded-full p-0.5 hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
