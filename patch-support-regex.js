const fs = require('fs');
let code = fs.readFileSync('src/app/support/page.tsx', 'utf8');

// Add toast import if missing
if (!code.includes('import toast from "react-hot-toast";')) {
  code = code.replace(/import \{ Search, /g, 'import toast from "react-hot-toast";\\nimport { Search, ');
}

// Top Buttons
code = code.replace(/<button className="flex-1 border border-\[\#ff0b0b\] text-\[\#ffdf00\] rounded-lg py-2\.5 text-\[12px\] font-medium hover:bg-\[\#2e0505\] transition-colors">\s*Customer Service\s*<\/button>/, `<button onClick={() => window.open('https://t.me/Game8111c', '_blank')} className="flex-1 border border-[#ff0b0b] text-[#ffdf00] rounded-lg py-2.5 text-[12px] font-medium hover:bg-[#2e0505] transition-colors shadow-[0_0_10px_rgba(255,11,11,0.2)]">Customer Service</button>`);

code = code.replace(/<button className="flex-1 border border-\[\#ff0b0b\] text-\[\#ffdf00\] rounded-lg py-2\.5 text-\[12px\] font-medium hover:bg-\[\#2e0505\] transition-colors">\s*Telegram CS\s*<\/button>/, `<button onClick={() => window.open('https://t.me/Game8111c', '_blank')} className="flex-1 border border-[#ff0b0b] text-[#ffdf00] rounded-lg py-2.5 text-[12px] font-medium hover:bg-[#2e0505] transition-colors shadow-[0_0_10px_rgba(255,11,11,0.2)]">Telegram CS</button>`);

// Help center buttons
code = code.replace(/<button className="shrink-0 flex items-center gap-1\.5 bg-\[\#cc0000\] border border-\[\#ff0b0b\] text-white text-\[12px\] font-bold px-3 py-1\.5 rounded shadow-md">\s*<Download className="w-3\.5 h-3\.5" \/> Download APP\s*<\/button>/, `<button onClick={() => toast.success('Starting APK download...')} className="shrink-0 flex items-center gap-1.5 bg-[#cc0000] border border-[#ff0b0b] text-white text-[12px] font-bold px-3 py-1.5 rounded shadow-md hover:scale-105 transition-transform"><Download className="w-3.5 h-3.5" /> Download APP</button>`);

code = code.replace(/<button className="shrink-0 flex items-center gap-1\.5 bg-\[\#141414\] border border-neutral-700 text-neutral-300 text-\[12px\] font-medium px-3 py-1\.5 rounded">\s*ðŸ¤  Proxy Problem\s*<\/button>/, `<button onClick={() => toast.success('Fetching Proxy FAQ...')} className="shrink-0 flex items-center gap-1.5 bg-[#141414] border border-neutral-700 text-neutral-300 hover:text-white text-[12px] font-medium px-3 py-1.5 rounded hover:border-[#ffdf00] transition-colors">ðŸ¤  Proxy Problem</button>`);

code = code.replace(/<button className="shrink-0 flex items-center gap-1\.5 bg-\[\#141414\] border border-neutral-700 text-neutral-300 text-\[12px\] font-medium px-3 py-1\.5 rounded">\s*ðŸ’³ Reload Que...\s*<\/button>/, `<button onClick={() => toast.success('Fetching Reload FAQ...')} className="shrink-0 flex items-center gap-1.5 bg-[#141414] border border-neutral-700 text-neutral-300 hover:text-white text-[12px] font-medium px-3 py-1.5 rounded hover:border-[#ffdf00] transition-colors">ðŸ’³ Reload Que...</button>`);

// APP installation steps
code = code.replace(/<button className="w-full flex justify-between items-center text-\[12px\] font-medium text-white hover:text-\[\#ffdf00\] transition-colors py-1">\s*<span>1\. APP installation steps<\/span>\s*<ChevronRight className="w-4 h-4 text-neutral-500" \/>\s*<\/button>/, `<button onClick={() => toast('1. Download APK\\n2. Enable Unknown Sources\\n3. Install & Play', { icon: 'ðŸ“±', style: { background: '#333', color: '#fff'} })} className="w-full flex justify-between items-center text-[12px] font-medium text-white hover:text-[#ffdf00] transition-colors py-1"><span>1. APP installation steps</span><ChevronRight className="w-4 h-4 text-neutral-500" /></button>`);

fs.writeFileSync('src/app/support/page.tsx', code);
console.log("Updated support page with regex");
