const fs = require('fs');

const pageCode = `
"use client";
import React, { useState, useEffect } from 'react';
import { History, Search } from 'lucide-react';
import { apiRequest } from '@/utils/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function NotificationHistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await apiRequest('/admin/notifications/history');
      setHistory(res.data || []);
    } catch (err) {
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <History className="w-6 h-6 text-[#ffdf00]" />
          Notification History
        </h1>
      </div>

      <div className="bg-[#141414] border border-neutral-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-400">
            <thead className="text-xs text-neutral-400 uppercase bg-[#1c1c1c] border-b border-neutral-800">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Message</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Target / Users</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Sent Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">Loading...</td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">No broadcast history found.</td>
                </tr>
              ) : history.map((item) => (
                <tr key={item.id} className="border-b border-neutral-800 hover:bg-[#1c1c1c]/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-white">{item.title}</td>
                  <td className="px-6 py-4 max-w-[200px] truncate" title={item.message}>{item.message}</td>
                  <td className="px-6 py-4">
                    <span className="bg-neutral-800 text-neutral-300 px-2 py-1 rounded text-xs">
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {item.target === 'ALL' ? (
                      <span className="text-[#ffdf00]">{item.sent_to} Users</span>
                    ) : (
                      <span className="text-blue-400">Single User</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-green-500 font-bold">Sent</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {format(new Date(item.created_at), 'dd MMM yyyy, HH:mm')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/app/admin/notifications/history/page.tsx', pageCode);
console.log("Created Admin History Notification Page!");
