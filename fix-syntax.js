const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

// The original code had:
// code = code.replace(
//  '        {/* Bottom Navigation */}',
//  '        </>\n        )\n        }\n\n        {/* Bottom Navigation */}'
// );
// Which didn't do anything because Bottom Navigation was gone.

code = code.replace(
  '        {/* Fixed Left Global Popups */}',
  '        </>\n        )\n        }\n\n        {/* Fixed Left Global Popups */}'
);

fs.writeFileSync('src/components/HomeScreen.tsx', code);
console.log('Fixed syntax error!');
