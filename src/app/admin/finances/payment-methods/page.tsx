"use client";

import React, { useState, useEffect } from 'react';
import { CreditCard, Wallet, Banknote, Edit2, Save, X, Settings2, ShieldCheck, Activity } from 'lucide-react';
import { apiRequest } from '@/utils/api';

export default function PaymentMethodsPage() {
  const [methods, setMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [saving, setSaving] = useState(false);

  const fetchMethods = async () => {
    try {
      const res = await apiRequest('/admin/finances/payment-methods');
      setMethods(res);
    } catch (error) {
      console.error('Failed to fetch payment methods', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMethods();
  }, []);

  const handleEdit = (method: any) => {
    setEditingId(method.id);
    setEditForm({ ...method });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSave = async (id: string) => {
    setSaving(true);
    try {
      await apiRequest(`/admin/finances/payment-methods/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(editForm),
      });
      alert('Payment method updated successfully');
      setEditingId(null);
      fetchMethods();
    } catch (error: any) {
      alert(error.message || 'Failed to update payment method');
    } finally {
      setSaving(false);
    }
  };

  const toggleEnabled = async (id: string, currentEnabled: boolean) => {
    try {
      await apiRequest(`/admin/finances/payment-methods/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ enabled: !currentEnabled }),
      });
      fetchMethods();
    } catch (error: any) {
      alert(error.message || 'Failed to toggle status');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Payment Methods</h1>
        <p className="text-sm text-neutral-400 mt-1">Configure deposit and withdrawal gateways, limits, and fees.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="text-neutral-500 py-10 text-center">Loading payment methods...</div>
        ) : methods.length === 0 ? (
          <div className="text-neutral-500 py-10 text-center bg-[#111] rounded-xl border border-neutral-800">No payment methods configured.</div>
        ) : (
          methods.map(method => {
            const isEditing = editingId === method.id;
            
            return (
              <div key={method.id} className="bg-[#111] border border-neutral-800 rounded-xl overflow-hidden transition-all hover:border-neutral-700">
                <div className="p-5 flex items-center justify-between border-b border-neutral-800 bg-[#151515]">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-neutral-800 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-[#ffdf00]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{method.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${method.enabled ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                          {method.enabled ? 'Active' : 'Disabled'}
                        </span>
                        <span className="text-xs text-neutral-500 font-mono">ID: {method.id}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleEnabled(method.id, method.enabled)}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                        method.enabled 
                          ? 'bg-neutral-800 text-white hover:bg-neutral-700' 
                          : 'bg-green-500/20 text-green-500 hover:bg-green-500/30'
                      }`}
                    >
                      {method.enabled ? 'Disable' : 'Enable'}
                    </button>
                    {!isEditing && (
                      <button 
                        onClick={() => handleEdit(method)}
                        className="p-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-neutral-400 mb-1">Display Name</label>
                          <input 
                            type="text" 
                            value={editForm.name} 
                            onChange={e => setEditForm({...editForm, name: e.target.value})}
                            className="w-full bg-black border border-neutral-700 rounded-lg px-3 py-2 text-white focus:border-[#ffdf00] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-400 mb-1">Fee Percentage (%)</label>
                          <input 
                            type="number" 
                            step="0.1"
                            min="0"
                            value={editForm.fee_percentage} 
                            onChange={e => setEditForm({...editForm, fee_percentage: parseFloat(e.target.value)})}
                            className="w-full bg-black border border-neutral-700 rounded-lg px-3 py-2 text-white focus:border-[#ffdf00] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-400 mb-1">Min Deposit (PKR)</label>
                          <input 
                            type="number" 
                            value={editForm.min_deposit} 
                            onChange={e => setEditForm({...editForm, min_deposit: parseInt(e.target.value)})}
                            className="w-full bg-black border border-neutral-700 rounded-lg px-3 py-2 text-white focus:border-[#ffdf00] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-400 mb-1">Max Deposit (PKR)</label>
                          <input 
                            type="number" 
                            value={editForm.max_deposit} 
                            onChange={e => setEditForm({...editForm, max_deposit: parseInt(e.target.value)})}
                            className="w-full bg-black border border-neutral-700 rounded-lg px-3 py-2 text-white focus:border-[#ffdf00] focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
                        <button 
                          onClick={handleCancel}
                          className="px-4 py-2 text-neutral-400 hover:text-white transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => handleSave(method.id)}
                          disabled={saving}
                          className="flex items-center gap-2 px-4 py-2 bg-[#ffdf00] text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50"
                        >
                          <Save className="w-4 h-4" />
                          {saving ? 'Saving...' : 'Save Configuration'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div>
                        <div className="flex items-center gap-2 text-neutral-400 mb-1">
                          <Activity className="w-4 h-4" />
                          <span className="text-xs font-medium uppercase tracking-wider">Fee %</span>
                        </div>
                        <p className="text-xl font-bold text-white">{method.fee_percentage}%</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-neutral-400 mb-1">
                          <Banknote className="w-4 h-4" />
                          <span className="text-xs font-medium uppercase tracking-wider">Min Deposit</span>
                        </div>
                        <p className="text-xl font-bold text-white">PKR {method.min_deposit?.toLocaleString()}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-neutral-400 mb-1">
                          <ShieldCheck className="w-4 h-4" />
                          <span className="text-xs font-medium uppercase tracking-wider">Max Deposit</span>
                        </div>
                        <p className="text-xl font-bold text-white">PKR {method.max_deposit?.toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}