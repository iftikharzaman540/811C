"use client";
import React, { useState, useEffect } from 'react';
import { apiRequest } from '@/utils/api';
import { Image as ImageIcon, Plus, Edit2, Trash2, X, Link as LinkIcon, MoveUp, MoveDown } from 'lucide-react';

export default function BannersPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    desktop_image: '',
    mobile_image: '',
    link_url: '',
    display_order: '0',
    is_active: true
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiRequest(`/admin/cms/banners?page=1&limit=50`);
      setData(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openNew = () => {
    setEditingId(null);
    setForm({ title: '', desktop_image: '', mobile_image: '', link_url: '', display_order: data.length.toString(), is_active: true });
    setShowModal(true);
  };

  const openEdit = (item: any) => {
    setEditingId(item.id);
    setForm({
      title: item.title || '',
      desktop_image: item.desktop_image || '',
      mobile_image: item.mobile_image || '',
      link_url: item.link_url || '',
      display_order: item.display_order.toString(),
      is_active: item.is_active
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;
    try {
      await apiRequest(`/admin/cms/banners/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    }
  };

  const moveOrder = async (id: string, currentOrder: number, direction: 'up' | 'down') => {
    const newOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1;
    try {
      await apiRequest(`/admin/cms/banners/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ display_order: newOrder })
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        title: form.title,
        desktop_image: form.desktop_image,
        mobile_image: form.mobile_image,
        link_url: form.link_url,
        display_order: parseInt(form.display_order),
        is_active: form.is_active
      };
      
      if (editingId) {
        await apiRequest(`/admin/cms/banners/${editingId}`, {
          method: 'PATCH',
          body: JSON.stringify(payload)
        });
      } else {
        await apiRequest(`/admin/cms/banners`, {
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
          <h1 className="text-2xl font-bold text-white">Homepage Banners</h1>
          <p className="text-sm text-neutral-400 mt-1">Manage the main image sliders and promotional graphics.</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-[#ffdf00] text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors">
          <Plus className="w-5 h-5" />
          Add Banner
        </button>
      </div>

      <div className="bg-[#111] border border-neutral-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-neutral-800 bg-[#1a1a1a] flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-[#ffdf00]" />
          <h2 className="font-bold text-white">Banner Sequence</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-400">
            <thead className="bg-[#1a1a1a] text-neutral-300">
              <tr>
                <th className="px-6 py-4 font-medium">Order</th>
                <th className="px-6 py-4 font-medium">Preview</th>
                <th className="px-6 py-4 font-medium">Title & Link</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-neutral-500">Loading banners...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-neutral-500">No banners configured.</td></tr>
              ) : (
                data.map((item: any) => (
                  <tr key={item.id} className="hover:bg-[#1a1a1a] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-center gap-1">
                        <button onClick={() => moveOrder(item.id, item.display_order, 'up')} className="text-neutral-500 hover:text-white"><MoveUp className="w-4 h-4" /></button>
                        <span className="font-bold text-white">{item.display_order}</span>
                        <button onClick={() => moveOrder(item.id, item.display_order, 'down')} className="text-neutral-500 hover:text-white"><MoveDown className="w-4 h-4" /></button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {item.desktop_image ? (
                        <div className="w-32 h-16 bg-neutral-800 rounded overflow-hidden relative">
                          <img src={item.desktop_image} alt="Banner" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-32 h-16 bg-neutral-800 rounded flex items-center justify-center text-neutral-500 text-xs">No Image</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{item.title || 'Untitled Banner'}</div>
                      <div className="text-xs text-neutral-500 flex items-center gap-1 mt-1">
                        <LinkIcon className="w-3 h-3" /> {item.link_url || 'No link assigned'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.is_active ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {item.is_active ? 'VISIBLE' : 'HIDDEN'}
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
          <div className="bg-[#111] border border-neutral-800 rounded-xl w-full max-w-2xl overflow-hidden">
            <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-[#1a1a1a]">
              <h2 className="font-bold text-white">{editingId ? 'Edit Banner' : 'New Banner'}</h2>
              <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Banner Title (Internal / Alt text)</label>
                <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-black border border-neutral-700 rounded-lg px-3 py-2 text-white" placeholder="Summer Promo 2026" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Desktop Image URL (Required)</label>
                <input required type="url" value={form.desktop_image} onChange={e => setForm({...form, desktop_image: e.target.value})} className="w-full bg-black border border-neutral-700 rounded-lg px-3 py-2 text-white" placeholder="https://example.com/images/banner-desktop.jpg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Mobile Image URL (Optional)</label>
                <input type="url" value={form.mobile_image} onChange={e => setForm({...form, mobile_image: e.target.value})} className="w-full bg-black border border-neutral-700 rounded-lg px-3 py-2 text-white" placeholder="https://example.com/images/banner-mobile.jpg" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-1">Destination Link</label>
                  <input type="text" value={form.link_url} onChange={e => setForm({...form, link_url: e.target.value})} className="w-full bg-black border border-neutral-700 rounded-lg px-3 py-2 text-white" placeholder="/promo/summer" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-1">Display Order</label>
                  <input required type="number" value={form.display_order} onChange={e => setForm({...form, display_order: e.target.value})} className="w-full bg-black border border-neutral-700 rounded-lg px-3 py-2 text-white" />
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <input type="checkbox" id="isActive" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} className="w-5 h-5 accent-[#ffdf00]" />
                <label htmlFor="isActive" className="text-white font-medium">Active (Visible on homepage)</label>
              </div>
              <div className="pt-4">
                <button type="submit" disabled={submitting} className="w-full py-2.5 bg-[#ffdf00] text-black font-bold rounded-lg hover:bg-yellow-400 disabled:opacity-50">
                  {submitting ? 'Saving...' : 'Save Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
