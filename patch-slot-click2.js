const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

const regex = /(realGames\.slice\(33.*?whileTap=\{\{ scale: 0\.95 \}\})/s;
const match = code.match(regex);
if (match) {
  code = code.replace(
    regex, 
    `$1\n                  onClick={() => { if (typeof window !== 'undefined' && (window as any).handleLaunchGame) { (window as any).handleLaunchGame(game.id || game.name); } }}`
  );
  fs.writeFileSync('src/components/HomeScreen.tsx', code);
  console.log("Added onClick successfully!");
} else {
  console.log("Not found.");
}
