const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

// 1. Add states
code = code.replace(
  'const [isLoadingGames, setIsLoadingGames] = useState(true);',
  'const [isLoadingGames, setIsLoadingGames] = useState(true);\n  const [searchQuery, setSearchQuery] = useState({ hot: "", mini: "", slot: "", fishing: "", cards: "", live: "", sports: "" });'
);

// 2. Define categories to replace
const categories = [
  { name: 'Hot', id: 'hot', slice: '0, 21' },
  { name: 'Mini', id: 'mini', slice: '21, 33' },
  { name: 'Slot', id: 'slot', slice: '33, 42' },
  { name: 'Fishing', id: 'fishing', slice: '42, 48' },
  { name: 'Cards', id: 'cards', slice: '48, 54' },
  { name: 'Live', id: 'live', slice: '54, 60' },
  { name: 'Sports', id: 'sports', slice: '60, 66' }
];

for (const cat of categories) {
  // Add search bar to header
  // Note: the pill navigation starts with <div className="flex items-center text-[11px]
  code = code.replace(
    new RegExp(`(Single Main Grid Section \\(${cat.name}.*?\\s*.*?\\s*.*?\\s*.*?\\s*<h2.*?>.*?<\\/h2>\\s*<\\/div>\\s*)`),
    `$1\n            <input type="text" placeholder="Search..." value={searchQuery.${cat.id}} onChange={e => setSearchQuery({...searchQuery, ${cat.id}: e.target.value})} className="w-20 sm:w-28 h-7 mx-2 bg-[#141414] border border-neutral-800 rounded-full px-3 text-[10px] text-white focus:outline-none focus:border-[#cc0000]" />\n`
  );

  // Replace Pill Navigation onClick
  let pillNavRegex = new RegExp(`(<button onClick=\\{\\(\\) => toast\\("Previous page"\\)\\} className="px-3 h-full hover:bg-neutral-800 border-r border-neutral-800 flex items-center justify-center">.*?<div onClick=\\{\\(\\) => toast\\.success\\("Viewing All"\\)\\}.*?>.*?<button onClick=\\{\\(\\) => toast\\("Next page"\\)\\}.*?>)`, 's');
  
  if (code.match(pillNavRegex)) {
    code = code.replace(
      pillNavRegex,
      `<button onClick={() => document.getElementById('grid-${cat.id}')?.scrollBy({ left: -220, behavior: 'smooth' })} className="px-3 h-full hover:bg-neutral-800 border-r border-neutral-800 flex items-center justify-center">
                <ChevronLeft className="w-3.5 h-3.5 text-neutral-400" />
              </button>
              <div onClick={() => toast.success("Viewing All")} className="px-4 h-full flex items-center justify-center cursor-pointer hover:text-[#ffdf00]">
                All
              </div>
              <button onClick={() => document.getElementById('grid-${cat.id}')?.scrollBy({ left: 220, behavior: 'smooth' })} className="px-3 h-full hover:bg-neutral-800 border-l border-neutral-800 flex items-center justify-center">
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </button>`
    );
  }

  // Replace grid div with horizontal scroll
  code = code.replace(
    /<div className="grid grid-cols-3 gap-2\.5">/,
    `<div id="grid-${cat.id}" className="flex overflow-x-auto no-scrollbar gap-2.5 snap-x snap-mandatory pb-2">`
  );

  // Apply search filter and width classes to cards
  let mapRegex = new RegExp(`\\{realGames\\.slice\\(${cat.slice}\\)\\.map\\(\\(game: any, gIdx: number\\) => \\(`, 'g');
  code = code.replace(
    mapRegex,
    `{realGames.slice(${cat.slice}).filter(g => !searchQuery.${cat.id} || (g.title || g.name)?.toLowerCase().includes(searchQuery.${cat.id}.toLowerCase())).map((game: any, gIdx: number) => (`
  );

  // In the mapped div, add shrink-0, snap-start and w-[110px]
  let cardRegex = new RegExp(`(className="\`aspect-\\[3\\/4\\]) (\\$\\{game\\.img \\|\\| 'bg-neutral-900'\\} rounded-xl relative overflow-hidden flex flex-col shadow-\\[0_0_10px_rgba\\(255,11,11,0\\.4\\)\\] group cursor-pointer border border-\\[#ff0b0b\\]\`)`);
  // Note: we replace it for this section. Since we replace in order, we might need a more targeted replace.
  // Actually, replacing all occurrences is fine, because we do it 7 times, it will just replace all of them.
}

code = code.replace(/className="\`aspect-\[3\/4\]/g, 'className={`w-[110px] shrink-0 snap-start aspect-[3/4]');

fs.writeFileSync('src/components/HomeScreen.tsx', code);
console.log('Patched grids to horizontal scroll with search!');
