import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "accent" | "success" | "warning" | "danger" | "neutral";
}

export function Badge({
  className,
  variant = "neutral",
  children,
  ...props
}: BadgeProps) {
  const baseStyles = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors pointer-events-none select-none";

  const variants = {
    accent: "bg-[#FCE7EB] text-[#D84B68]",
    success: "bg-green-50 text-green-700 border border-green-200/50",
    warning: "bg-amber-50 text-amber-700 border border-amber-200/50",
    danger: "bg-red-50 text-red-700 border border-red-200/50",
    neutral: "bg-gray-100 text-gray-600"
  };

  return (
    <div className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </div>
  );
}
