const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

// 1. Add IDs to sections
code = code.replace('{/* Mini Games Section (Pixel Perfect) */}\n          <div className="mb-8 px-4">', '{/* Mini Games Section (Pixel Perfect) */}\n          <div id="section-mini" className="mb-8 px-4 scroll-mt-24">');
code = code.replace('{/* Slot Section (Pixel Perfect) */}\n          <div className="mb-8 px-4">', '{/* Slot Section (Pixel Perfect) */}\n          <div id="section-slot" className="mb-8 px-4 scroll-mt-24">');
code = code.replace('{/* Fishing Section (Pixel Perfect) */}\n          <div className="mb-8 px-4">', '{/* Fishing Section (Pixel Perfect) */}\n          <div id="section-fishing" className="mb-8 px-4 scroll-mt-24">');
code = code.replace('{/* Cards Section (Pixel Perfect) */}\n          <div className="mb-8 px-4">', '{/* Cards Section (Pixel Perfect) */}\n          <div id="section-cards" className="mb-8 px-4 scroll-mt-24">');
code = code.replace('{/* Live Section (Pixel Perfect) */}\n          <div className="mb-8 px-4">', '{/* Live Section (Pixel Perfect) */}\n          <div id="section-live" className="mb-8 px-4 scroll-mt-24">');
code = code.replace('{/* Sports Section (Pixel Perfect) */}\n          <div className="mb-8 px-4">', '{/* Sports Section (Pixel Perfect) */}\n          <div id="section-sports" className="mb-8 px-4 scroll-mt-24">');

// 2. Rewrite the Category Navigation Slider
const sliderStart = code.indexOf('{/* Category Navigation Slider (Beautiful) */}');
const searchBarStart = code.indexOf('{/* GLOBAL SEARCH BAR */}');

if (sliderStart !== -1 && searchBarStart !== -1) {
  const newSlider = `{/* Category Navigation Slider (Beautiful) */}
        <div className="relative px-0 mb-8">
          {/* Left Fade */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>

          {/* Left Arrow */}
          <div className="absolute left-2 top-1/2 -translate-y-1/2 z-20">
            <button onClick={() => {
              const container = document.getElementById('category-scroll-container');
              if (container) container.scrollBy({ left: -100, behavior: 'smooth' });
            }} className="w-7 h-7 rounded-full bg-black/80 backdrop-blur-sm border border-neutral-700 flex items-center justify-center text-white/70 hover:text-white hover:bg-[#ffdf00]/20 hover:border-[#ffdf00] transition-all shadow-lg">
              <ChevronLeft className="w-4 h-4 -ml-0.5" />
            </button>
          </div>

          {/* Slider Container */}
          <div id="category-scroll-container" className="flex justify-between items-center overflow-x-auto no-scrollbar px-10 gap-4" style={{ scrollBehavior: 'smooth' }}>
            {[
              { name: "Mini", id: "section-mini", icon: "🎲" },
              { name: "Slot", id: "section-slot", icon: "🎰", active: true },
              { name: "Fishing", id: "section-fishing", icon: "🦈" },
              { name: "Cards", id: "section-cards", icon: "🃏" },
              { name: "Live", id: "section-live", icon: "👩‍💼" },
              { name: "Sports", id: "section-sports", icon: "⚽" },
            ].map((cat, i) => (
              <div key={i} onClick={() => {
                const el = document.getElementById(cat.id);
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  toast.success(\`Jumped to \${cat.name} games\`);
                }
              }} className="flex flex-col items-center cursor-pointer group shrink-0">
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
            <button onClick={() => {
              const container = document.getElementById('category-scroll-container');
              if (container) container.scrollBy({ left: 100, behavior: 'smooth' });
            }} className="w-7 h-7 rounded-full bg-black/80 backdrop-blur-sm border border-neutral-700 flex items-center justify-center text-white/70 hover:text-white hover:bg-[#ffdf00]/20 hover:border-[#ffdf00] transition-all shadow-lg">
              <ChevronRight className="w-4 h-4 -mr-0.5" />
            </button>
          </div>
        </div>\n\n        `;
        
  code = code.substring(0, sliderStart) + newSlider + code.substring(searchBarStart);
  fs.writeFileSync('src/components/HomeScreen.tsx', code);
  console.log("Successfully made slider fully working!");
} else {
  console.log("Could not find slider section");
}
