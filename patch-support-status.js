const fs = require('fs');
let code = fs.readFileSync('backend/src/support/support.service.ts', 'utf8');

code = code.replace(/where: \{ user_id: userId, status: 'OPEN' \}/, "where: { user_id: userId, status: { in: ['OPEN', 'IN_PROGRESS'] } }");

fs.writeFileSync('backend/src/support/support.service.ts', code);
console.log("Updated support service to find OPEN or IN_PROGRESS tickets");
