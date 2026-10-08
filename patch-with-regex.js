const fs = require('fs');
const path = 'src/app/withdrawal-history/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const regex = /<div className="flex justify-between items-center mt-2">[\s\S]*?<\/div>\s*<\/div>/g;
const replacement = `$&
                  
                  {record.status === 'PENDING' && (
                    <div className="mt-3 p-2 rounded bg-yellow-500/10 border border-yellow-500/20 text-[11px] text-yellow-500/90 leading-tight">
                      Due to the high volume of withdrawal requests, processing may take 1–2 hours and, in some cases, up to approximately 24 hours. We appreciate your patience and understanding.
                    </div>
                  )}`;

content = content.replace(regex, replacement);
fs.writeFileSync(path, content);
console.log('Patched via regex');
