const fs = require('fs');
let code = fs.readFileSync('backend/src/gregmorn/gregmorn.service.ts', 'utf8');
code = code.replace(
  "new require('@nestjs/common').HttpException",
  "new HttpException"
);
fs.writeFileSync('backend/src/gregmorn/gregmorn.service.ts', code);
