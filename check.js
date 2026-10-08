const fs = require('fs');
const content = fs.readFileSync('src/app/promo/page.tsx', 'utf8');
if (content.includes('Wagering Progress')) {
    console.log("IT IS THERE");
} else {
    console.log("IT IS NOT THERE");
}
