const fs = require('fs');
const path = 'src/components/AuthScreen.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace('            {/* Close button at bottom */}', '          </div>\n        </div>\n\n        {/* Close button at bottom */}');

fs.writeFileSync(path, content);
console.log('Fixed divs');
