"use client";

import React, { useState, useEffect } from 'react';
import { apiRequest } from '@/utils/api';
import { ArrowDownRight, Search, FileText } from 'lucide-react';
import Link from 'next/link';

export default function DepositsPage() {
  const [deposits, setDeposits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1, page: 1, limit: 50 });

  const fetchDeposits = async (p = page) => {
    setLoading(true);
    try {
      const res = await apiRequest(`/admin/finances/deposits?page=\${p}&limit=50`);
      setDeposits(res.data);
      setMeta(res.meta);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits(page);
  }, [page]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Deposits Management</h1>
        <p className="text-sm text-neutral-400 mt-1">View and manage all user deposits.</p>
      </div>

      <div className="bg-[#111] border border-neutral-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-neutral-800 bg-[#1a1a1a] flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ArrowDownRight className="w-5 h-5 text-green-500" />
            <h2 className="font-bold text-white">Deposit History</h2>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-400">
            <thead className="bg-[#1a1a1a] text-neutral-300">
              <tr>
                <th className="px-6 py-4 font-medium">Transaction ID</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Method</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-neutral-500">Loading deposits...</td>
                </tr>
              ) : deposits.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-neutral-500">No deposits found.</td>
                </tr>
              ) : (
                deposits.map(dep => (
                  <tr key={dep.id} className="hover:bg-[#1a1a1a] transition-colors">
                    <td className="px-6 py-4 font-mono text-xs">{dep.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(dep.created_at).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <Link href={`/admin/users/\${dep.user_id}`} className="text-white hover:text-[#ffdf00]">
                        {dep.user?.username || dep.user?.email || dep.user_id}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      {dep.payment_method?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 font-bold text-green-500">
                      PKR {Number(dep.amount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold \${
                        dep.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500' :
                        dep.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' :
                        'bg-red-500/10 text-red-500'
                      }`}>
                        {dep.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {!loading && meta.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-neutral-800 flex justify-between items-center">
            <span className="text-sm text-neutral-500">Page {meta.page} of {meta.totalPages} (Total {meta.total})</span>
            <div className="flex gap-2">
              <button 
                disabled={meta.page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 bg-neutral-800 disabled:opacity-50 text-white rounded hover:bg-neutral-700 transition-colors text-sm"
              >
                Prev
              </button>
              <button 
                disabled={meta.page === meta.totalPages}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 bg-neutral-800 disabled:opacity-50 text-white rounded hover:bg-neutral-700 transition-colors text-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
