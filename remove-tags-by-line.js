const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/HomeScreen.tsx');
let lines = fs.readFileSync(filePath, 'utf8').split('\\n');

let targetIdx = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('{/* Fixed Left Global Popups */}')) {
    targetIdx = i;
    break;
  }
}

if (targetIdx !== -1) {
  // Let's go backwards and remove the closing tags
  for (let i = targetIdx - 1; i >= 0; i--) {
    let text = lines[i].trim();
    if (text === '}') {
      lines.splice(i, 1);
      targetIdx--;
    } else if (text === ')') {
      lines.splice(i, 1);
      targetIdx--;
    } else if (text === '</>') {
      lines.splice(i, 1);
      targetIdx--;
      break; // Found the start of the closing block
    } else if (text === '') {
      // Empty line, keep going
    } else {
      break; // Reached something else, stop
    }
  }
  
  fs.writeFileSync(filePath, lines.join('\\n'));
  console.log("Removed the tags by line accurately!");
} else {
  console.log("Could not find Fixed Left Global Popups");
}
