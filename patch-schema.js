const fs = require('fs');
let code = fs.readFileSync('backend/prisma/schema.prisma', 'utf8');

const broadcastModel = `
model AdminBroadcast {
  id         String   @id @default(uuid())
  title      String
  message    String
  type       String
  sent_to    Int
  target     String   @default("ALL") // "ALL" or specific user_id
  created_at DateTime @default(now())
}
`;

code = code.replace(
  "// PHASE 5 - ADMIN PANEL MODELS",
  broadcastModel + "\n// PHASE 5 - ADMIN PANEL MODELS"
);

fs.writeFileSync('backend/prisma/schema.prisma', code);
console.log("Added AdminBroadcast model");
