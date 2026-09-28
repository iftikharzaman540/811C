const fs = require('fs');
const file = 'src/components/HomeScreen.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  '  return (\r\n    <>\r\n      {/* Game Iframe Overlay */}',
  '  return (\r\n    <div className="w-full">\r\n      {/* Game Iframe Overlay */}'
);
code = code.replace(
  '  return (\n    <>\n      {/* Game Iframe Overlay */}',
  '  return (\n    <div className="w-full">\n      {/* Game Iframe Overlay */}'
);

const endStr = '    </div>\r\n    </>\r\n  );\r\n}';
code = code.replace(endStr, '    </div>\r\n    </div>\r\n  );\r\n}');
const endStr2 = '    </div>\n    </>\n  );\n}';
code = code.replace(endStr2, '    </div>\n    </div>\n  );\n}');

fs.writeFileSync(file, code);
console.log('Fixed for sure sure');
