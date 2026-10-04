const fs = require('fs');

const pending = [
  'src/app/admin/finances/payment-methods/page.tsx',
  'src/app/admin/marketing/affiliates/page.tsx',
  'src/app/admin/marketing/bonuses/page.tsx',
  'src/app/admin/cms/pages/page.tsx',
  'src/app/admin/cms/casino/page.tsx',
  'src/app/admin/cms/sportsbook/page.tsx',
  'src/app/admin/system/admins/page.tsx',
  'src/app/admin/system/settings/page.tsx',
  'src/app/admin/system/providers/page.tsx',
  'src/app/admin/reports/page.tsx'
];

const template = `
"use client";
import React from 'react';
import { Settings } from 'lucide-react';

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="p-6 bg-[#111] rounded-2xl border border-neutral-800 flex flex-col items-center max-w-md">
        <Settings className="w-12 h-12 text-[#ffdf00] mb-4 animate-[spin_4s_linear_infinite]" />
        <h1 className="text-2xl font-bold text-white mb-2">Module Coming Soon</h1>
        <p className="text-neutral-400">This module is scheduled for Phase 5 deployment. The backend schema is ready, but the UI is currently being finalized.</p>
      </div>
    </div>
  );
}
`;

pending.forEach(f => {
  if (fs.existsSync(f)) {
    fs.writeFileSync(f, template.trim());
    console.log('Styled ' + f);
  }
});
