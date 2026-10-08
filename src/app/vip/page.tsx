"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronUp, ChevronDown, Calendar, Trophy, Diamond, ChevronRight } from 'lucide-react';
import { apiRequest } from '@/utils/api';
import { useUser } from '@/context/UserContext';
import toast from 'react-hot-toast';

export default function VipPage() {
  const router = useRouter();
  const { user } = useUser();
  const [vipStatus, setVipStatus] = useState<any>(null);
  const [expandedLevels, setExpandedLevels] = useState<Record<number, boolean>>({ 1: true });

  useEffect(() => {
    apiRequest('/vip/status')
      .then(res => setVipStatus(res))
      .catch(() => {});
  }, []);

  const toggleLevel = (level: number) => {
    setExpandedLevels(prev => ({ ...prev, [level]: !prev[level] }));
  };

  const handleGoToBet = () => {
    router.push('/');
  };

  const claimBonus = async (level: number) => {
    try {
      toast.loading("Claiming...", { id: 'claim' });
      await apiRequest('/vip/claim-bonus', {
        method: 'POST',
        body: JSON.stringify({ level })
      });
      toast.dismiss('claim');
      toast.success("Bonus Claimed Successfully!");
      // refresh status
      const res = await apiRequest('/vip/status');
      setVipStatus(res);
    } catch (e: any) {
      toast.dismiss('claim');
      toast.error(e.message || "Failed to claim bonus");
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white flex flex-col font-sans pb-10">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-[#1a1a1a] sticky top-0 z-50 shadow-md">
        <button onClick={() => router.back()} className="text-[#ffdf00] hover:text-white p-1 -ml-1 transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold tracking-wide">VIP Privileges</h1>
        <div className="w-6"></div>
      </div>

      {/* Main Table Structure matching reference */}
      <div className="flex-1 w-full flex flex-col mt-2">
        {/* Table Header */}
        <div className="flex border-b border-neutral-800 bg-[#1a1a1a] text-neutral-400 text-sm font-bold">
          <div className="w-[80px] p-4 border-r border-neutral-800 text-center flex-shrink-0 flex items-center justify-center">
            Level
          </div>
          <div className="flex-1 p-4 flex items-center justify-center">
            Rewards/Privileges
          </div>
        </div>

        {/* Levels List */}
        {!vipStatus ? (
          <div className="p-10 text-center text-neutral-500 animate-pulse">Loading VIP Data...</div>
        ) : (
          vipStatus.levels?.filter((l: any) => l.level > 0).map((lvl: any) => {
            const isExpanded = expandedLevels[lvl.level];
            const isReached = (vipStatus.totalWagered || 0) >= lvl.min_turnover;
            const isClaimed = vipStatus.claims?.some((c: any) => c.level === lvl.level);
            
            // For UI accuracy to reference image:
            const weeklySalary = (lvl.bonus_amount * 0.25).toFixed(2);
            const monthlySalary = (lvl.bonus_amount * 0.50).toFixed(2);
            const totalReceive = (Number(lvl.bonus_amount) + Number(weeklySalary) + Number(monthlySalary)).toFixed(2);

            return (
              <div key={lvl.level} className="flex border-b border-neutral-800 bg-[#171717]">
                
                {/* Left Column: VIP Badge */}
                <div className="w-[80px] border-r border-neutral-800 flex flex-col items-center justify-start pt-6 flex-shrink-0 bg-[#141414]">
                  <div className="relative flex flex-col items-center">
                    {/* Crown Icon */}
                    <div className="w-10 h-10 bg-gradient-to-br from-[#7ae22d] to-[#4c9c15] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(122,226,45,0.3)] mb-1 relative overflow-hidden">
                       <span className="font-black text-white text-lg relative z-10 italic">V</span>
                       {/* Crown points */}
                       <div className="absolute top-1 w-6 h-3 flex justify-between px-[2px]">
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          <div className="w-1.5 h-1.5 bg-white rounded-full -mt-1"></div>
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                       </div>
                    </div>
                    {/* VIP Pill */}
                    <div className="bg-gradient-to-r from-green-400 to-green-600 px-2 py-0.5 rounded-full text-[10px] font-black text-white shadow-sm mb-2 -mt-2 z-10 border border-green-300/30">
                      VIP {lvl.level}
                    </div>
                    <span className="font-black text-white">VIP {lvl.level}</span>
                  </div>
                </div>

                {/* Right Column: Rewards Details */}
                <div className="flex-1 flex flex-col">
                  {/* Fold Header */}
                  <div 
                    onClick={() => toggleLevel(lvl.level)}
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-neutral-800/30 transition-colors"
                  >
                    <div className="text-[15px] text-white">
                      Level up to VIP{lvl.level} to receive <span className="text-[#ff9900] font-bold">{totalReceive}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#7ae22d] text-sm">
                      {isExpanded ? 'Fold' : 'Expand'}
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-4 pb-6 space-y-5">
                      
                      {/* Weekly Salary */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#e6ffcc] rounded-xl flex flex-col items-center justify-center text-[#4c9c15] shadow-sm">
                            <span className="text-[10px] font-bold leading-none mt-1">WEEK</span>
                            <span className="text-sm font-black leading-none mb-1">07</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[15px] text-white">Weekly salary</span>
                            <span className="bg-[#4d3300] text-[#ff9900] px-2 py-0.5 rounded text-sm font-bold">+{weeklySalary}</span>
                          </div>
                        </div>
                        <button onClick={handleGoToBet} className="bg-[#7ae22d] hover:bg-[#65cc20] text-black font-bold px-4 py-2 rounded-lg text-sm shadow-md transition-all active:scale-95">
                          Go to bet
                        </button>
                      </div>

                      {/* Monthly Salary */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#e6eeff] rounded-xl flex flex-col items-center justify-center text-[#3366ff] shadow-sm">
                            <span className="text-[10px] font-bold leading-none mt-1">MONTH</span>
                            <span className="text-sm font-black leading-none mb-1">30</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[15px] text-white">Monthly salary</span>
                            <span className="bg-[#4d3300] text-[#ff9900] px-2 py-0.5 rounded text-sm font-bold">+{monthlySalary}</span>
                          </div>
                        </div>
                        <button onClick={handleGoToBet} className="bg-[#7ae22d] hover:bg-[#65cc20] text-black font-bold px-4 py-2 rounded-lg text-sm shadow-md transition-all active:scale-95">
                          Go to bet
                        </button>
                      </div>

                      {/* Next Level Bonus */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#ffe6cc] rounded-xl flex items-center justify-center text-[#ff6600] shadow-sm relative overflow-hidden">
                            <Trophy className="w-6 h-6 z-10" />
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="text-[15px] text-white">Next level bonus</span>
                              <span className="bg-[#4d3300] text-[#ff9900] px-2 py-0.5 rounded text-sm font-bold">+{Number(lvl.bonus_amount).toFixed(2)}</span>
                            </div>
                            <span className="text-sm text-neutral-500 mt-1">Bet for promotion {lvl.min_turnover.toLocaleString()}</span>
                          </div>
                        </div>
                        
                        {/* Dynamic Button for Bonus */}
                        {isClaimed ? (
                           <button disabled className="bg-neutral-800 text-neutral-500 font-bold px-4 py-2 rounded-lg text-sm shadow-md">
                             Claimed
                           </button>
                        ) : isReached ? (
                           <button onClick={() => claimBonus(lvl.level)} className="bg-gradient-to-r from-[#ffdf00] to-[#ff9900] text-black font-bold px-4 py-2 rounded-lg text-sm shadow-[0_0_10px_rgba(255,153,0,0.5)] transition-all active:scale-95">
                             Claim Now
                           </button>
                        ) : (
                          <button onClick={handleGoToBet} className="bg-[#7ae22d] hover:bg-[#65cc20] text-black font-bold px-4 py-2 rounded-lg text-sm shadow-md transition-all active:scale-95">
                            Go to bet
                          </button>
                        )}
                      </div>

                      {/* VIP Privilege */}
                      <div className="flex items-start gap-3 pt-2">
                        <div className="w-10 h-10 bg-[#fff5cc] rounded-xl flex items-center justify-center text-[#ffcc00] shadow-sm flex-shrink-0">
                          <Diamond className="w-6 h-6 fill-[#ffcc00]" />
                        </div>
                        <div className="flex flex-col w-full">
                          <span className="text-[15px] text-white mb-2">VIP Privilege</span>
                          
                          <div className="grid grid-cols-2 gap-y-4 gap-x-2 w-full">
                            <div>
                              <div className="text-xs text-neutral-500 mb-0.5">Daily total withdrawal:</div>
                              <div className="text-sm text-white font-medium">Unlimited</div>
                            </div>
                            <div>
                              <div className="text-xs text-neutral-500 mb-0.5">Daily withdrawal times:</div>
                              <div className="text-sm text-white font-medium">Unlimited</div>
                            </div>
                            <div>
                              <div className="text-xs text-neutral-500 mb-0.5">Daily fee-free orders: 0</div>
                              <div className="text-sm text-white font-medium">orders</div>
                            </div>
                          </div>
                        </div>
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
