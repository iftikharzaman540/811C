"use client";
import React, { useState, useEffect } from 'react';
import { apiRequest } from '@/utils/api';
import { TrendingUp, Users, ArrowDownToLine, ArrowUpFromLine, Calendar, FileText } from 'lucide-react';

export default function ReportsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(30);

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - dateRange);
      
      const res = await apiRequest(`/admin/dashboard/reports?startDate=${start.toISOString().split('T')[0]}&endDate=${end.toISOString().split('T')[0]}`);
      setData(res || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const totals = data.reduce((acc, day) => {
    acc.new_users += day.new_users;
    acc.deposits += day.deposits;
    acc.withdrawals += day.withdrawals;
    acc.bets += day.bets;
    acc.wins += day.wins;
    acc.ggr += day.ggr;
    return acc;
  }, { new_users: 0, deposits: 0, withdrawals: 0, bets: 0, wins: 0, ggr: 0 });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Financial & Analytics Reports</h1>
          <p className="text-sm text-neutral-400 mt-1">Detailed breakdown of platform performance.</p>
        </div>
        <div className="flex items-center gap-2 bg-[#1a1a1a] p-1 rounded-lg border border-neutral-800">
          {[7, 30, 90].map(days => (
            <button
              key={days}
              onClick={() => setDateRange(days)}
              className={`px-4 py-1.5 rounded-md text-sm font-bold transition-colors ${
                dateRange === days ? 'bg-[#ffdf00] text-black' : 'text-neutral-400 hover:text-white'
              }`}
            >
              {days} Days
            </button>
          ))}
        </div>
      </div>

      {/* Aggregate Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111] p-5 rounded-xl border border-neutral-800">
          <div className="flex items-center gap-3 text-neutral-400 mb-2">
            <Users className="w-5 h-5 text-blue-500" />
            <span className="font-bold text-sm">New Signups</span>
          </div>
          <div className="text-2xl font-black text-white">{totals.new_users}</div>
        </div>
        <div className="bg-[#111] p-5 rounded-xl border border-neutral-800">
          <div className="flex items-center gap-3 text-neutral-400 mb-2">
            <ArrowDownToLine className="w-5 h-5 text-green-500" />
            <span className="font-bold text-sm">Total Deposits</span>
          </div>
          <div className="text-2xl font-black text-white">Rs {totals.deposits.toFixed(2)}</div>
        </div>
        <div className="bg-[#111] p-5 rounded-xl border border-neutral-800">
          <div className="flex items-center gap-3 text-neutral-400 mb-2">
            <ArrowUpFromLine className="w-5 h-5 text-red-500" />
            <span className="font-bold text-sm">Total Withdrawals</span>
          </div>
          <div className="text-2xl font-black text-white">Rs {totals.withdrawals.toFixed(2)}</div>
        </div>
        <div className="bg-[#111] p-5 rounded-xl border border-neutral-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffdf00]/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div className="flex items-center gap-3 text-neutral-400 mb-2 relative z-10">
            <TrendingUp className="w-5 h-5 text-[#ffdf00]" />
            <span className="font-bold text-sm">GGR (Gross Gaming Rev)</span>
          </div>
          <div className="text-2xl font-black text-[#ffdf00] relative z-10">Rs {totals.ggr.toFixed(2)}</div>
        </div>
      </div>

      {/* Daily Breakdown Table */}
      <div className="bg-[#111] border border-neutral-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-neutral-800 bg-[#1a1a1a] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#ffdf00]" />
            <h2 className="font-bold text-white">Daily Breakdown</h2>
          </div>
          <button onClick={() => {
            const csv = [
              ['Date', 'New Users', 'Deposits', 'Withdrawals', 'Total Bets', 'Total Wins', 'GGR'].join(','),
              ...data.map(d => [d.date, d.new_users, d.deposits, d.withdrawals, d.bets, d.wins, d.ggr].join(','))
            ].join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `report_${dateRange}_days.csv`;
            a.click();
          }} className="px-3 py-1.5 bg-neutral-800 text-white text-xs font-bold rounded hover:bg-neutral-700">
            Export CSV
          </button>
        </div>
        <div className="overflow-x-auto max-h-[500px]">
          <table className="w-full text-left text-sm text-neutral-400">
            <thead className="bg-[#1a1a1a] text-neutral-300 sticky top-0 shadow-md">
              <tr>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right">New Users</th>
                <th className="px-6 py-4 font-medium text-right">Deposits</th>
                <th className="px-6 py-4 font-medium text-right">Withdrawals</th>
                <th className="px-6 py-4 font-medium text-right">GGR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-neutral-500">Generating report...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-neutral-500">No data available for this period.</td></tr>
              ) : (
                data.slice().reverse().map((item: any) => (
                  <tr key={item.date} className="hover:bg-[#1a1a1a] transition-colors">
                    <td className="px-6 py-3 font-medium text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-neutral-500" />
                      {new Date(item.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-3 text-right">{item.new_users}</td>
                    <td className="px-6 py-3 text-right text-green-500 font-medium">Rs {item.deposits.toFixed(2)}</td>
                    <td className="px-6 py-3 text-right text-red-500 font-medium">Rs {item.withdrawals.toFixed(2)}</td>
                    <td className={`px-6 py-3 text-right font-bold ${item.ggr >= 0 ? 'text-[#ffdf00]' : 'text-red-500'}`}>
                      Rs {item.ggr.toFixed(2)}
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