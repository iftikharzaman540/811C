const fs = require('fs');
let code = fs.readFileSync('src/components/DepositScreen.tsx', 'utf8');

// Replace state with useRef
code = code.replace(/const \[popupWindow, setPopupWindow\] = useState<Window \| null>\(null\);/g, 'const popupWindowRef = useRef<Window | null>(null);');

// Fix assignments
code = code.replace(/setPopupWindow\(popup\);/g, 'popupWindowRef.current = popup;');
code = code.replace(/if \(popupWindow\) popupWindow\.close\(\);/g, 'if (popupWindowRef.current) popupWindowRef.current.close();');
code = code.replace(/setPopupWindow\(null\);/g, 'popupWindowRef.current = null;');

// Add useRef import if needed
if (!code.includes('useRef')) {
  code = code.replace(/import React, \{ useState, useEffect \} from "react";/, 'import React, { useState, useEffect, useRef } from "react";');
}

fs.writeFileSync('src/components/DepositScreen.tsx', code);
console.log("Patched popup window to use useRef");
