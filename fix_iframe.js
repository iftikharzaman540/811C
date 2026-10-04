const fs = require('fs');
let content = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

const regex = /<iframe[\s\S]*?className="w-full flex-1 border-0"[\s\S]*?\/>/;
const replacement = `<div className="flex-1 w-full relative overflow-y-auto overflow-x-hidden" style={{ WebkitOverflowScrolling: 'touch' }}>
              <iframe 
                src={gameUrl} 
                className="absolute inset-0 w-full h-full border-0"
                allow="autoplay; fullscreen"
                scrolling="yes"
              />
            </div>`;

if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync('src/components/HomeScreen.tsx', content);
    console.log("Success!");
} else {
    console.log("Could not find the target string.");
}
