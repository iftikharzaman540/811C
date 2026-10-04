const fs = require('fs');

const generateFrontend = (title, description, icon, columns, endpoint, mapRow) => `
"use client";
import React, { useState, useEffect } from 'react';
import { apiRequest } from '@/utils/api';
import { ${icon} } from 'lucide-react';
import Link from 'next/link';

export default function Page() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiRequest(\`${endpoint}?page=1&limit=50\`);
      setData(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">${title}</h1>
        <p className="text-sm text-neutral-400 mt-1">${description}</p>
      </div>

      <div className="bg-[#111] border border-neutral-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-neutral-800 bg-[#1a1a1a] flex items-center gap-2">
          <${icon} className="w-5 h-5 text-[#ffdf00]" />
          <h2 className="font-bold text-white">${title} List</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-400">
            <thead className="bg-[#1a1a1a] text-neutral-300">
              <tr>
                ${columns.map(c => `<th className="px-6 py-4 font-medium">${c}</th>`).join('\n                ')}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {loading ? (
                <tr><td colSpan={${columns.length}} className="px-6 py-8 text-center text-neutral-500">Loading...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={${columns.length}} className="px-6 py-8 text-center text-neutral-500">No records found.</td></tr>
              ) : (
                data.map((item: any) => (
                  <tr key={item.id} className="hover:bg-[#1a1a1a] transition-colors">
                    ${mapRow}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
`;

const pages = [
  {
    file: 'src/app/admin/kyc/page.tsx',
    title: 'KYC Management',
    desc: 'Verify user identities and documents.',
    icon: 'ShieldAlert',
    endpoint: '/admin/kyc',
    cols: ['ID', 'User', 'Doc Type', 'Number', 'Status'],
    row: `
      <td className="px-6 py-4 text-xs font-mono">{item.id}</td>
      <td className="px-6 py-4 text-white">{item.user?.email || item.user_id}</td>
      <td className="px-6 py-4">{item.document_type}</td>
      <td className="px-6 py-4">{item.document_number}</td>
      <td className="px-6 py-4">
        <span className="px-2 py-1 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-500">{item.status}</span>
      </td>
    `
  },
  {
    file: 'src/app/admin/support/tickets/page.tsx',
    title: 'Support Tickets',
    desc: 'Manage and respond to user inquiries.',
    icon: 'MessageSquare',
    endpoint: '/admin/support/tickets',
    cols: ['Ticket ID', 'User', 'Subject', 'Status', 'Date'],
    row: `
      <td className="px-6 py-4 text-xs font-mono">{item.id}</td>
      <td className="px-6 py-4 text-white">{item.user?.email || item.user_id}</td>
      <td className="px-6 py-4 font-medium text-white">{item.subject}</td>
      <td className="px-6 py-4">
        <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-500">{item.status}</span>
      </td>
      <td className="px-6 py-4">{new Date(item.created_at).toLocaleDateString()}</td>
    `
  },
  {
    file: 'src/app/admin/marketing/promocodes/page.tsx',
    title: 'Promo Codes',
    desc: 'Manage marketing promotional codes.',
    icon: 'Ticket',
    endpoint: '/admin/marketing/promocodes',
    cols: ['Code', 'Bonus Amount', 'Min Deposit', 'Usage', 'Status'],
    row: `
      <td className="px-6 py-4 font-bold text-[#ffdf00]">{item.code}</td>
      <td className="px-6 py-4">PKR {Number(item.bonus_amount).toLocaleString()}</td>
      <td className="px-6 py-4">PKR {Number(item.min_deposit).toLocaleString()}</td>
      <td className="px-6 py-4">{item.used_count} / {item.usage_limit}</td>
      <td className="px-6 py-4">
        <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-500">{item.is_active ? 'ACTIVE' : 'INACTIVE'}</span>
      </td>
    `
  },
  {
    file: 'src/app/admin/cms/banners/page.tsx',
    title: 'Banners Management',
    desc: 'Manage homepage banners and sliders.',
    icon: 'Image',
    endpoint: '/admin/cms/banners',
    cols: ['Banner', 'Title', 'Link', 'Status'],
    row: `
      <td className="px-6 py-4">
        <img src={item.desktop_image} alt="banner" className="w-24 h-12 object-cover rounded border border-neutral-800" />
      </td>
      <td className="px-6 py-4 font-medium text-white">{item.title}</td>
      <td className="px-6 py-4 text-xs font-mono">{item.link_url}</td>
      <td className="px-6 py-4">
        <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-500">{item.is_active ? 'ACTIVE' : 'INACTIVE'}</span>
      </td>
    `
  }
];

pages.forEach(p => {
  const content = generateFrontend(p.title, p.desc, p.icon, p.cols, p.endpoint, p.row);
  fs.writeFileSync(p.file, content);
  console.log('Generated UI for ' + p.file);
});
