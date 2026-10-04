const fs = require('fs');
const file = 'src/components/HomeScreen.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "fetch('/api/v1/games/gregmorn/list')",
  "fetch('/api/v1/games/gregmorn/list?t=' + Date.now())"
);

fs.writeFileSync(file, code);
console.log("Added cache buster to HomeScreen fetch");
