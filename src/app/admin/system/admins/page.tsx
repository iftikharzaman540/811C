"use client";
import React, { useState, useEffect } from 'react';
import { apiRequest } from '@/utils/api';
import { Shield, Plus, Edit2, X, Check, Key } from 'lucide-react';

const AVAILABLE_PERMISSIONS = [
  { id: 'manage_users', label: 'Manage Users', desc: 'Can view, edit, and ban players.' },
  { id: 'manage_finances', label: 'Manage Finances', desc: 'Can process deposits, withdrawals, and wallets.' },
  { id: 'manage_marketing', label: 'Manage Marketing', desc: 'Can create bonuses, promocodes, and view affiliates.' },
  { id: 'manage_cms', label: 'Manage CMS & Website', desc: 'Can edit banners, pages, and UI.' },
  { id: 'manage_support', label: 'Manage Support', desc: 'Can reply to and resolve support tickets.' },
];

export default function AdminsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'ADMIN',
    permissions: [] as string[]
  });
  
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiRequest(`/admin/users/list-admins`);
      setData(res || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openNew = () => {
    setEditingId(null);
    setForm({ username: '', email: '', password: '', role: 'ADMIN', permissions: [] });
    setShowModal(true);
  };

  const openEdit = (item: any) => {
    setEditingId(item.id);
    setForm({
      username: item.username || '',
      email: item.email || '',
      password: '', // blank for edit
      role: item.role,
      permissions: item.permissions || []
    });
    setShowModal(true);
  };

  const togglePermission = (id: string) => {
    setForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(id) 
        ? prev.permissions.filter(p => p !== id) 
        : [...prev.permissions, id]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await apiRequest(`/admin/users/update-admin/${editingId}`, {
          method: 'PATCH',
          body: JSON.stringify({ permissions: form.permissions, role: form.role })
        });
      } else {
        await apiRequest(`/admin/users/create-admin`, {
          method: 'POST',
          body: JSON.stringify(form)
        });
      }
      setShowModal(false);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to save admin');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Administrator Access</h1>
          <p className="text-sm text-neutral-400 mt-1">Manage staff accounts and their specific module permissions.</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-[#ffdf00] text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors">
          <Plus className="w-5 h-5" />
          Create Admin
        </button>
      </div>

      <div className="bg-[#111] border border-neutral-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-neutral-800 bg-[#1a1a1a] flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#ffdf00]" />
          <h2 className="font-bold text-white">Staff Accounts</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-400">
            <thead className="bg-[#1a1a1a] text-neutral-300">
              <tr>
                <th className="px-6 py-4 font-medium">Username</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Granted Permissions</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-neutral-500">Loading...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-neutral-500">No admins found.</td></tr>
              ) : (
                data.map((item: any) => (
                  <tr key={item.id} className="hover:bg-[#1a1a1a] transition-colors">
                    <td className="px-6 py-4 font-bold text-white">{item.username || 'N/A'}</td>
                    <td className="px-6 py-4">{item.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                        item.role === 'SUPER_ADMIN' ? 'bg-[#ffdf00]/20 text-[#ffdf00]' : 'bg-blue-500/10 text-blue-500'
                      }`}>
                        {item.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {item.role === 'SUPER_ADMIN' ? (
                        <span className="text-neutral-500 text-xs italic">Full Access</span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {item.permissions?.length ? (
                            item.permissions.map((p: string) => (
                              <span key={p} className="px-2 py-0.5 bg-neutral-800 rounded text-xs">{p.replace('manage_', '').toUpperCase()}</span>
                            ))
                          ) : (
                            <span className="text-neutral-500 text-xs">No specific permissions</span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 flex justify-end gap-2">
                      <button onClick={() => openEdit(item)} className="p-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700">
                        <Edit2 className="w-4 h-4" />
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
          <div className="bg-[#111] border border-neutral-800 rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-[#1a1a1a]">
              <h2 className="font-bold text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-[#ffdf00]" />
                {editingId ? 'Edit Admin Permissions' : 'Create Admin Account'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {!editingId && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-1">Username</label>
                    <input required type="text" value={form.username} onChange={e => setForm({...form, username: e.target.value})} className="w-full bg-black border border-neutral-700 rounded-lg px-3 py-2 text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-1">Email</label>
                    <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-black border border-neutral-700 rounded-lg px-3 py-2 text-white" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-neutral-400 mb-1">Password</label>
                    <input required type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full bg-black border border-neutral-700 rounded-lg px-3 py-2 text-white" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-3">Admin Role</label>
                <div className="flex gap-4">
                  <label className={`flex-1 p-3 rounded-lg border cursor-pointer flex items-center gap-3 ${form.role === 'ADMIN' ? 'bg-[#ffdf00]/10 border-[#ffdf00]' : 'bg-neutral-800 border-transparent hover:bg-neutral-700'}`}>
                    <input type="radio" name="role" checked={form.role === 'ADMIN'} onChange={() => setForm({...form, role: 'ADMIN'})} className="hidden" />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${form.role === 'ADMIN' ? 'border-[#ffdf00] bg-[#ffdf00]' : 'border-neutral-500'}`}>
                      {form.role === 'ADMIN' && <Check className="w-3 h-3 text-black" />}
                    </div>
                    <div>
                      <div className="font-bold text-white">Staff Admin</div>
                      <div className="text-xs text-neutral-400">Restricted access</div>
                    </div>
                  </label>
                  <label className={`flex-1 p-3 rounded-lg border cursor-pointer flex items-center gap-3 ${form.role === 'SUPER_ADMIN' ? 'bg-[#ffdf00]/10 border-[#ffdf00]' : 'bg-neutral-800 border-transparent hover:bg-neutral-700'}`}>
                    <input type="radio" name="role" checked={form.role === 'SUPER_ADMIN'} onChange={() => setForm({...form, role: 'SUPER_ADMIN'})} className="hidden" />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${form.role === 'SUPER_ADMIN' ? 'border-[#ffdf00] bg-[#ffdf00]' : 'border-neutral-500'}`}>
                      {form.role === 'SUPER_ADMIN' && <Check className="w-3 h-3 text-black" />}
                    </div>
                    <div>
                      <div className="font-bold text-white">Super Admin</div>
                      <div className="text-xs text-neutral-400">Full system access</div>
                    </div>
                  </label>
                </div>
              </div>

              {form.role === 'ADMIN' && (
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-3">Specific Module Permissions</label>
                  <div className="grid grid-cols-1 gap-3">
                    {AVAILABLE_PERMISSIONS.map(p => {
                      const isActive = form.permissions.includes(p.id);
                      return (
                        <div 
                          key={p.id}
                          onClick={() => togglePermission(p.id)}
                          className={`p-3 rounded-lg border cursor-pointer flex items-start gap-3 transition-colors ${
                            isActive ? 'bg-blue-500/10 border-blue-500' : 'bg-neutral-800 border-neutral-700 hover:border-neutral-500'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded mt-0.5 flex items-center justify-center border shrink-0 ${
                            isActive ? 'bg-blue-500 border-blue-500' : 'bg-black border-neutral-600'
                          }`}>
                            {isActive && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-white">{p.label}</div>
                            <div className="text-xs text-neutral-400 mt-0.5">{p.desc}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-neutral-800">
                <button type="submit" disabled={submitting} className="w-full py-3 bg-[#ffdf00] text-black font-bold rounded-lg hover:bg-yellow-400 disabled:opacity-50">
                  {submitting ? 'Saving...' : 'Save Admin Configuration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
