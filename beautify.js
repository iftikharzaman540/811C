const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

// 1. Rewrite Alliance Cards
const allianceStart = code.indexOf('{/* Alliance Cards (Pixel Perfect) */}');
const marqueeStart = code.indexOf('{/* Marquee Bar (Pixel Perfect) */}');

if (allianceStart !== -1 && marqueeStart !== -1) {
  const newAlliance = `{/* Alliance Cards (Beautiful) */}
        <div className="px-3 mb-5 grid grid-cols-3 gap-2.5">
          {[
            { logo: "PKR365", text: "Rs 666", color: "from-[#3a0a0a]", border: "border-[#ff0b0b]", shadow: "shadow-[0_0_15px_rgba(255,11,11,0.2)]", icon: "🦅" },
            { logo: "PKRBET", text: "Rs 888", color: "from-[#0a203f]", border: "border-[#00aaff]", shadow: "shadow-[0_0_15px_rgba(0,170,255,0.2)]", icon: "🐔" },
            { logo: "PX8888", text: "Rs 888", color: "from-[#2a2a2a]", border: "border-[#ffdf00]", shadow: "shadow-[0_0_15px_rgba(255,223,0,0.15)]", icon: "👑" },
          ].map((card, i) => (
            <div key={i} className={\`relative rounded-2xl bg-gradient-to-b \${card.color} to-black border border-neutral-800 border-b-[3px] \${card.border} p-2 flex flex-col items-center justify-between h-[95px] \${card.shadow} hover:-translate-y-1 transition-transform cursor-pointer overflow-hidden group\`}>
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              {/* Red dot */}
              <div className="absolute top-0 right-0 w-4 h-4 bg-[#ff3b30] rounded-bl-xl flex items-center justify-center z-10 shadow-sm border-l border-b border-black">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
              </div>
              
              <h3 className="font-black italic text-[15px] leading-tight flex items-center mt-1 bg-gradient-to-r from-white via-gray-200 to-gray-400 text-transparent bg-clip-text drop-shadow-md">
                 {card.logo}
              </h3>
              
              <div className="text-[32px] mt-auto mb-1 opacity-95 drop-shadow-xl group-hover:scale-110 transition-transform">{card.icon}</div>
              
              <div className="w-full rounded-full overflow-hidden border border-white/10 text-center relative z-10 mt-auto flex flex-col">
                 <div className="bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-700 py-[3px]">
                   <p className="text-[9px] text-black font-black leading-none whitespace-nowrap drop-shadow-sm">Free to claim {card.text}</p>
                 </div>
                 <div className="bg-neutral-900 text-white/70 text-[6px] py-[2px] font-bold leading-none tracking-widest uppercase">Alliance</div>
              </div>
            </div>
          ))}
        </div>\n\n        `;
  
  code = code.substring(0, allianceStart) + newAlliance + code.substring(marqueeStart);
}

// 2. Rewrite Marquee Bar
const marqueeOldStart = code.indexOf('{/* Marquee Bar (Pixel Perfect) */}');
const categoryNavStart = code.indexOf('{/* Category Navigation Slider (Pixel Perfect) */}');

if (marqueeOldStart !== -1 && categoryNavStart !== -1) {
  const newMarquee = `{/* Marquee Bar (Beautiful) */}
        <div className="px-3 mb-7">
          <div className="flex items-center gap-2 bg-gradient-to-r from-[#141414] via-[#1a1a1a] to-[#141414] rounded-full border border-neutral-800 p-1.5 shadow-inner relative overflow-hidden">
            <div className="absolute left-0 w-8 h-full bg-gradient-to-r from-[#141414] to-transparent z-10"></div>
            <div className="bg-gradient-to-br from-red-600 to-red-900 w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(255,0,0,0.4)] z-20">
              <Volume2 className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 overflow-hidden relative h-6 flex items-center">
               <p className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffdf00] to-[#ffaa00] text-[13px] font-medium whitespace-nowrap absolute left-0 animate-marquee z-0">
                 Welcome to 8111C.com &nbsp;✨&nbsp; Bigger Rewards &nbsp;✨&nbsp; More Games &nbsp;✨&nbsp; Play & Win Big Today!
               </p>
            </div>
            <div className="absolute right-0 w-12 h-full bg-gradient-to-l from-[#141414] to-transparent z-10"></div>
            <div className="relative shrink-0 ml-1 mr-2 z-20 cursor-pointer hover:scale-110 transition-transform">
              <Mail className="w-6 h-6 text-neutral-400 hover:text-white transition-colors" />
              <div className="absolute -top-1.5 -right-2 bg-[#ff0b0b] text-white text-[10px] font-bold px-1.5 rounded-full min-w-[18px] text-center shadow-[0_0_8px_rgba(255,11,11,0.6)] leading-tight border border-black animate-pulse">
                31
              </div>
            </div>
          </div>
        </div>\n\n        `;
        
  code = code.substring(0, marqueeOldStart) + newMarquee + code.substring(categoryNavStart);
}

