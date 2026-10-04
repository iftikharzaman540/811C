const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

// 1. Add states
code = code.replace(
  'const [isLoadingGames, setIsLoadingGames] = useState(true);',
  'const [isLoadingGames, setIsLoadingGames] = useState(true);\n  const [searchQuery, setSearchQuery] = useState<any>({ hot: "", mini: "", slot: "", fishing: "", cards: "", live: "", sports: "" });'
);

// 2. Define categories to replace
const categories = [
  { name: 'Hot', id: 'hot', slice: '0, 21' },
  { name: 'Mini Game', id: 'mini', slice: '21, 33' },
  { name: 'Slot', id: 'slot', slice: '33, 42' },
  { name: 'Fishing', id: 'fishing', slice: '42, 48' },
  { name: 'Cards', id: 'cards', slice: '48, 54' },
  { name: 'Live', id: 'live', slice: '54, 60' },
  { name: 'Sports', id: 'sports', slice: '60, 66' }
];

for (const cat of categories) {
  // Add search bar
  let h2Regex = new RegExp(`(<h2 className="text-\\[17px\\] font-bold text-white tracking-tight">${cat.name}<\\/h2>\\s*<\\/div>)`);
  code = code.replace(
    h2Regex,
    `$1\n            <input type="text" placeholder="Search..." value={searchQuery.${cat.id}} onChange={e => setSearchQuery({...searchQuery, ${cat.id}: e.target.value})} className="w-20 sm:w-28 h-7 mx-2 bg-[#141414] border border-neutral-800 rounded-full px-3 text-[10px] text-white focus:outline-none focus:border-[#cc0000]" />`
  );

  // Replace onClick for Pill Navigation for this specific section
  // To avoid matching multiple sections, we will replace the first 'toast("Previous page")' we find AFTER the category header.
  // We can do this by splitting the code at the header, doing one replace, and joining.
  let parts = code.split(` tracking-tight">${cat.name}</h2>`);
  if (parts.length > 1) {
    parts[1] = parts[1].replace(
      'onClick={() => toast("Previous page")}',
      `onClick={() => document.getElementById('grid-${cat.id}')?.scrollBy({ left: -220, behavior: 'smooth' })}`
    );
    parts[1] = parts[1].replace(
      'onClick={() => toast("Next page")}',
      `onClick={() => document.getElementById('grid-${cat.id}')?.scrollBy({ left: 220, behavior: 'smooth' })}`
    );
    
    // Replace grid div
    parts[1] = parts[1].replace(
      '<div className="grid grid-cols-3 gap-2.5">',
      `<div id="grid-${cat.id}" className="flex overflow-x-auto no-scrollbar gap-2.5 snap-x snap-mandatory pb-2">`
    );

    // Replace map function
    let mapRegex = new RegExp(`\\{realGames\\.slice\\(${cat.slice}\\)\\.map\\(\\(game: any, gIdx: number\\) => \\(`);
    parts[1] = parts[1].replace(
      mapRegex,
      `{realGames.slice(${cat.slice}).filter(g => !searchQuery.${cat.id} || (g.title || g.name)?.toLowerCase().includes(searchQuery.${cat.id}.toLowerCase())).map((game: any, gIdx: number) => (`
    );

    code = parts.join(` tracking-tight">${cat.name}</h2>`);
  }
}

// Replace all aspect-[3/4] to have width and snap classes
code = code.replace(/className="\`aspect-\[3\/4\]/g, 'className={`w-[110px] shrink-0 snap-start aspect-[3/4]');

fs.writeFileSync('src/components/HomeScreen.tsx', code);
console.log('Patched grids safely!');
