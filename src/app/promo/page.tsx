"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { ChevronLeft, Grid, Handshake, Megaphone, Flame, UserPlus, Gamepad2, History, RefreshCw, Gift, X, PackageOpen, ChevronRight, Zap, Info, Play, ChevronDown, ChevronUp, Calendar, Trophy, Crown, CheckCircle2, Smartphone } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { motion, AnimatePresence } from "framer-motion";

export default function PromoPage() {
  const [activeTopTab, setActiveTopTab] = useState("Mission");
  const [activeSideTab, setActiveSideTab] = useState("All");
  const [activeRebateTab, setActiveRebateTab] = useState("Mini Games");
  const [activeMissionTab, setActiveMissionTab] = useState("Newplayer");
  const [activeSpinWheel, setActiveSpinWheel] = useState("Silver");
  const [activeSpinTimes, setActiveSpinTimes] = useState(1);
  const [vip1Expanded, setVip1Expanded] = useState(true);
  const [luckyPoints, setLuckyPoints] = useState(150000);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinRotation, setSpinRotation] = useState(0);

  const handleSpin = () => {
    if (isSpinning) return;
    
    let cost = 10000;
    if (activeSpinWheel === "Gold") cost = 50000;
    if (activeSpinWheel === "Diamond") cost = 150000;
    
    const totalCost = cost * activeSpinTimes;
    
    if (luckyPoints < totalCost) {
      toast.error("Insufficient lucky points to spin");
      return;
    }

    setLuckyPoints(prev => prev - totalCost);
    setIsSpinning(true);
    
    const extraSpins = 5 * 360; // 5 full rotations
    const randomSegment = Math.floor(Math.random() * 10);
    const stopAngle = extraSpins + (randomSegment * 36) + 18; // point to middle of segment
    
    setSpinRotation(prev => prev + stopAngle);
    
    setTimeout(() => {
      setIsSpinning(false);
      const prizes = [7.00, 10.00, 15.00, 27.00, 77.00, 130.00, 200.00, 250.00, 300.00, 377.00];
      // Due to rotation backwards vs prize array
      const wonAmount = prizes[(10 - randomSegment % 10) % 10] * activeSpinTimes;
      toast.success(`Congratulations! You won Rs ${wonAmount.toFixed(2)}`, { duration: 4000 });
    }, 3000);
  };
  
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showRedeemModal, setShowRedeemModal] = useState(false);

  const topTabs = ["Event", "Unclaimed", "Rebate", "Mission", "Spins", "VIP", "History", "Fund"];
  
  const eventSideTabs = [
    { id: "All", icon: <Grid className="w-5 h-5" /> },
    { id: "Cooperation", icon: <Handshake className="w-5 h-5" /> },
    { id: "Channel", icon: <Megaphone className="w-5 h-5" /> },
    { id: "Popular", icon: <Flame className="w-5 h-5" /> },
    { id: "New Users", icon: <UserPlus className="w-5 h-5" /> },
    { id: "Mini Games", icon: <Gamepad2 className="w-5 h-5" /> },
    { id: "Slot", icon: <span className="font-bold text-[10px] border border-current px-0.5 rounded leading-none flex items-center justify-center">777</span> },
  ];

  const rebateSideTabs = [
    { id: "Mini Games", icon: <Gamepad2 className="w-5 h-5" /> },
    { id: "Slot", icon: <span className="font-bold text-[10px] border border-current px-0.5 rounded leading-none flex items-center justify-center">777</span> },
    { id: "Fishing", icon: <span className="text-[14px]">🦈</span> },
    { id: "Cards", icon: <span className="text-[14px]">🃏</span> },
    { id: "Live", icon: <span className="text-[14px]">👩‍💼</span> },
    { id: "Sports", icon: <span className="text-[14px]">⚽</span> },
  ];

  const renderEventBanners = () => {
    switch (activeSideTab) {
      case "All":
        return (
          <>
            <Banner title="Redeem code" desc="Follow the 8111C channel" highlight="Earn 10~77777" icon="🎁" />
            <Banner title="BRAND ALLIANCE" desc="8111C.com" sub="DUAL CERTIFICATION OF REPUTATION AND STRENGTH" icon="🛡️" />
            <Banner title="BRAND ALLIANCE" desc="VIP Club" sub="DUAL CERTIFICATION OF REPUTATION AND STRENGTH" icon="👑" badge="1" />
          </>
        );
      case "Cooperation":
        return (
          <>
            <Banner title="Invitation Event" desc="Each player you invite" highlight="Get Rs 600" icon="🤝" />
            <Banner title="Invitation Event" desc="Each player you invite" highlight="Get Rs 2000" icon="💸" />
            <Banner title="Invitation Event" desc="Each player you invite" highlight="Get Rs 10,000" icon="💰" />
            <Banner title="Invitation Event" desc="Each player you invite" highlight="Get Rs 50,000" icon="💎" />
          </>
        );
      case "Channel":
        return (
          <>
            <Banner title="Redeem code" desc="Follow the 8111C channel" highlight="Earn 10~77777" icon="🎁" />
            <Banner title="Official Channel" desc="Follow us on Facebook" sub="Stay updated on the latest deals" icon="🌐" badge="•" href="https://www.facebook.com/share/1JzvPey4hQ/" />
            <Banner title="Official Channel" desc="Follow us on Telegram" sub="Stay updated on the latest deals" icon="✈️" badge="•" href="https://t.me/Game8111c" />
            <Banner title="Official Channel" desc="Follow us on WhatsApp" sub="Stay updated on the latest deals" icon="💬" badge="•" href="https://whatsapp.com/channel/0029VbDJdVw7j6gCK3T1YG0i" />
          </>
        );
      case "Popular":
        return (
          <>
            <Banner title="Redeem code" desc="Follow the 8111C channel" highlight="Earn 10~77777" icon="🎁" />
            <Banner title="Bet on Aviator" desc="Claim bonus" highlight="Rs 177,777" icon="🚀" />
            <Banner title="Daily Ranking" desc="Recharge Competition" sub="You're the First" icon="🏆" />
          </>
        );
      case "Mini Games":
        return (
          <>
            <Banner title="Bet on Aviator" desc="Claim bonus" highlight="Rs 177,777" icon="🚀" />
            <Banner title="Lucky Wheel" desc="Play daily to participate in the Lucky Wheel" highlight="" icon="🎡" />
            <Banner title="Chicken Road" desc="Betting boost bonus" highlight="Rs 177777" icon="🐔" />
          </>
        );
      case "Slot":
        return (
          <>
            <Banner title="Lucky Wheel" desc="Play daily to participate in the Lucky Wheel" highlight="" icon="🎡" />
            <Banner title="SLOT BETTING" desc="Lucky bet numbers" highlight="1000X BET BONUS" icon="🎰" />
            <Banner title="JILI PG Slot" desc="Betting Boost Bonus" highlight="Rs 177777" icon="🛡️" />
          </>
        );
      default:
        return <div className="flex items-center justify-center h-40 text-neutral-500 text-[13px]">No events available for this category yet.</div>;
    }
  };

  const renderRebateList = () => {
    let providers = [];
    let cashback = "0.30%";

    switch (activeRebateTab) {
      case "Mini Games": providers = ["WG", "SPRIBE", "EVO", "IN", "JILI"]; cashback = "0.30%"; break;
      case "Slot": providers = ["WG", "PG", "JILI", "JDB", "FC"]; cashback = "0.30%"; break;
      case "Fishing": providers = ["JILI", "WG", "YB", "YGR", "JDB"]; cashback = "0.20%"; break;
      case "Cards": providers = ["WG", "JILI", "KM", "TP", "RTG"]; cashback = "0.20%"; break;
      case "Live": providers = ["EVO", "PLAY", "Ezugi", "SEXY", "AG"]; cashback = "0.05%"; break;
      case "Sports": providers = ["SBO", "WG", "SABA", "CMD", "IN"]; cashback = "0.05%"; break;
      default: providers = ["WG", "JILI"]; cashback = "0.10%";
    }

    return providers.map((provider, idx) => {
      const itemCashback = (activeRebateTab === "Cards" && provider === "KM") ? "0.05%" : cashback;
      return (
        <div key={idx} className="bg-[#1a1a1a] border border-neutral-800 rounded-lg p-3 flex flex-col gap-2 mb-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="font-black italic text-[14px] text-white tracking-wider">{provider}</span>
              <span className="text-neutral-400 text-[12px]">Valid Bets <span className="text-white font-bold">0.00</span></span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-500" />
          </div>
          <div className="w-full bg-[#333] rounded-full h-4 relative flex items-center justify-center overflow-hidden border border-[#444]">
            <span className="text-[9px] font-bold text-white z-10 drop-shadow-md">Re-bet 100 to get {itemCashback} cashback</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-neutral-400">Rebate rate <span className="text-white font-bold">0.00%</span></span>
            <span className="text-neutral-400">Collectable <span className="text-[#ffdf00] font-bold">0.00</span></span>
          </div>
        </div>
      );
    });
  };

  return (
    <main className="h-screen bg-[#111] text-white flex flex-col font-sans overflow-hidden">
      
      {/* Top Header & Tabs */}
      <div className="flex-none bg-[#141414] border-b border-neutral-800">
        <div className="flex items-center h-[50px] px-2 relative">
          <Link href="/" className="px-2 shrink-0">
            <ChevronLeft className="w-5 h-5 text-neutral-400" />
          </Link>
          <div className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-6 px-4">
            {topTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTopTab(tab)}
                className={`relative py-3 text-[14px] font-medium whitespace-nowrap transition-colors ${
                  activeTopTab === tab ? "text-[#ffdf00]" : "text-white"
                }`}
              >
                {tab}
                {activeTopTab === tab && (
                  <motion.div
                    layoutId="top-tab"
                    className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#ff0b0b]"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden pb-16 relative">
        
        {/* EVENT TAB CONTENT */}
        {activeTopTab === "Event" && (
          <div className="flex-1 flex overflow-hidden">
            {/* Left Sidebar */}
            <div className="w-[85px] bg-[#1a1a1a] flex-none overflow-y-auto no-scrollbar pb-6 flex flex-col gap-1.5 p-2 border-r border-neutral-800">
              {eventSideTabs.map((tab) => {
                const isActive = activeSideTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSideTab(tab.id)}
                    className={`flex flex-col items-center justify-center py-2.5 rounded-lg transition-all ${
                      isActive ? "bg-[#cc0000] text-white shadow-[0_0_10px_rgba(255,11,11,0.5)]" : "bg-[#222] text-neutral-400 hover:bg-[#333]"
                    }`}
                  >
                    <div className={`mb-1 ${isActive ? "text-[#ffdf00]" : "text-neutral-400"}`}>{tab.icon}</div>
                    <span className="text-[10px] font-medium text-center leading-tight px-1">{tab.id.replace(' ', '\n')}</span>
                  </button>
                );
              })}
              <div className="mt-4 flex flex-col gap-2">
                <button onClick={() => setActiveTopTab("History")} className="flex items-center justify-center gap-1 py-1.5 border border-[#ff0b0b] text-[#ffdf00] rounded text-[10px] font-bold hover:bg-[#2e0505]"><History className="w-3 h-3" /> History</button>
                <button onClick={() => toast.success("Rewards refreshed")} className="flex items-center justify-center gap-1 py-1.5 border border-[#ff0b0b] text-[#ffdf00] rounded text-[10px] font-bold leading-tight hover:bg-[#2e0505]"><RefreshCw className="w-3 h-3 shrink-0" /> <span className="text-left">Refresh<br/>rewards</span></button>
                <button onClick={() => setShowRedeemModal(true)} className="flex items-center justify-center gap-1 py-2 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded text-[10px] font-bold leading-tight shadow-md">
                  <Gift className="w-4 h-4 shrink-0 text-[#ffdf00]" /> <span className="text-left">Redeem<br/>Code</span>
                </button>
              </div>
            </div>
            {/* Right Content */}
            <div className="flex-1 bg-[#111] overflow-y-auto no-scrollbar p-3">
              <AnimatePresence mode="wait">
                <motion.div key={activeSideTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="flex flex-col gap-3">
                  {renderEventBanners()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* UNCLAIMED TAB */}
        {activeTopTab === "Unclaimed" && (
          <div className="flex-1 overflow-y-auto no-scrollbar bg-[#111] p-4 flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-center opacity-50 mb-4">
              <PackageOpen className="w-20 h-20 text-neutral-600 mb-2" />
              <div className="flex items-center gap-2">
                <span className="text-neutral-500 text-[13px]">No content yet</span>
                <RefreshCw onClick={() => toast.success("Refreshed")} className="w-4 h-4 text-[#ffdf00] cursor-pointer" />
              </div>
            </div>
            <div className="flex justify-between items-center border-b border-neutral-800 pb-2 mb-4">
              <span className="text-[#ffdf00] font-medium text-[13px] border-b-2 border-[#ff0b0b] pb-2 -mb-[9px]">History</span>
              <span onClick={() => toast("Loading more history...")} className="text-[#ffdf00] font-medium text-[13px] cursor-pointer">More</span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center opacity-50">
              <PackageOpen className="w-20 h-20 text-neutral-600 mb-2" />
              <div className="flex items-center gap-2">
                <span className="text-neutral-500 text-[13px]">No content yet</span>
                <RefreshCw onClick={() => toast.success("Refreshed")} className="w-4 h-4 text-[#ffdf00] cursor-pointer" />
              </div>
            </div>
          </div>
        )}

        {/* REBATE TAB */}
        {activeTopTab === "Rebate" && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="bg-gradient-to-br from-[#ffdf00] to-[#ffaa00] m-3 p-4 rounded-xl shadow-lg border border-[#ffb300]">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">💰</span>
                <h3 className="text-[#4a2e00] font-bold text-[14px]">Today's estimated rebate <span className="text-[#cc0000]">0.00</span></h3>
                <RefreshCw onClick={() => toast.success("Rebate data synchronized")} className="w-4 h-4 text-[#0066cc] cursor-pointer" />
              </div>
              <div className="flex gap-3 mb-3">
                <div className="flex-1 bg-gradient-to-r from-blue-200 to-blue-100 rounded-lg p-2.5 shadow-inner">
                  <div className="text-[#4a2e00] font-black text-[15px] mb-1">0.00</div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#4a2e00]/70 text-[11px] font-medium">Today's valid bet</span>
                    <ChevronRight className="w-3 h-3 text-[#4a2e00]/40 cursor-pointer" onClick={() => toast("View details")} />
                  </div>
                </div>
                <div className="flex-1 bg-gradient-to-r from-red-200 to-red-100 rounded-lg p-2.5 shadow-inner border border-red-300">
                  <div className="text-[#4a2e00] font-black text-[15px] mb-1">0.00</div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#4a2e00]/70 text-[11px] font-medium">Claimed today</span>
                    <ChevronRight className="w-3 h-3 text-[#4a2e00]/40 cursor-pointer" onClick={() => toast("View details")} />
                  </div>
                </div>
              </div>
              <p className="text-[#4a2e00]/80 text-[10px] leading-tight font-medium">
                Data is updated every 10 min. If not synchronized, click above to refresh manually or check back later
              </p>
            </div>
            <div className="flex-1 flex overflow-hidden border-t border-neutral-800">
              <div className="w-[85px] bg-[#1a1a1a] flex-none overflow-y-auto no-scrollbar p-2 border-r border-neutral-800 flex flex-col gap-1.5">
                {rebateSideTabs.map((tab) => {
                  const isActive = activeRebateTab === tab.id;
                  return (
                    <button key={tab.id} onClick={() => setActiveRebateTab(tab.id)} className={`flex flex-col items-center justify-center py-2.5 rounded-lg transition-all ${isActive ? "bg-[#cc0000] text-white" : "bg-[#222] text-neutral-400 hover:bg-[#333]"}`}>
                      <div className={`mb-1 ${isActive ? "text-[#ffdf00]" : "text-neutral-400"}`}>{tab.icon}</div>
                      <span className="text-[10px] font-medium text-center leading-tight px-1">{tab.id.replace(' ', '\n')}</span>
                    </button>
                  );
                })}
              </div>
              <div className="flex-1 bg-[#111] overflow-y-auto no-scrollbar p-3">
                {renderRebateList()}
              </div>
            </div>
          </div>
        )}

        {/* MISSION TAB CONTENT */}
        {activeTopTab === "Mission" && (
          <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar bg-[#111]">
            <div className="p-4 border-b border-neutral-800 relative bg-[#1a1a1a]">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-1 text-[#ffdf00] font-bold text-[14px]">
                  <Zap className="w-4 h-4 fill-current" /> 0
                </div>
                <button onClick={() => toast("Loading details...")} className="text-[#ff0b0b] font-medium text-[13px]">Details</button>
              </div>
              
              {/* Progress Track */}
              <div className="flex justify-between items-center relative px-2 mb-2">
                <div className="absolute top-1/2 left-6 right-6 h-0.5 bg-neutral-700 -translate-y-1/2 z-0"></div>
                {[100, 300, 500, 700].map((points, i) => (
                  <div key={i} className="flex flex-col items-center relative z-10 gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-b from-neutral-600 to-neutral-800 border-2 border-neutral-500 flex items-center justify-center shadow-lg shadow-black/50">
                      <PackageOpen className="w-5 h-5 text-neutral-400" />
                      <span className="absolute bottom-1 right-1 text-[9px] font-bold text-white leading-none">{i+1}</span>
                    </div>
                    <div className="bg-black/50 rounded-full px-2 py-0.5 border border-neutral-800 text-[10px] font-medium text-neutral-400 flex items-center gap-1">
                      <Zap className="w-3 h-3 text-neutral-500" /> -{points}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 p-4 pb-2">
              <button onClick={() => setActiveMissionTab("Newplayer")} className={`px-4 py-1.5 rounded-full text-[12px] font-bold transition-colors ${activeMissionTab === "Newplayer" ? "bg-[#cc0000] text-white" : "border border-neutral-700 text-neutral-400"}`}>Newplayer</button>
              <button onClick={() => setActiveMissionTab("Daily Mission")} className={`px-4 py-1.5 rounded-full text-[12px] font-bold transition-colors ${activeMissionTab === "Daily Mission" ? "bg-[#cc0000] text-white" : "border border-neutral-700 text-neutral-400"}`}>Daily Mission</button>
              <button onClick={() => setActiveMissionTab("Weekly Mission")} className={`px-4 py-1.5 rounded-full text-[12px] font-bold transition-colors ${activeMissionTab === "Weekly Mission" ? "bg-[#cc0000] text-white" : "border border-neutral-700 text-neutral-400"}`}>Weekly Mission</button>
              <div className="flex-1 flex justify-end">
                <button onClick={() => toast.success("Missions refreshed")} className="flex items-center gap-1 text-[#ff0b0b] text-[12px] font-medium"><RefreshCw className="w-3 h-3" /> Refresh</button>
              </div>
            </div>

            <div className="p-4 flex flex-col gap-3">
              {/* Mission Items */}
              <div className="bg-[#1a1a1a] rounded-lg overflow-hidden border border-neutral-800">
                <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-neutral-900 to-[#1a1a1a] border-b border-neutral-800">
                  <div className="bg-[#e6f4ff] rounded p-1"><PackageOpen className="w-4 h-4 text-blue-500" /></div>
                  <span className="text-white font-medium text-[13px]">Sign up an account</span>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <div className="flex flex-col items-center">
                    <span className="w-6 h-6 rounded-full bg-[#ffdf00] text-[#111] font-bold text-[11px] flex items-center justify-center mb-1">Rs</span>
                    <span className="text-[#ffdf00] font-bold text-[12px] text-center leading-tight">10.00-666.0<br/>0</span>
                  </div>
                  <button onClick={() => toast("Redirecting to mission...")} className="bg-gradient-to-b from-[#cc0000] to-[#ff0b0b] text-white font-bold px-8 py-2 rounded shadow-lg text-[13px] hover:brightness-110">Go</button>
                </div>
              </div>

              <div className="bg-[#1a1a1a] rounded-lg overflow-hidden border border-neutral-800">
                <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-neutral-900 to-[#1a1a1a] border-b border-neutral-800">
                  <div className="bg-[#e6f4ff] rounded p-1"><Smartphone className="w-4 h-4 text-green-500" /></div>
                  <span className="text-white font-medium text-[13px]">Login to the APP(First deposit)</span>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <div className="flex flex-col items-center">
                    <span className="w-6 h-6 rounded-full bg-[#ffdf00] text-[#111] font-bold text-[11px] flex items-center justify-center mb-1">Rs</span>
                    <span className="text-[#ffdf00] font-bold text-[12px] text-center leading-tight">66.00-666.0<br/>0</span>
                  </div>
                  <button onClick={() => toast("Redirecting to mission...")} className="bg-gradient-to-b from-[#cc0000] to-[#ff0b0b] text-white font-bold px-8 py-2 rounded shadow-lg text-[13px] hover:brightness-110">Go</button>
                </div>
              </div>

              <div className="bg-[#141414] rounded-lg p-4 border border-neutral-800 mt-2 text-[12px] text-neutral-400 leading-relaxed shadow-inner">
                <p><span className="text-white font-bold">1. Applicable Objects:</span> New users registering on the platform for the first time.</p>
                <p><span className="text-white font-bold">2. Task Deadline:</span> Valid within 10 days from the date of successful registration; reward will expire after this period.</p>
                <p><span className="text-white font-bold">3. Claim Conditions:</span> The following tasks must be completed to claim: SMS verification, Payment method binding</p>
              </div>
            </div>
          </div>
        )}

        {/* SPINS TAB CONTENT */}
        {activeTopTab === "Spins" && (
          <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar bg-gradient-to-b from-[#4a0000] to-[#111] relative">
            <div className="bg-black/50 py-1.5 px-3 flex items-center text-[11px] border-b border-neutral-800">
              <span className="mr-2">🎉</span>
              <div className="text-neutral-300 truncate w-full">3926***4475 only used <span className="text-white font-bold">10000</span> luck to win the prize <span className="text-[#ffdf00] font-bold">300.00</span> in <span className="text-[#ff0b0b] font-bold">Red Wheel</span></div>
            </div>

            <div className="p-4">
              <div className="bg-black/60 rounded-xl p-3 flex justify-between items-center border border-neutral-800 shadow-xl backdrop-blur-sm mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-[#ffdf00] text-[20px] drop-shadow-md">⭐</span>
                  <span className="text-white font-bold text-[16px]">{luckyPoints.toLocaleString()}</span>
                  <RefreshCw onClick={() => toast.success("Lucky points updated")} className="w-4 h-4 text-[#ff0b0b] cursor-pointer" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-neutral-400 text-[11px]">Valid Bets <span className="text-white font-bold">1=1</span> Lucky point <Info className="w-3 h-3 inline text-[#ffdf00]" /></span>
                  <button onClick={() => window.location.href="/deposit"} className="bg-gradient-to-r from-[#cc0000] to-[#ff0b0b] text-white font-bold text-[12px] px-4 py-1.5 rounded shadow-lg border border-red-500">GO</button>
                </div>
              </div>

              {/* Wheel Tabs */}
              <div className="flex gap-2 mb-4">
                <button onClick={() => setActiveSpinWheel("Silver")} className={`flex-1 flex flex-col items-center justify-center py-2 rounded-lg border-2 transition-all ${activeSpinWheel === "Silver" ? "bg-gradient-to-b from-neutral-300 to-neutral-400 border-white text-black shadow-lg" : "bg-transparent border-neutral-700 text-neutral-400"}`}>
                  <span className="font-bold text-[12px]">Silver Wheel</span>
                  <span className="text-[10px] font-medium flex items-center gap-1">⭐ 10000</span>
                </button>
                <button onClick={() => setActiveSpinWheel("Gold")} className={`flex-1 flex flex-col items-center justify-center py-2 rounded-lg border-2 transition-all ${activeSpinWheel === "Gold" ? "bg-gradient-to-b from-[#ffdf00] to-[#ffaa00] border-[#fff3e0] text-[#4a2e00] shadow-lg" : "bg-transparent border-neutral-700 text-neutral-400"}`}>
                  <span className="font-bold text-[12px]">Gold Wheel</span>
                  <span className="text-[10px] font-medium flex items-center gap-1">⭐ 50000</span>
                </button>
                <button onClick={() => setActiveSpinWheel("Diamond")} className={`flex-1 flex flex-col items-center justify-center py-2 rounded-lg border-2 transition-all ${activeSpinWheel === "Diamond" ? "bg-gradient-to-b from-[#cc0000] to-[#ff0b0b] border-red-400 text-white shadow-[0_0_15px_rgba(255,11,11,0.5)]" : "bg-transparent border-neutral-700 text-neutral-400"}`}>
                  <span className="font-bold text-[12px]">Diamond Wheel</span>
                  <span className="text-[10px] font-medium flex items-center gap-1">⭐ 150000</span>
                </button>
              </div>

              {/* Times Tabs */}
              <div className="flex gap-4 justify-center mb-10">
                <button onClick={() => setActiveSpinTimes(1)} className={`px-4 py-1.5 rounded-full text-[12px] font-bold border transition-all flex items-center gap-1.5 ${activeSpinTimes === 1 ? "bg-[#cc0000] border-[#ff0b0b] text-white shadow-[0_0_10px_rgba(255,11,11,0.3)]" : "bg-transparent border-neutral-600 text-neutral-400"}`}>
                  {activeSpinTimes === 1 && <CheckCircle2 className="w-3.5 h-3.5" />} 1 time
                </button>
                <button onClick={() => setActiveSpinTimes(10)} className={`px-4 py-1.5 rounded-full text-[12px] font-bold border transition-all flex items-center gap-1.5 ${activeSpinTimes === 10 ? "bg-[#cc0000] border-[#ff0b0b] text-white shadow-[0_0_10px_rgba(255,11,11,0.3)]" : "bg-transparent border-neutral-600 text-neutral-400"}`}>
                  {activeSpinTimes === 10 && <CheckCircle2 className="w-3.5 h-3.5" />} 10 times
                </button>
                <button onClick={() => setActiveSpinTimes(50)} className={`px-4 py-1.5 rounded-full text-[12px] font-bold border transition-all flex items-center gap-1.5 ${activeSpinTimes === 50 ? "bg-[#cc0000] border-[#ff0b0b] text-white shadow-[0_0_10px_rgba(255,11,11,0.3)]" : "bg-transparent border-neutral-600 text-neutral-400"}`}>
                  {activeSpinTimes === 50 && <CheckCircle2 className="w-3.5 h-3.5" />} 50 times
                </button>
              </div>

              {/* Fake Wheel CSS Construction */}
              <div className="relative w-64 h-64 mx-auto mt-4 mb-20 drop-shadow-[0_0_30px_rgba(255,11,11,0.4)]">
                {/* Pointer */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-[#ffdf00] drop-shadow-md"></div>
                
                {/* Wheel Base */}
                <div className="w-full h-full rounded-full border-[10px] border-neutral-300/20 bg-gradient-to-br from-[#cc0000] to-[#4a0000] relative overflow-hidden flex items-center justify-center shadow-2xl">
                  
                  {/* Rotatable Layer */}
                  <div className="absolute inset-0 w-full h-full" style={{ transform: `rotate(-${spinRotation}deg)`, transition: isSpinning ? "transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none" }}>
                    {/* Wheel segments using CSS conic gradient */}
                    <div className="absolute inset-0 rounded-full" style={{ background: 'conic-gradient(#cc0000 0deg 36deg, #ff0b0b 36deg 72deg, #cc0000 72deg 108deg, #ff0b0b 108deg 144deg, #cc0000 144deg 180deg, #ff0b0b 180deg 216deg, #cc0000 216deg 252deg, #ff0b0b 252deg 288deg, #cc0000 288deg 324deg, #ff0b0b 324deg 360deg)' }}></div>
                    
                    {/* Inner text (Simulated) */}
                    <div className="absolute inset-0 flex items-center justify-center rotate-[-18deg]">
                      {[7.00, 10.00, 15.00, 27.00, 77.00, 130.00, 200.00, 250.00, 300.00, 377.00].map((amt, i) => (
                        <div key={i} className="absolute w-full h-full flex justify-center pt-4" style={{ transform: `rotate(${i * 36}deg)` }}>
                          <span className="text-[#ffdf00] font-bold text-[11px] drop-shadow-md">{amt.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Center Draw Button */}
                  <div onClick={handleSpin} className={`w-20 h-20 bg-gradient-to-br from-[#2e0505] to-[#111] rounded-full z-10 flex flex-col items-center justify-center border-4 border-[#ffdf00] shadow-[0_0_20px_rgba(255,223,0,0.5)] transition-transform ${isSpinning ? 'opacity-70 scale-95' : 'cursor-pointer hover:scale-105'}`}>
                    <span className="text-[#ffdf00] font-black text-[11px]">x0</span>
                    <span className="text-white font-bold text-[14px]">Draw</span>
                  </div>
                </div>

                {/* Pedestal */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 h-12 bg-gradient-to-t from-[#ffdf00]/30 to-transparent rounded-full blur-xl -z-10"></div>
              </div>
            </div>
          </div>
        )}

        {/* VIP TAB CONTENT */}
        {activeTopTab === "VIP" && (
          <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar bg-[#111] p-3">
            
            {/* VIP Status Card */}
            <div className="bg-gradient-to-br from-[#e6f4ff] to-[#ffffff] rounded-xl p-4 relative overflow-hidden shadow-lg border border-neutral-300 mb-6">
              <div className="absolute right-[-20px] top-[-20px] opacity-10 text-[150px] leading-none pointer-events-none">👑</div>
              <span className="bg-neutral-200 text-neutral-600 text-[10px] font-bold px-2 py-0.5 rounded-sm">Current Level</span>
              <div className="flex items-center gap-2 mt-2">
                <h2 className="text-[#2c3e50] font-black text-[32px] italic tracking-tighter">VIP 0</h2>
                <button className="flex items-center text-[10px] text-blue-500 border border-blue-200 bg-white rounded-full px-2 py-0.5 shadow-sm font-medium hover:bg-blue-50">Level up now <ChevronRight className="w-3 h-3" /></button>
              </div>
              
              <div className="mt-4 mb-2">
                <div className="flex justify-between text-[11px] font-bold mb-1">
                  <span className="text-blue-600">0%</span>
                  <span className="text-blue-600 italic">VIP 1</span>
                </div>
                <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                  <div className="w-0 h-full bg-blue-500"></div>
                </div>
              </div>
              
              <p className="text-[12px] text-[#2c3e50]/80 font-medium mt-3">Bet <span className="font-bold text-[#2c3e50]">50,000.00</span> to enjoy member benefits</p>
              
              {/* Big VIP Crown Logo */}
              <div className="absolute right-4 bottom-4 flex flex-col items-center">
                <Crown className="w-12 h-12 text-[#cc0000] fill-current drop-shadow-md mb-1" />
                <div className="bg-gradient-to-r from-[#cc0000] to-[#ff0b0b] text-white font-black italic px-3 py-0.5 rounded-full border-2 border-white shadow-lg text-[16px]">VIP 0</div>
              </div>
            </div>

            {/* Title */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-neutral-500">🌿</span>
              <h3 className="text-white font-bold text-[18px]">VIP reward list</h3>
              <span className="text-neutral-500 transform scale-x-[-1]">🌿</span>
            </div>

            {/* Sub Tabs */}
            <div className="flex mb-4">
              <button className="flex-1 text-[#ffdf00] font-bold text-[14px] pb-2 border-b-2 border-[#ff0b0b]">VIP reward</button>
              <button className="flex-1 text-neutral-400 font-bold text-[14px] pb-2 border-b border-neutral-800">Rules</button>
            </div>

            {/* Table Header */}
            <div className="flex border-b border-neutral-800 text-[12px] font-medium text-neutral-400 pb-2 mb-2">
              <div className="w-20 pl-2">Level</div>
              <div className="flex-1 text-center">Rewards/Privileges</div>
            </div>

            {/* VIP 1 Row (Expanded) */}
            <div className="flex border border-neutral-800 rounded-lg overflow-hidden mb-3 bg-[#1a1a1a]">
              <div className="w-20 bg-gradient-to-b from-[#111] to-[#1a1a1a] flex flex-col items-center pt-6 border-r border-neutral-800">
                <Crown className="w-8 h-8 text-[#ffdf00] fill-current drop-shadow-md mb-1" />
                <span className="bg-white text-[#cc0000] font-bold text-[10px] px-1.5 rounded-full border border-neutral-300 -mt-2 z-10 shadow-sm">VIP 1</span>
                <span className="text-white font-bold text-[12px] mt-2">VIP 1</span>
              </div>
              <div className="flex-1 flex flex-col">
                <button onClick={() => setVip1Expanded(!vip1Expanded)} className="flex justify-between items-center p-3 w-full text-left bg-[#222]">
                  <span className="text-white text-[13px] font-medium">Level up to VIP1 to receive <span className="text-[#ffdf00] font-bold">175.00</span></span>
                  <div className="flex items-center gap-1 text-[#cc0000] text-[11px] font-medium">
                    {vip1Expanded ? 'Fold' : 'Expand'} {vip1Expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </div>
                </button>
                
                <AnimatePresence>
                  {vip1Expanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="p-3 flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="bg-gradient-to-br from-green-400 to-green-600 w-8 h-8 rounded-lg flex flex-col items-center justify-center text-white font-bold leading-none shadow-md">
                              <span className="text-[7px]">📅</span>
                              <span className="text-[10px]">07</span>
                            </div>
                            <span className="text-white text-[12px] font-medium">Weekly salary <span className="text-[#ffdf00] bg-[#4a2e00] px-1 rounded ml-1 font-bold">+25.00</span></span>
                          </div>
                          <button onClick={() => window.location.href="/"} className="bg-gradient-to-b from-[#cc0000] to-[#ff0b0b] text-white text-[11px] font-bold px-4 py-1.5 rounded hover:brightness-110">Go to bet</button>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="bg-gradient-to-br from-blue-400 to-blue-600 w-8 h-8 rounded-lg flex flex-col items-center justify-center text-white font-bold leading-none shadow-md">
                              <span className="text-[7px]">📅</span>
                              <span className="text-[10px]">30</span>
                            </div>
                            <span className="text-white text-[12px] font-medium">Monthly salary <span className="text-[#ffdf00] bg-[#4a2e00] px-1 rounded ml-1 font-bold">+50.00</span></span>
                          </div>
                          <button onClick={() => window.location.href="/"} className="bg-gradient-to-b from-[#cc0000] to-[#ff0b0b] text-white text-[11px] font-bold px-4 py-1.5 rounded hover:brightness-110">Go to bet</button>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="bg-gradient-to-br from-orange-400 to-orange-600 w-8 h-8 rounded-full flex flex-col items-center justify-center text-white shadow-md">
                              <Trophy className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-white text-[12px] font-medium">Next level bonus <span className="text-[#ffdf00] bg-[#4a2e00] px-1 rounded ml-1 font-bold">+100.00</span></span>
                              <span className="text-neutral-500 text-[10px]">Bet for promotion <span className="text-neutral-400">50,000</span></span>
                            </div>
                          </div>
                          <button onClick={() => window.location.href="/"} className="bg-gradient-to-b from-[#cc0000] to-[#ff0b0b] text-white text-[11px] font-bold px-4 py-1.5 rounded hover:brightness-110">Go to bet</button>
                        </div>

                        <div className="flex items-start gap-2 mt-2 pt-3 border-t border-neutral-800">
                          <div className="bg-gradient-to-br from-yellow-300 to-yellow-500 w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-md shrink-0">
                            <Crown className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col w-full">
                            <span className="text-white text-[12px] font-medium mb-1">VIP Privilege</span>
                            <div className="flex justify-between w-full">
                              <div className="flex flex-col text-[10px] text-neutral-500 gap-1">
                                <span>Daily total withdrawal: <span className="text-white font-medium">Unlimited</span></span>
                                <span>Daily fee-free orders: <span className="text-white font-medium">0 orders</span></span>
                              </div>
                              <div className="flex flex-col text-[10px] text-neutral-500">
                                <span>Daily withdrawal times: <span className="text-white font-medium">Unlimited</span></span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* VIP 2 Row (Collapsed) */}
            <div className="flex border border-neutral-800 rounded-lg overflow-hidden mb-3 bg-[#1a1a1a]">
              <div className="w-20 bg-gradient-to-b from-[#111] to-[#1a1a1a] flex flex-col items-center pt-6 border-r border-neutral-800">
                <Crown className="w-8 h-8 text-[#ffdf00] fill-current drop-shadow-md mb-1 opacity-50" />
                <span className="bg-white text-[#cc0000] font-bold text-[10px] px-1.5 rounded-full border border-neutral-300 -mt-2 z-10 shadow-sm opacity-50">VIP 2</span>
                <span className="text-white font-bold text-[12px] mt-2 opacity-50">VIP 2</span>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <button className="flex justify-between items-center p-3 w-full text-left">
                  <span className="text-white text-[13px] font-medium">Total bonus <span className="text-[#ffdf00] font-bold">350.00</span></span>
                  <div className="flex items-center gap-1 text-[#cc0000] text-[11px] font-medium">
                    Expand <ChevronDown className="w-3 h-3" />
                  </div>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* HISTORY TAB CONTENT */}
        {activeTopTab === "History" && (
          <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar bg-[#111]">
            <div className="p-3 border-b border-neutral-800 flex gap-2">
              <button className="flex items-center gap-1 border border-neutral-700 rounded-full px-3 py-1 text-neutral-400 text-[12px]">
                Today <ChevronDown className="w-3 h-3" />
              </button>
              <button className="flex items-center gap-1 border border-neutral-700 rounded-full px-3 py-1 text-neutral-400 text-[12px]">
                All Status <ChevronDown className="w-3 h-3" />
              </button>
              <button className="flex items-center gap-1 border border-neutral-700 rounded-full px-3 py-1 text-neutral-400 text-[12px]">
                All Types <ChevronDown className="w-3 h-3" />
              </button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center opacity-50 mb-4">
              <PackageOpen className="w-20 h-20 text-neutral-600 mb-2" />
              <div className="flex items-center gap-2">
                <span className="text-neutral-500 text-[13px]">Today No Records,but <span onClick={() => toast("No more records")} className="text-[#cc0000] font-medium cursor-pointer">Read More</span></span>
              </div>
            </div>
          </div>
        )}

        {/* FUND TAB CONTENT */}
        {activeTopTab === "Fund" && (
          <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar bg-[#111]">
            
            {/* Top Stats Box */}
            <div className="bg-[#1a1a1a] p-4 m-3 rounded-lg border border-neutral-800 flex flex-col gap-4">
              <div className="flex justify-between relative">
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-neutral-800"></div>
                <div className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-neutral-500 text-[12px]">Total deposit</span>
                  <span className="text-white font-bold text-[20px]">0.00</span>
                  <div className="relative mt-2">
                    <span className="absolute -top-3 -right-6 bg-[#cc0000] text-white text-[9px] font-bold px-1 rounded-sm shadow">+50%</span>
                    <button onClick={() => window.location.href="/deposit"} className="bg-gradient-to-r from-[#ffdf00] to-[#ffaa00] text-[#4a2e00] font-bold text-[12px] px-6 py-1 rounded shadow-md">Deposit</button>
                  </div>
                </div>
                <div className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-neutral-500 text-[12px]">Fund</span>
                  <span className="text-[#ffdf00] font-bold text-[20px]">0.00</span>
                  <div className="relative mt-2">
                    <button onClick={() => window.location.href="/withdraw"} className="bg-neutral-600 text-neutral-300 font-bold text-[12px] px-6 py-1 rounded shadow-md">Withdraw</button>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-0.5 text-[10px] text-neutral-500 mt-2">
                <div>Bonus cap <span className="text-white font-medium">not to be capped</span></div>
                <div>Times capped <span className="text-white font-medium">not to be capped</span></div>
              </div>
            </div>

            {/* Sub Tabs */}
            <div className="flex border-b border-neutral-800 text-[13px] font-medium bg-[#1a1a1a]">
              <button className="flex-1 text-[#cc0000] py-3 border-b-2 border-[#cc0000]">Total records</button>
              <button className="flex-1 text-white py-3">Cumulative betting requirements</button>
              <button className="px-4 text-white py-3">Rules</button>
            </div>

            {/* Records Section */}
            <div className="p-3">
              <div className="flex justify-between items-center mb-6">
                <button className="flex items-center justify-between w-24 border border-neutral-700 rounded-full px-3 py-1.5 text-neutral-400 text-[12px]">
                  Today <ChevronDown className="w-3 h-3" />
                </button>
                <div className="text-neutral-500 text-[12px]">Total <span className="text-[#ffdf00] font-bold">0.00</span></div>
              </div>

              <div className="flex flex-col items-center justify-center opacity-50 mt-10">
                <PackageOpen className="w-20 h-20 text-neutral-600 mb-2" />
                <div className="flex items-center gap-2">
                  <span className="text-neutral-500 text-[13px]">Today No Records,but <span onClick={() => toast("No more records")} className="text-[#cc0000] font-medium cursor-pointer">Read More</span></span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Linked Phone Number Modal */}
      <AnimatePresence>
        {showPhoneModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPhoneModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
             {/* ... phone modal omitted to save space since it was already correctly placed but Redeem Bonus is what we use now */}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bonus Redemption Modal */}
      <AnimatePresence>
        {showRedeemModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowRedeemModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center p-6">
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} onClick={(e) => e.stopPropagation()} className="bg-gradient-to-b from-[#ffdf00] via-[#ffaa00] to-[#fff3e0] rounded-2xl w-full max-w-sm p-6 shadow-2xl relative">
              <button onClick={() => setShowRedeemModal(false)} className="absolute top-4 right-4 text-[#4a2e00] hover:scale-110 transition-transform"><X className="w-5 h-5" /></button>
              <div className="absolute -top-12 -left-6 drop-shadow-2xl z-10 w-28 h-28 pointer-events-none text-[80px]">🎁</div>
              <div className="text-center mt-4 mb-6 relative z-0">
                <h2 className="text-[22px] font-black text-[#cc0000] leading-tight drop-shadow-sm uppercase">Bonus<br/>Redemption...</h2>
              </div>
              <div className="text-center mb-4">
                <span className="text-[#4a2e00] font-medium text-[13px]">Win up to <span className="bg-[#cc0000] text-white px-2 py-0.5 rounded-full font-bold">Rs 77,777</span> in bonus!</span>
              </div>
              <div className="bg-white rounded-lg p-1.5 flex items-center mb-6 shadow-inner border border-neutral-200">
                <span className="px-2 text-[16px]">🎫</span>
                <input type="text" placeholder="The redemption code is co..." className="flex-1 bg-transparent border-none outline-none text-[13px] text-neutral-800 placeholder:text-neutral-400 px-1" />
                <button onClick={() => toast.success("Pasted from clipboard")} className="text-[#cc0000] font-bold text-[13px] px-3 border-l border-neutral-200">Paste</button>
              </div>
              <button onClick={() => toast.error("Invalid redeem code")} className="w-full bg-[#111] text-white font-bold text-[15px] py-3.5 rounded-lg shadow-lg hover:bg-[#333] transition-colors mb-4">Redeem Bonus</button>
              <div className="text-center">
                <button onClick={() => toast("Opening rules...")} className="text-[#cc0000] text-[12px] font-bold hover:underline">Event Rules</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav activeTab="promo" />
    </main>
  );
}

function Banner({ title, desc, highlight, sub, icon, badge, href }: { title: string, desc: string, highlight?: string, sub?: string, icon: string, badge?: string, href?: string }) {
  const content = (
    <div className="relative w-full rounded-xl overflow-hidden border border-[#ff0b0b] bg-gradient-to-br from-[#2e0505] via-[#111] to-[#1a1a1a] p-4 shadow-[0_0_15px_rgba(255,11,11,0.15)] flex flex-col justify-between min-h-[110px]">
      <div className="absolute top-0 left-0 bg-gradient-to-r from-[#ff0b0b] to-[#cc0000] px-3 py-0.5 rounded-br-lg flex items-center gap-1 shadow-md">
        <span className="text-white font-black italic text-[11px] tracking-wider">8111C.com</span>
      </div>
      {badge && <div className="absolute top-2 right-2 bg-[#cc0000] text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-[#111] z-10 shadow-md">{badge}</div>}
      <div className="absolute -right-4 -bottom-6 text-[80px] opacity-10 grayscale">{icon}</div>
      <div className="flex mt-4 items-center justify-between relative z-10">
        <div className="flex flex-col w-[70%]">
          <h3 className="text-[#ffdf00] font-black text-[15px] leading-tight mb-1 uppercase tracking-wide">{title}</h3>
          <p className="text-white font-medium text-[12px] leading-snug">{desc}</p>
          {highlight && <p className="text-[#ffdf00] font-bold text-[13px] mt-1">{highlight}</p>}
          {sub && <p className="text-neutral-400 text-[9px] mt-1 uppercase tracking-wider">{sub}</p>}
        </div>
        <div className="w-[30%] flex justify-end items-center"><div className="text-[40px] drop-shadow-[0_0_10px_rgba(255,223,0,0.4)]">{icon}</div></div>
      </div>
    </div>
  );

  if (href) {
    return <a href={href} target="_blank" rel="noopener noreferrer" className="block hover:scale-[1.02] transition-transform">{content}</a>;
  }
  return content;
}


