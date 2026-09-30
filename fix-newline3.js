const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

const targetStr = 'useState("");\\n  const [isLoadingGames';
if (code.includes(targetStr)) {
  code = code.replace(targetStr, 'useState("");\\n  const [isLoadingGames'); // Wait, \\n is string literal \n!
}

// Just find the line!
let lines = code.split('\\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('useState("");\\n  const [isLoadingGames')) {
    lines[i] = lines[i].replace('useState("");\\n  const [isLoadingGames', 'useState("");');
    lines.splice(i + 1, 0, '  const [isLoadingGames');
  }
}

fs.writeFileSync('src/components/HomeScreen.tsx', lines.join('\\n'));
console.log("Fixed by line split!");
