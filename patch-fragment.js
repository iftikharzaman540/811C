const fs = require('fs');
const file = 'src/components/HomeScreen.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /return \(\n\s*\{\/\* Game Iframe Overlay \*\/\}/g,
  'return (\n    <>\n      {/* Game Iframe Overlay */}'
);

const endStr = '    </div>\n  );\n}';
code = code.replace(endStr, '    </div>\n    </>\n  );\n}');

fs.writeFileSync(file, code);
console.log('Fixed fragment');
