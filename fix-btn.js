const fs = require('fs');
let c = fs.readFileSync('src/app/admin/finances/wallet-adjustments/page.tsx', 'utf8');
c = c.replace(/<button onClick=\{\(\) => setShowModal\(false\)\} className="text-neutral-400 hover:text-white">.*?<\/button>/, '<button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-white"><X className="w-5 h-5" /></button>');
if (!c.includes("import { Plus, History, ArrowUpRight, ArrowDownRight, X }")) {
  c = c.replace("import { Plus, History, ArrowUpRight, ArrowDownRight } from 'lucide-react';", "import { Plus, History, ArrowUpRight, ArrowDownRight, X } from 'lucide-react';");
}
fs.writeFileSync('src/app/admin/finances/wallet-adjustments/page.tsx', c);
console.log('Fixed button');
