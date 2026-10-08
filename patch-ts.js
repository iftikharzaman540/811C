const fs = require('fs');
let promoPage = fs.readFileSync('src/app/promo/page.tsx', 'utf8');
promoPage = promoPage.replace(/window\.claimVipBonus && window\.claimVipBonus/g, '(window as any).claimVipBonus && (window as any).claimVipBonus');
fs.writeFileSync('src/app/promo/page.tsx', promoPage);
console.log('Fixed typescript error');
