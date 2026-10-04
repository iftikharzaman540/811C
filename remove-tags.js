const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

// Replace the rogue closing tags
code = code.replace('        </>\\n        )\\n        }', '');
code = code.replace('        </>\\r\\n        )\\r\\n        }', '');

fs.writeFileSync('src/components/HomeScreen.tsx', code);
console.log("Removed rogue tags");