// 3. Rewrite Category Slider
const catSliderStart = code.indexOf('{/* Category Navigation Slider (Pixel Perfect) */}');
const searchBarStart = code.indexOf('{/* GLOBAL SEARCH BAR */}');

if (catSliderStart !== -1 && searchBarStart !== -1) {
  const newCatSlider = `{/* Category Navigation Slider (Beautiful) */}
        <div className="relative px-0 mb-8">
          {/* Left Fade */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>

          {/* Left Arrow */}
          <div className="absolute left-2 top-1/2 -translate-y-1/2 z-20">
            <button onClick={() => toast("Scrolling left")} className="w-7 h-7 rounded-full bg-black/80 backdrop-blur-sm border border-neutral-700 flex items-center justify-center text-white/70 hover:text-white hover:bg-[#ffdf00]/20 hover:border-[#ffdf00] transition-all shadow-lg">
              <ChevronLeft className="w-4 h-4 -ml-0.5" />
            </button>
          </div>

          {/* Slider Container */}
          <div className="flex justify-between items-center overflow-x-auto no-scrollbar px-10 gap-4">
            {[
              { name: "Slot", icon: "🎰", active: true },
              { name: "Fishing", icon: "🦈" },
              { name: "Cards", icon: "🃏" },
              { name: "Live", icon: "👩‍💼" },
              { name: "Sports", icon: "⚽" },
            ].map((cat, i) => (
              <div key={i} onClick={() => toast.success(\`Viewing \${cat.name} games\`)} className="flex flex-col items-center cursor-pointer group shrink-0">
                <div className={\`w-[54px] h-[54px] rounded-[18px] flex flex-col items-center justify-center mb-2 transition-all duration-300 \${cat.active ? 'bg-gradient-to-br from-[#ffdf00] to-[#ffaa00] shadow-[0_0_15px_rgba(255,223,0,0.4)] scale-110' : 'bg-gradient-to-br from-[#1f1f1f] to-[#0a0a0a] border border-neutral-800 shadow-inner group-hover:border-neutral-600 group-hover:scale-105'}\`}>
                  <span className={\`text-[28px] drop-shadow-md transition-transform \${cat.active ? 'scale-110' : 'grayscale-[0.3] group-hover:grayscale-0'}\`}>{cat.icon}</span>
                </div>
                <span className={\`text-[13px] font-bold tracking-tight transition-colors \${cat.active ? 'text-[#ffdf00]' : 'text-neutral-500 group-hover:text-neutral-300'}\`}>{cat.name}</span>
                {cat.active && <div className="w-1 h-1 bg-[#ffdf00] rounded-full mt-1 shadow-[0_0_5px_#ffdf00]"></div>}
              </div>
            ))}
          </div>

          {/* Right Fade */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>

          {/* Right Arrow */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 z-20">
            <button onClick={() => toast("Scrolling right")} className="w-7 h-7 rounded-full bg-black/80 backdrop-blur-sm border border-neutral-700 flex items-center justify-center text-white/70 hover:text-white hover:bg-[#ffdf00]/20 hover:border-[#ffdf00] transition-all shadow-lg">
              <ChevronRight className="w-4 h-4 -mr-0.5" />
            </button>
          </div>
        </div>\n\n        `;
        
  code = code.substring(0, catSliderStart) + newCatSlider + code.substring(searchBarStart);
}

fs.writeFileSync('src/components/HomeScreen.tsx', code);
console.log("Successfully beautified the layout sections!");
