"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, User, Wallet, ShieldAlert, Save, History, Ban, CheckCircle, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import Link from 'next/link';
import { apiRequest } from '@/utils/api';

export default function UserProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'deposits' | 'withdrawals'>('deposits');
  const [depositFilter, setDepositFilter] = useState('ALL');
  const [withdrawalFilter, setWithdrawalFilter] = useState('ALL');
  
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
        status: res.status || 'ACTIVE',
        casino_enabled: res.casino_enabled !== false,
        sportsbook_enabled: res.sportsbook_enabled !== false,
        deposits_enabled: res.deposits_enabled !== false,
        withdrawals_enabled: res.withdrawals_enabled !== false,
        bonuses_enabled: res.bonuses_enabled !== false,
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

  const getStatusColor = (status: string) => {
    if (status === 'COMPLETED' || status === 'APPROVED') return 'text-green-500 bg-green-500/10';
    if (status === 'FAILED' || status === 'REJECTED' || status === 'CANCELLED') return 'text-red-500 bg-red-500/10';
    return 'text-yellow-500 bg-yellow-500/10';
  };

  if (loading || !user) {
    return <div className="text-white text-center py-20">Loading user profile...</div>;
  }

  const deposits = user.deposits || [];
  const withdrawals = user.withdrawals || [];

  const filteredDeposits = depositFilter === 'ALL' ? deposits : deposits.filter((d: any) => {
    if (depositFilter === 'PENDING') return d.status === 'PENDING';
    if (depositFilter === 'APPROVED') return d.status === 'COMPLETED';
    if (depositFilter === 'REJECTED') return d.status === 'FAILED' || d.status === 'REJECTED' || d.status === 'CANCELLED';
    return true;
  });

  const filteredWithdrawals = withdrawalFilter === 'ALL' ? withdrawals : withdrawals.filter((w: any) => {
    if (withdrawalFilter === 'PENDING') return w.status === 'PENDING';
    if (withdrawalFilter === 'APPROVED') return w.status === 'COMPLETED';
    if (withdrawalFilter === 'REJECTED') return w.status === 'FAILED' || w.status === 'REJECTED' || w.status === 'CANCELLED';
    return true;
  });

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

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111] border border-neutral-800 rounded-xl p-5 flex flex-col justify-center">
          <div className="text-neutral-400 text-sm mb-1">Total Deposited</div>
          <div className="text-2xl font-bold text-green-500">PKR {Number(user.total_deposited || 0).toLocaleString()}</div>
        </div>
        <div className="bg-[#111] border border-neutral-800 rounded-xl p-5 flex flex-col justify-center">
          <div className="text-neutral-400 text-sm mb-1">Total Withdrawn</div>
          <div className="text-2xl font-bold text-red-500">PKR {Number(user.total_withdrawn || 0).toLocaleString()}</div>
        </div>
        <div className="bg-[#111] border border-neutral-800 rounded-xl p-5 flex flex-col justify-center">
          <div className="text-neutral-400 text-sm mb-1">Current Balance</div>
          <div className="text-2xl font-bold text-[#ffdf00]">PKR {Number(user.wallet?.balance || 0).toLocaleString()}</div>
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

          <div className="bg-[#111] border border-neutral-800 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-[#ffdf00]" /> Wagering Status
            </h2>
            <div className="bg-black rounded-lg p-4 border border-neutral-800 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Total Bonus</span>
                <span className="text-white font-medium">PKR {Number(user.wallet?.bonus_balance || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Required Valid Bet</span>
                <span className="text-white font-medium">PKR {Number(user.current_wagering_requirement || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Completed Valid Bet</span>
                <span className="text-green-500 font-medium">PKR {Number(user.current_wagering_completed || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Remaining Valid Bet</span>
                <span className="text-red-500 font-medium">PKR {Math.max(0, Number(user.current_wagering_requirement || 0) - Number(user.current_wagering_completed || 0)).toLocaleString()}</span>
              </div>
              
              <div className={`mt-2 w-full py-2 rounded-lg text-center text-sm font-bold ${
                Number(user.current_wagering_completed || 0) >= Number(user.current_wagering_requirement || 0) 
                ? 'bg-green-500/20 text-green-500' 
                : 'bg-red-500/20 text-red-500'
              }`}>
                Withdrawal: {Number(user.current_wagering_completed || 0) >= Number(user.current_wagering_requirement || 0) ? 'ELIGIBLE' : 'LOCKED'}
              </div>
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

      {/* Transaction History Tabs */}
      <div className="bg-[#111] border border-neutral-800 rounded-xl overflow-hidden mt-8">
        <div className="flex border-b border-neutral-800">
          <button 
            onClick={() => setActiveTab('deposits')}
            className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'deposits' ? 'text-[#ffdf00] border-b-2 border-[#ffdf00]' : 'text-neutral-400 hover:text-white'}`}
          >
            <ArrowDownToLine className="w-4 h-4" />
            Deposit History
          </button>
          <button 
            onClick={() => setActiveTab('withdrawals')}
            className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'withdrawals' ? 'text-[#ffdf00] border-b-2 border-[#ffdf00]' : 'text-neutral-400 hover:text-white'}`}
          >
            <ArrowUpFromLine className="w-4 h-4" />
            Withdrawal History
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'deposits' && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(f => (
                  <button 
                    key={f}
                    onClick={() => setDepositFilter(f)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${depositFilter === f ? 'bg-[#ffdf00] text-black' : 'bg-neutral-800 text-white hover:bg-neutral-700'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-neutral-400">
                  <thead className="bg-[#1a1a1a] text-neutral-300">
                    <tr>
                      <th className="px-4 py-3 font-medium rounded-tl-lg">Transaction ID</th>
                      <th className="px-4 py-3 font-medium">Amount</th>
                      <th className="px-4 py-3 font-medium">Payment Method</th>
                      <th className="px-4 py-3 font-medium">Ref #</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium rounded-tr-lg">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {filteredDeposits.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-neutral-500">No deposits found.</td>
                      </tr>
                    ) : (
                      filteredDeposits.map((tx: any) => (
                        <tr key={tx.id} className="hover:bg-[#1a1a1a] transition-colors">
                          <td className="px-4 py-3 font-mono text-xs text-white">{tx.id.split('-')[0].toUpperCase()}</td>
                          <td className="px-4 py-3 font-bold text-green-500">PKR {Number(tx.amount).toLocaleString()}</td>
                          <td className="px-4 py-3 text-white">{tx.provider}</td>
                          <td className="px-4 py-3 text-xs">{tx.transaction_reference || 'N/A'}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${getStatusColor(tx.status)}`}>
                              {tx.status === 'COMPLETED' ? 'APPROVED' : tx.status === 'FAILED' ? 'REJECTED' : tx.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-neutral-500">{new Date(tx.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'withdrawals' && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(f => (
                  <button 
                    key={f}
                    onClick={() => setWithdrawalFilter(f)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${withdrawalFilter === f ? 'bg-[#ffdf00] text-black' : 'bg-neutral-800 text-white hover:bg-neutral-700'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-neutral-400">
                  <thead className="bg-[#1a1a1a] text-neutral-300">
                    <tr>
                      <th className="px-4 py-3 font-medium rounded-tl-lg">Transaction ID</th>
                      <th className="px-4 py-3 font-medium">Amount</th>
                      <th className="px-4 py-3 font-medium">Method & Account</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium rounded-tr-lg">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {filteredWithdrawals.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-neutral-500">No withdrawals found.</td>
                      </tr>
                    ) : (
                      filteredWithdrawals.map((tx: any) => (
                        <tr key={tx.id} className="hover:bg-[#1a1a1a] transition-colors">
                          <td className="px-4 py-3 font-mono text-xs text-white">{tx.id.split('-')[0].toUpperCase()}</td>
                          <td className="px-4 py-3 font-bold text-red-500">PKR {Number(tx.amount).toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <div className="text-white font-medium">{tx.provider}</div>
                            <div className="text-xs text-neutral-500">{(tx.metadata as any)?.accountNumber || (tx.metadata as any)?.accountTitle || 'N/A'}</div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${getStatusColor(tx.status)}`}>
                              {tx.status === 'COMPLETED' ? 'APPROVED' : tx.status === 'FAILED' ? 'REJECTED' : tx.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-neutral-500">{new Date(tx.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
