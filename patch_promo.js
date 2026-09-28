const fs = require('fs');
let code = fs.readFileSync('src/app/promo/page.tsx', 'utf8');

// 1. History sidebar button
code = code.replace(
  /<button className="flex items-center justify-center gap-1 py-1\.5 border border-\[#ff0b0b\] text-\[#ffdf00\] rounded text-\[10px\] font-bold hover:bg-\[#2e0505\]">\s*<History className="w-3 h-3" \/> History\s*<\/button>/g,
  '<button onClick={() => setActiveTopTab("History")} className="flex items-center justify-center gap-1 py-1.5 border border-[#ff0b0b] text-[#ffdf00] rounded text-[10px] font-bold hover:bg-[#2e0505]"><History className="w-3 h-3" /> History</button>'
);

// 2. Refresh rewards sidebar button
code = code.replace(
  /<button className="flex items-center justify-center gap-1 py-1\.5 border border-\[#ff0b0b\] text-\[#ffdf00\] rounded text-\[10px\] font-bold leading-tight hover:bg-\[#2e0505\]">\s*<RefreshCw className="w-3 h-3 shrink-0" \/> <span className="text-left">Refresh<br\/>rewards<\/span>\s*<\/button>/g,
  '<button onClick={() => toast.success("Rewards refreshed")} className="flex items-center justify-center gap-1 py-1.5 border border-[#ff0b0b] text-[#ffdf00] rounded text-[10px] font-bold leading-tight hover:bg-[#2e0505]"><RefreshCw className="w-3 h-3 shrink-0" /> <span className="text-left">Refresh<br/>rewards</span></button>'
);

// 3. Redeem Paste
code = code.replace(
  /<button className="text-\[#cc0000\] font-bold text-\[13px\] px-3 border-l border-neutral-200">Paste<\/button>/g,
  '<button onClick={() => toast.success("Pasted from clipboard")} className="text-[#cc0000] font-bold text-[13px] px-3 border-l border-neutral-200">Paste</button>'
);

// 4. Redeem Bonus action
code = code.replace(
  /<button className="w-full bg-\[#111\] text-white font-bold text-\[15px\] py-3\.5 rounded-lg shadow-lg hover:bg-\[#333\] transition-colors mb-4">Redeem Bonus<\/button>/g,
  '<button onClick={() => toast.error("Invalid redeem code")} className="w-full bg-[#111] text-white font-bold text-[15px] py-3.5 rounded-lg shadow-lg hover:bg-[#333] transition-colors mb-4">Redeem Bonus</button>'
);

// 5. Event Rules
code = code.replace(
  /<button className="text-\[#cc0000\] text-\[12px\] font-bold hover:underline">Event Rules<\/button>/g,
  '<button onClick={() => toast("Opening rules...")} className="text-[#cc0000] text-[12px] font-bold hover:underline">Event Rules</button>'
);

// 6. Refresh icons (Rebate, Unclaimed, etc.)
code = code.replace(
  /<RefreshCw className="w-4 h-4 text-\[#ffdf00\]" \/>/g,
  '<RefreshCw onClick={() => toast.success("Refreshed")} className="w-4 h-4 text-[#ffdf00] cursor-pointer" />'
);
code = code.replace(
  /<RefreshCw className="w-4 h-4 text-\[#0066cc\]" \/>/g,
  '<RefreshCw onClick={() => toast.success("Rebate data synchronized")} className="w-4 h-4 text-[#0066cc] cursor-pointer" />'
);
code = code.replace(
  /<RefreshCw className="w-4 h-4 text-\[#ff0b0b\]" \/>/g,
  '<RefreshCw onClick={() => toast.success("Lucky points updated")} className="w-4 h-4 text-[#ff0b0b] cursor-pointer" />'
);

// 7. "More" / "Read More" in history
code = code.replace(
  /<span className="text-\[#ffdf00\] font-medium text-\[13px\]">More<\/span>/g,
  '<span onClick={() => toast("Loading more history...")} className="text-[#ffdf00] font-medium text-[13px] cursor-pointer">More</span>'
);
code = code.replace(
  /<span className="text-\[#cc0000\] font-medium">Read More<\/span>/g,
  '<span onClick={() => toast("No more records")} className="text-[#cc0000] font-medium cursor-pointer">Read More</span>'
);

// 8. ChevronRight for Rebate
code = code.replace(
  /<ChevronRight className="w-3 h-3 text-\[#4a2e00\]\/40" \/>/g,
  '<ChevronRight className="w-3 h-3 text-[#4a2e00]/40 cursor-pointer" onClick={() => toast("View details")} />'
);

