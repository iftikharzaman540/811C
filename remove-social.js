const fs = require('fs');
const path = 'src/components/AuthScreen.tsx';
const lines = fs.readFileSync(path, 'utf8').split('\n');

const startIdx = lines.findIndex(l => l.includes('<div className="relative flex py-4 items-center">'));
const endIdx = lines.findIndex((l, i) => i > startIdx && l.includes('</div>') && lines[i+1] && lines[i+1].includes('</div>') && lines[i+2] && lines[i+2].includes('</div>') && lines[i+3] && lines[i+3].includes('{/* Close button at bottom */}'));

console.log(startIdx, endIdx);

if(startIdx !== -1 && endIdx !== -1) {
  const newLines = [...lines.slice(0, startIdx), ...lines.slice(endIdx)];
  fs.writeFileSync(path, newLines.join('\n'));
}
