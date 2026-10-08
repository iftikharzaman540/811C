"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronUp, ChevronDown, Calendar, Trophy, Diamond } from 'lucide-react';
import { apiRequest } from '@/utils/api';
import toast from 'react-hot-toast';

export default function VipPage() {
  const router = useRouter();
  const [vipStatus, setVipStatus] = useState<any>(null);
  const [expandedLevels, setExpandedLevels] = useState<Record<number, boolean>>({ 1: true });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    apiRequest('/vip/status')
      .then(res => setVipStatus(res))
      .catch((err) => {
        console.error(err);
        setErrorMsg(err.message || 'Failed to load data');
      });
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
      
      const res = await apiRequest('/vip/status');
      setVipStatus(res);
    } catch (e: any) {
      toast.dismiss('claim');
      toast.error(e.message || "Failed to claim bonus");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans pb-10">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-[#111] sticky top-0 z-50 border-b border-[#ffdf00]/20">
        <button onClick={() => router.back()} className="text-[#ffdf00] hover:text-white transition-colors p-1">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-black tracking-wide text-[#ffdf00]">VIP Privileges</h1>
        <div className="w-6"></div>
      </div>

      {/* Error State */}
      {errorMsg ? (
        <div className="p-10 text-center text-[#ff0b0b] font-bold">{errorMsg}</div>
      ) : !vipStatus ? (
        <div className="p-10 text-center text-[#ffdf00]/70 animate-pulse font-medium">Loading VIP Data...</div>
      ) : (
        <div className="flex-1 w-full flex flex-col">
          
          {/* Table Header */}
          <div className="flex border-b border-neutral-800 bg-[#111] text-[#ffdf00] text-[13px] font-bold uppercase tracking-wider">
            <div className="w-[75px] p-3 border-r border-neutral-800 text-center flex-shrink-0">
              Level
            </div>
            <div className="flex-1 p-3 text-center">
              Rewards / Privileges
            </div>
          </div>

          {/* Levels List */}
          {vipStatus.levels?.filter((l: any) => l.level > 0).map((lvl: any) => {
            const isExpanded = expandedLevels[lvl.level];
            const isReached = (vipStatus.totalWagered || 0) >= lvl.min_turnover;
            const isClaimed = vipStatus.claims?.some((c: any) => c.level === lvl.level);
            
            // Safe parsing
            const baseBonus = Number(lvl.bonus_amount || 0);
            const weeklySalary = (baseBonus * 0.25).toFixed(2);
            const monthlySalary = (baseBonus * 0.50).toFixed(2);
            const totalReceive = (baseBonus + Number(weeklySalary) + Number(monthlySalary)).toFixed(2);

            return (
              <div key={lvl.level} className="flex border-b border-neutral-800/50 bg-[#111]">
                
                {/* Left Column: VIP Badge (Gold Theme) */}
                <div className="w-[75px] border-r border-neutral-800/50 flex flex-col items-center justify-start pt-5 flex-shrink-0 bg-[#0a0a0a]">
                  <div className="relative flex flex-col items-center">
                    
                    <div className="w-[42px] h-[42px] bg-gradient-to-br from-[#ffdf00] to-[#ff9900] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,223,0,0.2)] mb-1 relative border-2 border-[#fff5cc]">
                       <span className="font-black text-black text-xl italic drop-shadow-sm">V</span>
                    </div>
                    
                    <div className="bg-gradient-to-r from-[#cc0000] to-[#ff0b0b] px-2 py-0.5 rounded border border-[#ff4d4d] text-[10px] font-black text-white shadow-md -mt-2 z-10 whitespace-nowrap">
                      VIP {lvl.level}
                    </div>
                  </div>
                </div>

                {/* Right Column: Rewards Details */}
                <div className="flex-1 flex flex-col min-w-0">
                  {/* Fold Header */}
                  <div 
                    onClick={() => toggleLevel(lvl.level)}
                    className="p-3 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors select-none"
                  >
                    <div className="text-[13px] text-neutral-300 leading-tight">
                      Level up to VIP{lvl.level} to receive <br/>
                      <span className="text-[#ffdf00] font-black text-[15px]">{totalReceive}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#ffdf00] text-[12px] font-bold">
                      {isExpanded ? 'Fold' : 'Expand'}
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-3 pb-5 space-y-3">
                      
                      {/* Weekly Salary */}
                      <div className="flex items-center gap-2 justify-between bg-[#1a1a1a] p-2.5 rounded-lg border border-neutral-800">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-9 h-9 bg-neutral-900 rounded flex flex-col items-center justify-center text-[#ffdf00] border border-[#ffdf00]/20 flex-shrink-0">
                            <span className="text-[8px] font-bold leading-none mt-1">WEEK</span>
                            <span className="text-[13px] font-black leading-none mb-1">07</span>
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[12px] text-white truncate">Weekly salary</span>
                            <span className="text-[#00e676] text-[13px] font-black">+{weeklySalary}</span>
                          </div>
                        </div>
                        <button onClick={handleGoToBet} className="flex-shrink-0 bg-gradient-to-r from-[#cc0000] to-[#ff0b0b] text-white font-bold px-3 py-1.5 rounded text-[11px] shadow-sm whitespace-nowrap active:scale-95">
                          Go to bet
                        </button>
                      </div>

                      {/* Monthly Salary */}
                      <div className="flex items-center gap-2 justify-between bg-[#1a1a1a] p-2.5 rounded-lg border border-neutral-800">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-9 h-9 bg-neutral-900 rounded flex flex-col items-center justify-center text-[#ffdf00] border border-[#ffdf00]/20 flex-shrink-0">
                            <span className="text-[8px] font-bold leading-none mt-1">MONTH</span>
                            <span className="text-[13px] font-black leading-none mb-1">30</span>
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[12px] text-white truncate">Monthly salary</span>
                            <span className="text-[#00e676] text-[13px] font-black">+{monthlySalary}</span>
                          </div>
                        </div>
                        <button onClick={handleGoToBet} className="flex-shrink-0 bg-gradient-to-r from-[#cc0000] to-[#ff0b0b] text-white font-bold px-3 py-1.5 rounded text-[11px] shadow-sm whitespace-nowrap active:scale-95">
                          Go to bet
                        </button>
                      </div>

                      {/* Next Level Bonus */}
                      <div className="flex items-center gap-2 justify-between bg-[#1a1a1a] p-2.5 rounded-lg border border-[#ffdf00]/30 shadow-[0_0_10px_rgba(255,223,0,0.05)]">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-9 h-9 bg-gradient-to-b from-[#332a00] to-black rounded flex items-center justify-center text-[#ffdf00] border border-[#ffdf00]/40 flex-shrink-0">
                            <Trophy className="w-5 h-5 drop-shadow-md" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[12px] text-white truncate">Next level bonus</span>
                            <div className="flex items-center gap-1.5">
                               <span className="text-[#00e676] text-[13px] font-black">+{baseBonus.toFixed(2)}</span>
                            </div>
                            <span className="text-[10px] text-neutral-500 leading-tight mt-0.5 truncate">
                               Bet target: {Number(lvl.min_turnover || 0).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        
                        {/* Dynamic Button */}
                        {isClaimed ? (
                           <button disabled className="flex-shrink-0 bg-neutral-800 text-neutral-500 font-bold px-3 py-1.5 rounded text-[11px] whitespace-nowrap">
                             Claimed
                           </button>
                        ) : isReached ? (
                           <button onClick={() => claimBonus(lvl.level)} className="flex-shrink-0 bg-gradient-to-r from-[#ffdf00] to-[#ff9900] text-black font-black px-3 py-1.5 rounded text-[11px] shadow-[0_0_10px_rgba(255,223,0,0.4)] whitespace-nowrap animate-pulse active:scale-95">
                             Claim Now
                           </button>
                        ) : (
                          <button onClick={handleGoToBet} className="flex-shrink-0 bg-gradient-to-r from-[#cc0000] to-[#ff0b0b] text-white font-bold px-3 py-1.5 rounded text-[11px] shadow-sm whitespace-nowrap active:scale-95">
                            Go to bet
                          </button>
                        )}
                      </div>

                      {/* VIP Privilege */}
                      <div className="flex items-start gap-2.5 bg-[#1a1a1a] p-2.5 rounded-lg border border-neutral-800">
                        <div className="w-9 h-9 bg-neutral-900 rounded flex items-center justify-center text-[#ffdf00] border border-[#ffdf00]/20 flex-shrink-0">
                          <Diamond className="w-5 h-5 fill-[#ffdf00]" />
                        </div>
                        <div className="flex flex-col w-full min-w-0">
                          <span className="text-[13px] font-bold text-[#ffdf00] mb-2">VIP Privilege</span>
                          
                          <div className="grid grid-cols-2 gap-y-3 gap-x-2 w-full">
                            <div>
                              <div className="text-[10px] text-neutral-500 leading-tight">Daily withdrawal limit</div>
                              <div className="text-[12px] text-white font-medium">Unlimited</div>
                            </div>
                            <div>
                              <div className="text-[10px] text-neutral-500 leading-tight">Withdrawal times</div>
                              <div className="text-[12px] text-white font-medium">Unlimited</div>
                            </div>
                            <div>
                              <div className="text-[10px] text-neutral-500 leading-tight">Fee-free orders</div>
                              <div className="text-[12px] text-white font-medium">0 orders</div>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
