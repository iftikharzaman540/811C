const fs = require('fs');

const frontendCode = `"use client";

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

  const handleSave = async (id: string, data: any) => {
    try {
      setSaving(id);
      await apiRequest('/admin/vip/levels/' + id, {
        method: 'PUT',
        body: JSON.stringify({
          min_deposit: Number(data.min_deposit || 0),
          min_turnover: Number(data.min_turnover || 0),
          bonus_amount: Number(data.bonus_amount || 0),
          wagering_multiplier: Number(data.wagering_multiplier || 1),
          auto_upgrade: Boolean(data.auto_upgrade)
        })
      });
      toast.success('VIP Level updated');
    } catch (err) {
      toast.error('Failed to update VIP level');
    } finally {
      setSaving(null);
    }
  };

  const handleChange = (index: number, field: string, val: any) => {
    const updated = [...levels];
    updated[index][field] = val;
    setLevels(updated);
  };

  if (loading) return <div className="p-8 text-neutral-400">Loading VIP settings...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2"><TrendingUp className="text-[#ffdf00]"/> VIP Levels Configuration</h1>
          <p className="text-neutral-400">Configure turnover requirements, bonuses, and wagering limits for each VIP level.</p>
        </div>
      </div>

      <div className="bg-[#1a1a1a] border border-neutral-800 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 bg-[#111]">
                <th className="p-4 text-neutral-400 font-medium whitespace-nowrap">Level</th>
                <th className="p-4 text-neutral-400 font-medium whitespace-nowrap">Min Turnover (Bet)</th>
                <th className="p-4 text-neutral-400 font-medium whitespace-nowrap">Level Up Bonus</th>
                <th className="p-4 text-neutral-400 font-medium whitespace-nowrap">Wagering (x)</th>
                <th className="p-4 text-neutral-400 font-medium whitespace-nowrap text-center">Auto Upgrade</th>
                <th className="p-4 text-neutral-400 font-medium whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {levels.map((level, i) => (
                <tr key={level.id} className="border-b border-neutral-800/50 hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold text-[#ffdf00] whitespace-nowrap">{level.name}</td>
                  <td className="p-4">
                    <input 
                      type="number"
                      value={level.min_turnover || 0}
                      onChange={(e) => handleChange(i, 'min_turnover', e.target.value)}
                      className="w-full bg-[#111] border border-neutral-700 rounded p-2 text-white outline-none focus:border-[#ffdf00] transition-colors"
                    />
                  </td>
                  <td className="p-4">
                    <input 
                      type="number"
                      value={level.bonus_amount || 0}
                      onChange={(e) => handleChange(i, 'bonus_amount', e.target.value)}
                      className="w-full bg-[#111] border border-neutral-700 rounded p-2 text-white outline-none focus:border-[#ffdf00] transition-colors"
                    />
                  </td>
                  <td className="p-4">
                    <input 
                      type="number"
                      value={level.wagering_multiplier || 1}
                      onChange={(e) => handleChange(i, 'wagering_multiplier', e.target.value)}
                      className="w-full bg-[#111] border border-neutral-700 rounded p-2 text-white outline-none focus:border-[#ffdf00] transition-colors"
                    />
                  </td>
                  <td className="p-4 text-center">
                    <input 
                      type="checkbox"
                      checked={level.auto_upgrade}
                      onChange={(e) => handleChange(i, 'auto_upgrade', e.target.checked)}
                      className="w-5 h-5 accent-[#ffdf00] cursor-pointer"
                    />
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => handleSave(level.id, level)}
                      disabled={saving === level.id}
                      className="inline-flex items-center gap-2 bg-[#ffdf00] hover:bg-[#ffdf00]/90 text-black px-4 py-2 rounded font-medium disabled:opacity-50 transition-colors shadow-sm"
                    >
                      <Save className="w-4 h-4" />
                      {saving === level.id ? 'Saving...' : 'Save'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-[#cc0000]/10 border border-[#cc0000]/20 rounded-lg p-4 flex gap-3 text-[#ff0b0b]">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <div className="text-sm">
          <p className="font-bold mb-1">Configuration Guide</p>
          <ul className="list-disc pl-4 space-y-1 text-[#ff0b0b]/80">
            <li><strong>Min Turnover:</strong> Total bet amount required to reach this VIP level.</li>
            <li><strong>Level Up Bonus:</strong> Claimable bonus amount when user reaches this level.</li>
            <li><strong>Wagering (x):</strong> Wagering requirement multiplier for the bonus (e.g., 1x, 2x).</li>
            <li><strong>Auto Upgrade:</strong> If enabled, users are automatically upgraded to this level upon hitting the turnover target.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
`;
fs.writeFileSync('src/app/admin/system/vip-levels/page.tsx', frontendCode);
console.log('Frontend patched');
