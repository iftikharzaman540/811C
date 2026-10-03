"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#111] pb-24 text-gray-300 font-sans">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-white/5 relative bg-[#1a1a1a]">
        <button onClick={() => router.back()} className="text-gray-400 p-1">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-white text-lg font-normal absolute left-1/2 -translate-x-1/2">About 8111c.com</h1>
      </div>

      <div className="p-5 max-w-lg mx-auto space-y-6 mt-4">
        
        <div className="flex flex-col items-center justify-center space-y-3 pb-4 border-b border-white/10">
          <ShieldCheck className="w-16 h-16 text-[#53f124]" />
          <h2 className="text-xl font-bold text-white tracking-wide">8111c.com</h2>
          <span className="text-xs font-semibold text-black bg-[#53f124] px-2 py-0.5 rounded-sm">V 1.0.0</span>
        </div>

        <div className="space-y-4 text-[14px] leading-relaxed text-gray-300 text-justify">
          <p>
            8111c.com strictly adheres to applicable laws and regulations, operating under an official government-issued license to ensure all services are delivered within a secure legal framework. We employ industry-standard SSL encryption technology to safeguard your data privacy and financial security, while integrating with verified local payment channels such as JazzCash and EasyPaisa for reliable transactions.
          </p>
          <p>
            The platform enforces a strict 18+ age verification policy, with transparent service terms and no hidden clauses. We provide English-speaking customer support and localized network infrastructure to deliver a smooth, user-focused entertainment experience.
          </p>
          <p>
            Choosing 8111c.com means choosing compliance, security, and a trusted entertainment experience.
          </p>
        </div>

      </div>
    </div>
  );
}
