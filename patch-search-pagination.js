const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

// 1. Add states for search and pagination
code = code.replace(
  'const [isLoadingGames, setIsLoadingGames] = useState(true);',
  `const [isLoadingGames, setIsLoadingGames] = useState(true);
  const [globalSearch, setGlobalSearch] = useState("");
  const [pages, setPages] = useState<any>({ hot: 0, mini: 0, slot: 0, fishing: 0, cards: 0, live: 0, sports: 0 });`
);

// 2. Define our categories and their slice sizes
const cats = [
  { id: 'hot', name: 'Hot', start: 0, size: 21 },
  { id: 'mini', name: 'Mini Game', start: 21, size: 12 },
  { id: 'slot', name: 'Slot', start: 33, size: 9 },
  { id: 'fishing', name: 'Fishing', start: 42, size: 6 },
  { id: 'cards', name: 'Cards', start: 48, size: 6 },
  { id: 'live', name: 'Live', start: 54, size: 6 },
  { id: 'sports', name: 'Sports', start: 60, size: 6 }
];

// 3. Inject Search Bar and Conditional Rendering
const globalSearchUI = `
        {/* GLOBAL SEARCH BAR */}
        <div className="px-4 mb-6">
          <div className="relative w-full h-12 bg-[#141414] rounded-full border border-neutral-800 shadow-inner flex items-center px-4 overflow-hidden focus-within:border-[#cc0000] focus-within:shadow-[0_0_15px_rgba(204,0,0,0.3)] transition-all">
            <svg className="w-5 h-5 text-neutral-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text" 
              placeholder="Search for any game..." 
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="w-full bg-transparent text-white placeholder-neutral-600 text-sm focus:outline-none"
            />
            {globalSearch && (
              <button onClick={() => setGlobalSearch("")} className="ml-2 w-6 h-6 bg-neutral-800 rounded-full flex items-center justify-center text-white hover:bg-neutral-700">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>
        </div>

        {globalSearch ? (
          <div className="mb-8 px-4">
            <div className="flex items-center gap-1.5 mb-4">
              <span className="text-[20px]">🔍</span>
              <h2 className="text-[17px] font-bold text-white tracking-tight">Search Results</h2>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {realGames.filter((g: any) => (g.title || g.name)?.toLowerCase().includes(globalSearch.toLowerCase())).map((game: any, gIdx: number) => (
                <motion.div 
                  key={gIdx}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { if (typeof window !== 'undefined' && (window as any).handleLaunchGame) { (window as any).handleLaunchGame(game.id || game.name); } }}
                  className={\`aspect-[3/4] \${game.img || 'bg-neutral-900'} rounded-xl relative overflow-hidden flex flex-col shadow-[0_0_10px_rgba(255,11,11,0.4)] group cursor-pointer border border-[#ff0b0b]\`}
                >
                  <div className="absolute inset-0 flex items-center justify-center text-[45px] drop-shadow-2xl">
                    {game.imageUrl ? <img src={game.imageUrl} className="w-full h-full object-cover rounded-xl absolute inset-0 z-0" /> : game.graphic}
                  </div>
                  <div className="w-full text-center mt-auto relative z-10 pb-2">
                    <div className="text-[11px] font-medium tracking-tight text-white drop-shadow-md bg-black/60 mx-1 rounded">{game.title || game.name}</div>
                  </div>
                </motion.div>
              ))}
              {realGames.filter((g: any) => (g.title || g.name)?.toLowerCase().includes(globalSearch.toLowerCase())).length === 0 && (
                <div className="col-span-3 text-center text-neutral-500 py-10">No games found matching "{globalSearch}"</div>
              )}
            </div>
          </div>
        ) : (
          <>
`;

code = code.replace(
  '{/* Single Main Grid Section (Hot) */}',
  globalSearchUI + '\n        {/* Single Main Grid Section (Hot) */}'
);

// We need to close the `<>` at the very end of the content. 
// We can inject `</>` right before `</div>{/* Bottom Navigation */}`
code = code.replace(
  '        {/* Bottom Navigation */}',
  '        </>\n        )\n        }\n\n        {/* Bottom Navigation */}'
);

// 4. Update Pagination in categories
for (const cat of cats) {
  let parts = code.split(` tracking-tight">${cat.name}</h2>`);
  if (parts.length > 1) {
    // Replace onClick for Pill Navigation
    parts[1] = parts[1].replace(
      'onClick={() => toast("Previous page")}',
      `onClick={() => setPages((p: any) => ({ ...p, ${cat.id}: Math.max(0, p.${cat.id} - 1) }))}`
    );
    parts[1] = parts[1].replace(
      'onClick={() => toast("Next page")}',
      `onClick={() => setPages((p: any) => ({ ...p, ${cat.id}: p.${cat.id} + 1 }))}`
    );
    
    // Replace slice
    let mapRegex = new RegExp(`\\{realGames\\.slice\\([0-9]+, [0-9]+\\)\\.map`);
    parts[1] = parts[1].replace(
      mapRegex,
      `{realGames.slice(${cat.start} + pages.${cat.id} * ${cat.size}, ${cat.start} + (pages.${cat.id} + 1) * ${cat.size}).map`
    );

    code = parts.join(` tracking-tight">${cat.name}</h2>`);
  }
}

fs.writeFileSync('src/components/HomeScreen.tsx', code);
console.log('Patched with search and pagination!');
