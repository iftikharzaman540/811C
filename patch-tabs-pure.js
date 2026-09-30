const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

// 1. Add activeCategory state
const stateInsertionPoint = code.indexOf('const [globalSearch, setGlobalSearch] = useState("");');
if (stateInsertionPoint !== -1 && code.indexOf('const [activeCategory') === -1) {
  const newState = 'const [activeCategory, setActiveCategory] = useState("All");\n  ';
  code = code.substring(0, stateInsertionPoint) + newState + code.substring(stateInsertionPoint);
}

// 2. Replace the Category Navigation Slider logic
const sliderStart = code.indexOf('{/* Category Navigation Slider (Beautiful) */}');
const sliderEnd = code.indexOf('{/* GLOBAL SEARCH BAR */}');

if (sliderStart !== -1 && sliderEnd !== -1) {
  const newSlider = '{/* Category Navigation Slider (Beautiful) */}\n' +
'        <div className="relative px-0 mb-8">\n' +
'          {/* Left Arrow */}\n' +
'          <div className="absolute left-2 top-1/2 -translate-y-1/2 z-20">\n' +
'            <button onClick={() => {\n' +
'              const container = document.getElementById(\'category-scroll-container\');\n' +
'              if (container) container.scrollBy({ left: -100, behavior: \'smooth\' });\n' +
'            }} className="w-7 h-7 rounded-full bg-black/80 backdrop-blur-sm border border-neutral-700 flex items-center justify-center text-white/70 hover:text-white hover:bg-[#ffdf00]/20 hover:border-[#ffdf00] transition-all shadow-lg">\n' +
'              <ChevronLeft className="w-4 h-4 -ml-0.5" />\n' +
'            </button>\n' +
'          </div>\n' +
'\n' +
'          {/* Slider Container */}\n' +
'          <div id="category-scroll-container" className="flex justify-between items-center overflow-x-auto [&::-webkit-scrollbar]:hidden px-10 gap-4" style={{ scrollBehavior: \'smooth\' }}>\n' +
'            {[\n' +
'              { name: "All", id: "All", icon: "🌟", active: activeCategory === "All" },\n' +
'              { name: "Mini", id: "Mini Games", icon: "🎲", active: activeCategory === "Mini Games" },\n' +
'              { name: "Slot", id: "Slot", icon: "🎰", active: activeCategory === "Slot" },\n' +
'              { name: "Fishing", id: "Fishing", icon: "🦈", active: activeCategory === "Fishing" },\n' +
'              { name: "Cards", id: "Cards", icon: "🃏", active: activeCategory === "Cards" },\n' +
'              { name: "Live", id: "Live", icon: "👩‍💼", active: activeCategory === "Live" },\n' +
'              { name: "Sports", id: "Sports", icon: "⚽", active: activeCategory === "Sports" },\n' +
'            ].map((cat, i) => (\n' +
'              <div key={i} onClick={() => {\n' +
'                setActiveCategory(cat.id);\n' +
'                window.scrollTo({ top: 400, behavior: \'smooth\' });\n' +
'              }} className="flex flex-col items-center cursor-pointer group shrink-0">\n' +
'                <div className={"w-[54px] h-[54px] rounded-[18px] flex flex-col items-center justify-center mb-2 transition-all duration-300 " + (cat.active ? \'bg-gradient-to-br from-[#ffdf00] to-[#ffaa00] shadow-[0_0_15px_rgba(255,223,0,0.4)] scale-110\' : \'bg-gradient-to-br from-[#1f1f1f] to-[#0a0a0a] border border-neutral-800 shadow-inner group-hover:border-neutral-600 group-hover:scale-105\')}>\n' +
'                  <span className={"text-[28px] drop-shadow-md transition-transform " + (cat.active ? \'scale-110\' : \'grayscale-[0.3] group-hover:grayscale-0\')}>{cat.icon}</span>\n' +
'                </div>\n' +
'                <span className={"text-[13px] font-bold tracking-tight transition-colors " + (cat.active ? \'text-[#ffdf00]\' : \'text-neutral-500 group-hover:text-neutral-300\')}>{cat.name}</span>\n' +
'                {cat.active && <div className="w-1 h-1 bg-[#ffdf00] rounded-full mt-1 shadow-[0_0_5px_#ffdf00]"></div>}\n' +
'              </div>\n' +
'            ))}\n' +
'          </div>\n' +
'\n' +
'          {/* Right Arrow */}\n' +
'          <div className="absolute right-2 top-1/2 -translate-y-1/2 z-20">\n' +
'            <button onClick={() => {\n' +
'              const container = document.getElementById(\'category-scroll-container\');\n' +
'              if (container) container.scrollBy({ left: 100, behavior: \'smooth\' });\n' +
'            }} className="w-7 h-7 rounded-full bg-black/80 backdrop-blur-sm border border-neutral-700 flex items-center justify-center text-white/70 hover:text-white hover:bg-[#ffdf00]/20 hover:border-[#ffdf00] transition-all shadow-lg">\n' +
'              <ChevronRight className="w-4 h-4 -mr-0.5" />\n' +
'            </button>\n' +
'          </div>\n' +
'        </div>\n\n        ';
  
  code = code.substring(0, sliderStart) + newSlider + code.substring(sliderEnd);
}

// 3. Add CSS display logic to sections
const sectionsToWrap = [
  { id: 'section-mini', category: 'Mini Games' },
  { id: 'section-slot', category: 'Slot' },
  { id: 'section-fishing', category: 'Fishing' },
  { id: 'section-cards', category: 'Cards' },
  { id: 'section-live', category: 'Live' },
  { id: 'section-sports', category: 'Sports' }
];

sectionsToWrap.forEach(({ id, category }) => {
  const target = '<div id="' + id + '" className="mb-8 px-4 scroll-mt-[100px]">';
  const replacement = '<div id="' + id + '" className="mb-8 px-4 scroll-mt-[100px]" style={{ display: (activeCategory === "All" || activeCategory === "' + category + '") ? "block" : "none" }}>';
  code = code.replace(target, replacement);
});

// also do "Hot Games" if it has an id, wait Hot Games is the default one at the top. Let's find it.
const hotTarget = '{/* Single Main Grid Section (Hot) */}\n          <div className="mb-8 px-4">';
const hotTargetCRLF = '{/* Single Main Grid Section (Hot) */}\r\n          <div className="mb-8 px-4">';
const hotReplacement = '{/* Single Main Grid Section (Hot) */}\n          <div className="mb-8 px-4" style={{ display: (activeCategory === "All" || activeCategory === "Hot") ? "block" : "none" }}>';

if (code.includes(hotTargetCRLF)) {
  code = code.replace(hotTargetCRLF, hotReplacement);
} else if (code.includes(hotTarget)) {
  code = code.replace(hotTarget, hotReplacement);
}

fs.writeFileSync('src/components/HomeScreen.tsx', code);
console.log("Applied Tab Filtering Logic Successfully!");
