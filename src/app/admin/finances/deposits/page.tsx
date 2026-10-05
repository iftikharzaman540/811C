
"use client";

import React, { useState, useEffect } from 'react';
import { apiRequest } from '@/utils/api';
import { ArrowDownRight, Search, FileText, Check, X } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function DepositsPage() {
  const [deposits, setDeposits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1, page: 1, limit: 50 });
  const [search, setSearch] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchDeposits = async (p = page, q = search) => {
    setLoading(true);
    try {
      const res = await apiRequest(`/admin/finances/deposits?page=${p}&limit=50&search=${encodeURIComponent(q)}`);
      setDeposits(res.data);
      setMeta(res.meta);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits(page, search);
  }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchDeposits(1, search);
  };

  const handleProcess = async (id: string, action: 'approve' | 'reject') => {
    let reason = '';
    if (action === 'reject') {
      const input = prompt('Please enter a reason for rejecting this deposit:');
      if (input === null) return;
      reason = input.trim();
      if (!reason) {
        toast.error('Reason is required for rejection');
        return;
      }
    } else {
      if (!confirm(`Are you sure you want to approve this deposit?`)) return;
    }
    setProcessingId(id);
    try {
      await apiRequest(`/admin/finances/deposits/${id}/${action}`, { 
        method: 'PATCH',
        body: JSON.stringify(reason ? { reason } : {})
      });
      toast.success(`Deposit ${action}d successfully`);
      fetchDeposits();
    } catch (error: any) {
      toast.error(error.message || `Failed to ${action} deposit`);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Deposits Management</h1>
        <p className="text-sm text-neutral-400 mt-1">View, search, and manage all user deposits.</p>
      </div>

      <div className="bg-[#111] border border-neutral-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-neutral-800 bg-[#1a1a1a] flex flex-wrap gap-4 justify-between items-center">
          <div className="flex items-center gap-2">
            <ArrowDownRight className="w-5 h-5 text-green-500" />
            <h2 className="font-bold text-white">Deposit History</h2>
          </div>
          <form onSubmit={handleSearch} className="flex relative w-full md:w-auto">
            <input 
              type="text" 
              placeholder="Search by username or transaction ID..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-black border border-neutral-700 text-white text-sm rounded-l-md px-3 py-2 w-full md:w-64 focus:outline-none focus:border-[#ffdf00]"
            />
            <button type="submit" className="bg-[#ffdf00] text-black px-3 py-2 rounded-r-md font-bold hover:bg-[#ffdf00]/80">
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-400">
            <thead className="bg-[#1a1a1a] text-neutral-300">
              <tr>
                <th className="px-6 py-4 font-medium">Transaction ID / Ref</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Method</th>
                <th className="px-6 py-4 font-medium">Payment Account</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-neutral-500">Loading deposits...</td>
                </tr>
              ) : deposits.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-neutral-500">No deposits found.</td>
                </tr>
              ) : (
                deposits.map(dep => (
                  <tr key={dep.id} className="hover:bg-[#1a1a1a] transition-colors">
                    <td className="px-6 py-4 font-mono text-xs">
                       <div className="text-white">{dep.transaction_reference || 'N/A'}</div>
                       <div className="text-neutral-600 text-[10px] mt-1">{dep.id}</div>
                         <div className="text-[#ffdf00] text-[10px] mt-1 break-all">Merchant ID: {dep.metadata?.webhook_data?.orderNo || dep.metadata?.gatewayOrderNo || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(dep.created_at).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <Link href={`/admin/users/${dep.user_id}`} className="text-white hover:text-[#ffdf00]">
                        {dep.user?.player_id ? 'ID: ' + dep.user.player_id : (dep.user?.username || dep.user?.email || dep.user_id)}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      {dep.provider || 'Unknown'}
                    </td>
                    <td className="px-6 py-4">
                        <span className="text-white font-mono bg-neutral-800 px-2 py-1 rounded text-xs">{dep.metadata?.accountNo || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4 font-bold text-green-500">
                      PKR {Number(dep.amount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        dep.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500' :
                        dep.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' :
                        'bg-red-500/10 text-red-500'
                      }`}>
                        {dep.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {dep.status === 'PENDING' && (
                        <div className="flex justify-end gap-2">
                          <button 
                            disabled={processingId === dep.id}
                            onClick={() => handleProcess(dep.id, 'approve')}
                            className="p-1.5 bg-green-500/20 text-green-500 rounded hover:bg-green-500 hover:text-white transition-colors"
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button 
                            disabled={processingId === dep.id}
                            onClick={() => handleProcess(dep.id, 'reject')}
                            className="p-1.5 bg-red-500/20 text-red-500 rounded hover:bg-red-500 hover:text-white transition-colors"
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
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
