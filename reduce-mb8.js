const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

// Replace mb-8 with mb-4 to reduce extra space between sections
code = code.replace(/className="mb-8 px-4 scroll-mt-\[100px\]"/g, 'className="mb-4 px-4 scroll-mt-[100px]"');
code = code.replace(/className="mb-8 px-4 pb-4"/g, 'className="mb-4 px-4 pb-4"'); // line 1053

fs.writeFileSync('src/components/HomeScreen.tsx', code);
