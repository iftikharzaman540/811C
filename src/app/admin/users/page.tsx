"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Eye, Edit2, ShieldAlert } from 'lucide-react';
import { apiRequest } from '@/utils/api';

export default function UsersManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1, page: 1, limit: 20 });

  const fetchUsers = async (searchTerm = search, p = page) => {
    setLoading(true);
    try {
      const query = new URLSearchParams({ page: p.toString(), limit: '20' });
      if (searchTerm) query.append('search', searchTerm);
      
      const res = await apiRequest(`/admin/users?${query.toString()}`);
      setUsers(res.data);
      setMeta(res.meta);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers(search, 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between items-start gap-4">
        <h1 className="text-2xl font-bold text-white">User Management</h1>
        
        <form onSubmit={handleSearch} className="relative w-full">
          <input
            type="text"
            placeholder="Search by ID, Username, Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111] border border-neutral-800 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-[#ffdf00]"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-neutral-500" />
        </form>
      </div>

      <div className="bg-[#111] border border-neutral-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-400">
            <thead className="bg-[#1a1a1a] text-neutral-300">
              <tr>
                <th className="px-6 py-4 font-medium">User ID / Email</th>
                <th className="px-6 py-4 font-medium">Balance</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">Loading users...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">No users found.</td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id} className="hover:bg-[#1a1a1a] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center font-bold text-white uppercase">
                          {user.username?.charAt(0) || user.email?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div className="font-medium text-white">{user.username || 'Unnamed'}</div>
                          <div className="text-xs text-neutral-500">{user.email || user.phone}</div>
                          <div className="text-[10px] text-[#ffdf00] font-mono mt-1 font-bold">ID: {user.player_id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">PKR {Number(user.wallet?.balance || 0).toLocaleString()}</div>
                      <div className="text-xs text-[#ffdf00]">Bonus: PKR {Number(user.wallet?.bonus_balance || 0).toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500' :
                        user.status === 'BANNED' ? 'bg-red-500/10 text-red-500' :
                        'bg-yellow-500/10 text-yellow-500'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-neutral-400">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/admin/users/${user.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors text-xs font-medium"
                      >
                        <Eye className="w-4 h-4" /> View Profile
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {!loading && meta.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-neutral-800 flex justify-between items-center">
            <span className="text-sm text-neutral-500">Page {meta.page} of {meta.totalPages}</span>
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


