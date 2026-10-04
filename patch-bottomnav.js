const fs = require('fs');
let code = fs.readFileSync('src/components/BottomNav.tsx', 'utf8');

code = code.replace(
  'import { Home, Gift, UserPlus, Headset, User } from "lucide-react";',
  'import { Home, Gift, UserPlus, Headset, User } from "lucide-react";\nimport { useUser } from "@/context/UserContext";'
);

code = code.replace(
  'export default function BottomNav({ activeTab = "home" }: { activeTab?: string }) {',
  'export default function BottomNav({ activeTab = "home" }: { activeTab?: string }) {\n  const { unreadNotifCount } = useUser();'
);

code = code.replace(
  '<User className="w-[22px] h-[22px]" />',
  `<div className="relative">
            <User className="w-[22px] h-[22px]" />
            {unreadNotifCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#ff0b0b] text-white text-[9px] font-bold px-1 rounded-full shadow-md z-10 border border-black min-w-[14px] text-center">
                {unreadNotifCount}
              </span>
            )}
          </div>`
);

fs.writeFileSync('src/components/BottomNav.tsx', code);
console.log("Updated BottomNav with notification badge!");
