const fs = require('fs');
let c = fs.readFileSync('src/app/admin/system/vip-history/page.tsx', 'utf8');
c = c.replace(/href=\{'\/admin\/users\/' \+ record\.user_id\}\}/, "href={'/admin/users/' + record.user_id}");
fs.writeFileSync('src/app/admin/system/vip-history/page.tsx', c);
