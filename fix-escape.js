const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

code = code.replace('useState("");\\n  const [isLoadingGames, setIsLoadingGames]', 'useState("");\\n  const [isLoadingGames, setIsLoadingGames]'); // wait no
// Let's just manually replace the line

const lines = code.split('\\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('useState("");\\\\n  const [isLoadingGames')) {
    lines[i] = lines[i].replace('useState("");\\\\n  const [isLoadingGames', 'useState("");');
    lines.splice(i + 1, 0, '  const [isLoadingGames');
  } else if (lines[i].includes('useState("");\\n  const [isLoadingGames')) {
    // If it literally has \n
    lines[i] = lines[i].replace('useState("");\\n  const [isLoadingGames', 'useState("");');
    lines.splice(i + 1, 0, '  const [isLoadingGames');
  }
}

// Actually, I can just do a regex replace over the entire string:
code = code.replace(/useState\(""\);\\[n]  const \[isLoadingGames/g, 'useState("");\\n  const [isLoadingGames');
code = code.replace(/useState\(""\);\\n  const \[isLoadingGames/g, 'useState("");\\n  const [isLoadingGames');

fs.writeFileSync('src/components/HomeScreen.tsx', code);
