"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Star, ShieldCheck } from "lucide-react";

export default function Testimonials() {
  const reviews = [
    {
      name: "Marcus Vance",
      role: "Founder, ScaleAgency",
      avatar: "MV",
      stat: "42 meetings booked",
      text: "Before ProspectOS, we were paying for Apollo, Instantly, and a custom validation tool. Moving everything here cut our costs by 60% and doubled our meeting booking rates in the first 30 days.",
    },
    {
      name: "Elena Rostova",
      role: "VP Growth, SaaSFlow",
      avatar: "ER",
      stat: "3.2x ROI in 3 weeks",
      text: "The AI personalizer is next-level. Our response rates shot up from 2% to 8.4% after using ProspectOS's custom introductory line generator. Absolute game-changer.",
    },
    {
      name: "Jordan Bell",
      role: "Co-Founder, GrowthStack",
      avatar: "JB",
      stat: "Sub-1% Bounce Rate",
      text: "Email deliverability was our biggest bottleneck. With the built-in multi-step verifier, we have had zero bounced campaigns. Setting up domains takes minutes.",
    },
  ];

  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge variant="success">User Reviews</Badge>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
            Loved by Modern B2B Growth Teams
          </h2>
          <p className="text-sm md:text-lg text-gray-500">
            See how freelancers, agencies, and enterprise sales teams scale their client acquisition pipeline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <GlassCard
              key={idx}
              hoverEffect="lift"
              className="flex flex-col justify-between p-8 bg-white border border-gray-200/60 shadow-xs relative"
            >
              {/* Star Rating & Stat */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#F4B6C2] text-[#F4B6C2]" />
                  ))}
                </div>
                <span className="text-xs font-bold text-[#D84B68] bg-[#FCE7EB] px-2.5 py-0.5 rounded-full">
                  {rev.stat}
                </span>
              </div>

              {/* Text */}
              <p className="text-sm md:text-base text-gray-600 leading-relaxed italic mb-8">
                "{rev.text}"
              </p>

              {/* Profile info */}
              <div className="flex items-center space-x-3.5 border-t border-gray-100 pt-5">
                <div className="h-10 w-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center font-bold text-xs text-gray-700 select-none">
                  {rev.avatar}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1">
                    {rev.name}
                    <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
                  </h4>
                  <p className="text-xs text-gray-400 font-semibold">{rev.role}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
