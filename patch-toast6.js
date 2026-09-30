const fs = require('fs');
let code = fs.readFileSync('src/app/support/page.tsx', 'utf8');

code = code.replace('"use client";\\nimport toast from "react-hot-toast";', '"use client";\nimport toast from "react-hot-toast";');

fs.writeFileSync('src/app/support/page.tsx', code);
