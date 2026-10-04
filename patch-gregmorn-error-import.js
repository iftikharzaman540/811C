const fs = require('fs');
let code = fs.readFileSync('backend/src/gregmorn/gregmorn.service.ts', 'utf8');
code = code.replace(
  "import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';",
  "import { Injectable, InternalServerErrorException, Logger, HttpException } from '@nestjs/common';"
);
fs.writeFileSync('backend/src/gregmorn/gregmorn.service.ts', code);
