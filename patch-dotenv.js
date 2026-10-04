const fs = require('fs');
const file = 'backend/src/main.ts';
let code = fs.readFileSync(file, 'utf8');

code = "import * as dotenv from 'dotenv';\ndotenv.config();\n" + code;

fs.writeFileSync(file, code);
console.log("Added dotenv to main.ts");
