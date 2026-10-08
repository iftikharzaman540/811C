"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronUp, ChevronDown, Calendar, Trophy, Diamond, Crown, Shield } from 'lucide-react';
import { apiRequest } from '@/utils/api';
import toast from 'react-hot-toast';
import BottomNav from '@/components/BottomNav';

export default function VipPage() {
  const router = useRouter();
  const [vipStatus, setVipStatus] = useState<any>(null);
  const [expandedLevels, setExpandedLevels] = useState<Record<number, boolean>>({ 1: true });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'rewards' | 'rules'>('rewards');

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

  // Get next level bonus for the top card
  const getNextLevelBonus = () => {
    if (!vipStatus || !vipStatus.levels || !vipStatus.nextLevel) return '0.00';
    const next = vipStatus.levels.find((l: any) => l.level === vipStatus.nextLevel);
    return next ? Number(next.bonus_amount || 0).toFixed(2) : '0.00';
  };

  return (
    <div className="min-h-screen bg-[#111] text-white flex flex-col font-sans pb-[80px]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-[#0a0a0a] sticky top-0 z-50 border-b border-[#222]">
        <button onClick={() => router.back()} className="text-[#ffdf00] hover:text-white transition-colors p-1">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h1 className="text-[17px] font-black tracking-wide text-[#ffdf00]">VIP Privileges</h1>
        <div className="w-6"></div>
      </div>

      {/* Top VIP Card (Copied from Profile) */}
      <div className="p-4 bg-[#0a0a0a] border-b border-neutral-900">
        <div className="border border-[#ffdf00]/30 bg-gradient-to-r from-[#1a1700] via-[#0f0a00] to-[#1a1700] rounded-xl p-3 flex items-center justify-between relative shadow-[0_0_20px_rgba(255,223,0,0.06)]">
          
          {/* Left Side: Badge & Progress */}
          <div className="flex-1 pr-3 border-r border-[#ffdf00]/20 flex items-center gap-2">
            {/* Shield Badge */}
            <div className="relative w-[50px] h-[60px] flex-shrink-0 flex flex-col items-center justify-center">
              <svg className="absolute inset-0 w-full h-full drop-shadow-[0_0_8px_rgba(255,223,0,0.5)]" viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 0L40 10V25C40 35 20 48 20 48C20 48 0 35 0 25V10L20 0Z" fill="url(#goldGradient)"/>
                <path d="M20 2L38 11V24.5C38 33.5 20 45 20 45C20 45 2 33.5 2 24.5V11L20 2Z" fill="url(#darkGradient)"/>
                <defs>
                  <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="48" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#ffe54c"/>
                    <stop offset="0.5" stopColor="#ffdf00"/>
                    <stop offset="1" stopColor="#997a00"/>
                  </linearGradient>
                  <linearGradient id="darkGradient" x1="0" y1="0" x2="0" y2="48" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#2a2000"/>
                    <stop offset="1" stopColor="#0a0800"/>
                  </linearGradient>
                </defs>
              </svg>
              <div className="z-10 flex flex-col items-center mt-[-4px]">
                <Crown className="w-5 h-5 text-[#ffdf00] fill-current mb-0.5" />
                <span className="text-[#ffdf00] font-black text-[12px] italic leading-none drop-shadow-md">VIP {vipStatus?.currentLevel || 0}</span>
              </div>
            </div>

            {/* Progress */}
            <div className="flex-1 flex flex-col justify-center">
              <div className="w-full h-2.5 bg-[#000] rounded-full overflow-visible relative border border-neutral-800 shadow-inner">
                <div className="h-full bg-gradient-to-r from-[#ffdf00] to-[#fff5cc] rounded-full relative transition-all duration-1000" style={{ width: Math.min(100, (vipStatus?.requiredForNext ? (vipStatus.totalWagered / vipStatus.requiredForNext) * 100 : 0)) + '%' }}>
                  <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-[0_0_10px_#fff,0_0_20px_#ffdf00]"></div>
                </div>
              </div>
              <div className="text-[11px] text-neutral-400 font-bold mt-2 text-left tracking-tight">
                {(vipStatus?.totalWagered || 0).toLocaleString(undefined, {minimumFractionDigits: 2})} / {(vipStatus?.requiredForNext || 10000).toLocaleString(undefined, {minimumFractionDigits: 2})}
              </div>
            </div>
          </div>
          
          {/* Right Side: Next Level Info */}
          <div className="w-[110px] pl-3 flex flex-col justify-center relative">
            <span className="text-neutral-400 text-[10px] leading-tight font-medium">Next level bonus</span>
            <span className="text-[#ffdf00] font-black text-[14px] leading-tight mt-1 mb-1.5 drop-shadow-md">Rs {getNextLevelBonus()}</span>
            <span className="text-neutral-500 text-[9px] leading-tight">Requires Bets {(vipStatus?.requiredForNext || 0).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#161616] border-b border-[#333] shadow-sm sticky top-[65px] z-40">
        <button 
          onClick={() => setActiveTab('rewards')}
          className={`flex-1 py-3.5 text-[13px] font-black uppercase tracking-wider transition-all relative ${activeTab === 'rewards' ? 'text-[#ffdf00]' : 'text-neutral-500'}`}
        >
          VIP Rewards
          {activeTab === 'rewards' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40px] h-[3px] bg-[#ffdf00] rounded-t-full shadow-[0_-2px_10px_rgba(255,223,0,0.5)]"></div>}
        </button>
        <button 
          onClick={() => setActiveTab('rules')}
          className={`flex-1 py-3.5 text-[13px] font-black uppercase tracking-wider transition-all relative ${activeTab === 'rules' ? 'text-[#ffdf00]' : 'text-neutral-500'}`}
        >
          Rules
          {activeTab === 'rules' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40px] h-[3px] bg-[#ffdf00] rounded-t-full shadow-[0_-2px_10px_rgba(255,223,0,0.5)]"></div>}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        {errorMsg ? (
          <div className="p-10 text-center text-[#ff0b0b] font-bold">{errorMsg}</div>
        ) : !vipStatus ? (
          <div className="p-10 text-center text-[#ffdf00]/70 animate-pulse font-medium">Loading VIP Data...</div>
        ) : activeTab === 'rewards' ? (
          <div className="flex-1 w-full flex flex-col">
            
            {/* Table Header */}
            <div className="flex border-b border-[#222] bg-[#0a0a0a] text-[#ffdf00] text-[11px] font-black uppercase tracking-widest py-3">
              <div className="w-[75px] border-r border-[#222] text-center flex-shrink-0">
                Level
              </div>
              <div className="flex-1 text-center">
                Rewards / Privileges
              </div>
            </div>

            {/* Levels List */}
            {vipStatus.levels?.filter((l: any) => l.level > 0).map((lvl: any) => {
              const isExpanded = expandedLevels[lvl.level];
              const isReached = (vipStatus.totalWagered || 0) >= lvl.min_turnover;
              const isClaimed = vipStatus.claims?.some((c: any) => c.level === lvl.level);
              
              const baseBonus = Number(lvl.bonus_amount || 0);
              const weeklySalary = (baseBonus * 0.25).toFixed(2);
              const monthlySalary = (baseBonus * 0.50).toFixed(2);
              const totalReceive = (baseBonus + Number(weeklySalary) + Number(monthlySalary)).toFixed(2);

              return (
                <div key={lvl.level} className="flex border-b border-[#222] bg-[#141414] hover:bg-[#1a1a1a] transition-colors">
                  
                  {/* Left Column: VIP Badge (Gold Circle with Red Ribbon) */}
                  <div className="w-[75px] border-r border-[#222] flex flex-col items-center justify-start pt-4 flex-shrink-0 relative">
                    <div className="relative flex flex-col items-center">
                      {/* Gold Circle */}
                      <div className="w-[46px] h-[46px] bg-gradient-to-br from-[#ffe54c] via-[#ffdf00] to-[#b39800] rounded-full flex items-center justify-center shadow-[0_4px_15px_rgba(255,223,0,0.15)] border-2 border-[#fff9d6]">
                         <span className="font-black text-black text-2xl italic pr-1">V</span>
                      </div>
                      
                      {/* Red Ribbon */}
                      <div className="bg-gradient-to-r from-[#ff3333] to-[#cc0000] px-2.5 py-[3px] rounded text-[10px] font-black text-white shadow-lg -mt-2.5 z-10 border border-[#ff6666]/50 whitespace-nowrap">
                        VIP {lvl.level}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Rewards Details */}
                  <div className="flex-1 flex flex-col min-w-0">
                    {/* Fold Header */}
                    <div 
                      onClick={() => toggleLevel(lvl.level)}
                      className="p-3 py-2.5 flex items-center justify-between cursor-pointer select-none"
                    >
                      <div className="text-[13px] text-neutral-300 font-medium">
                        Level up to VIP{lvl.level} to receive <br/>
                        <span className="text-[#ffdf00] font-black text-[16px]">{totalReceive}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#ffdf00] text-[12px] font-bold">
                        {isExpanded ? 'Fold' : 'Expand'}
                        {isExpanded ? <ChevronUp className="w-4 h-4 stroke-[3]" /> : <ChevronDown className="w-4 h-4 stroke-[3]" />}
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="px-3 pb-4 space-y-2">
                        
                        {/* Weekly Salary */}
                        <div className="flex items-center gap-2 justify-between bg-[#0a0a0a] p-2 rounded-lg border border-[#222]">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-[32px] h-[32px] bg-[#1a1a1a] rounded-lg flex flex-col items-center justify-center text-[#ffdf00] border border-[#ffdf00]/20 flex-shrink-0">
                              <span className="text-[7px] font-bold leading-none mt-0.5">WEEK</span>
                              <span className="text-[11px] font-black leading-none mb-0.5">07</span>
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-[11px] text-white font-medium truncate">Weekly salary</span>
                              <span className="text-[#ff9900] text-[12px] font-black">+{weeklySalary}</span>
                            </div>
                          </div>
                          <button onClick={handleGoToBet} className="flex-shrink-0 bg-gradient-to-b from-[#7ae22d] to-[#4c9c15] text-black font-black px-3 py-1.5 rounded-md text-[11px] shadow-sm whitespace-nowrap active:scale-95 border border-[#8aff33]/50">
                            Go to bet
                          </button>
                        </div>

                        {/* Monthly Salary */}
                        <div className="flex items-center gap-2 justify-between bg-[#0a0a0a] p-2 rounded-lg border border-[#222]">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-[32px] h-[32px] bg-[#1a1a1a] rounded-lg flex flex-col items-center justify-center text-[#3366ff] border border-[#3366ff]/30 flex-shrink-0">
                              <span className="text-[7px] font-bold leading-none mt-0.5">MONTH</span>
                              <span className="text-[11px] font-black leading-none mb-0.5">30</span>
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-[11px] text-white font-medium truncate">Monthly salary</span>
                              <span className="text-[#ff9900] text-[12px] font-black">+{monthlySalary}</span>
                            </div>
                          </div>
                          <button onClick={handleGoToBet} className="flex-shrink-0 bg-gradient-to-b from-[#7ae22d] to-[#4c9c15] text-black font-black px-3 py-1.5 rounded-md text-[11px] shadow-sm whitespace-nowrap active:scale-95 border border-[#8aff33]/50">
                            Go to bet
                          </button>
                        </div>

                        {/* Next Level Bonus */}
                        <div className="flex items-center gap-2 justify-between bg-[#1a1700] p-2 rounded-lg border border-[#ffdf00]/30 shadow-[0_0_15px_rgba(255,223,0,0.05)]">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-[32px] h-[32px] bg-gradient-to-b from-[#4d3a00] to-black rounded-lg flex items-center justify-center text-[#ffdf00] border border-[#ffdf00]/50 flex-shrink-0">
                              <Trophy className="w-4 h-4 drop-shadow-md" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-[11px] text-white font-medium truncate">Next level bonus</span>
                              <div className="flex items-center gap-1.5">
                                 <span className="text-[#ffdf00] text-[12px] font-black">+{baseBonus.toFixed(2)}</span>
                              </div>
                              <span className="text-[10px] text-neutral-500 leading-tight mt-0.5 truncate font-medium">
                                 Bet target: {Number(lvl.min_turnover || 0).toLocaleString()}
                              </span>
                            </div>
                          </div>
                          
                          {/* Dynamic Button */}
                          {isClaimed ? (
                             <button disabled className="flex-shrink-0 bg-[#222] text-neutral-500 font-black px-3 py-1.5 rounded-md text-[11px] whitespace-nowrap border border-[#333]">
                               Claimed
                             </button>
                          ) : isReached ? (
                             <button onClick={() => claimBonus(lvl.level)} className="flex-shrink-0 bg-gradient-to-b from-[#ffdf00] to-[#ff9900] text-black font-black px-3 py-1.5 rounded-md text-[11px] shadow-[0_0_15px_rgba(255,153,0,0.5)] whitespace-nowrap animate-pulse active:scale-95 border border-[#ffe680]">
                               Claim Now
                             </button>
                          ) : (
                            <button onClick={handleGoToBet} className="flex-shrink-0 bg-gradient-to-b from-[#7ae22d] to-[#4c9c15] text-black font-black px-3 py-1.5 rounded-md text-[11px] shadow-sm whitespace-nowrap active:scale-95 border border-[#8aff33]/50">
                              Go to bet
                            </button>
                          )}
                        </div>

                        {/* VIP Privilege */}
                        <div className="flex items-start gap-2 bg-[#0a0a0a] p-2.5 rounded-lg border border-[#222]">
                          <div className="w-[32px] h-[32px] bg-[#1a1a1a] rounded-lg flex items-center justify-center text-[#ffdf00] border border-[#ffdf00]/20 flex-shrink-0">
                            <Shield className="w-4 h-4 fill-[#ffdf00]/10 text-[#ffdf00]" />
                          </div>
                          <div className="flex flex-col w-full min-w-0">
                            <span className="text-[12px] font-black text-white mb-1.5">VIP Privilege</span>
                            
                            <div className="grid grid-cols-2 gap-y-2 gap-x-2 w-full">
                              <div>
                                <div className="text-[9px] text-neutral-500 font-medium mb-0.5 uppercase tracking-wider">Daily withdrawal</div>
                                <div className="text-[11px] text-white font-bold">Unlimited</div>
                              </div>
                              <div>
                                <div className="text-[9px] text-neutral-500 font-medium mb-0.5 uppercase tracking-wider">Withdrawal times</div>
                                <div className="text-[11px] text-white font-bold">Unlimited</div>
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
        ) : (
          /* Rules Tab */
          <div className="p-6">
            <h2 className="text-[#ffdf00] font-black text-lg mb-6 flex items-center gap-2">
              <Diamond className="w-5 h-5 fill-[#ffdf00]" />
              VIP System Rules
            </h2>
            <div className="space-y-5 text-sm text-neutral-300 leading-relaxed bg-[#1a1a1a] p-5 rounded-2xl border border-[#333]">
              <div className="flex gap-2">
                <span className="w-4 h-4 rounded-full bg-[#ffdf00]/10 text-[#ffdf00] font-black flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                <p><strong className="text-white block mb-1">Automatic Upgrades</strong> Your VIP level is automatically upgraded as soon as your total betting turnover reaches the required target for the next level.</p>
              </div>
              <div className="flex gap-2">
                <span className="w-4 h-4 rounded-full bg-[#ffdf00]/10 text-[#ffdf00] font-black flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                <p><strong className="text-white block mb-1">Level Up Bonuses</strong> Upon reaching a new VIP level, you can claim an exclusive Level Up Bonus from the VIP Rewards tab.</p>
              </div>
              <div className="flex gap-2">
                <span className="w-4 h-4 rounded-full bg-[#ffdf00]/10 text-[#ffdf00] font-black flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                <p><strong className="text-white block mb-1">Wagering Requirements</strong> Claimed VIP bonuses will be placed in your Bonus Balance and require a standard wagering multiplier before they become withdrawable.</p>
              </div>
              <div className="flex gap-2">
                <span className="w-4 h-4 rounded-full bg-[#ffdf00]/10 text-[#ffdf00] font-black flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
                <p><strong className="text-white block mb-1">Unlimited Withdrawals</strong> VIP members enjoy enhanced account privileges, including unlimited daily withdrawal amounts and frequencies.</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
