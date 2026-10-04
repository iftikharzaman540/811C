const fs = require('fs');
let c = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');
c = c.replace('useState("");\\n  const [isLoadingGames', 'useState("");\\n  const [isLoadingGames');
fs.writeFileSync('src/components/HomeScreen.tsx', c);
