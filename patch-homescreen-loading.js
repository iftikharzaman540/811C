const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

code = code.replace(
  'const [realGames, setRealGames] = useState<any[]>([]);',
  'const [realGames, setRealGames] = useState<any[]>([]);\n  const [isLoadingGames, setIsLoadingGames] = useState(true);'
);

code = code.replace(
  /\.then\(data => \{\s*if\(Array\.isArray\(data\)\) setRealGames\(data\);\s*\}\)/,
  '.then(data => { if(Array.isArray(data)) setRealGames(data); }).finally(() => setIsLoadingGames(false))'
);

code = code.replace(
  '<div className="flex-1 overflow-y-auto pb-[90px]">',
  `{isLoadingGames ? (
          <div className="flex-1 flex flex-col items-center justify-center pt-20">
            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-neutral-400 mt-4 text-sm font-medium">Loading games...</p>
          </div>
        ) : (
        <div className="flex-1 overflow-y-auto pb-[90px]">`
);

code = code.replace(
  '{/* Deposit Full Screen Menu */}',
  `        )} {/* Deposit Full Screen Menu */}`
);

fs.writeFileSync('src/components/HomeScreen.tsx', code);
console.log('Added loading spinner.');
