const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

// 1. Download banner X
code = code.replace(
  /<button className="text-\[#ffdf00\] p-1 -ml-1 hover:opacity-80 transition-opacity shrink-0">/,
  '<button onClick={() => toast("Banner dismissed")} className="text-[#ffdf00] p-1 -ml-1 hover:opacity-80 transition-opacity shrink-0">'
);

// 2. Download now button
code = code.replace(
  /<button className="bg-\[#cc0000\] hover:bg-\[#ff0000\] text-white rounded-md font-bold text-\[11px\] leading-tight flex flex-col items-center justify-center h-\[38px\] px-3 shrink-0 ml-2 transition-colors">/,
  '<button onClick={() => toast.success("Downloading app...")} className="bg-[#cc0000] hover:bg-[#ff0000] text-white rounded-md font-bold text-[11px] leading-tight flex flex-col items-center justify-center h-[38px] px-3 shrink-0 ml-2 transition-colors">'
);

// 3. Quick Links
code = code.replace(
  /<div key=\{i\} className="flex flex-col items-center">/g, 
  `<div key={i} onClick={() => {
    if (item.name === "Invite") window.location.href = "/invite";
    else if (item.name === "Spins" || item.name === "Rebate") window.location.href = "/promo";
    else toast.success(item.name + " opened");
  }} className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform">`
);

// 4. Category Navigation Slider arrows
code = code.replace(
  /<button className="w-6 h-6 rounded-full bg-black\/60 border border-neutral-700 flex items-center justify-center text-white\/70 hover:text-white hover:bg-black\/80 shadow-md">/g, 
  '<button onClick={() => toast("Scrolling...")} className="w-6 h-6 rounded-full bg-black/60 border border-neutral-700 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 shadow-md">'
);

// 5. Category icons
code = code.replace(
  /<div key=\{i\} className="flex flex-col items-center opacity-70 hover:opacity-100 cursor-pointer transition-opacity">/g, 
  '<div key={i} onClick={() => toast.success(`Viewing ${cat.name} games`)} className="flex flex-col items-center opacity-70 hover:opacity-100 cursor-pointer transition-opacity">'
);

// 6. Pill Navigation (All)
code = code.replace(
  /<button className="px-3 h-full hover:bg-neutral-800 border-r border-neutral-800 flex items-center justify-center">/g, 
  '<button onClick={() => toast("Previous page")} className="px-3 h-full hover:bg-neutral-800 border-r border-neutral-800 flex items-center justify-center">'
);
code = code.replace(
  /<button className="px-3 h-full hover:bg-neutral-800 border-l border-neutral-800 flex items-center justify-center">/g, 
  '<button onClick={() => toast("Next page")} className="px-3 h-full hover:bg-neutral-800 border-l border-neutral-800 flex items-center justify-center">'
);
code = code.replace(
  /<div className="px-4 h-full flex items-center justify-center">/g, 
  '<div onClick={() => toast.success("Viewing All")} className="px-4 h-full flex items-center justify-center cursor-pointer hover:text-[#ffdf00]">'
);

// 7. Alliance Cards
code = code.replace(
  /<div key=\{i\} className="relative rounded-xl bg-gradient-to-b \$\{card\.color\} to-\[#0a0a0a\] border border-neutral-800 border-b-\[2px\] \$\{card\.border\} p-1\.5 flex flex-col items-center justify-between h-\[85px\] \$\{card\.shadow\}">/g, 
  '<div key={i} onClick={() => toast.success(`Joining ${card.logo} Alliance`)} className={`relative rounded-xl bg-gradient-to-b ${card.color} to-[#0a0a0a] border border-neutral-800 border-b-[2px] ${card.border} p-1.5 flex flex-col items-center justify-between h-[85px] ${card.shadow} cursor-pointer hover:scale-[1.02] transition-transform`}>'
);

// 8. Fixed Popups (Left & Right)
code = code.replace(
  /<div className="relative mb-3 pointer-events-auto cursor-pointer group flex items-center transition-transform duration-300 ease-out hover:scale-110 hover:translate-x-1">/g, 
  '<div onClick={() => toast.success("Claimed bonus!")} className="relative mb-3 pointer-events-auto cursor-pointer group flex items-center transition-transform duration-300 ease-out hover:scale-110 hover:translate-x-1">'
);

code = code.replace(
  /<div className="relative pointer-events-auto cursor-pointer group flex items-center transition-transform duration-300 ease-out hover:scale-110 hover:translate-x-1">/g, 
  '<div onClick={() => toast.success("Opening lucky wheel!")} className="relative pointer-events-auto cursor-pointer group flex items-center transition-transform duration-300 ease-out hover:scale-110 hover:translate-x-1">'
);

code = code.replace(
  /<div className="relative pointer-events-auto cursor-pointer group flex items-center transition-transform duration-300 ease-out hover:scale-110 hover:-translate-x-1">/g, 
  '<div onClick={() => toast.success("Viewing deposit rewards!")} className="relative pointer-events-auto cursor-pointer group flex items-center transition-transform duration-300 ease-out hover:scale-110 hover:-translate-x-1">'
);

// 9. Balance refresh button
code = code.replace(
  /<button className="text-\[#1fdf1f\] hover:rotate-180 transition-transform duration-300 ml-0\.5">/, 
  '<button onClick={() => toast.success("Balance refreshed")} className="text-[#1fdf1f] hover:rotate-180 transition-transform duration-300 ml-0.5">'
);

// 10. Hero Banner click
code = code.replace(
  /<div className="px-3 mb-3 relative h-\[140px\]">/g, 
  '<div onClick={() => toast.success("Opening promotion...")} className="px-3 mb-3 relative h-[140px] cursor-pointer">'
);

// Write back
fs.writeFileSync('src/components/HomeScreen.tsx', code);
