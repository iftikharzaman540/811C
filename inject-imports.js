const fs = require('fs');
const path = 'src/components/HomeScreen.tsx';
let content = fs.readFileSync(path, 'utf8');

const targetStr = "MessageSquare } from \"lucide-react\";";
const replaceStr = "MessageSquare, X, ChevronUp } from \"lucide-react\";";

if(content.includes(targetStr)) {
  content = content.replace(targetStr, replaceStr);
  fs.writeFileSync(path, content);
  console.log("Added X and ChevronUp to lucide imports");
} else {
  console.log("Could not find lucide-react import string");
}
