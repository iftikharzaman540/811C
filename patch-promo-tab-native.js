const fs = require('fs');
let content = fs.readFileSync('src/app/promo/page.tsx', 'utf8');

// Revert useSearchParams import
content = content.replace(
  'import { useState, useEffect } from "react";\nimport { useSearchParams } from "next/navigation";',
  'import { useState, useEffect } from "react";'
);

// Remove the searchParams variable
content = content.replace(
  'export default function PromoPage() {\n  const searchParams = useSearchParams();',
  'export default function PromoPage() {'
);

// Replace the useEffect block that used searchParams
content = content.replace(
  'const [activeTopTab, setActiveTopTab] = useState("Event");\n\n  useEffect(() => {\n    const tab = searchParams.get("tab");\n    if (tab && topTabs.includes(tab)) {\n      setActiveTopTab(tab);\n    }\n  }, [searchParams]);',
  `const [activeTopTab, setActiveTopTab] = useState("Event");\n\n  useEffect(() => {\n    if (typeof window !== "undefined") {\n      const params = new URLSearchParams(window.location.search);\n      const tab = params.get("tab");\n      if (tab && topTabs.includes(tab)) {\n        setActiveTopTab(tab);\n      }\n    }\n  }, []);`
);

fs.writeFileSync('src/app/promo/page.tsx', content);
console.log('Patched promo tab parameter handling to use native window.location.search');
