const fs = require('fs');
let code = fs.readFileSync('src/app/profile/page.tsx', 'utf8');

// Replace the two occurrences of window.location.href = '/promo?tab=VIP'
code = code.replace(/onClick=\{\(\) => window\.location\.href = '\/promo\?tab=VIP'\}/g, 'onClick={() => router.push("/vip")}');

fs.writeFileSync('src/app/profile/page.tsx', code);
console.log('Patched profile to redirect to /vip');
