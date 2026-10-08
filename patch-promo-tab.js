const fs = require('fs');
let content = fs.readFileSync('src/app/promo/page.tsx', 'utf8');

if (!content.includes('useSearchParams')) {
  content = content.replace(
    'import { useState, useEffect } from "react";',
    'import { useState, useEffect } from "react";\nimport { useSearchParams } from "next/navigation";'
  );
  
  content = content.replace(
    'export default function PromoPage() {',
    'export default function PromoPage() {\n  const searchParams = useSearchParams();'
  );
  
  content = content.replace(
    'const [activeTopTab, setActiveTopTab] = useState("Event");',
    'const [activeTopTab, setActiveTopTab] = useState("Event");\n\n  useEffect(() => {\n    const tab = searchParams.get("tab");\n    if (tab && topTabs.includes(tab)) {\n      setActiveTopTab(tab);\n    }\n  }, [searchParams]);'
  );
  
  fs.writeFileSync('src/app/promo/page.tsx', content);
  console.log('Patched promo tab parameter handling.');
} else {
  console.log('useSearchParams already present.');
}
