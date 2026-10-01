"use client";

import React, { useState, useEffect } from 'react';
import { apiRequest } from '@/utils/api';
import { Search, Plus, ArrowUpRight, ArrowDownRight, History } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function WalletAdjustmentsPage() {
  const searchParams = useSearchParams();
  const defaultUserId = searchParams.get('userId') || '';

  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    userId: defaultUserId,
    type: 'CREDIT',
    amount: '',
    reason: ''
  });

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await apiRequest('/admin/finances/wallet-adjustments/history');
      setLogs(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    if (defaultUserId) {
      setShowModal(true);
    }
  }, [defaultUserId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiRequest('/admin/finances/wallet-adjustments', {
        method: 'POST',
        body: JSON.stringify({
          userId: formData.userId,
          type: formData.type,
          amount: Number(formData.amount),
          reason: formData.reason
        })
      });
      alert('Wallet adjusted successfully');
      setShowModal(false);
      setFormData({ userId: '', type: 'CREDIT', amount: '', reason: '' });
      fetchLogs();
    } catch (error: any) {
      alert(error.message || 'Failed to adjust wallet');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Manual Wallet Adjustments</h1>
          <p className="text-sm text-neutral-400 mt-1">Directly credit or debit a user's real balance.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#ffdf00] text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Adjustment
        </button>
      </div>

      <div className="bg-[#111] border border-neutral-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-neutral-800 bg-[#1a1a1a] flex items-center gap-2">
          <History className="w-5 h-5 text-neutral-400" />
          <h2 className="font-bold text-white">Adjustment History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-400">
            <thead className="bg-[#1a1a1a] text-neutral-300">
              <tr>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Admin</th>
                <th className="px-6 py-4 font-medium">Target User</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-neutral-500">Loading history...</td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-neutral-500">No manual adjustments found.</td>
                </tr>
              ) : (
                logs.map(log => {
                  const isCredit = log.action === 'MANUAL_WALLET_CREDIT';
                  const newBalance = log.new_value?.balance;
                  const reason = log.new_value?.reason;
                  const diff = Math.abs(newBalance - log.old_value?.balance);

                  return (
                    <tr key={log.id} className="hover:bg-[#1a1a1a] transition-colors">
                      <td className="px-6 py-4">{new Date(log.created_at).toLocaleString()}</td>
                      <td className="px-6 py-4 text-white">{log.admin?.email}</td>
                      <td className="px-6 py-4">
                        <div className="text-white">{log.user?.username || log.user?.email}</div>
                        <div className="text-xs font-mono text-neutral-500">{log.user_id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={\`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold w-fit \${
                          isCredit ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                        }\`}>
                          {isCredit ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {isCredit ? 'CREDIT' : 'DEBIT'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className={\`font-bold \${isCredit ? 'text-green-500' : 'text-red-500'}\`}>
                          {isCredit ? '+' : '-'} PKR {diff.toLocaleString()}
                        </div>
                        <div className="text-xs text-neutral-500">New Bal: {newBalance}</div>
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate" title={reason}>
                        {reason}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111] border border-neutral-800 rounded-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-[#1a1a1a]">
              <h2 className="font-bold text-white">New Wallet Adjustment</h2>
              <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">User ID</label>
                <input 
                  required
                  type="text" 
                  value={formData.userId}
                  onChange={e => setFormData({...formData, userId: e.target.value})}
                  className="w-full bg-black border border-neutral-700 rounded-lg px-3 py-2 text-white focus:border-[#ffdf00] focus:outline-none font-mono"
                  placeholder="e.g. 123e4567-e89b-12d3-a456-426614174000"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-1">Type</label>
                  <select 
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    className="w-full bg-black border border-neutral-700 rounded-lg px-3 py-2 text-white focus:border-[#ffdf00] focus:outline-none"
                  >
                    <option value="CREDIT">CREDIT (+)</option>
                    <option value="DEBIT">DEBIT (-)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-1">Amount (PKR)</label>
                  <input 
                    required
                    type="number" 
                    min="1"
                    value={formData.amount}
                    onChange={e => setFormData({...formData, amount: e.target.value})}
                    className="w-full bg-black border border-neutral-700 rounded-lg px-3 py-2 text-white focus:border-[#ffdf00] focus:outline-none"
                    placeholder="1000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Reason (Required for Audit)</label>
                <textarea 
                  required
                  value={formData.reason}
                  onChange={e => setFormData({...formData, reason: e.target.value})}
                  className="w-full h-24 bg-black border border-neutral-700 rounded-lg px-3 py-2 text-white focus:border-[#ffdf00] focus:outline-none resize-none"
                  placeholder="Explain why this manual adjustment is being made..."
                />
              </div>
              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 bg-[#ffdf00] text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Processing...' : 'Confirm Adjustment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
