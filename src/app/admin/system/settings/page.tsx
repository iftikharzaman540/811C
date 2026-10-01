"use client";
import React, { useState, useEffect } from 'react';
import { apiRequest } from '@/utils/api';
import { Settings, Plus, Edit2, Trash2, X } from 'lucide-react';

export default function SystemSettingsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ key: '', value: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiRequest(`/admin/settings/system`);
      setData(res || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openNew = () => {
    setForm({ key: '', value: '', description: '' });
    setShowModal(true);
  };

  const openEdit = (item: any) => {
    setForm({
      key: item.key,
      value: item.value,
      description: item.description || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (key: string) => {
    if (!confirm('Are you sure you want to delete this setting? It might break the platform.')) return;
    try {
      await apiRequest(`/admin/settings/system/${key}`, { method: 'DELETE' });
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiRequest(`/admin/settings/system`, {
        method: 'POST',
        body: JSON.stringify(form)
      });
      setShowModal(false);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to save');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">System Settings</h1>
          <p className="text-sm text-neutral-400 mt-1">Manage global platform configurations and variables.</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-[#ffdf00] text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors">
          <Plus className="w-5 h-5" />
          Add Setting
        </button>
      </div>

      <div className="bg-[#111] border border-neutral-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-neutral-800 bg-[#1a1a1a] flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#ffdf00]" />
          <h2 className="font-bold text-white">Configuration Variables</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-400">
            <thead className="bg-[#1a1a1a] text-neutral-300">
              <tr>
                <th className="px-6 py-4 font-medium">Key</th>
                <th className="px-6 py-4 font-medium">Value</th>
                <th className="px-6 py-4 font-medium">Description</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-neutral-500">Loading...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-neutral-500">No settings found.</td></tr>
              ) : (
                data.map((item: any) => (
                  <tr key={item.id} className="hover:bg-[#1a1a1a] transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-[#ffdf00]">{item.key}</td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs truncate text-white">{item.value}</div>
                    </td>
                    <td className="px-6 py-4 text-xs">{item.description}</td>
                    <td className="px-6 py-4 flex justify-end gap-2">
                      <button onClick={() => openEdit(item)} className="p-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(item.key)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111] border border-neutral-800 rounded-xl w-full max-w-lg overflow-hidden">
            <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-[#1a1a1a]">
              <h2 className="font-bold text-white">System Setting</h2>
              <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Key Name</label>
                <input required type="text" value={form.key} onChange={e => setForm({...form, key: e.target.value})} className="w-full bg-black border border-neutral-700 rounded-lg px-3 py-2 text-white font-mono" placeholder="e.g. MIN_DEPOSIT_AMOUNT" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Value (JSON or String)</label>
                <textarea required value={form.value} onChange={e => setForm({...form, value: e.target.value})} className="w-full bg-black border border-neutral-700 rounded-lg px-3 py-2 text-white min-h-[100px] font-mono" placeholder="500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Description (Optional)</label>
                <input type="text" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full bg-black border border-neutral-700 rounded-lg px-3 py-2 text-white" />
              </div>
              <div className="pt-4">
                <button type="submit" disabled={submitting} className="w-full py-2.5 bg-[#ffdf00] text-black font-bold rounded-lg hover:bg-yellow-400 disabled:opacity-50">
                  {submitting ? 'Saving...' : 'Save Setting'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}