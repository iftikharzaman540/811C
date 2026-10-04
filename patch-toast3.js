const fs = require('fs');
let code = fs.readFileSync('src/app/support/page.tsx', 'utf8');

code = code.replace('import toast from "react-hot-toast";\\n"use client";', '"use client";\\nimport toast from "react-hot-toast";');

fs.writeFileSync('src/app/support/page.tsx', code);
