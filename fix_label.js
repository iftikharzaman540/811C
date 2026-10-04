const fs = require('fs');
let content = fs.readFileSync('src/components/AuthScreen.tsx', 'utf8');

// Replace <label className="flex items-start gap-2 mt-1 cursor-pointer">
content = content.replace(/<label className="flex items-start gap-2 mt-1 cursor-pointer">/, '<div className="flex items-start gap-2 mt-1">');

// Replace the closing </label> for that specific block
// The block ends around line 245
content = content.replace(/<\/label>\s*\{\/\* Register Button \*\/\}/, '</div>\n\n                {/* Register Button */}');

// Let's just do a string replacement for the specific block.
