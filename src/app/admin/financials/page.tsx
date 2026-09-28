"use client";

import { useEffect, useState } from "react";
import { Check, X, RefreshCw } from "lucide-react";

export default function AdminFinancialsPage() {
  const [tab, setTab] = useState<"deposits" | "withdrawals">("deposits");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const API_URL = "https://8111c.com/api/v1";
      const res = await fetch(`${API_URL}/admin/${tab}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setData(json.data || []);
    } catch (error) {
      console.error(error);
      alert("Error loading financial data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tab]);

  const processTransaction = async (id: string, action: string) => {
    if (!confirm(`Are you sure you want to ${action} this transaction?`)) return;
    
    try {
      const token = localStorage.getItem("token");
      const API_URL = "https://8111c.com/api/v1";
      const res = await fetch(`${API_URL}/admin/${tab}/${id}/${action}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        alert("Transaction processed");
        fetchData();
      } else {
        const error = await res.json();
        alert(error.message || "Failed to process transaction");
      }
    } catch (e) {
      alert("Error processing request");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Manage Financials</h1>
        <button onClick={fetchData} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-sm font-medium transition-colors">
          <RefreshCw className="w-4 h-4 text-[#ffdf00]" /> Refresh
        </button>
      </div>
      
      <div className="flex gap-4 border-b border-neutral-800">
        <button 
          onClick={() => setTab("deposits")}
          className={`py-3 text-sm font-medium border-b-2 transition-colors ${tab === "deposits" ? "border-[#ffdf00] text-[#ffdf00]" : "border-transparent text-neutral-400 hover:text-white"}`}
        >
          Deposits
        </button>
        <button 
          onClick={() => setTab("withdrawals")}
          className={`py-3 text-sm font-medium border-b-2 transition-colors ${tab === "withdrawals" ? "border-[#ffdf00] text-[#ffdf00]" : "border-transparent text-neutral-400 hover:text-white"}`}
        >
          Withdrawals
        </button>
      </div>

      <div className="bg-[#111] rounded-xl border border-neutral-800 overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-sm text-neutral-300 whitespace-nowrap">
          <thead className="bg-[#1a1a1a] text-neutral-400 font-medium">
            <tr>
              <th className="px-6 py-4">Reference</th>
              <th className="px-6 py-4">User ID</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Provider</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {loading ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center">Loading...</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-neutral-500">No {tab} found.</td></tr>
            ) : (
              data.map((item: any) => (
                <tr key={item.id} className="hover:bg-[#151515] transition-colors">
                  <td className="px-6 py-4 font-mono text-xs">{item.transaction_reference}</td>
                  <td className="px-6 py-4 font-mono text-xs">{item.user_id.substring(0,8)}...</td>
                  <td className="px-6 py-4 font-bold text-[#ffdf00]">Rs {item.amount}</td>
                  <td className="px-6 py-4">{item.provider}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      item.status === 'APPROVED' || item.status === 'COMPLETED' ? 'bg-green-500/20 text-green-500' : 
                      item.status === 'REJECTED' ? 'bg-red-500/20 text-red-500' : 'bg-orange-500/20 text-orange-500'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    {item.status === 'PENDING' && (
                      <>
                        <button onClick={() => processTransaction(item.id, 'approve')} className="px-3 py-1 bg-green-500/10 text-green-500 hover:bg-green-500/20 rounded font-medium flex items-center gap-1 text-xs">
                          <Check className="w-3 h-3" /> Approve
                        </button>
                        <button onClick={() => processTransaction(item.id, 'reject')} className="px-3 py-1 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded font-medium flex items-center gap-1 text-xs">
                          <X className="w-3 h-3" /> Reject
                        </button>
                      </>
                    )}
                    {(item.status === 'APPROVED' && tab === 'withdrawals') && (
                      <button onClick={() => processTransaction(item.id, 'complete')} className="px-3 py-1 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 rounded font-medium flex items-center gap-1 text-xs">
                        <Check className="w-3 h-3" /> Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
