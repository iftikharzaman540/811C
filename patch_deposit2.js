const fs = require('fs');
let code = fs.readFileSync('src/components/DepositScreen.tsx', 'utf8');

code = code.replace(
  /if \(resData\.payment_url\) \{\s*window\.open\(resData\.payment_url, "_blank"\);\s*\}/g,
  '// No redirect to fake payment url'
);

fs.writeFileSync('src/components/DepositScreen.tsx', code);
