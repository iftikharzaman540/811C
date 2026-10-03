"use client";

import React from "react";
import { usePathname } from "next/navigation";

export default function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  if (pathname && pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col items-center justify-start w-full min-h-screen bg-[#000]">
      <div className="w-full max-w-[400px] min-h-screen bg-[#0a0a0a] relative shadow-[0_0_50px_rgba(255,223,0,0.05)] flex flex-col border-x border-neutral-900 overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