// 9. "Details" in Mission
code = code.replace(
  /<button className="text-\[#ff0b0b\] font-medium text-\[13px\]">Details<\/button>/g,
  '<button onClick={() => toast("Loading details...")} className="text-[#ff0b0b] font-medium text-[13px]">Details</button>'
);

// 10. Refresh text button in Mission
code = code.replace(
  /<button className="flex items-center gap-1 text-\[#ff0b0b\] text-\[12px\] font-medium"><RefreshCw className="w-3 h-3" \/> Refresh<\/button>/g,
  '<button onClick={() => toast.success("Missions refreshed")} className="flex items-center gap-1 text-[#ff0b0b] text-[12px] font-medium"><RefreshCw className="w-3 h-3" /> Refresh</button>'
);

// 11. "Go" button for Mission
code = code.replace(
  /<button className="bg-gradient-to-b from-\[#cc0000\] to-\[#ff0b0b\] text-white font-bold px-8 py-2 rounded shadow-lg text-\[13px\] hover:brightness-110">Go<\/button>/g,
  '<button onClick={() => toast("Redirecting to mission...")} className="bg-gradient-to-b from-[#cc0000] to-[#ff0b0b] text-white font-bold px-8 py-2 rounded shadow-lg text-[13px] hover:brightness-110">Go</button>'
);

// 12. "GO" button for Spins valid bets
code = code.replace(
  /<button className="bg-gradient-to-r from-\[#cc0000\] to-\[#ff0b0b\] text-white font-bold text-\[12px\] px-4 py-1\.5 rounded shadow-lg border border-red-500">GO<\/button>/g,
  '<button onClick={() => window.location.href="/deposit"} className="bg-gradient-to-r from-[#cc0000] to-[#ff0b0b] text-white font-bold text-[12px] px-4 py-1.5 rounded shadow-lg border border-red-500">GO</button>'
);

// 13. "Go to bet" in VIP
code = code.replace(
  /<button className="bg-gradient-to-b from-\[#cc0000\] to-\[#ff0b0b\] text-white text-\[11px\] font-bold px-4 py-1\.5 rounded hover:brightness-110">Go to bet<\/button>/g,
  '<button onClick={() => window.location.href="/"} className="bg-gradient-to-b from-[#cc0000] to-[#ff0b0b] text-white text-[11px] font-bold px-4 py-1.5 rounded hover:brightness-110">Go to bet</button>'
);

// 14. Center Draw Button in Spins
code = code.replace(
  /<div className="w-20 h-20 bg-gradient-to-br from-\[#2e0505\] to-\[#111\] rounded-full z-10 flex flex-col items-center justify-center border-4 border-\[#ffdf00\] shadow-\[0_0_20px_rgba\(255,223,0,0\.5\)\] cursor-pointer hover:scale-105 transition-transform">/g,
  '<div onClick={() => toast.error("Insufficient lucky points to spin")} className="w-20 h-20 bg-gradient-to-br from-[#2e0505] to-[#111] rounded-full z-10 flex flex-col items-center justify-center border-4 border-[#ffdf00] shadow-[0_0_20px_rgba(255,223,0,0.5)] cursor-pointer hover:scale-105 transition-transform">'
);

// 15. "View all" in VIP
code = code.replace(
  /<span className="text-\[#cc0000\] font-medium cursor-pointer">View all<\/span>/g,
  '<span onClick={() => toast("Loading VIP details...")} className="text-[#cc0000] font-medium cursor-pointer">View all</span>'
);

// 16. Deposit & Withdraw buttons in Fund tab
code = code.replace(
  /<button className="bg-gradient-to-r from-\[#ffdf00\] to-\[#ffaa00\] text-\[#4a2e00\] font-bold text-\[12px\] px-6 py-1 rounded shadow-md">Deposit<\/button>/g,
  '<button onClick={() => window.location.href="/deposit"} className="bg-gradient-to-r from-[#ffdf00] to-[#ffaa00] text-[#4a2e00] font-bold text-[12px] px-6 py-1 rounded shadow-md">Deposit</button>'
);
code = code.replace(
  /<button className="bg-neutral-600 text-neutral-300 font-bold text-\[12px\] px-6 py-1 rounded shadow-md">Withdraw<\/button>/g,
  '<button onClick={() => window.location.href="/withdraw"} className="bg-neutral-600 text-neutral-300 font-bold text-[12px] px-6 py-1 rounded shadow-md">Withdraw</button>'
);

// Ensure toast is imported
if (!code.includes('import toast from')) {
  code = code.replace('import { ChevronLeft', 'import toast from "react-hot-toast";\nimport { ChevronLeft');
}

fs.writeFileSync('src/app/promo/page.tsx', code);
