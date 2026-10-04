const fs = require('fs');
let content = fs.readFileSync('src/app/support/page.tsx', 'utf8');

// Cyan/Blue to Yellow
content = content.replace(/#00aaff/g, '#ffdf00');

// Gradient for avatar
content = content.replace(/from-\[#ffdf00\] to-\[#0055ff\]/g, 'from-[#ffdf00] to-[#cc0000]');

// Cyan shadow to Yellow shadow
content = content.replace(/rgba\(0,170,255,0.3\)/g, 'rgba(255,223,0,0.3)');

// Dark purple button to Red border button
content = content.replace(/bg-gradient-to-r from-\[#211144\] to-\[#3a1b7a\] border border-\[#4c2299\] text-white/g, 'border border-[#ff0b0b] text-[#ffdf00] hover:bg-[#2e0505]');
content = content.replace(/bg-gradient-to-r from-\[#3a1b7a\] to-\[#4c2299\] border border-\[#5d2bbc\] text-white/g, 'border border-[#ff0b0b] text-[#ffdf00] hover:bg-[#2e0505]');

// Dark purple background for list items
content = content.replace(/bg-\[#2b2447\] hover:bg-\[#342b57\]/g, 'bg-[#1c1c1c] hover:bg-[#252525]');

fs.writeFileSync('src/app/support/page.tsx', content);
