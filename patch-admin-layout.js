const fs = require('fs');
let code = fs.readFileSync('src/app/admin/layout.tsx', 'utf8');

code = code.replace(/\{ name: "Promo Codes", href: "\/admin\/marketing\/promocodes" \},/, 
`{ name: "Promo Codes", href: "/admin/marketing/promocodes" },
        { name: "Promo Events", href: "/admin/marketing/events" },`);

fs.writeFileSync('src/app/admin/layout.tsx', code);
console.log("Added to Admin layout!");
