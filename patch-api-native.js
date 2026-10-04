const fs = require('fs');
const file = 'src/components/HomeScreen.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /const API_URL = process\.env\.NEXT_PUBLIC_API_URL \|\| "http:\/\/169\.58\.50\.184:4000\/api\/v1";/g,
  'const API_URL = "/api/v1";'
);

fs.writeFileSync(file, code);
console.log("Patched API_URL to use /api/v1 natively");
