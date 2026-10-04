const fs = require('fs');
let code = fs.readFileSync('src/app/invite/page.tsx', 'utf8');

// 1. Add toast import
if (!code.includes('import toast from')) {
  code = code.replace('import { ChevronLeft', 'import toast from "react-hot-toast";\nimport { ChevronLeft');
}

// 2. Fix Home / Promo Share Save Button
code = code.replace(
  /<button className="w-full bg-\[#cc0000\] text-white text-\[10px\] font-bold py-1\.5 rounded text-center leading-tight shadow-md hover:bg-\[#ff0b0b\]">/g,
  '<button onClick={() => toast.success("Invitation saved to gallery!")} className="w-full bg-[#cc0000] text-white text-[10px] font-bold py-1.5 rounded text-center leading-tight shadow-md hover:bg-[#ff0b0b]">'
);
code = code.replace(
  /<button className="w-full bg-\[#cc0000\] text-white text-\[9px\] font-bold py-1\.5 rounded text-center leading-tight shadow-md">/g,
  '<button onClick={() => toast.success("Invitation saved to gallery!")} className="w-full bg-[#cc0000] text-white text-[9px] font-bold py-1.5 rounded text-center leading-tight shadow-md hover:bg-[#ff0b0b]">'
);

// 3. Fix Copy Link
code = code.replace(
  /<Copy className="w-4 h-4 text-\[#ffdf00\] cursor-pointer" \/>/g,
  '<Copy onClick={() => { navigator.clipboard.writeText("https://8111C.com/invite"); toast.success("Link copied!"); }} className="w-4 h-4 text-[#ffdf00] cursor-pointer" />'
);

// 4. Fix Social Shares
code = code.replace(
  /<div className="flex flex-col items-center gap-1 cursor-pointer">\s*<div className="w-9 h-9/g,
  '<div onClick={() => navigator.share ? navigator.share({title: "Join 8111C", url: "https://8111C.com/invite"}) : toast.success("Opening share dialog...")} className="flex flex-col items-center gap-1 cursor-pointer">\n                        <div className="w-9 h-9'
);
code = code.replace(
  /<div className="flex flex-col items-center gap-1 cursor-pointer">\s*<div className="w-8 h-8/g,
  '<div onClick={() => navigator.share ? navigator.share({title: "Join 8111C", url: "https://8111C.com/invite"}) : toast.success("Opening share dialog...")} className="flex flex-col items-center gap-1 cursor-pointer">\n                        <div className="w-8 h-8'
);

code = code.replace(
  /<div className="flex flex-col items-center gap-1 cursor-pointer">\s*<img src="https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/6\/6b\/WhatsApp\.svg/g,
  '<div onClick={() => window.open("https://wa.me/?text=Join%20me%20on%208111C!%20https://8111C.com/invite", "_blank")} className="flex flex-col items-center gap-1 cursor-pointer">\n                        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg'
);
code = code.replace(
  /<div className="flex flex-col items-center gap-1 cursor-pointer">\s*<img src="https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/8\/82\/Telegram_logo\.svg/g,
  '<div onClick={() => window.open("https://t.me/share/url?url=https://8111C.com/invite&text=Join%20me!", "_blank")} className="flex flex-col items-center gap-1 cursor-pointer">\n                        <img src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg'
);
code = code.replace(
  /<div className="flex flex-col items-center gap-1 cursor-pointer">\s*<img src="https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/b\/b8\/2021_Facebook_icon\.svg/g,
  '<div onClick={() => window.open("https://www.facebook.com/sharer/sharer.php?u=https://8111C.com/invite", "_blank")} className="flex flex-col items-center gap-1 cursor-pointer">\n                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg'
);

// 5. Commission Rate Button
code = code.replace(
  /<button className="w-full bg-gradient-to-r from-\[#ffaa00\] to-\[#ffdf00\] text-\[#4a2e00\] font-black text-\[15px\] py-4 rounded-xl flex items-center justify-between px-4 shadow-\[0_4px_15px_rgba\(255,223,0,0\.3\)\] hover:scale-\[0\.98\] transition-transform">/g,
  '<button onClick={() => setActiveTab("Commission Rate")} className="w-full bg-gradient-to-r from-[#ffaa00] to-[#ffdf00] text-[#4a2e00] font-black text-[15px] py-4 rounded-xl flex items-center justify-between px-4 shadow-[0_4px_15px_rgba(255,223,0,0.3)] hover:scale-[0.98] transition-transform">'
);

// 6. Header Commission sim
code = code.replace(
  /<button className="absolute right-4 text-\[#ff0b0b\] text-\[10px\] leading-tight text-right flex flex-col font-medium">/g,
  '<button onClick={() => toast("Simulation calculator coming soon")} className="absolute right-4 text-[#ff0b0b] text-[10px] leading-tight text-right flex flex-col font-medium">'
);

// 7. Make all filter dropdown buttons click to show toast
// Subordinate Finance
code = code.replace(
  /<button className="border border-neutral-700 rounded-full px-3 py-1 flex items-center gap-1 text-neutral-300 text-\[11px\]">(\s*Sort by recharge\.\.\.\s*<ChevronLeft className="w-3 h-3 rotate-90" \/>\s*)<\/button>/g,
  '<button onClick={() => toast.success("Sorting applied")} className="border border-neutral-700 rounded-full px-3 py-1 flex items-center gap-1 text-neutral-300 text-[11px]">$1</button>'
);
code = code.replace(
  /<button className="border border-neutral-700 rounded-full px-3 py-1 flex items-center gap-1 text-neutral-300 text-\[11px\]">(\s*Sort by login date\s*<ChevronLeft className="w-3 h-3 rotate-90" \/>\s*)<\/button>/g,
  '<button onClick={() => toast.success("Sorting applied")} className="border border-neutral-700 rounded-full px-3 py-1 flex items-center gap-1 text-neutral-300 text-[11px]">$1</button>'
);
code = code.replace(
  /<button className="border border-neutral-700 rounded-full px-3 py-1 flex items-center gap-1 text-neutral-300 text-\[11px\]">(\s*Total collection o\.\.\.\s*<ChevronLeft className="w-3 h-3 rotate-90" \/>\s*)<\/button>/g,
  '<button onClick={() => toast.success("Sorting applied")} className="border border-neutral-700 rounded-full px-3 py-1 flex items-center gap-1 text-neutral-300 text-[11px]">$1</button>'
);

// Member ID search button
code = code.replace(
  /<button className="border border-neutral-700 rounded-full px-3 py-1 flex items-center justify-between flex-1 text-neutral-500 text-\[11px\]">(\s*Member ID\s*<span className="text-\[#ffdf00\]">.*?<\/span>\s*)<\/button>/g,
  '<button onClick={() => toast("Search feature coming soon")} className="border border-neutral-700 rounded-full px-3 py-1 flex items-center justify-between flex-1 text-neutral-500 text-[11px]">$1</button>'
);

// Valid bet sorting dropdown toggle
code = code.replace(
  /<button className="border border-\[#ffdf00\] rounded-full px-3 py-1 flex items-center gap-1 text-\[#ffdf00\] text-\[11px\] bg-\[#2e0505\]">(\s*Valid bet sorting\s*<ChevronLeft className="w-3 h-3 -rotate-90" \/>\s*)<\/button>/g,
  '<button onClick={() => toast.success("Dropdown opened")} className="border border-[#ffdf00] rounded-full px-3 py-1 flex items-center gap-1 text-[#ffdf00] text-[11px] bg-[#2e0505]">$1</button>'
);

fs.writeFileSync('src/app/invite/page.tsx', code);
