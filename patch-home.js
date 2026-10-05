const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');
code = code.replace(/toast\.error\("Loading..."\)/g, 'toast.error("Please select a game from the list below to play!")');
code = code.replace(/toast\.error\("Loading game..."\)/g, 'toast.error("Please select a game from the list below to play!")');
fs.writeFileSync('src/components/HomeScreen.tsx', code);
