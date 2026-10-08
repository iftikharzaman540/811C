const fs = require('fs');
const path = 'src/components/AuthScreen.tsx';
let content = fs.readFileSync(path, 'utf8');

const startStr = '<div className="relative flex py-4 items-center">';
const endStr = '</button>\n              </div>';

const startIdx = content.indexOf(startStr);
const endIdx = content.indexOf(endStr, startIdx);

if (startIdx !== -1 && endIdx !== -1) {
  // Find the start of the line for startIdx
  const actualStart = content.lastIndexOf('\n', startIdx);
  // Find the end of the line for endIdx
  const actualEnd = content.indexOf('\n', endIdx + endStr.length);
  
  const newContent = content.substring(0, actualStart) + content.substring(actualEnd);
  fs.writeFileSync(path, newContent);
  console.log('Success, removed from', actualStart, 'to', actualEnd);
} else {
  console.log('Not found');
  console.log('startIdx:', startIdx);
  console.log('endIdx:', endIdx);
}
