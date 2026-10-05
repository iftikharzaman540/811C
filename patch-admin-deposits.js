const fs = require('fs');
let code = fs.readFileSync('src/app/admin/finances/deposits/page.tsx', 'utf8');

code = code.replace(
  '<th className="px-6 py-4 font-medium">Amount</th>',
  '<th className="px-6 py-4 font-medium">Payment Account</th>\n                <th className="px-6 py-4 font-medium">Amount</th>'
);

code = code.replace(
  '<td className="px-6 py-4 font-bold text-green-500">',
  '<td className="px-6 py-4">\n                        <span className="text-white font-mono bg-neutral-800 px-2 py-1 rounded text-xs">{dep.metadata?.accountNo || \'N/A\'}</span>\n                      </td>\n                      <td className="px-6 py-4 font-bold text-green-500">'
);

fs.writeFileSync('src/app/admin/finances/deposits/page.tsx', code);
