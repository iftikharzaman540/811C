"use client";

import React, { useState, useEffect } from 'react';
import { apiRequest } from '@/utils/api';
import { FileText } from 'lucide-react';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1, page: 1, limit: 20 });

  const fetchLogs = async (p = page) => {
    setLoading(true);
    try {
      const res = await apiRequest(`/admin/settings/audit-logs?page=\${p}&limit=50`);
      setLogs(res.data);
      setMeta(res.meta);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(page);
  }, [page]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">System Audit Logs</h1>
        <p className="text-sm text-neutral-400 mt-1">A complete record of all actions performed by Admin users.</p>
      </div>

      <div className="bg-[#111] border border-neutral-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-neutral-800 bg-[#1a1a1a] flex items-center gap-2">
          <FileText className="w-5 h-5 text-neutral-400" />
          <h2 className="font-bold text-white">Action History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-400">
            <thead className="bg-[#1a1a1a] text-neutral-300">
              <tr>
                <th className="px-6 py-4 font-medium">Timestamp</th>
                <th className="px-6 py-4 font-medium">Admin</th>
                <th className="px-6 py-4 font-medium">Action</th>
                <th className="px-6 py-4 font-medium">Entity & Target</th>
                <th className="px-6 py-4 font-medium">Changes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">Loading audit logs...</td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">No logs found.</td>
                </tr>
              ) : (
                logs.map(log => (
                  <tr key={log.id} className="hover:bg-[#1a1a1a] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(log.created_at).toLocaleString()}</td>
                    <td className="px-6 py-4 text-white">
                      {log.admin?.username || log.admin?.email || log.admin_id}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white">{log.entity}</div>
                      {log.user && <div className="text-xs text-neutral-500 mt-0.5">Target User: {log.user.email}</div>}
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <details className="text-xs">
                        <summary className="cursor-pointer text-[#ffdf00] font-medium">View Data</summary>
                        <div className="mt-2 p-2 bg-black rounded border border-neutral-800 overflow-auto max-h-32">
                          <div className="text-neutral-500 mb-1">New Value:</div>
                          <pre className="text-white">{JSON.stringify(log.new_value, null, 2)}</pre>
                        </div>
                      </details>
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
            <span className="text-sm text-neutral-500">Page {meta.page} of {meta.totalPages} (Total {meta.total})</span>
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
