"use client";

import React, { useState, useEffect } from 'react';
import { History, ArrowRight } from 'lucide-react';
import { apiRequest } from '@/utils/api';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function VipHistoryAdminPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await apiRequest('/admin/vip/history');
      setHistory(data.data || []);
    } catch (err) {
      toast.error('Failed to load VIP history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-neutral-400">Loading VIP history...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <History className="w-8 h-8 text-[#ffdf00]" />
        <div>
          <h1 className="text-2xl font-bold text-white">VIP Progression History</h1>
          <p className="text-neutral-400 text-sm">Log of all automatic VIP upgrades</p>
        </div>
      </div>

      <div className="bg-[#111] rounded-xl border border-neutral-800 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#1a1a1a] text-neutral-400 uppercase">
            <tr>
              <th className="px-6 py-4 font-medium">User</th>
              <th className="px-6 py-4 font-medium">Upgrade</th>
              <th className="px-6 py-4 font-medium">Deposit TXN</th>
              <th className="px-6 py-4 font-medium">New Total</th>
              <th className="px-6 py-4 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {history.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-neutral-500">No VIP upgrades yet</td></tr>}
            {history.map((record) => (
              <tr key={record.id} className="hover:bg-[#1a1a1a] transition-colors">
                <td className="px-6 py-4">
                  <Link href={'/admin/users/' + record.user_id}} className="text-[#ffdf00] hover:underline font-bold">
                    {record.user?.username || "ID: " + record.user?.player_id || 'User'}
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <span className="text-neutral-500">VIP {record.previous_level}</span>
                    <ArrowRight className="w-4 h-4 text-[#ffdf00]" />
                    <span className="text-[#ffdf00]">VIP {record.new_level}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-mono text-xs text-neutral-300">{record.transaction_id || '-'}</div>
                  <div className="text-green-500 font-bold mt-1">+PKR {Number(record.deposit_amount).toLocaleString()}</div>
                </td>
                <td className="px-6 py-4 font-bold">
                  PKR {Number(record.total_deposit_after).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-neutral-400 whitespace-nowrap">
                  {new Date(record.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


