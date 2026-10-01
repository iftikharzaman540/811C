"use client";
import React, { useState, useEffect } from 'react';
import { apiRequest } from '@/utils/api';
import { FileText, Plus, Edit2, Trash2, X, Globe, Code } from 'lucide-react';

export default function CustomPages() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    content: '',
    is_published: true
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiRequest(`/admin/cms/pages?page=1&limit=50`);
      setData(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openNew = () => {
    setEditingId(null);
    setForm({ title: '', slug: '', content: '', is_published: true });
    setShowModal(true);
  };

  const openEdit = (item: any) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      slug: item.slug,
      content: item.content,
      is_published: item.is_published
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this custom page?')) return;
    try {
      await apiRequest(`/admin/cms/pages/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...form };
      if (editingId) {
        await apiRequest(`/admin/cms/pages/${editingId}`, {
          method: 'PATCH',
          body: JSON.stringify(payload)
        });
      } else {
        await apiRequest(`/admin/cms/pages`, {
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
          <h1 className="text-2xl font-bold text-white">Custom Pages</h1>
          <p className="text-sm text-neutral-400 mt-1">Manage terms, policies, and standalone website pages.</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-[#ffdf00] text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors">
          <Plus className="w-5 h-5" />
          Create Page
        </button>
      </div>

      <div className="bg-[#111] border border-neutral-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-neutral-800 bg-[#1a1a1a] flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#ffdf00]" />
          <h2 className="font-bold text-white">Website Pages</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-400">
            <thead className="bg-[#1a1a1a] text-neutral-300">
              <tr>
                <th className="px-6 py-4 font-medium">Page Title</th>
                <th className="px-6 py-4 font-medium">URL Slug</th>
                <th className="px-6 py-4 font-medium">Last Updated</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-neutral-500">Loading pages...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-neutral-500">No pages found.</td></tr>
              ) : (
                data.map((item: any) => (
                  <tr key={item.id} className="hover:bg-[#1a1a1a] transition-colors">
                    <td className="px-6 py-4 font-bold text-white">{item.title}</td>
                    <td className="px-6 py-4 text-[#ffdf00]">/{item.slug}</td>
                    <td className="px-6 py-4">{new Date(item.updated_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.is_published ? 'bg-green-500/10 text-green-500' : 'bg-neutral-800 text-neutral-400'}`}>
                        {item.is_published ? 'PUBLISHED' : 'DRAFT'}
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
          <div className="bg-[#111] border border-neutral-800 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-[#1a1a1a]">
              <h2 className="font-bold text-white">{editingId ? 'Edit Page' : 'Create Page'}</h2>
              <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-1">Page Title</label>
                  <input required type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-black border border-neutral-700 rounded-lg px-3 py-2 text-white focus:border-[#ffdf00]" placeholder="Terms & Conditions" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-1">URL Slug</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Globe className="h-4 w-4 text-neutral-500" />
                      <span className="text-neutral-500 ml-1">/</span>
                    </div>
                    <input required type="text" value={form.slug} onChange={e => setForm({...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')})} className="w-full bg-black border border-neutral-700 rounded-lg pl-9 pr-3 py-2 text-white focus:border-[#ffdf00]" placeholder="terms-conditions" />
                  </div>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col min-h-[300px]">
                <label className="block text-sm font-medium text-neutral-400 mb-1 flex justify-between">
                  <span>HTML Content</span>
                  <span className="text-xs flex items-center gap-1"><Code className="w-3 h-3"/> HTML Supported</span>
                </label>
                <textarea required value={form.content} onChange={e => setForm({...form, content: e.target.value})} className="flex-1 w-full bg-black border border-neutral-700 rounded-lg px-3 py-3 text-neutral-300 font-mono text-sm focus:border-[#ffdf00] focus:outline-none resize-none" placeholder="<h1>Terms of Service</h1><p>Welcome to our platform...</p>" />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input type="checkbox" id="isPublished" checked={form.is_published} onChange={e => setForm({...form, is_published: e.target.checked})} className="w-5 h-5 accent-[#ffdf00]" />
                <label htmlFor="isPublished" className="text-white font-medium">Publish immediately</label>
              </div>

              <div className="pt-2">
                <button type="submit" disabled={submitting} className="w-full py-2.5 bg-[#ffdf00] text-black font-bold rounded-lg hover:bg-yellow-400 disabled:opacity-50">
                  {submitting ? 'Saving...' : 'Save Custom Page'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}