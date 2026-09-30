const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

// Replace all non-Slot sections
code = code.replace(/\(realGames\.length > 0 \? realGames\.slice\(0, 21\) : gamesList\)/g, 'realGames.slice(0, 21)');
code = code.replace(/\(realGames\.length > 0 \? realGames\.slice\(21, 33\) : miniGamesList\)/g, 'realGames.slice(21, 33)');
code = code.replace(/\(realGames\.length > 0 \? realGames\.slice\(42, 48\) : fishingGamesList\)/g, 'realGames.slice(42, 48)');
code = code.replace(/\(realGames\.length > 0 \? realGames\.slice\(48, 54\) : cardsGamesList\)/g, 'realGames.slice(48, 54)');
code = code.replace(/\(realGames\.length > 0 \? realGames\.slice\(54, 60\) : liveGamesList\)/g, 'realGames.slice(54, 60)');
code = code.replace(/\(realGames\.length > 0 \? realGames\.slice\(60, 66\) : sportsGamesList\)/g, 'realGames.slice(60, 66)');

// Replace the Slot section
const slotStartRegex = /\{realGames\.length > 0 \? realGames\.map\(\(game, gIdx\) => \(/;
const slotEndRegex = /\)\) : \(realGames\.length > 0 \? realGames\.slice\(33, 42\) : slotGamesList\)\.map\(\(game: any, gIdx: number\) => \(/;

const lines = code.split('\n');
let startIdx = -1;
let endIdx = -1;
for (let i = 0; i < lines.length; i++) {
  if (slotStartRegex.test(lines[i])) startIdx = i;
  if (slotEndRegex.test(lines[i])) endIdx = i;
}

if (startIdx !== -1 && endIdx !== -1) {
  lines[startIdx] = '            {realGames.slice(33, 42).map((game: any, gIdx: number) => (';
  lines.splice(startIdx + 1, endIdx - startIdx);
  code = lines.join('\n');
} else {
  console.log("Could not find Slot section!");
}

fs.writeFileSync('src/components/HomeScreen.tsx', code);
console.log("Done patching.");
