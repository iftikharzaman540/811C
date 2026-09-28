"use client";

import { useEffect, useState } from "react";
import { Users, CreditCard, Download, Activity, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://169.58.50.184:4000/api/v1";
      const res = await fetch(`${API_URL}/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Failed to load dashboard data");
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return <div className="text-neutral-400">Loading dashboard metrics...</div>;
  if (error) return <div className="text-[#ff0b0b]">Error: {error}</div>;
  if (!data) return null;

  const stats = [
    { label: "Total Users", value: data.total_users, icon: <Users className="w-8 h-8 text-[#ffdf00]" /> },
    { label: "Active Users", value: data.active_users, icon: <Users className="w-8 h-8 text-[#ffdf00]" /> },
    { label: "Total Deposits Volume", value: `Rs ${Number(data.total_deposits_volume || 0).toFixed(2)}`, icon: <Download className="w-8 h-8 text-[#ffdf00]" /> },
    { label: "Total Withdrawals Volume", value: `Rs ${Number(data.total_withdrawals_volume || 0).toFixed(2)}`, icon: <Activity className="w-8 h-8 text-[#ffdf00]" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Overview</h1>
        <button onClick={fetchDashboard} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-sm font-medium transition-colors">
          <RefreshCw className="w-4 h-4 text-[#ffdf00]" />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#111] border border-neutral-800 rounded-xl p-6 flex items-center gap-4 hover:border-[#ffdf00]/30 transition-colors">
            <div className="p-3 bg-neutral-900 rounded-lg">
              {stat.icon}
            </div>
            <div>
              <p className="text-neutral-400 text-sm font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-[#111] border border-neutral-800 rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link href="/admin/users" className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm font-medium text-[#ffdf00] transition-colors border border-neutral-700 hover:border-[#ffdf00]/50">
            Manage Users
          </Link>
          <Link href="/admin/financials?tab=deposits" className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm font-medium text-[#ffdf00] transition-colors border border-neutral-700 hover:border-[#ffdf00]/50">
            Review Deposits
          </Link>
          <Link href="/admin/financials?tab=withdrawals" className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm font-medium text-[#ffdf00] transition-colors border border-neutral-700 hover:border-[#ffdf00]/50">
            Review Withdrawals
          </Link>
          <button className="px-4 py-2 bg-neutral-800 opacity-50 cursor-not-allowed rounded-lg text-sm font-medium text-neutral-400 transition-colors border border-neutral-700">
            Audit Logs (Coming Soon)
          </button>
        </div>
      </div>
    </div>
  );
}
