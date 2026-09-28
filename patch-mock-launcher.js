const fs = require('fs');
const file = 'src/components/HomeScreen.tsx';
let code = fs.readFileSync(file, 'utf8');

const regex = /\(window as any\)\.handleLaunchGame = async \(gameName: string\) => \{[\s\S]*?\} catch \(e\) \{[\s\S]*?\}\s*\};/;

const replacement = `(window as any).handleLaunchGame = async (gameName: string) => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to play games!");
        if (onLoginClick) onLoginClick();
        return;
      }
      toast.error(\`"\${gameName}" is a UI Demo. Please play real games from the 'Slot Game' section below!\`, { duration: 4000 });
    };`;

code = code.replace(regex, replacement);
fs.writeFileSync(file, code);
console.log("Patched mock launcher");
