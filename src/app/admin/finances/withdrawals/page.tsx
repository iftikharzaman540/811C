"use client";

import React, { useState, useEffect } from 'react';
import { apiRequest } from '@/utils/api';
import { ArrowUpRight, Search, Check, X } from 'lucide-react';
import Link from 'next/link';

export default function WithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1, page: 1, limit: 50 });

  const fetchWithdrawals = async (p = page) => {
    setLoading(true);
    try {
      const res = await apiRequest(`/admin/finances/withdrawals?page=${p}&limit=50`);
      setWithdrawals(res.data);
      setMeta(res.meta);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals(page);
  }, [page]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Withdrawals Management</h1>
        <p className="text-sm text-neutral-400 mt-1">Review and process user withdrawal requests.</p>
      </div>

      <div className="bg-[#111] border border-neutral-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-neutral-800 bg-[#1a1a1a] flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ArrowUpRight className="w-5 h-5 text-red-500" />
            <h2 className="font-bold text-white">Withdrawal Requests</h2>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-400">
            <thead className="bg-[#1a1a1a] text-neutral-300">
              <tr>
                <th className="px-6 py-4 font-medium">Request ID</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Provider & Details</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-neutral-500">Loading withdrawals...</td>
                </tr>
              ) : withdrawals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-neutral-500">No withdrawal requests found.</td>
                </tr>
              ) : (
                withdrawals.map(req => (
                  <tr key={req.id} className="hover:bg-[#1a1a1a] transition-colors">
                    <td className="px-6 py-4 font-mono text-xs">{req.id.slice(-8)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(req.created_at).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <Link href={`/admin/users/${req.user_id}`} className="text-white hover:text-[#ffdf00]">
                        {req.user?.username || req.user?.email || req.user_id}
                      </Link>
                      <div className="text-xs text-neutral-500 mt-0.5">Bal: PKR {Number(req.user?.wallet?.balance || 0).toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-red-500">
                      PKR {Number(req.amount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#ffdf00] text-xs mb-1">{req.provider}</div>
                      {req.metadata?.accountDetails && (
                        <div className="text-xs text-neutral-400 max-w-[200px]">
                          {req.metadata.accountDetails.accountTitle && <div><span className="text-neutral-500">Title:</span> <span className="text-white">{req.metadata.accountDetails.accountTitle}</span></div>}
                          {req.metadata.accountDetails.accountNo && <div><span className="text-neutral-500">A/C:</span> <span className="text-white">{req.metadata.accountDetails.accountNo}</span></div>}
                          {req.metadata.accountDetails.cnic && <div><span className="text-neutral-500">CNIC:</span> <span className="text-white">{req.metadata.accountDetails.cnic}</span></div>}
                          {req.metadata.accountDetails.bankName && <div><span className="text-neutral-500">Bank:</span> <span className="text-white">{req.metadata.accountDetails.bankName}</span></div>}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        req.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500' :
                        req.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' :
                        'bg-red-500/10 text-red-500'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {req.status === 'PENDING' ? (
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => alert('Approve API coming soon')}
                            className="p-1.5 bg-green-500/20 text-green-500 hover:bg-green-500 hover:text-white rounded transition-colors" title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => alert('Reject API coming soon')}
                            className="p-1.5 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors" title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-neutral-500">-</span>
                      )}
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
