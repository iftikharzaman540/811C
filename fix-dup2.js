const fs = require('fs');
let code = fs.readFileSync('src/components/WithdrawScreen.tsx', 'utf8');

const lines = code.split('\n');
let newLines = [];
let foundReq = false;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('const req = Number(user?.current_wagering_requirement || 0);')) {
    if (foundReq) {
      // skip this and the next 5 lines
      i += 5;
      continue;
    }
    foundReq = true;
  }
  newLines.push(lines[i]);
}

fs.writeFileSync('src/components/WithdrawScreen.tsx', newLines.join('\n'));
console.log("Fixed dup variables");
