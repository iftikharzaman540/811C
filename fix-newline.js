const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

code = code.replace('useState("");\\n  const [isLoadingGames', 'useState("");\\n  const [isLoadingGames');

fs.writeFileSync('src/components/HomeScreen.tsx', code);
