const fs = require('fs');
const data = fs.readFileSync('public/8111c.apk', 'utf8');
const matches = data.match(/https?:\/\/[a-zA-Z0-9.-]+/g);
if(matches) console.log([...new Set(matches)]);
