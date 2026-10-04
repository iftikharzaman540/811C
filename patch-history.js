const fs = require('fs');
let code = fs.readFileSync('src/app/admin/notifications/history/page.tsx', 'utf8');

code = code.replace("import { format } from 'date-fns';", "");
code = code.replace(
  /{format\(new Date\(item\.created_at\), 'dd MMM yyyy, HH:mm'\)}/,
  "{new Date(item.created_at).toLocaleString()}"
);

fs.writeFileSync('src/app/admin/notifications/history/page.tsx', code);
console.log("Removed date-fns dependency!");
