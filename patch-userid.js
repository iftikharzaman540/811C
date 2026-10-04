const fs = require('fs');
const file = 'backend/src/gregmorn/gregmorn.service.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "this.accessToken = data.accessToken;",
  "this.accessToken = data.accessToken;\n      this.userId = data.user.id;"
);
// In getGames, we should make sure we have userId. But login() is called first, which sets it!

fs.writeFileSync(file, code);
console.log("Patched dynamic userId");
