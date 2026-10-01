"use client";
import React from 'react';
import { Settings } from 'lucide-react';

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="p-6 bg-[#111] rounded-2xl border border-neutral-800 flex flex-col items-center max-w-md">
        <Settings className="w-12 h-12 text-[#ffdf00] mb-4 animate-[spin_4s_linear_infinite]" />
        <h1 className="text-2xl font-bold text-white mb-2">Module Coming Soon</h1>
        <p className="text-neutral-400">This module is scheduled for Phase 5 deployment. The backend schema is ready, but the UI is currently being finalized.</p>
      </div>
    </div>
  );
}