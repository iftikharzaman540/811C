const fs = require('fs');
const file = 'src/components/HomeScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace imports
content = content.replace('Facebook, Instagram, Send, Twitter', 'Globe as Web, Camera, Send, MessageSquare');

// Replace usage
content = content.replace('<Facebook className="w-4 h-4 text-white" />', '<Web className="w-4 h-4 text-white" />');
content = content.replace('<Instagram className="w-4 h-4 text-white" />', '<Camera className="w-4 h-4 text-white" />');
content = content.replace('<Twitter className="w-4 h-4 text-white" />', '<MessageSquare className="w-4 h-4 text-white" />');

fs.writeFileSync(file, content, 'utf8');
console.log("REPLACED ICONS SUCCESSFULLY");
