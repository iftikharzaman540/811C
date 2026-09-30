const fs = require('fs');
let code = fs.readFileSync('src/components/Footer.tsx', 'utf8');

// 1. Footer wrapper: pt-8 pb-24 -> pt-6 pb-20
code = code.replace(
  'className="w-full bg-[#111] border-t border-neutral-800 pt-8 pb-24 px-4 text-neutral-400"',
  'className="w-full bg-[#111] border-t border-neutral-800 pt-6 pb-[80px] px-4 text-neutral-400"'
);

// 2. Grid spacing: mb-10 -> mb-6
code = code.replace(
  'className="grid grid-cols-3 gap-2 mb-10 text-[13px] text-[#888] font-medium leading-relaxed"',
  'className="grid grid-cols-3 gap-2 mb-6 text-[12px] text-[#888] font-medium leading-relaxed"'
);

// 3. Contact Us section: mb-6 pt-6 -> mb-5 pt-5
code = code.replace(
  'className="mb-6 border-t border-neutral-800 pt-6"',
  'className="mb-5 border-t border-neutral-800 pt-4"'
);

// 4. Contact Us / Official Channel h4 margins
code = code.replace(
  /className="text-white text-sm mb-4"/g,
  'className="text-white text-[13px] mb-3 font-semibold"'
);

// 5. Official Channel margin: mb-8 -> mb-5
code = code.replace(
  'className="mb-8"',
  'className="mb-5"'
);

// 6. Social icons sizes: w-10 h-10 -> w-8 h-8, inner icons w-5 h-5 -> w-4 h-4
code = code.replace(/w-10 h-10/g, 'w-[34px] h-[34px]');
code = code.replace(/w-5 h-5/g, 'w-4 h-4');

// 7. Gap between icons: gap-4 -> gap-3
code = code.replace(
  /className="flex gap-4"/g,
  'className="flex flex-wrap gap-2.5"'
);

// 8. Licensing info section: mb-6 pt-6 -> mb-4 pt-4
code = code.replace(
  'className="text-[10px] text-neutral-500 text-center leading-relaxed mb-6 border-t border-neutral-800 pt-6"',
  'className="text-[10px] text-neutral-500 text-center leading-snug mb-4 border-t border-neutral-800 pt-4"'
);

fs.writeFileSync('src/components/Footer.tsx', code);
