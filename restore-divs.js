const fs = require('fs');
const path = 'src/components/AuthScreen.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace('            {/* Close button at bottom */}\n        <div className="flex justify-center mt-5 mb-8">', '          </div>\n        </div>\n        \n        {/* Close button at bottom */}\n        <div className="flex justify-center mt-5 mb-8">');

fs.writeFileSync(path, content);
console.log('Restored divs');
