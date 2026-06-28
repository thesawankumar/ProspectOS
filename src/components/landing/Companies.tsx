"use client";

import React from "react";

export default function Companies() {
  // SVG Text based logos for clean rendering without images
  const brands = [
    { name: "Stripe", class: "font-semibold tracking-tight text-[#635BFF]" },
    { name: "Linear", class: "font-medium tracking-wide text-gray-800" },
    { name: "Vercel", class: "font-black tracking-widest text-black" },
    { name: "Notion", class: "font-serif font-extrabold text-gray-800" },
    { name: "Slack", class: "font-bold tracking-tight text-[#4A154B]" },
    { name: "Apollo", class: "font-sans font-bold text-gray-700" },
  ];

  return (
    <section className="py-12 bg-white overflow-hidden border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-gray-400 mb-8">
          Trusted by top growth teams at fast-growing companies
        </p>
        
        {/* Marquee Wrapper */}
        <div className="relative w-full flex items-center overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          
          <div className="flex space-x-16 animate-marquee whitespace-nowrap">
            {/* Duplicated list to create loop effect */}
            {[...brands, ...brands, ...brands, ...brands].map((brand, idx) => (
              <div
                key={idx}
                className="flex items-center space-x-2 text-xl md:text-2xl font-bold text-gray-300 select-none grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-300"
              >
                <span className={brand.class}>{brand.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
