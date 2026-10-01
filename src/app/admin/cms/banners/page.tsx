
"use client";
import React, { useState, useEffect } from 'react';
import { apiRequest } from '@/utils/api';
import { Image } from 'lucide-react';
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
      const res = await apiRequest(`/admin/cms/banners?page=1&limit=50`);
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
        <h1 className="text-2xl font-bold text-white">Banners Management</h1>
        <p className="text-sm text-neutral-400 mt-1">Manage homepage banners and sliders.</p>
      </div>

      <div className="bg-[#111] border border-neutral-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-neutral-800 bg-[#1a1a1a] flex items-center gap-2">
          <Image className="w-5 h-5 text-[#ffdf00]" />
          <h2 className="font-bold text-white">Banners Management List</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-400">
            <thead className="bg-[#1a1a1a] text-neutral-300">
              <tr>
                <th className="px-6 py-4 font-medium">Banner</th>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Link</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-neutral-500">Loading...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-neutral-500">No records found.</td></tr>
              ) : (
                data.map((item: any) => (
                  <tr key={item.id} className="hover:bg-[#1a1a1a] transition-colors">
                    
      <td className="px-6 py-4">
        <img src={item.desktop_image} alt="banner" className="w-24 h-12 object-cover rounded border border-neutral-800" />
      </td>
      <td className="px-6 py-4 font-medium text-white">{item.title}</td>
      <td className="px-6 py-4 text-xs font-mono">{item.link_url}</td>
      <td className="px-6 py-4">
        <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-500">{item.is_active ? 'ACTIVE' : 'INACTIVE'}</span>
      </td>
    
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
