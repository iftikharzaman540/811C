const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

// The literal characters are backslash then n.
code = code.replace('useState("");\\n  const [isLoadingGames', 'useState("");\\n  const [isLoadingGames');

fs.writeFileSync('src/components/HomeScreen.tsx', code);
