const fs = require('fs');
let code = fs.readFileSync('src/app/admin/finances/deposits/page.tsx', 'utf8');

code = code.replace(
  /<div className="text-neutral-600 text-\[10px\] mt-1">\{dep\.id\}<\/div>/,
  '<div className="text-neutral-600 text-[10px] mt-1">{dep.id}</div>\n                         <div className="text-[#ffdf00] text-[10px] mt-1 break-all">Merchant ID: {dep.metadata?.webhook_data?.orderNo || dep.metadata?.gatewayOrderNo || \'N/A\'}</div>'
);

fs.writeFileSync('src/app/admin/finances/deposits/page.tsx', code);
