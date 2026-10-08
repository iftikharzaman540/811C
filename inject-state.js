const fs = require('fs');
const path = 'src/components/HomeScreen.tsx';
let content = fs.readFileSync(path, 'utf8');

const targetStr = "export default function HomeScreen({ onLoginClick, onRegisterClick }: HomeScreenProps) {";
const stateInjection = `  const [showWhatsApp, setShowWhatsApp] = useState(true);`;

if (content.includes("showWhatsApp")) {
  console.log("State already exists");
} else {
  content = content.replace(targetStr, targetStr + "\n" + stateInjection);
  fs.writeFileSync(path, content);
  console.log("Injected state");
}
