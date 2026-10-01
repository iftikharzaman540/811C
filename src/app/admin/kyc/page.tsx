
"use client";
import React, { useState, useEffect } from 'react';
import { apiRequest } from '@/utils/api';
import { ShieldAlert } from 'lucide-react';
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
      const res = await apiRequest(`/admin/kyc?page=1&limit=50`);
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
        <h1 className="text-2xl font-bold text-white">KYC Management</h1>
        <p className="text-sm text-neutral-400 mt-1">Verify user identities and documents.</p>
      </div>

      <div className="bg-[#111] border border-neutral-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-neutral-800 bg-[#1a1a1a] flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-[#ffdf00]" />
          <h2 className="font-bold text-white">KYC Management List</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-400">
            <thead className="bg-[#1a1a1a] text-neutral-300">
              <tr>
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Doc Type</th>
                <th className="px-6 py-4 font-medium">Number</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-neutral-500">Loading...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-neutral-500">No records found.</td></tr>
              ) : (
                data.map((item: any) => (
                  <tr key={item.id} className="hover:bg-[#1a1a1a] transition-colors">
                    
      <td className="px-6 py-4 text-xs font-mono">{item.id}</td>
      <td className="px-6 py-4 text-white">{item.user?.email || item.user_id}</td>
      <td className="px-6 py-4">{item.document_type}</td>
      <td className="px-6 py-4">{item.document_number}</td>
      <td className="px-6 py-4">
        <span className="px-2 py-1 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-500">{item.status}</span>
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
