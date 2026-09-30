const fs = require('fs');

let file = '/var/www/gaming-app/backend/src/gregmorn/gregmorn.service.ts';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('logger.log(`openGame Payload')) {
  code = code.replace(
    'const bodyString = JSON.stringify(payload);',
    'const bodyString = JSON.stringify(payload);\n    this.logger.log(`openGame Payload: ${bodyString}`);'
  );
  code = code.replace(
    'const data = await response.json();',
    'const responseText = await response.text();\n      this.logger.log(`openGame Response: ${responseText} (Status: ${response.status})`);\n      const data = JSON.parse(responseText);'
  );
  fs.writeFileSync(file, code);
  console.log("Patched!");
} else {
  console.log("Already patched");
}
