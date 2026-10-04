const fs = require('fs');
let code = fs.readFileSync('src/components/DepositScreen.tsx', 'utf8');

// I will just do a targeted replace for the promo section.
const regex = /\{ bonus: "7\.00"[\s\S]*?hidden: true \},/m;

const newPromo = `{ bonus: "7.00", tag: "Deposit again 100 to receive", condition: "Total deposit >= 100" },
                { bonus: "20.00", condition: "First Deposit >= 300" },
                { bonus: "17.00", tag: "Deposit again 500 to receive", condition: "Total deposit >= 500" },
                { bonus: "30.00", condition: "First Deposit >= 600", hidden: true },
                { bonus: "50.00", condition: "First Deposit >= 1,000", hidden: true },`;

code = code.replace(regex, newPromo);

// Fix the corrupted coin character
code = code.replace(/<div className="w-4 h-4 bg-\[#332a00\][^>]*>[\s\S]*?<\/div>/m, `<div className="w-4 h-4 bg-[#332a00] rounded-full flex items-center justify-center text-[10px] text-[#ffdf00] border border-[#ffdf00]/50">
                C
             </div>`);

fs.writeFileSync('src/components/DepositScreen.tsx', code);
console.log("Fixed unicode in promo array");
