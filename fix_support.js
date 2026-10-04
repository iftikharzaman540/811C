const fs = require('fs');
let content = fs.readFileSync('src/app/support/page.tsx', 'utf8');
content = content.replace(/className=\{.ex-1 py-3 text-\[14px\] font-medium relative transition-colors \}/, "className={\lex-1 py-3 text-[14px] font-medium relative transition-colors \\}");
fs.writeFileSync('src/app/support/page.tsx', content);
