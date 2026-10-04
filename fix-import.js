const fs = require('fs');
let code = fs.readFileSync('src/components/DepositScreen.tsx', 'utf8');
code = code.replace(/import \{ useState, useEffect \} from "react";/, 'import { useState, useEffect, useRef } from "react";');
fs.writeFileSync('src/components/DepositScreen.tsx', code);
console.log("Fixed useRef import");
