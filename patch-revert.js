const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

// 1. Restore sections without inline style
const displayRegex = /<div id="([^"]+)" className="mb-8 px-4" style=\{\{ display: [^\}]+\}\} \}\}>/g;
code = code.replace(displayRegex, '<div id="$1" className="mb-8 px-4 scroll-mt-[100px]">');

// Manually replace known instances if regex doesn't match perfectly (due to varying spacing)
code = code.replace(/<div id="section-hot" className="mb-8 px-4" style=\{\{ display: [^\}]+ \}\}>/g, '<div id="section-hot" className="mb-8 px-4 scroll-mt-[100px]">');
code = code.replace(/<div id="section-mini" className="mb-8 px-4" style=\{\{ display: [^\}]+ \}\}>/g, '<div id="section-mini" className="mb-8 px-4 scroll-mt-[100px]">');
code = code.replace(/<div id="section-slot" className="mb-8 px-4" style=\{\{ display: [^\}]+ \}\}>/g, '<div id="section-slot" className="mb-8 px-4 scroll-mt-[100px]">');
code = code.replace(/<div id="section-fishing" className="mb-8 px-4" style=\{\{ display: [^\}]+ \}\}>/g, '<div id="section-fishing" className="mb-8 px-4 scroll-mt-[100px]">');
code = code.replace(/<div id="section-cards" className="mb-8 px-4" style=\{\{ display: [^\}]+ \}\}>/g, '<div id="section-cards" className="mb-8 px-4 scroll-mt-[100px]">');
code = code.replace(/<div id="section-live" className="mb-8 px-4" style=\{\{ display: [^\}]+ \}\}>/g, '<div id="section-live" className="mb-8 px-4 scroll-mt-[100px]">');
code = code.replace(/<div id="section-sports" className="mb-8 px-4" style=\{\{ display: [^\}]+ \}\}>/g, '<div id="section-sports" className="mb-8 px-4 scroll-mt-[100px]">');

// 2. Replace the slider map logic completely
const oldSliderLogic = `            {[
              { name: "All", id: "All", icon: "🌟", active: activeCategory === "All" },
              { name: "Mini", id: "Mini Games", icon: "🎲", active: activeCategory === "Mini Games" },
              { name: "Slot", id: "Slot", icon: "🎰", active: activeCategory === "Slot" },
              { name: "Fishing", id: "Fishing", icon: "🦈", active: activeCategory === "Fishing" },
              { name: "Cards", id: "Cards", icon: "🃏", active: activeCategory === "Cards" },
              { name: "Live", id: "Live", icon: "👩‍💼", active: activeCategory === "Live" },
              { name: "Sports", id: "Sports", icon: "⚽", active: activeCategory === "Sports" },
            ].map((cat, i) => (
              <div key={i} onClick={() => {
                setActiveCategory(cat.id);
                window.scrollTo({ top: 400, behavior: 'smooth' });
              }}`;

const newSliderLogic = `            {[
              { name: "Hot", id: "section-hot", icon: "🔥", active: activeCategory === "section-hot" || activeCategory === "All" },
              { name: "Mini", id: "section-mini", icon: "🎲", active: activeCategory === "section-mini" },
              { name: "Slot", id: "section-slot", icon: "🎰", active: activeCategory === "section-slot" },
              { name: "Fishing", id: "section-fishing", icon: "🦈", active: activeCategory === "section-fishing" },
              { name: "Cards", id: "section-cards", icon: "🃏", active: activeCategory === "section-cards" },
              { name: "Live", id: "section-live", icon: "👩‍💼", active: activeCategory === "section-live" },
              { name: "Sports", id: "section-sports", icon: "⚽", active: activeCategory === "section-sports" },
            ].map((cat, i) => (
              <div key={i} onClick={() => {
                setActiveCategory(cat.id);
                const el = document.getElementById(cat.id);
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}`;

code = code.replace(oldSliderLogic, newSliderLogic);

fs.writeFileSync('src/components/HomeScreen.tsx', code);
console.log("Restored sections and slider scrolling logic");
