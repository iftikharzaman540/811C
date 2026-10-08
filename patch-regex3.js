const fs = require('fs');
const path = 'src/components/AuthScreen.tsx';
let content = fs.readFileSync(path, 'utf8');

const regex = /<div className="relative flex py-4 items-center">[\s\S]*?{([^}]*?Close button at bottom[^}]*?)}/g;
content = content.replace(regex, '{$1}');

fs.writeFileSync(path, content);
console.log('Success regex replace');
