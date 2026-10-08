const fs = require('fs');
const path = 'src/components/HomeScreen.tsx';
let content = fs.readFileSync(path, 'utf8');

const targetStr = 'https://whatsapp.com/channel/0029ValN0e0CxoAx5w2Y0O0q';
const replaceStr = 'https://whatsapp.com/channel/0029VbDJdVw7j6gCK3T1YG0i';

if(content.includes(targetStr)) {
  content = content.replace(targetStr, replaceStr);
  fs.writeFileSync(path, content);
  console.log("Updated WhatsApp channel link");
} else {
  console.log("Could not find dummy WA string");
}
