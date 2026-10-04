const fs = require('fs');

function patchTheme(file) {
    let code = fs.readFileSync(file, 'utf8');

    // Backgrounds
    code = code.replace(/bg-\[#1a103c\]/g, 'bg-[#111]');
    code = code.replace(/bg-\[#241744\]/g, 'bg-[#1a1a1a]');
    code = code.replace(/bg-\[#190f33\]/g, 'bg-[#1a1a1a]');
    code = code.replace(/bg-\[#20153f\]/g, 'bg-[#151515]');
    code = code.replace(/from-\[#2a1b54\] via-\[#1a103c\] to-\[#0a0518\]/g, 'from-neutral-900 via-[#111] to-black');
    
    // Borders
    code = code.replace(/border-\[#3d2773\]/g, 'border-neutral-800');
    code = code.replace(/border-\[#2d1b54\]/g, 'border-neutral-800');
    
    // Accents
    code = code.replace(/text-\[#4a90e2\]/g, 'text-[#ffdf00]');
    code = code.replace(/border-\[#4a90e2\]/g, 'border-[#ffdf00]');
    
    // Remove the purple image overlay completely
    code = code.replace(/<div\s*className="absolute inset-0 z-0 opacity-40 mix-blend-overlay bg-cover bg-center pointer-events-none"\s*style=\{\{ backgroundImage: "url\('\/casino-bg-placeholder\.jpg'\)" \}\}\s*><\/div>/g, '');

    fs.writeFileSync(file, code);
}

patchTheme('src/app/deposit-history/page.tsx');
patchTheme('src/app/withdrawal-history/page.tsx');
console.log("Patched themes!");
