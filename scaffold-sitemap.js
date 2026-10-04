const fs = require('fs');
const path = require('path');

const sitemap = [
  '/admin/dashboard',
  '/admin/users',
  '/admin/finances/deposits',
  '/admin/finances/withdrawals',
  '/admin/finances/wallet-adjustments',
  '/admin/finances/payment-methods',
  '/admin/kyc',
  '/admin/marketing/bonuses',
  '/admin/marketing/promocodes',
  '/admin/marketing/affiliates',
  '/admin/cms/banners',
  '/admin/cms/pages',
  '/admin/cms/casino',
  '/admin/cms/sportsbook',
  '/admin/support/tickets',
  '/admin/system/settings',
  '/admin/system/providers',
  '/admin/system/admins',
  '/admin/system/audit-logs',
  '/admin/reports'
];

const basePath = path.join('src', 'app');

// Also create dynamic route for user profile
const dynamicRoutes = [
  '/admin/users/[id]'
];

const allRoutes = [...sitemap, ...dynamicRoutes];

allRoutes.forEach(route => {
  const dirPath = path.join(basePath, ...route.split('/').filter(Boolean));
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  const pagePath = path.join(dirPath, 'page.tsx');
  if (!fs.existsSync(pagePath)) {
    const componentName = route.split('/').filter(Boolean).map(s => s.replace(/[^a-zA-Z0-9]/g, '').charAt(0).toUpperCase() + s.replace(/[^a-zA-Z0-9]/g, '').slice(1)).join('');
    const content = `"use client";

import React from 'react';

export default function ${componentName}Page() {
  return (
    <div className="bg-[#111] border border-neutral-800 rounded-xl p-6">
      <h1 className="text-2xl font-bold text-white mb-6">
        ${route.split('/').pop().toUpperCase().replace(/[^A-Z0-9]/g, ' ')}
      </h1>
      <div className="text-neutral-400 text-sm">
        <p>This module is currently under construction for Phase 4 deployment.</p>
      </div>
    </div>
  );
}
`;
    fs.writeFileSync(pagePath, content);
  }
});
