const fs = require('fs');
let code = fs.readFileSync('src/app/support/page.tsx', 'utf8');

const lines = code.split('\\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('Proxy Problem') && lines[i].includes('<button')) {
    lines[i] = lines[i].replace('<button className=', `<button onClick={() => toast.success('Fetching Proxy FAQ...')} className=`);
    lines[i] = lines[i].replace('text-neutral-300', 'text-neutral-300 hover:text-white hover:border-[#ffdf00] transition-colors');
  }
  if (lines[i].includes('Reload Que') && lines[i].includes('<button')) {
    lines[i] = lines[i].replace('<button className=', `<button onClick={() => toast.success('Fetching Reload FAQ...')} className=`);
    lines[i] = lines[i].replace('text-neutral-300', 'text-neutral-300 hover:text-white hover:border-[#ffdf00] transition-colors');
  }
}

fs.writeFileSync('src/app/support/page.tsx', lines.join('\\n'));
console.log("Updated proxy and reload buttons");
