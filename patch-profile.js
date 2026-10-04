const fs = require('fs');
let content = fs.readFileSync('src/app/profile/page.tsx', 'utf8');

if (!content.includes('useUser')) {
  content = content.replace(
    'import { Copy, RefreshCcw, Banknote, ShieldCheck, Mail, History, HelpCircle, Download, FileText, ChevronRight, Settings } from "lucide-react";',
    'import { Copy, RefreshCcw, Banknote, ShieldCheck, Mail, History, HelpCircle, Download, FileText, ChevronRight, Settings } from "lucide-react";\nimport { useUser } from "@/context/UserContext";'
  );

  content = content.replace(
    'export default function ProfileScreen() {',
    'export default function ProfileScreen() {\n  const { user } = useUser();'
  );

  content = content.replace(
    '<span className="text-neutral-400 text-[13px] leading-tight">Please first <span className="text-white font-bold">Login</span> Or <span className="text-white font-bold">Register</span></span>',
    '{user ? <div className="flex flex-col"><span className="text-white font-bold text-[14px]">{user.phone || user.email}</span><span className="text-[#ffdf00] font-bold text-[16px]">Rs {user.balance.toFixed(2)}</span></div> : <span className="text-neutral-400 text-[13px] leading-tight">Please first <span className="text-white font-bold">Login</span> Or <span className="text-white font-bold">Register</span></span>}'
  );

  fs.writeFileSync('src/app/profile/page.tsx', content);
  console.log('Patched Profile');
}
