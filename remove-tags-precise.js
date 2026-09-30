const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

// I will just replace the exact preceding characters
code = code.replace('        </>\\r\\n        )\\r\\n        }\\r\\n\\r\\n        {/* Fixed Left Global Popups */}', '        {/* Fixed Left Global Popups */}');
code = code.replace('        </>\\n        )\\n        }\\n\\n        {/* Fixed Left Global Popups */}', '        {/* Fixed Left Global Popups */}');

fs.writeFileSync('src/components/HomeScreen.tsx', code);
console.log("Removed rogue closing tags precisely!");
