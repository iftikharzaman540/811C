const fs = require('fs');
let code = fs.readFileSync('backend/src/gregmorn/gregmorn.service.ts', 'utf8');
code = code.replace(
  /throw new InternalServerErrorException\('Failed to launch game'\);/g,
  "throw new require('@nestjs/common').HttpException(error.message || 'Failed to launch game', 400);"
);
fs.writeFileSync('backend/src/gregmorn/gregmorn.service.ts', code);
