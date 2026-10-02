"use client";
import React, { useState, useEffect } from 'react';
import { apiRequest } from '@/utils/api';
import { Users, Link as LinkIcon, DollarSign } from 'lucide-react';

export default function AffiliatesPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiRequest(`/admin/marketing/affiliates?page=1&limit=100`);
      setData(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Affiliates & Referrals</h1>
          <p className="text-sm text-neutral-400 mt-1">Track user referrals and affiliate commissions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111] border border-neutral-800 rounded-xl p-5">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-neutral-400">Total Referrals</p>
            <div className="p-2 bg-blue-500/10 rounded-lg"><Users className="w-4 h-4 text-blue-500" /></div>
          </div>
          <h3 className="text-2xl font-bold text-white">{data.length}</h3>
        </div>
        <div className="bg-[#111] border border-neutral-800 rounded-xl p-5">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-neutral-400">Active Affiliates</p>
            <div className="p-2 bg-purple-500/10 rounded-lg"><LinkIcon className="w-4 h-4 text-purple-500" /></div>
          </div>
          <h3 className="text-2xl font-bold text-white">{new Set(data.map(d => d.user_id)).size}</h3>
        </div>
        <div className="bg-[#111] border border-neutral-800 rounded-xl p-5">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-neutral-400">Total Commissions</p>
            <div className="p-2 bg-green-500/10 rounded-lg"><DollarSign className="w-4 h-4 text-green-500" /></div>
          </div>
          <h3 className="text-2xl font-bold text-white">PKR {data.reduce((acc, curr) => acc + Number(curr.commission || 0), 0).toLocaleString()}</h3>
        </div>
      </div>

      <div className="bg-[#111] border border-neutral-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-neutral-800 bg-[#1a1a1a] flex items-center gap-2">
          <Users className="w-5 h-5 text-[#ffdf00]" />
          <h2 className="font-bold text-white">Referral Log</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-400">
            <thead className="bg-[#1a1a1a] text-neutral-300">
              <tr>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Referrer (Affiliate)</th>
                <th className="px-6 py-4 font-medium">Referred User</th>
                <th className="px-6 py-4 font-medium">Commission Earned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-neutral-500">Loading records...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-neutral-500">No referrals found.</td></tr>
              ) : (
                data.map((item: any) => (
                  <tr key={item.id} className="hover:bg-[#1a1a1a] transition-colors">
                    <td className="px-6 py-4">{new Date(item.created_at).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{item.user?.username || 'Unknown'}</div>
                      <div className="text-xs text-neutral-500">{item.user?.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{item.referred_user?.username || 'Unknown'}</div>
                      <div className="text-xs text-neutral-500">{item.referred_user?.email}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-green-500">
                      PKR {Number(item.commission).toLocaleString()}
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