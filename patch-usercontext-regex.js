const fs = require('fs');
let userCtx = fs.readFileSync('src/context/UserContext.tsx', 'utf8');

const newType = `type User = {
  id: string;
  phone?: string;
  email?: string;
  balance: number;
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
  current_wagering_requirement?: number;
  current_wagering_completed?: number;
  today_withdrawals_count?: number;
  [key: string]: any;
};`;

userCtx = userCtx.replace(/type User = \{[\s\S]*?\};/m, newType);
fs.writeFileSync('src/context/UserContext.tsx', userCtx);
console.log("UserContext patched with regex");
