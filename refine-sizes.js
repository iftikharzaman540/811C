const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

// 1. Quick Links
// mb-4 mt-1 -> mb-2 mt-0
code = code.replace(
  'className="grid grid-cols-6 gap-2 px-3 mb-4 mt-1"',
  'className="grid grid-cols-6 gap-1.5 px-3 mb-2 mt-0"'
);
// Icon sizes
code = code.replace(/w-6 h-6 text-\[\#ffdf00\]/g, 'w-5 h-5 text-[#ffdf00]');
// Text sizes
code = code.replace(/text-\[11px\] font-bold/g, 'text-[10px] font-medium');
// mb-1 under icon box
code = code.replace(
  'shadow-[0_0_12px_rgba(255,11,11,0.3)] mb-1',
  'shadow-[0_0_12px_rgba(255,11,11,0.3)] mb-0.5'
);

// 2. Category Navigation Slider
// shrink gaps
code = code.replace(
  'className="flex justify-between items-center overflow-x-auto [&::-webkit-scrollbar]:hidden px-10 gap-4"',
  'className="flex justify-between items-center overflow-x-auto [&::-webkit-scrollbar]:hidden px-8 gap-3"'
);
// box size and margin
code = code.replace(
  'w-[54px] h-[54px] rounded-[18px] flex flex-col items-center justify-center mb-2',
  'w-[46px] h-[46px] rounded-[14px] flex flex-col items-center justify-center mb-1'
);
// icon size
code = code.replace(
  'text-[28px]',
  'text-[22px]'
);
// label size
code = code.replace(
  'text-[13px] font-bold tracking-tight',
  'text-[11px] font-semibold tracking-tight'
);
// active dot mt-1 -> mt-0.5
code = code.replace(
  'className="w-1 h-1 bg-[#ffdf00] rounded-full mt-1',
  'className="w-1 h-1 bg-[#ffdf00] rounded-full mt-0.5'
);


fs.writeFileSync('src/components/HomeScreen.tsx', code);
