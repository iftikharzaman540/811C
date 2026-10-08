const fs = require('fs');
let profilePage = fs.readFileSync('src/app/profile/page.tsx', 'utf8');

// Replace totalDeposited with totalWagered in progress logic
profilePage = profilePage.replace(/vipStatus\.totalDeposited \/ vipStatus\.requiredForNext/g, 'vipStatus.totalWagered / vipStatus.requiredForNext');
profilePage = profilePage.replace(/vipStatus\?\.totalDeposited/g, 'vipStatus?.totalWagered');

fs.writeFileSync('src/app/profile/page.tsx', profilePage);

console.log('Updated profile page to use totalWagered');
