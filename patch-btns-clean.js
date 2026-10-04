const fs = require('fs');
let code = fs.readFileSync('src/app/support/page.tsx', 'utf8');
const lines = code.split('\\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('Proxy Problem') && lines[i-1].includes('<button')) {
    lines[i-1] = '                  <button onClick={() => toast.success("Fetching Proxy FAQ...")} className="shrink-0 flex items-center gap-1.5 bg-[#141414] border border-neutral-700 text-neutral-300 hover:text-white hover:border-[#ffdf00] transition-colors text-[12px] font-medium px-3 py-1.5 rounded">';
  }
  if (lines[i].includes('Reload Que') && lines[i-1].includes('<button')) {
    lines[i-1] = '                  <button onClick={() => toast.success("Fetching Reload FAQ...")} className="shrink-0 flex items-center gap-1.5 bg-[#141414] border border-neutral-700 text-neutral-300 hover:text-white hover:border-[#ffdf00] transition-colors text-[12px] font-medium px-3 py-1.5 rounded">';
  }
}
fs.writeFileSync('src/app/support/page.tsx', lines.join('\\n'));
