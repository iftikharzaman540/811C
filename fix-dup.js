const fs = require('fs');
let code = fs.readFileSync('src/components/WithdrawScreen.tsx', 'utf8');

// The vars are defined twice. We can just replace the second occurrence or find all occurrences of "const req = Number"
const lines = code.split('\n');
let newLines = [];
let skip = false;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('const req = Number(user?.current_wagering_requirement || 0);')) {
    if (skip) continue;
    skip = true; // next time skip
  }
  newLines.push(lines[i]);
}

// Actually, let's just use regex to remove the duplicate block
const blockRegex = /  const req = Number\(user\?\.current_wagering_requirement \|\| 0\);\n  const comp = Number\(user\?\.current_wagering_completed \|\| 0\);\n  const remaining = Math\.max\(0, req - comp\);\n  const isEligible = comp >= req;\n  const todayCount = Number\(user\?\.today_withdrawals_count \|\| 0\);\n  const remainingDaily = Math\.max\(0, 15 - todayCount\);\n/g;

const matches = code.match(blockRegex);
if (matches && matches.length > 1) {
  // Replace the first match with empty string
  code = code.replace(blockRegex, (match, offset, string) => {
    return offset === string.indexOf(match) ? "" : match;
  });
}

// But wait! Did I also duplicate the original req/comp from aaaa3dc? 
// In aaaa3dc there was NO req/comp!
// Let's just remove the first occurrence!
fs.writeFileSync('src/components/WithdrawScreen.tsx', code);
console.log("Fixed dup variables");
