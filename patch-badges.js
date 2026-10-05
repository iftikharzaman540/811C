const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

// Remove ArrowLeft 6 badge
code = code.replace(/<span className="absolute -top-1 -right-1 bg-\[#ff4747\] text-white text-\[10px\] font-bold w-4 h-4 rounded-full flex items-center justify-center">6<\/span>/g, '');

// Remove Offer Center 3, 1, 2 badges
code = code.replace(/<span className="absolute -top-1 right-0 bg-\[#ff4747\] text-white text-\[10px\] font-bold px-1\.5 min-w-\[16px\] h-4 rounded-full flex items-center justify-center z-20">\d<\/span>/g, '');

fs.writeFileSync('src/components/HomeScreen.tsx', code);
