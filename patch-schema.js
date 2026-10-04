const fs = require('fs');
let code = fs.readFileSync('backend/prisma/schema.prisma', 'utf8');

code = code.replace(
  "password_hash String",
  "password_hash String\n  active_session_id String?"
);

fs.writeFileSync('backend/prisma/schema.prisma', code);
console.log("Added active_session_id to schema!");
