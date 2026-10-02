"use client";

import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, TrendingUp } from 'lucide-react';
import { apiRequest } from '@/utils/api';
import toast from 'react-hot-toast';

export default function VipLevelsAdminPage() {
  const [levels, setLevels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetchLevels();
  }, []);

  const fetchLevels = async () => {
    try {
      const data = await apiRequest('/admin/vip/levels');
      setLevels(data);
    } catch (err) {
      toast.error('Failed to load VIP levels');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (id: string, min_deposit: number) => {
    try {
      setSaving(id);
      await apiRequest('/admin/vip/levels/' + id, {
        method: 'PUT',
        body: JSON.stringify({ min_deposit })
      });
      toast.success('VIP Level updated');
    } catch (err) {
      toast.error('Failed to update VIP level');
    } finally {
      setSaving(null);
    }
  };

  const handleDepositChange = (index: number, val: string) => {
    const updated = [...levels];
    updated[index].min_deposit = val;
    setLevels(updated);
  };

  if (loading) return <div className="p-8 text-neutral-400">Loading VIP settings...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <TrendingUp className="w-8 h-8 text-[#ffdf00]" />
        <div>
          <h1 className="text-2xl font-bold text-white">VIP Levels Configuration</h1>
          <p className="text-neutral-400 text-sm">Set required deposit thresholds for automatic VIP upgrades</p>
        </div>
      </div>

      <div className="bg-[#111] rounded-xl border border-neutral-800 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#1a1a1a] text-neutral-400 uppercase">
            <tr>
              <th className="px-6 py-4 font-medium">Level</th>
              <th className="px-6 py-4 font-medium">Deposit Requirement (PKR)</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {levels.map((lvl, idx) => (
              <tr key={lvl.id} className="hover:bg-[#1a1a1a] transition-colors">
                <td className="px-6 py-4 font-bold text-[#ffdf00]">{lvl.name}</td>
                <td className="px-6 py-4">
                  <input 
                    type="number"
                    value={lvl.min_deposit}
                    onChange={(e) => handleDepositChange(idx, e.target.value)}
                    className="w-full bg-black border border-neutral-700 rounded px-3 py-2 text-white outline-none focus:border-[#ffdf00]"
                  />
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => handleSave(lvl.id, Number(lvl.min_deposit))}
                    disabled={saving === lvl.id}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded font-medium disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" /> 
                    {saving === lvl.id ? 'Saving...' : 'Save'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
