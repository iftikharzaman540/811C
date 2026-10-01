"use client";
import React, { useState, useEffect } from 'react';
import { apiRequest } from '@/utils/api';
import { Ticket, Plus, Edit2, Trash2, X } from 'lucide-react';

export default function PromoCodesPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    code: '',
    bonus_amount: '',
    min_deposit: '',
    usage_limit: '',
    is_active: true
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiRequest(`/admin/marketing/promocodes?page=1&limit=50`);
      setData(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openNew = () => {
    setEditingId(null);
    setForm({ code: '', bonus_amount: '', min_deposit: '0', usage_limit: '100', is_active: true });
    setShowModal(true);
  };

  const openEdit = (item: any) => {
    setEditingId(item.id);
    setForm({
      code: item.code,
      bonus_amount: item.bonus_amount.toString(),
      min_deposit: item.min_deposit.toString(),
      usage_limit: item.usage_limit.toString(),
      is_active: item.is_active
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this promo code?')) return;
    try {
      await apiRequest(`/admin/marketing/promocodes/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        code: form.code,
        bonus_amount: parseFloat(form.bonus_amount),
        min_deposit: parseFloat(form.min_deposit),
        usage_limit: parseInt(form.usage_limit),
        is_active: form.is_active
      };
      
      if (editingId) {
        await apiRequest(`/admin/marketing/promocodes/${editingId}`, {
          method: 'PATCH',
          body: JSON.stringify(payload)
        });
      } else {
        await apiRequest(`/admin/marketing/promocodes`, {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      }
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
          <h1 className="text-2xl font-bold text-white">Promo Codes</h1>
          <p className="text-sm text-neutral-400 mt-1">Manage marketing promotional codes.</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-[#ffdf00] text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors">
          <Plus className="w-5 h-5" />
          New Promo Code
        </button>
      </div>

      <div className="bg-[#111] border border-neutral-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-neutral-800 bg-[#1a1a1a] flex items-center gap-2">
          <Ticket className="w-5 h-5 text-[#ffdf00]" />
          <h2 className="font-bold text-white">Promo Codes List</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-400">
            <thead className="bg-[#1a1a1a] text-neutral-300">
              <tr>
                <th className="px-6 py-4 font-medium">Code</th>
                <th className="px-6 py-4 font-medium">Bonus Amount</th>
                <th className="px-6 py-4 font-medium">Min Deposit</th>
                <th className="px-6 py-4 font-medium">Usage</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-neutral-500">Loading...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-neutral-500">No records found.</td></tr>
              ) : (
                data.map((item: any) => (
                  <tr key={item.id} className="hover:bg-[#1a1a1a] transition-colors">
                    <td className="px-6 py-4 font-bold text-[#ffdf00]">{item.code}</td>
                    <td className="px-6 py-4">PKR {Number(item.bonus_amount).toLocaleString()}</td>
                    <td className="px-6 py-4">PKR {Number(item.min_deposit).toLocaleString()}</td>
                    <td className="px-6 py-4">{item.used_count || 0} / {item.usage_limit}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.is_active ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {item.is_active ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex justify-end gap-2">
                      <button onClick={() => openEdit(item)} className="p-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20">
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
          <div className="bg-[#111] border border-neutral-800 rounded-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-[#1a1a1a]">
              <h2 className="font-bold text-white">{editingId ? 'Edit Promo Code' : 'New Promo Code'}</h2>
              <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Code</label>
                <input required type="text" value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} className="w-full bg-black border border-neutral-700 rounded-lg px-3 py-2 text-white font-mono uppercase" placeholder="WELCOME100" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-1">Bonus Amount</label>
                  <input required type="number" value={form.bonus_amount} onChange={e => setForm({...form, bonus_amount: e.target.value})} className="w-full bg-black border border-neutral-700 rounded-lg px-3 py-2 text-white" placeholder="500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-1">Min Deposit</label>
                  <input required type="number" value={form.min_deposit} onChange={e => setForm({...form, min_deposit: e.target.value})} className="w-full bg-black border border-neutral-700 rounded-lg px-3 py-2 text-white" placeholder="1000" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Usage Limit</label>
                <input required type="number" value={form.usage_limit} onChange={e => setForm({...form, usage_limit: e.target.value})} className="w-full bg-black border border-neutral-700 rounded-lg px-3 py-2 text-white" placeholder="100" />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <input type="checkbox" id="isActive" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} className="w-5 h-5 accent-[#ffdf00]" />
                <label htmlFor="isActive" className="text-white font-medium">Active (Can be used by players)</label>
              </div>
              <div className="pt-4">
                <button type="submit" disabled={submitting} className="w-full py-2.5 bg-[#ffdf00] text-black font-bold rounded-lg hover:bg-yellow-400 disabled:opacity-50">
                  {submitting ? 'Saving...' : 'Save Promo Code'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
