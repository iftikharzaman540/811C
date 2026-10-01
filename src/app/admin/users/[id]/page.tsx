"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, User, Wallet, ShieldAlert, Save, History, Ban, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { apiRequest } from '@/utils/api';

export default function UserProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    status: '',
    casino_enabled: true,
    sportsbook_enabled: true,
    deposits_enabled: true,
    withdrawals_enabled: true,
    bonuses_enabled: true,
    internal_notes: ''
  });

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const res = await apiRequest(`/admin/users/${id}`);
      setUser(res);
      setFormData({
        status: res.status,
        casino_enabled: res.casino_enabled,
        sportsbook_enabled: res.sportsbook_enabled,
        deposits_enabled: res.deposits_enabled,
        withdrawals_enabled: res.withdrawals_enabled,
        bonuses_enabled: res.bonuses_enabled,
        internal_notes: res.internal_notes || ''
      });
    } catch (error) {
      console.error('Error fetching user', error);
      alert('User not found');
      router.push('/admin/users');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiRequest(`/admin/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(formData)
      });
      alert('User updated successfully');
      fetchUser();
    } catch (error) {
      console.error('Error updating user', error);
      alert('Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) {
    return <div className="text-white text-center py-20">Loading user profile...</div>;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-full text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-white flex-1">User Profile: {user.username || user.email}</h1>
        
        <div className="flex gap-2">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-[#ffdf00] text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Info & Wallet */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-[#111] border border-neutral-800 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-[#ffdf00]" /> Personal Info
            </h2>
            <div className="space-y-4">
              <div>
                <div className="text-xs text-neutral-500 mb-1">User ID</div>
                <div className="font-mono text-sm text-[#ffdf00] font-bold bg-black p-2 rounded">{user.player_id} <span className="text-xs text-neutral-600 font-normal ml-2">({user.id})</span></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-neutral-500 mb-1">Username</div>
                  <div className="text-white">{user.username || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs text-neutral-500 mb-1">Phone</div>
                  <div className="text-white">{user.phone || 'N/A'}</div>
                </div>
              </div>
              <div>
                <div className="text-xs text-neutral-500 mb-1">Email</div>
                <div className="text-white">{user.email || 'N/A'}</div>
              </div>
              <div>
                <div className="text-xs text-neutral-500 mb-1">Registered</div>
                <div className="text-white">{new Date(user.created_at).toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-neutral-500 mb-1">Account Status</div>
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full bg-black border border-neutral-700 rounded-lg px-3 py-2 text-white focus:border-[#ffdf00] focus:outline-none"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                  <option value="BANNED">BANNED</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-[#111] border border-neutral-800 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-[#ffdf00]" /> Wallet Status
            </h2>
            <div className="bg-black rounded-lg p-4 border border-neutral-800 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Main Balance</span>
                <span className="text-xl font-bold text-white">PKR {Number(user.wallet?.balance || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Bonus Balance</span>
                <span className="text-lg font-bold text-[#ffdf00]">PKR {Number(user.wallet?.bonus_balance || 0).toLocaleString()}</span>
              </div>
              
              <Link 
                href={`/admin/finances/wallet-adjustments?userId=${user.id}`}
                className="mt-2 w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-center text-sm font-medium transition-colors"
              >
                Manual Adjustment
              </Link>
            </div>
          </div>
        </div>

        {/* Right Col: Restrictions & Notes */}
        <div className="space-y-6 lg:col-span-2">
          
          <div className="bg-[#111] border border-neutral-800 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-500" /> Platform Restrictions
            </h2>
            <p className="text-sm text-neutral-400 mb-6">Use these toggles to restrict specific functionalities for this user without completely banning their account.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'casino_enabled', label: 'Casino Games Access' },
                { key: 'sportsbook_enabled', label: 'Sportsbook Access' },
                { key: 'deposits_enabled', label: 'Allow Deposits' },
                { key: 'withdrawals_enabled', label: 'Allow Withdrawals' },
                { key: 'bonuses_enabled', label: 'Eligibility for Bonuses' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 bg-black border border-neutral-800 rounded-lg">
                  <span className="text-white font-medium">{item.label}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={formData[item.key as keyof typeof formData] as boolean}
                      onChange={(e) => setFormData({...formData, [item.key]: e.target.checked})}
                    />
                    <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#111] border border-neutral-800 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Internal Admin Notes</h2>
            <textarea
              value={formData.internal_notes}
              onChange={(e) => setFormData({...formData, internal_notes: e.target.value})}
              placeholder="Add notes about this user (e.g. suspicious activity, VIP request). These notes are only visible to admins."
              className="w-full h-32 bg-black border border-neutral-800 rounded-lg p-4 text-white focus:outline-none focus:border-[#ffdf00] resize-none"
            ></textarea>
          </div>

        </div>

      </div>
    </div>
  );
}

