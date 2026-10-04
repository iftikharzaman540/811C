const fs = require('fs');
const lines = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8').split('\n');

let start = -1;
let end = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('{/* Alliance Cards (Beautiful) */}')) {
    start = i;
  }
  if (lines[i].includes('{/* Category Navigation Slider (Beautiful) */}')) {
    end = i;
    break;
  }
}

if (start !== -1 && end !== -1) {
  lines.splice(start, end - start);
  fs.writeFileSync('src/components/HomeScreen.tsx', lines.join('\n'));
  console.log("Removed from " + start + " to " + end);
} else {
  console.error("Could not find boundaries");
}
