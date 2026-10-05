const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

code = code.replace(/\(g\.title \|\| g\.name\)\?\.toLowerCase\(\)\.includes/g, '((g.title || g.name) || "").toLowerCase().includes');

fs.writeFileSync('src/components/HomeScreen.tsx', code);
