"use client";

import { useEffect, useState } from "react";
import { Search, ShieldAlert, CheckCircle, Ban } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const API_URL = "https://8111c.com/api/v1";
      const query = search ? `?search=${search}` : "";
      const res = await fetch(`${API_URL}/admin/users${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data.data || []);
    } catch (error) {
      console.error(error);
      alert("Error loading users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const updateStatus = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem("token");
      const API_URL = "https://8111c.com/api/v1";
      const res = await fetch(`${API_URL}/admin/users/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        alert("Status updated");
        fetchUsers();
      } else {
        const error = await res.json();
        alert(error.message || "Failed to update status");
      }
    } catch (e) {
      alert("Error processing request");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Manage Users</h1>
      
      <div className="bg-[#111] p-4 rounded-xl border border-neutral-800">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-neutral-500" />
            <input 
              type="text" 
              placeholder="Search by username, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-neutral-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-[#ffdf00] outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="bg-[#111] rounded-xl border border-neutral-800 overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-sm text-neutral-300 whitespace-nowrap">
          <thead className="bg-[#1a1a1a] text-neutral-400 font-medium">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Wallet Balance</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center">Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-neutral-500">No users found.</td></tr>
            ) : (
              users.map((u: any) => (
                <tr key={u.id} className="hover:bg-[#151515] transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-white">{u.username || 'Unnamed'}</div>
                    <div className="text-xs text-neutral-500">{u.email || u.phone}</div>
                  </td>
                  <td className="px-6 py-4">{u.role}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      u.status === 'ACTIVE' ? 'bg-green-500/20 text-green-500' : 
                      u.status === 'BLOCKED' ? 'bg-red-500/20 text-red-500' : 'bg-orange-500/20 text-orange-500'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#ffdf00] font-medium">
                    Rs {u.wallet?.balance || '0.00'}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    {u.status !== 'ACTIVE' && (
                      <button onClick={() => updateStatus(u.id, 'ACTIVE')} className="p-2 bg-green-500/10 text-green-500 hover:bg-green-500/20 rounded" title="Unblock/Activate">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    {u.status !== 'BLOCKED' && (
                      <button onClick={() => updateStatus(u.id, 'BLOCKED')} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded" title="Block">
                        <Ban className="w-4 h-4" />
                      </button>
                    )}
                    {u.status !== 'SUSPENDED' && (
                      <button onClick={() => updateStatus(u.id, 'SUSPENDED')} className="p-2 bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 rounded" title="Suspend">
                        <ShieldAlert className="w-4 h-4" />
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
