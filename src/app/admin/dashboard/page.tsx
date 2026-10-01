"use client";

import React, { useState, useEffect } from 'react';
import { 
  Users, Wallet, ArrowUpRight, ArrowDownRight, 
  Activity, ShieldCheck, CreditCard, Banknote, Clock
} from 'lucide-react';
import { apiRequest } from '@/utils/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // In a real implementation, we would fetch this from a dedicated stats endpoint
  // For now, we will just show a UI skeleton that represents the final scope
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiRequest('/admin/dashboard/stats');
        setStats(res);
      } catch (error) {
        console.error('Failed to load dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-white text-center py-20">Loading dashboard metrics...</div>;
  }

  const formatCurrency = (val: number) => 'PKR ' + val.toLocaleString();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Platform Overview</h1>
          <p className="text-sm text-neutral-400 mt-1">Real-time business and financial metrics.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-500 rounded-lg text-sm font-medium border border-green-500/20">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          System Online
        </div>
      </div>

      {/* Top row: Key Financials */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111] border border-neutral-800 rounded-xl p-5">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-neutral-400">Total Deposits</p>
            <div className="p-2 bg-green-500/10 rounded-lg"><ArrowDownRight className="w-4 h-4 text-green-500" /></div>
          </div>
          <h3 className="text-2xl font-bold text-white">{formatCurrency(stats.totalDeposits)}</h3>
          <p className="text-xs text-green-500 mt-2 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> +12.5% this month
          </p>
        </div>

        <div className="bg-[#111] border border-neutral-800 rounded-xl p-5">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-neutral-400">Total Withdrawals</p>
            <div className="p-2 bg-red-500/10 rounded-lg"><ArrowUpRight className="w-4 h-4 text-red-500" /></div>
          </div>
          <h3 className="text-2xl font-bold text-white">{formatCurrency(stats.totalWithdrawals)}</h3>
          <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> +8.2% this month
          </p>
        </div>

        <div className="bg-[#111] border border-neutral-800 rounded-xl p-5">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-neutral-400">Net Revenue</p>
            <div className="p-2 bg-[#ffdf00]/10 rounded-lg"><Banknote className="w-4 h-4 text-[#ffdf00]" /></div>
          </div>
          <h3 className="text-2xl font-bold text-[#ffdf00]">{formatCurrency(stats.netRevenue)}</h3>
          <p className="text-xs text-green-500 mt-2 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> +15.3% this month
          </p>
        </div>

        <div className="bg-[#111] border border-neutral-800 rounded-xl p-5">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-neutral-400">Total Bonuses Given</p>
            <div className="p-2 bg-purple-500/10 rounded-lg"><CreditCard className="w-4 h-4 text-purple-500" /></div>
          </div>
          <h3 className="text-2xl font-bold text-white">{formatCurrency(stats.totalBonuses)}</h3>
          <p className="text-xs text-neutral-500 mt-2 flex items-center gap-1">
            Operating cost metric
          </p>
        </div>
      </div>

      {/* Middle row: Users & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#111] border border-neutral-800 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#ffdf00]" /> User Demographics
          </h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-neutral-400">Total Registered</span>
                <span className="text-white font-bold">{stats.totalUsers.toLocaleString()}</span>
              </div>
              <div className="w-full bg-neutral-800 rounded-full h-2">
                <div className="bg-[#ffdf00] h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-neutral-400">Active (Last 30 days)</span>
                <span className="text-white font-bold">{stats.activeUsers.toLocaleString()}</span>
              </div>
              <div className="w-full bg-neutral-800 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `\${(stats.activeUsers / stats.totalUsers) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#111] border border-neutral-800 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#ffdf00]" /> Pending Admin Actions
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-neutral-800 rounded-lg p-4 bg-black flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-full">
                <Clock className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.pendingWithdrawals}</div>
                <div className="text-xs text-neutral-400">Pending Withdrawals</div>
              </div>
            </div>
            <div className="border border-neutral-800 rounded-lg p-4 bg-black flex items-center gap-4">
              <div className="p-3 bg-yellow-500/10 rounded-full">
                <ShieldCheck className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.pendingKyc}</div>
                <div className="text-xs text-neutral-400">Pending KYC Docs</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
