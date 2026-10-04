const fs = require('fs');
let code = fs.readFileSync('src/components/WithdrawScreen.tsx', 'utf8');

// Compact balance banner
code = code.replace(/<div className="bg-gradient-to-r from-neutral-800 to-neutral-900 rounded-xl p-4 mb-6 border border-neutral-700 shadow-lg">/, '<div className="bg-[#1a1a1a] rounded-lg p-3 mb-4 border border-neutral-800 shadow-sm">');
code = code.replace(/<h2 className="text-3xl font-black text-\[#ffdf00\]">/, '<h2 className="text-2xl font-black text-[#ffdf00]">');

// Compact headers
code = code.replace(/label className="text-sm font-medium text-neutral-300 block mb-2"/g, 'label className="text-xs font-medium text-neutral-400 block mb-1"');

// Compact method buttons
code = code.replace(/className={\`flex flex-col items-center justify-center py-3 rounded-lg border-2/g, 'className={`flex flex-col items-center justify-center py-2 rounded-lg border');
code = code.replace(/className="h-8 mb-1 object-contain rounded"/g, 'className="h-6 mb-1 object-contain rounded"');
code = code.replace(/<div className="h-6 mb-1 flex items-center justify-center text-white">/g, '<div className="h-5 mb-1 flex items-center justify-center text-white">');
code = code.replace(/width="24" height="24"/g, 'width="20" height="20"');

// Reduce mb-5 to mb-3
code = code.replace(/<div className="mb-5">/g, '<div className="mb-3">');

// Compact inputs
code = code.replace(/w-full bg-black border border-neutral-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-\[#ffdf00\]/g, 'w-full bg-black border border-neutral-800 rounded-lg py-2.5 px-3 text-white text-sm focus:outline-none focus:border-[#ffdf00]');

// Amount input special case
code = code.replace(/className="w-full bg-black border border-neutral-700 rounded-lg py-3 px-4 text-white font-bold text-lg focus:outline-none focus:border-\[#ffdf00\] placeholder:text-neutral-600 placeholder:font-normal"/, 'className="w-full bg-black border border-neutral-800 rounded-lg py-2.5 px-3 text-white text-sm font-bold focus:outline-none focus:border-[#ffdf00] placeholder:text-neutral-600 placeholder:font-normal"');

// Compact Submit button
code = code.replace(/className={\`w-full py-4 rounded-lg font-bold text-\[16px\] text-black/g, 'className={`w-full py-3 mt-2 rounded-lg font-bold text-[14px] text-black');

// Compact the info texts
code = code.replace(/<div className="mb-5 text-\[13px\] space-y-1\.5 font-medium">/, '<div className="mb-4 text-[11px] space-y-1.5 font-medium">');

fs.writeFileSync('src/components/WithdrawScreen.tsx', code);
console.log("Compacted WithdrawScreen layout!");
