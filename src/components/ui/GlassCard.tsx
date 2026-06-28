"use client";

import * as React from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: "lift" | "tilt" | "none";
  interactive?: boolean;
}

export function GlassCard({
  className,
  children,
  hoverEffect = "lift",
  interactive = true,
  ...props
}: GlassCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);

  // Motion values for the tilt effect
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  // Smooth springs to dampen the tilt rotations
  const rotateXSpring = useSpring(useTransform(y, [0, 1], [7, -7]), { stiffness: 150, damping: 20 });
  const rotateYSpring = useSpring(useTransform(x, [0, 1], [-7, 7]), { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (hoverEffect !== "tilt" || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Normalize coordinates from 0 to 1
    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeave = () => {
    if (hoverEffect !== "tilt") return;
    x.set(0.5);
    y.set(0.5);
  };

  const isTilt = hoverEffect === "tilt";

  const cardStyle = isTilt
    ? {
        rotateX: rotateXSpring,
        rotateY: rotateYSpring,
        transformStyle: "preserve-3d" as const,
      }
    : {};

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={cardStyle}
      whileHover={
        interactive && hoverEffect === "lift"
          ? { y: -6, boxShadow: "0 20px 40px -15px rgba(244, 182, 194, 0.15), 0 0 0 1px rgba(244, 182, 194, 0.2)" }
          : undefined
      }
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={cn(
        "glass-effect rounded-3xl p-6 md:p-8 transition-all duration-300 relative overflow-hidden bg-white/70",
        interactive && "hover:bg-white/90 hover:border-gray-300/80 cursor-pointer",
        className
      )}
      {...(props as any)}
    >
      {/* Background glow overlay */}
      <div className="absolute inset-0 bg-radial-gradient from-[#F4B6C2]/5 to-transparent pointer-events-none -z-10 opacity-0 hover:opacity-100 transition-opacity duration-500" />
      {children}
    </motion.div>
  );
}
