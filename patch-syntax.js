const fs = require('fs');
const file = 'src/components/HomeScreen.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
    /\(window as any\)\.handleLaunchGame = async\r?\n\s*\(gameIdOrName: string\) => \{/g,
    "(window as any).handleLaunchGame = async (gameIdOrName: string) => {"
);

fs.writeFileSync(file, code);
console.log("Fixed syntax error");
