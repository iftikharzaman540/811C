const fs = require('fs');
const path = 'src/components/HomeScreen.tsx';
let content = fs.readFileSync(path, 'utf8');

const targetStr = `export default function HomeScreen({ onLoginClick, onRegisterClick }: { onLoginClick?: () => void, onRegisterClick?: () => void }) {`;
const replaceStr = targetStr + `\n  const [showWhatsApp, setShowWhatsApp] = useState(true);`;

if(content.includes(targetStr)) {
  content = content.replace(targetStr, replaceStr);
  fs.writeFileSync(path, content);
  console.log("Successfully injected state declaration");
} else {
  console.log("Could not find the target string!");
}
