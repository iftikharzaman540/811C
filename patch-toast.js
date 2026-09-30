const fs = require('fs');
let code = fs.readFileSync('src/app/support/page.tsx', 'utf8');

if (!code.includes('import toast from "react-hot-toast";')) {
  code = 'import toast from "react-hot-toast";\\n' + code;
}

fs.writeFileSync('src/app/support/page.tsx', code);
