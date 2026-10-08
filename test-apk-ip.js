const fs = require('fs');
const data = fs.readFileSync('public/8111c.apk', 'utf8');
if(data.includes('169.58.50.184')) console.log('Contains IP');
if(data.includes('3000')) console.log('Contains 3000');
