const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

// Add sidebarSearch state
const stateInsertionPoint = code.indexOf('const [isLoadingGames, setIsLoadingGames] = useState(true);');
if (stateInsertionPoint !== -1) {
  const newState = 'const [sidebarSearch, setSidebarSearch] = useState("");\\n  ';
  code = code.substring(0, stateInsertionPoint) + newState + code.substring(stateInsertionPoint);
}

// Update the Search input in the sidebar
const searchBlockRegex = /\{\/\* Search \*\/\}\s*<div className="bg-\[\#242424\] rounded-lg p-3 flex items-center gap-2">\s*<Search className="w-5 h-5 text-neutral-400" \/>\s*<input type="text" placeholder="Search" className="bg-transparent border-none outline-none text-\[14px\] text-white placeholder-neutral-400 w-full" \/>\s*<\/div>/;

const newSearchBlock = `{/* Search */}
              <div className="bg-[#242424] rounded-lg p-3 flex items-center gap-2 focus-within:ring-1 focus-within:ring-[#ffdf00] transition-all relative z-50">
                <Search className="w-5 h-5 text-neutral-400" />
                <input 
                  type="text" 
                  placeholder="Search games..." 
                  value={sidebarSearch}
                  onChange={(e) => setSidebarSearch(e.target.value)}
                  className="bg-transparent border-none outline-none text-[14px] text-white placeholder-neutral-400 w-full" 
                />
                {sidebarSearch && (
                  <button onClick={() => setSidebarSearch("")} className="text-neutral-400 hover:text-white">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                )}
              </div>

              {/* Search Results Dropdown inside Sidebar */}
              {sidebarSearch && (
                <div className="mt-2 bg-[#1c1c1c] rounded-lg border border-neutral-800 overflow-hidden max-h-[300px] overflow-y-auto no-scrollbar shadow-xl">
                  {realGames.filter((g: any) => (g.title || g.name)?.toLowerCase().includes(sidebarSearch.toLowerCase())).length > 0 ? (
                    <div className="flex flex-col">
                      {realGames.filter((g: any) => (g.title || g.name)?.toLowerCase().includes(sidebarSearch.toLowerCase())).slice(0, 15).map((game: any, gIdx: number) => (
                        <div 
                          key={gIdx}
                          onClick={() => {
                            setIsMenuOpen(false);
                            setSidebarSearch("");
                            if (typeof window !== 'undefined' && (window as any).handleLaunchGame) {
                              (window as any).handleLaunchGame(game.id || game.name);
                            }
                          }}
                          className="flex items-center gap-3 p-3 border-b border-neutral-800/50 hover:bg-[#2a2a2a] cursor-pointer transition-colors"
                        >
                          <div className="w-10 h-10 rounded-md overflow-hidden bg-neutral-900 flex shrink-0">
                            {game.imageUrl ? <img src={game.imageUrl} className="w-full h-full object-cover" /> : <div className="m-auto text-xl">{game.graphic}</div>}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[13px] font-medium text-white">{game.title || game.name}</span>
                            <span className="text-[10px] text-[#ffdf00]">{game.provider || 'Casino'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-[12px] text-neutral-500">
                      No games found matching "{sidebarSearch}"
                    </div>
                  )}
                </div>
              )}`;

code = code.replace(searchBlockRegex, newSearchBlock);

fs.writeFileSync('src/components/HomeScreen.tsx', code);
console.log("Added sidebar search dropdown logic");
