const fs = require('fs');
let code = fs.readFileSync('src/app/support/page.tsx', 'utf8');

// Add toast import
if (!code.includes('import toast')) {
  code = code.replace('import { Search, ', 'import toast from "react-hot-toast";\\nimport { Search, ');
}

// 1. Update the top buttons
const oldTopButtons = `<div className="flex gap-3">
                  <button className="flex-1 border border-[#ff0b0b] text-[#ffdf00] rounded-lg py-2.5 text-[12px] font-medium hover:bg-[#2e0505] transition-colors">
                    Customer Service
                  </button>
                  <button className="flex-1 border border-[#ff0b0b] text-[#ffdf00] rounded-lg py-2.5 text-[12px] font-medium hover:bg-[#2e0505] transition-colors">
                    Telegram CS
                  </button>
                </div>`;

const newTopButtons = `<div className="flex gap-3">
                  <button onClick={() => window.open('https://t.me/Game8111c', '_blank')} className="flex-1 border border-[#ff0b0b] text-[#ffdf00] rounded-lg py-2.5 text-[12px] font-medium hover:bg-[#2e0505] transition-colors shadow-[0_0_10px_rgba(255,11,11,0.2)]">
                    Customer Service
                  </button>
                  <button onClick={() => window.open('https://t.me/Game8111c', '_blank')} className="flex-1 border border-[#ff0b0b] text-[#ffdf00] rounded-lg py-2.5 text-[12px] font-medium hover:bg-[#2e0505] transition-colors shadow-[0_0_10px_rgba(255,11,11,0.2)]">
                    Telegram CS
                  </button>
                </div>`;
code = code.replace(oldTopButtons, newTopButtons);

// 2. Update Help Center buttons
const oldHelpButtons = `<button className="shrink-0 flex items-center gap-1.5 bg-[#cc0000] border border-[#ff0b0b] text-white text-[12px] font-bold px-3 py-1.5 rounded shadow-md">
                    <Download className="w-3.5 h-3.5" /> Download APP
                  </button>
                  <button className="shrink-0 flex items-center gap-1.5 bg-[#141414] border border-neutral-700 text-neutral-300 text-[12px] font-medium px-3 py-1.5 rounded">
                    ðŸ¤  Proxy Problem
                  </button>
                  <button className="shrink-0 flex items-center gap-1.5 bg-[#141414] border border-neutral-700 text-neutral-300 text-[12px] font-medium px-3 py-1.5 rounded">
                    ðŸ’³ Reload Que...
                  </button>`;

const newHelpButtons = `<button onClick={() => toast.success('Starting APK download...')} className="shrink-0 flex items-center gap-1.5 bg-[#cc0000] border border-[#ff0b0b] text-white text-[12px] font-bold px-3 py-1.5 rounded shadow-md hover:scale-105 transition-transform">
                    <Download className="w-3.5 h-3.5" /> Download APP
                  </button>
                  <button onClick={() => toast.success('Fetching Proxy FAQ...')} className="shrink-0 flex items-center gap-1.5 bg-[#141414] border border-neutral-700 text-neutral-300 hover:text-white text-[12px] font-medium px-3 py-1.5 rounded hover:border-[#ffdf00] transition-colors">
                    ðŸ¤  Proxy Problem
                  </button>
                  <button onClick={() => toast.success('Fetching Reload FAQ...')} className="shrink-0 flex items-center gap-1.5 bg-[#141414] border border-neutral-700 text-neutral-300 hover:text-white text-[12px] font-medium px-3 py-1.5 rounded hover:border-[#ffdf00] transition-colors">
                    ðŸ’³ Reload Que...
                  </button>`;
code = code.replace(oldHelpButtons, newHelpButtons);

// 3. Update installation steps button
const oldInstallButton = `<button className="w-full flex justify-between items-center text-[12px] font-medium text-white hover:text-[#ffdf00] transition-colors py-1">
                    <span>1. APP installation steps</span>
                    <ChevronRight className="w-4 h-4 text-neutral-500" />
                  </button>`;

const newInstallButton = `<button onClick={() => toast('1. Download APK\\n2. Enable Unknown Sources\\n3. Install & Play', { icon: 'ðŸ“±', style: { background: '#333', color: '#fff'} })} className="w-full flex justify-between items-center text-[12px] font-medium text-white hover:text-[#ffdf00] transition-colors py-1">
                    <span>1. APP installation steps</span>
                    <ChevronRight className="w-4 h-4 text-neutral-500" />
                  </button>`;
code = code.replace(oldInstallButton, newInstallButton);

// 4. Update the help center search input
const oldHelpSearch = `<input type="text" placeholder="Enter your question" className="bg-transparent border-none outline-none text-[11px] text-white w-full placeholder:text-neutral-500" />`;
const newHelpSearch = `<input type="text" onKeyDown={(e) => { if(e.key === 'Enter') { toast.success('Searching knowledge base...'); e.currentTarget.value = ''; } }} placeholder="Enter your question" className="bg-transparent border-none outline-none text-[11px] text-white w-full placeholder:text-neutral-500" />`;
code = code.replace(oldHelpSearch, newHelpSearch);

fs.writeFileSync('src/app/support/page.tsx', code);
console.log("Updated support page");
