const fs = require('fs');
const file = 'src/components/HomeScreen.tsx';
let code = fs.readFileSync(file, 'utf8');

// Replace the first useEffect completely
code = code.replace(/useEffect\(\(\) => \{\s*fetch\('https:\/\/8111c\.com\/api\/v1\/games\/gregmorn\/list\?t=' \+ Date\.now\(\)\)\s*\.then\(r => r\.json\(\)\)\s*\.then\(data => \{\s*if\(Array\.isArray\(data\)\) setRealGames\(data\.slice\(0, 30\)\);\s*\}\)\s*\.catch\(e => console\.error\("Error fetching games", e\)\);\s*\}, \[\]\);/g, "");

fs.writeFileSync(file, code);
console.log("Removed duplicate fetch with regex");
