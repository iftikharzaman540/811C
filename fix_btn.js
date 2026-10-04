const fs = require('fs');
let content = fs.readFileSync('src/components/AuthScreen.tsx', 'utf8');
content = content.replace(/<span className="text-\[\#ffdf00\]">.*?User Agreement.*?<\/span>/, '<button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowAgreement(true); }} className="text-[#ffdf00] hover:underline">«User Agreement»</button>');
fs.writeFileSync('src/components/AuthScreen.tsx', content);
