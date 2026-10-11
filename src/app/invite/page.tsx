"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { ChevronLeft, Share, Copy, Calendar, Search, Check } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/context/UserContext";

export default function InvitePage() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("Home");
  const [copied, setCopied] = useState(false);
  const tabs = [
    "Home",
    "Promotion Sharing",
    "My Data",
    "Performance",
    "Commission",
    "Subordinate Information",
    "Subordinate Betting",
    "Subordinate Finance",
    "Subordinate claim",
    "Commission Rate"
  ];

  const [dateModalOpen, setDateModalOpen] = useState(false);
  const [rateTab, setRateTab] = useState("Mini Games");

  // Overview state
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<any>(null);

  // My Data state
  const [myDataPeriod, setMyDataPeriod] = useState("Today");
  const [myData, setMyData] = useState<any>(null);
  const [myDataLoading, setMyDataLoading] = useState(false);

  // Performance state
  const [perfPeriod, setPerfPeriod] = useState("Today");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [perfLoading, setPerfLoading] = useState(false);

  // Subordinates states
  const [subPeriod, setSubPeriod] = useState("Today");
  const [subSort, setSubSort] = useState("login_date");
  const [subSearch, setSubSearch] = useState("");
  const [subordinates, setSubordinates] = useState<any[]>([]);
  const [subLoading, setSubLoading] = useState(false);

  // Subordinate Betting states
  const [bettingSort, setBettingSort] = useState("valid_bet");
  const [bettingDropdownOpen, setBettingDropdownOpen] = useState(false);
  const [bettingSearch, setBettingSearch] = useState("");
  const [bettingList, setBettingList] = useState<any[]>([]);
  const [bettingLoading, setBettingLoading] = useState(false);

  // Subordinate Finance states
  const [financeSearch, setFinanceSearch] = useState("");
  const [financeList, setFinanceList] = useState<any[]>([]);
  const [financeLoading, setFinanceLoading] = useState(false);

  // Claims states
  const [claimsList, setClaimsList] = useState<any[]>([]);
  const [claimsLoading, setClaimsLoading] = useState(false);

  const API_URL = "https://8111c.com/api/v1";

  // Capture referral code from URL if someone was invited
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code") || params.get("ref");
      if (code) {
        localStorage.setItem("referral_code", code.toUpperCase().trim());
      }
    }
  }, []);

  // Fetch Overview
  const fetchOverview = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      const res = await fetch(`${API_URL}/referrals/overview`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOverview(data);
      }
    } catch (err) {
      console.error("Error fetching overview:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, [user]);

  // Fetch My Data
  const fetchMyData = async (period: string) => {
    setMyDataLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch(`${API_URL}/referrals/my-data?period=${encodeURIComponent(period)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMyData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setMyDataLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "My Data") {
      fetchMyData(myDataPeriod);
    }
  }, [activeTab, myDataPeriod]);

  // Fetch Performance
  const fetchPerformance = async () => {
    setPerfLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      let url = `${API_URL}/referrals/performance?period=${encodeURIComponent(perfPeriod)}`;
      if (perfPeriod === "Custom" && customStart && customEnd) {
        url += `&startDate=${customStart}&endDate=${customEnd}`;
      }
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const json = await res.json();
        setPerformanceData(json.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setPerfLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "Performance" || activeTab === "Commission") {
      fetchPerformance();
    }
  }, [activeTab, perfPeriod, customStart, customEnd]);

  // Fetch Subordinates
  const fetchSubordinates = async () => {
    setSubLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      let url = `${API_URL}/referrals/subordinates?period=${encodeURIComponent(subPeriod)}&sortBy=${subSort}`;
      if (subSearch) url += `&search=${encodeURIComponent(subSearch)}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const json = await res.json();
        setSubordinates(json.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "Subordinate Information") {
      fetchSubordinates();
    }
  }, [activeTab, subPeriod, subSort, subSearch]);

  // Fetch Subordinate Betting
  const fetchBetting = async () => {
    setBettingLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      let url = `${API_URL}/referrals/subordinate-betting?sortBy=${bettingSort}`;
      if (bettingSearch) url += `&search=${encodeURIComponent(bettingSearch)}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const json = await res.json();
        setBettingList(json.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setBettingLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "Subordinate Betting") {
      fetchBetting();
    }
  }, [activeTab, bettingSort, bettingSearch]);

  // Fetch Subordinate Finance
  const fetchFinance = async () => {
    setFinanceLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      let url = `${API_URL}/referrals/subordinate-finance?search=${encodeURIComponent(financeSearch)}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const json = await res.json();
        setFinanceList(json.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setFinanceLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "Subordinate Finance") {
      fetchFinance();
    }
  }, [activeTab, financeSearch]);

  // Fetch Claims
  const fetchClaims = async () => {
    setClaimsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch(`${API_URL}/referrals/claims`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const json = await res.json();
        setClaimsList(json.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setClaimsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "Subordinate claim") {
      fetchClaims();
    }
  }, [activeTab]);

  // Referral link builder
  const referralCode = overview?.referral_code || user?.referral_code || "8111C";
  const origin = typeof window !== "undefined" ? window.location.origin : "https://8111c.com";
  const inviteUrl = `${origin}/invite?code=${referralCode}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(inviteUrl)}`;

  const handleCopyLink = () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(inviteUrl);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = inviteUrl;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }
      setCopied(true);
      toast.success("Invite link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: "Join 8111C", url: inviteUrl }).catch(() => {});
    } else {
      handleCopyLink();
    }
  };

  const handleSaveInvitation = () => {
    const a = document.createElement("a");
    a.href = qrUrl;
    a.download = `8111C-Invite-${referralCode}.png`;
    a.target = "_blank";
    a.click();
    toast.success("Invitation saved to gallery!");
  };

  // Marquee list
  const marqueeItems = overview?.marquee || [
    { agent: "63****115", amount: "249,714.13" },
    { agent: "34****980", amount: "19,486.07" }
  ];

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col pb-24 font-sans overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#141414] border-b border-neutral-800 flex items-center justify-center h-[50px] px-4">
        <Link href="/" className="absolute left-4">
          <ChevronLeft className="w-6 h-6 text-neutral-400" />
        </Link>
        <h1 className="text-[17px] font-medium tracking-wide">Invite</h1>
        {activeTab === "Commission Rate" && (
          <button onClick={() => toast("Simulation calculator coming soon")} className="absolute right-4 text-[#ff0b0b] text-[10px] leading-tight text-right flex flex-col font-medium">
            <span>Commission sim</span>
            <span>ulation calculator</span>
          </button>
        )}
      </header>

      {/* Tabs Menu */}
      <div className="sticky top-[50px] z-40 bg-[#141414] border-b border-neutral-800">
        <div className="flex overflow-x-auto no-scrollbar px-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-4 py-3 text-[13px] font-medium whitespace-nowrap transition-colors ${
                activeTab === tab ? "text-[#ffdf00]" : "text-neutral-400"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="invite-tab"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ff0b0b]"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 w-full max-w-[400px] mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === "Home" && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-3">
              {/* Scrolling Commission Tape */}
              <div className="bg-[#111111] border-b border-neutral-800 py-2 px-2 overflow-hidden flex items-center shadow-md">
                <div className="flex animate-marquee whitespace-nowrap items-center gap-4">
                  {marqueeItems.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[11px]">
                      <span className="text-[14px]">{idx % 2 === 0 ? "🏆" : "🔥"}</span>
                      <span className="text-neutral-400">Agent ID:</span>
                      <span className="font-bold text-white">{item.agent}</span>
                      <span className="text-neutral-400 ml-1">Commission earned today:</span>
                      <span className="text-[#ffdf00] font-bold">{Number(item.amount).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Banner Carousel */}
              <div className="px-3 mt-1">
                <div className="w-full aspect-[21/9] rounded-xl overflow-hidden relative border border-[#ff0b0b] shadow-[0_0_15px_rgba(255,11,11,0.2)]">
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10 flex flex-col justify-center px-4">
                    <img src="/splash-logo.png" alt="Logo" className="h-4 w-auto mb-2 mix-blend-screen opacity-90 object-left object-contain" />
                    <h2 className="text-[#ffdf00] text-lg font-black tracking-tighter italic">
                      {overview?.config?.banner_heading || "Invitation Event"}
                    </h2>
                    <p className="text-white text-xs mt-1 leading-tight">
                      Each player you invite<br/>Get <span className="text-[#ffdf00] font-bold text-sm">{overview?.config?.banner_reward_text || `Rs ${overview?.config?.fixed_reward_amount || 100}`}</span>
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#2e0505] to-[#cc0000] z-0"></div>
                  
                  {/* Fake carousel indicators */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
                    <div className="w-4 h-1.5 rounded-full bg-[#ffdf00]"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-white/30"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-white/30"></div>
                  </div>
                </div>
              </div>

              {/* Stats Card */}
              <div className="px-3">
                <div className="bg-[#1c1c1c] rounded-xl border border-neutral-800 p-4 shadow-lg flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-500 font-bold">
                      {overview?.stats ? `Total: ${overview.stats.total_subordinates}` : "-"}
                    </span>
                    <div className="flex flex-col items-end">
                      <span className="text-neutral-500 text-[11px]">Number of audits</span>
                      <span className="text-white text-[13px] font-bold">
                        {overview?.stats ? overview.stats.pending_audits : "-"}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="bg-[#2a1b05] border border-[#ffdf00]/30 text-[#ffdf00] text-[10px] px-2 py-0.5 rounded shadow-inner">
                      Infinite range
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-neutral-500 text-[11px]">Settlement cycle</span>
                      <span className="text-white text-[13px] font-bold">
                        {overview?.config?.settlement_cycle || "Daily settlement"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Share Card */}
              <div className="px-3">
                <div className="bg-[#1c1c1c] rounded-xl border border-neutral-800 p-3 shadow-lg flex gap-3">
                  
                  {/* QR Code Section */}
                  <div className="w-[100px] shrink-0 flex flex-col gap-2">
                    <div className="bg-white p-1 rounded-lg aspect-square flex items-center justify-center">
                      <img src={qrUrl} alt="QR" className="w-full h-full object-contain" />
                    </div>
                    <button onClick={handleSaveInvitation} className="w-full bg-[#cc0000] text-white text-[10px] font-bold py-1.5 rounded text-center leading-tight shadow-md hover:bg-[#ff0b0b] transition-colors">
                      Save<br/>invitation...
                    </button>
                  </div>

                  {/* Links & Socials Section */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div 
                      onClick={handleCopyLink}
                      className="flex items-center bg-[#111111] border border-neutral-700 hover:border-[#ffdf00]/60 rounded-lg pl-2 pr-1 h-9 shadow-inner cursor-pointer transition-colors group"
                      title="Click to copy invite link"
                    >
                      <span className="flex-1 text-[11px] text-neutral-300 font-mono truncate select-all">{inviteUrl}</span>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleCopyLink(); }}
                        className={`ml-1.5 px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all shrink-0 shadow-sm ${
                          copied
                            ? "bg-emerald-600 text-white"
                            : "bg-gradient-to-r from-[#ffaa00] to-[#ffdf00] text-[#3d2400] hover:brightness-110 active:scale-95"
                        }`}
                      >
                        {copied ? (
                          <>
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 stroke-[2.5]" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    
                    <div className="flex justify-between items-center mt-3 px-1">
                      <div onClick={handleShare} className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity">
                        <div className="w-9 h-9 rounded-full border border-neutral-700 flex items-center justify-center text-[#ffdf00]">
                          <Share className="w-4 h-4" />
                        </div>
                        <span className="text-[9px] text-neutral-400">Share</span>
                      </div>
                      <div onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Join me on 8111C! ${inviteUrl}`)}`, "_blank")} className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA" className="w-9 h-9" />
                        <span className="text-[9px] text-neutral-400">WhatsApp</span>
                      </div>
                      <div onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(inviteUrl)}&text=${encodeURIComponent("Join me on 8111C!")}`, "_blank")} className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg" alt="TG" className="w-9 h-9" />
                        <span className="text-[9px] text-neutral-400">Telegram</span>
                      </div>
                      <div onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(inviteUrl)}`, "_blank")} className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" alt="FB" className="w-9 h-9" />
                        <span className="text-[9px] text-neutral-400">Facebook</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Commission Rate Button */}
              <div className="px-3 mt-1">
                <button onClick={() => setActiveTab("Commission Rate")} className="w-full bg-gradient-to-r from-[#ffaa00] to-[#ffdf00] text-[#4a2e00] font-black text-[15px] py-4 rounded-xl flex items-center justify-between px-4 shadow-[0_4px_15px_rgba(255,223,0,0.3)] hover:scale-[0.98] transition-transform">
                  <div className="flex items-center gap-2">
                    <span className="text-[20px]">🪙</span>
                    Commission Rate
                  </div>
                  <ChevronLeft className="w-5 h-5 rotate-180" />
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === "Promotion Sharing" && (
            <motion.div key="promo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-4 pt-3">
              {/* Share Card Replica */}
              <div className="px-3">
                <div className="bg-[#1c1c1c] rounded-xl border border-neutral-800 p-3 shadow-lg flex gap-3">
                  <div className="w-[85px] shrink-0 flex flex-col gap-2">
                    <div className="bg-white p-1 rounded-lg aspect-square flex items-center justify-center">
                      <img src={qrUrl} alt="QR" className="w-full h-full object-contain" />
                    </div>
                    <button onClick={handleSaveInvitation} className="w-full bg-[#cc0000] text-white text-[9px] font-bold py-1.5 rounded text-center leading-tight shadow-md hover:bg-[#ff0b0b] transition-colors">
                      Save<br/>invitation...
                    </button>
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div 
                      onClick={handleCopyLink}
                      className="flex items-center bg-[#111111] border border-neutral-700 hover:border-[#ffdf00]/60 rounded-lg pl-2 pr-1 h-9 shadow-inner cursor-pointer transition-colors group"
                      title="Click to copy invite link"
                    >
                      <span className="flex-1 text-[11px] text-neutral-300 font-mono truncate select-all">{inviteUrl}</span>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleCopyLink(); }}
                        className={`ml-1.5 px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all shrink-0 shadow-sm ${
                          copied
                            ? "bg-emerald-600 text-white"
                            : "bg-gradient-to-r from-[#ffaa00] to-[#ffdf00] text-[#3d2400] hover:brightness-110 active:scale-95"
                        }`}
                      >
                        {copied ? (
                          <>
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 stroke-[2.5]" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="flex justify-between items-center mt-3 px-1">
                      <div onClick={handleShare} className="flex flex-col items-center gap-1 cursor-pointer">
                        <div className="w-8 h-8 rounded-full border border-neutral-700 flex items-center justify-center text-[#ffdf00]"><Share className="w-3.5 h-3.5" /></div>
                        <span className="text-[8px] text-neutral-400">Share</span>
                      </div>
                      <div onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Join me on 8111C! ${inviteUrl}`)}`, "_blank")} className="flex flex-col items-center gap-1 cursor-pointer">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA" className="w-8 h-8" />
                        <span className="text-[8px] text-neutral-400">WhatsApp</span>
                      </div>
                      <div onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(inviteUrl)}&text=${encodeURIComponent("Join me on 8111C!")}`, "_blank")} className="flex flex-col items-center gap-1 cursor-pointer">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg" alt="TG" className="w-8 h-8" />
                        <span className="text-[8px] text-neutral-400">Telegram</span>
                      </div>
                      <div onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(inviteUrl)}`, "_blank")} className="flex flex-col items-center gap-1 cursor-pointer">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" alt="FB" className="w-8 h-8" />
                        <span className="text-[8px] text-neutral-400">Facebook</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Agent Tutorial */}
              <div className="px-3 pb-8">
                <h3 className="text-[15px] font-medium text-white mb-3 px-1">Agent Tutorial</h3>
                
                <div className="flex gap-2 mb-4">
                  <button className="bg-[#cc0000] text-white text-[11px] px-4 py-1.5 rounded-full font-bold shadow-md">A commission</button>
                  <button className="bg-[#1a1a1a] border border-neutral-700 text-neutral-400 text-[11px] px-4 py-1.5 rounded-full font-medium">B1 commission</button>
                  <button className="bg-[#1a1a1a] border border-neutral-700 text-neutral-400 text-[11px] px-4 py-1.5 rounded-full font-medium">B2 commission</button>
                </div>

                <div className="bg-[#1a1a1a] rounded-xl border border-neutral-800 p-4 shadow-lg mb-4 flex items-center gap-4">
                  <div className="relative">
                    <div className="w-14 h-14 bg-white rounded-full flex items-end justify-center overflow-hidden border-2 border-orange-200">
                      <span className="text-3xl translate-y-1">👨‍💼</span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#ffaa00] text-white text-[10px] font-black rounded-full flex items-center justify-center border border-white">A</div>
                  </div>
                  <div className="flex flex-col text-[11px] gap-1">
                    <p className="text-white">Sub's Perf.=500+3000=3500</p>
                    <p className="text-white">Direct commission=3500*3%=<span className="text-[#ffaa00]">105</span></p>
                    <p className="text-white">Other commission=<span className="text-[#ffdf00]">20</span>+<span className="text-[#ffdf00]">40</span>=<span className="text-[#ffdf00]">60</span></p>
                    <p className="text-white font-bold">Current commission=<span className="text-[#ffaa00]">105</span>+<span className="text-[#ffdf00]">60</span>=<span className="text-[#ffaa00]">165</span></p>
                  </div>
                </div>

                {/* Flowchart Mockup */}
                <div className="relative w-full h-[350px] bg-neutral-900/50 rounded-xl border border-neutral-800 p-4 flex flex-col items-center overflow-hidden">
                  <div className="text-[10px] text-neutral-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 italic">
                    (Hierarchical Commission Tree Visualization)
                  </div>
                  <div className="absolute w-[2px] h-32 bg-[#ff0b0b] top-4 shadow-[0_0_8px_rgba(255,11,11,0.8)]"></div>
                  <div className="absolute w-[60%] h-[2px] bg-[#ff0b0b] top-12 shadow-[0_0_8px_rgba(255,11,11,0.8)]"></div>
                  <div className="absolute w-[2px] h-32 bg-[#ffdf00] top-4 left-[20%] shadow-[0_0_8px_rgba(255,223,0,0.8)]"></div>
                  <div className="absolute w-[2px] h-32 bg-[#ffdf00] top-4 right-[20%] shadow-[0_0_8px_rgba(255,223,0,0.8)]"></div>
                  
                  <div className="w-10 h-10 bg-[#ffaa00] rounded-full absolute top-8 left-[20%] -translate-x-1/2 border-2 border-white flex items-center justify-center text-xs font-black">B1</div>
                  <div className="w-10 h-10 bg-[#ffaa00] rounded-full absolute top-8 right-[20%] translate-x-1/2 border-2 border-white flex items-center justify-center text-xs font-black">B2</div>
                  <div className="w-10 h-10 bg-[#ffdf00] rounded-full absolute top-28 left-[10%] -translate-x-1/2 border-2 border-white flex items-center justify-center text-xs font-black text-black">C1</div>
                  <div className="w-10 h-10 bg-[#ffdf00] rounded-full absolute top-28 left-[40%] -translate-x-1/2 border-2 border-white flex items-center justify-center text-xs font-black text-black">C2</div>
                  <div className="w-10 h-10 bg-[#ffdf00] rounded-full absolute top-28 right-[10%] translate-x-1/2 border-2 border-white flex items-center justify-center text-xs font-black text-black">C3</div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "My Data" && (
            <motion.div key="mydata" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-3 pt-3">
              {/* Date Filters */}
              <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 pb-1">
                {["Today", "Yesterday", "This Week", "Last Week", "This Month"].map((btn) => (
                  <button
                    key={btn}
                    onClick={() => setMyDataPeriod(btn)}
                    className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[12px] font-medium transition-colors border ${
                      myDataPeriod === btn
                        ? "bg-[#cc0000] border-[#cc0000] text-white shadow-md"
                        : "bg-[#141414] border-neutral-700 text-neutral-400"
                    }`}
                  >
                    {btn}
                  </button>
                ))}
              </div>

              {/* Commission Card */}
              <div className="px-3">
                <div className="bg-[#141414] rounded-xl p-4 flex flex-col gap-3 border border-neutral-800 shadow-lg">
                  <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
                    <h3 className="text-[14px] font-bold text-white">{myDataPeriod} Commission</h3>
                    <div className="flex flex-col items-end">
                      <span className="text-[14px] font-bold text-white">
                        PKR {Number(myData?.today_commission || 0).toLocaleString()}
                      </span>
                      <span className="text-[10px] text-neutral-500">
                        (Total commission PKR {Number(myData?.total_commission || overview?.stats?.total_commission || 0).toLocaleString()})
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2.5 text-[12px]">
                    <div className="flex justify-between text-neutral-300">
                      <span>Direct commission</span>
                      <span className="font-semibold text-white">PKR {Number(myData?.direct_commission || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-neutral-300">
                      <span>Other commission</span>
                      <span className="font-semibold text-white">PKR {Number(myData?.other_commission || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-neutral-300">
                      <span>Promotional event rewards</span>
                      <span className="font-semibold text-white">PKR {Number(myData?.promotional_rewards || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-neutral-300">
                      <span>Agent activity rewards</span>
                      <span className="font-semibold text-white">PKR {Number(myData?.activity_rewards || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-3 mt-1 pb-8">
                <h3 className="text-[14px] font-bold text-white text-center mb-3">All Data</h3>
                
                <div className="flex flex-col gap-3">
                  {[
                    {
                      title: "Total new users",
                      val: myData?.metrics?.total_new_users?.total ?? 0,
                      sub1: myData?.metrics?.total_new_users?.sub1 ?? 0,
                      sub2: myData?.metrics?.total_new_users?.sub2 ?? 0
                    },
                    {
                      title: "Total deposit (Users)",
                      val: myData?.metrics?.total_deposit_users?.total ?? 0,
                      sub1: myData?.metrics?.total_deposit_users?.sub1 ?? 0,
                      sub2: myData?.metrics?.total_deposit_users?.sub2 ?? 0
                    },
                    {
                      title: "Total first charge (Number of people)",
                      val: myData?.metrics?.total_first_charge?.total ?? 0,
                      sub1: myData?.metrics?.total_first_charge?.sub1 ?? 0,
                      sub2: myData?.metrics?.total_first_charge?.sub2 ?? 0
                    },
                    {
                      title: "Same-day reg. first-deposit (Number of people)",
                      val: myData?.metrics?.same_day_first_deposit?.total ?? 0,
                      sub1: myData?.metrics?.same_day_first_deposit?.sub1 ?? 0,
                      sub2: myData?.metrics?.same_day_first_deposit?.sub2 ?? 0
                    }
                  ].map((item, i) => (
                    <div key={i} className="bg-[#141414] rounded-xl p-4 flex flex-col gap-3 border border-neutral-800 shadow-md">
                      <div className="flex justify-between items-start">
                        <span className="text-[13px] font-bold text-white w-2/3">{item.title}</span>
                        <span className="text-[13px] font-bold text-white">{item.val}</span>
                      </div>
                      <div className="flex flex-col gap-1 text-[11px] text-neutral-500">
                        <div className="flex justify-between">
                          <span>Subordinate Stats</span>
                          <span className="text-neutral-300">{item.sub1}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Other Stats</span>
                          <span className="text-neutral-300">{item.sub2}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "Performance" && (
            <motion.div key="performance" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-3 pt-3 px-3 pb-8">
              
              {/* Filter Trigger */}
              <button 
                onClick={() => setDateModalOpen(true)}
                className="self-start border border-[#ff0b0b] rounded-full px-4 py-1.5 flex items-center gap-1.5 text-[#ffdf00] text-[11px] hover:bg-[#2e0505] transition-colors"
              >
                {perfPeriod} <ChevronLeft className="w-3.5 h-3.5 rotate-90" />
              </button>

              {perfLoading ? (
                <div className="flex-1 flex items-center justify-center pt-20 pb-40">
                  <p className="text-neutral-400 text-sm">Loading performance...</p>
                </div>
              ) : performanceData.length === 0 ? (
                <div className="flex-1 flex items-center justify-center pt-20 pb-40">
                  <p className="text-neutral-500 text-sm">No data available</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2 mt-2">
                  {performanceData.map((item, i) => (
                    <div key={i} className="bg-[#141414] p-3 rounded-xl border border-neutral-800 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-bold text-white">Member #{item.member}</div>
                        <div className="text-[10px] text-neutral-500">{new Date(item.date).toLocaleDateString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-neutral-400">Turnover: PKR {item.turnover.toLocaleString()}</div>
                        <div className="text-[#ffdf00] font-bold">Comm: PKR {item.commission.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Date Modal Overlay */}
              <AnimatePresence>
                {dateModalOpen && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed top-0 h-[100dvh] left-1/2 -translate-x-1/2 w-full max-w-[400px] bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
                  >
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                      className="w-full max-w-sm bg-[#1c1c1c] rounded-2xl border border-neutral-800 p-4 shadow-2xl flex flex-col gap-4"
                    >
                      <div className="grid grid-cols-3 gap-2">
                        {["Today", "Yesterday", "This Week", "Last Week", "This Month", "Last Month"].map((btn) => (
                          <button
                            key={btn}
                            onClick={() => { setPerfPeriod(btn); setDateModalOpen(false); }}
                            className={`py-2 text-[11px] rounded-lg font-bold border transition-colors ${
                              perfPeriod === btn
                                ? "border-[#ff0b0b] text-[#ffdf00] shadow-[0_0_8px_rgba(255,11,11,0.2)] bg-[#2e0505]"
                                : "border-neutral-800 text-white hover:bg-neutral-800"
                            }`}
                          >
                            {btn}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => { setPerfPeriod("All"); setDateModalOpen(false); }}
                        className={`py-2 text-[11px] rounded-lg font-bold border w-1/3 transition-colors ${
                          perfPeriod === "All" ? "border-[#ff0b0b] text-[#ffdf00] bg-[#2e0505]" : "border-neutral-800 text-white hover:bg-neutral-800"
                        }`}
                      >
                        All
                      </button>

                      <div className="mt-2">
                        <h4 className="text-[12px] font-bold text-white mb-2">Custom</h4>
                        <div className="flex gap-4">
                          <div className="flex-1 flex flex-col">
                            <span className="text-[11px] text-neutral-400 mb-1">Start Date</span>
                            <input
                              type="date"
                              value={customStart}
                              onChange={(e) => setCustomStart(e.target.value)}
                              className="bg-neutral-900 border border-neutral-700 text-white rounded p-1.5 text-xs outline-none"
                            />
                          </div>
                          <div className="flex-1 flex flex-col">
                            <span className="text-[11px] text-neutral-400 mb-1">End Date</span>
                            <input
                              type="date"
                              value={customEnd}
                              onChange={(e) => setCustomEnd(e.target.value)}
                              className="bg-neutral-900 border border-neutral-700 text-white rounded p-1.5 text-xs outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 mt-4">
                        <button onClick={() => setDateModalOpen(false)} className="flex-1 py-3 rounded-xl border border-[#ff0b0b] text-[#ffdf00] font-bold text-[13px] hover:bg-[#2e0505] transition-colors">
                          Cancel
                        </button>
                        <button onClick={() => { if (customStart && customEnd) setPerfPeriod("Custom"); setDateModalOpen(false); }} className="flex-1 py-3 rounded-xl bg-[#cc0000] text-white font-bold text-[13px] hover:bg-[#ff0b0b] transition-colors shadow-lg">
                          Confirm
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {activeTab === "Commission" && (
            <motion.div key="commission" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-3 pt-3 px-3 pb-8">
              <div className="text-[12px] text-neutral-400 px-2 pb-2 border-b border-neutral-800 flex justify-between items-center">
                <span>Settlement cycle: <span className="text-white font-bold">{overview?.config?.settlement_cycle || "Daily settlement"}</span></span>
                <span className="text-xs text-[#ffdf00]">Total Comm: PKR {Number(overview?.stats?.total_commission || 0).toLocaleString()}</span>
              </div>
              
              <button 
                onClick={() => setDateModalOpen(true)}
                className="self-start border border-[#ff0b0b] rounded-full px-4 py-1.5 flex items-center gap-1.5 text-[#ffdf00] text-[11px] hover:bg-[#2e0505] transition-colors"
              >
                {perfPeriod} <ChevronLeft className="w-3.5 h-3.5 rotate-90" />
              </button>

              {perfLoading ? (
                <div className="flex-1 flex items-center justify-center pt-20 pb-40">
                  <p className="text-neutral-400 text-sm">Loading records...</p>
                </div>
              ) : performanceData.length === 0 ? (
                <div className="flex-1 flex items-center justify-center pt-20 pb-40">
                  <p className="text-neutral-500 text-sm">No data available</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2 mt-2">
                  {performanceData.map((item, i) => (
                    <div key={i} className="bg-[#141414] p-3 rounded-xl border border-neutral-800 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-bold text-white">Commission from #{item.member}</div>
                        <div className="text-[10px] text-neutral-500">{new Date(item.date).toLocaleDateString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[#ffdf00] font-bold text-sm">+PKR {item.commission.toLocaleString()}</div>
                        <div className="text-[10px] text-green-400">{item.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "Subordinate Information" && (
            <motion.div key="sub-info" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-3 pt-3 px-3 pb-8">
              <div className="flex gap-2 mb-2 items-center">
                <button
                  onClick={() => {
                    const next = subPeriod === "Today" ? "All" : "Today";
                    setSubPeriod(next);
                  }}
                  className="border border-neutral-700 rounded-full px-3 py-1 flex items-center gap-1 text-neutral-300 text-[11px]"
                >
                  {subPeriod} <ChevronLeft className="w-3 h-3 rotate-90" />
                </button>
                <button
                  onClick={() => {
                    const next = subSort === "login_date" ? "created_at" : "login_date";
                    setSubSort(next);
                    toast.success(`Sorted by ${next === "login_date" ? "login date" : "registration date"}`);
                  }}
                  className="border border-neutral-700 rounded-full px-3 py-1 flex items-center gap-1 text-neutral-300 text-[11px]"
                >
                  {subSort === "login_date" ? "Sort by login date" : "Sort by reg. date"} <ChevronLeft className="w-3 h-3 rotate-90" />
                </button>
                <div className="border border-neutral-700 rounded-full px-3 py-1 flex items-center justify-between flex-1 text-neutral-400 text-[11px] bg-neutral-900">
                  <input
                    type="text"
                    value={subSearch}
                    onChange={(e) => setSubSearch(e.target.value)}
                    placeholder="Member ID"
                    className="bg-transparent outline-none text-white text-[11px] w-full"
                  />
                  <Search className="w-3.5 h-3.5 text-[#ffdf00] shrink-0 ml-1" />
                </div>
              </div>

              {subLoading ? (
                <div className="py-20 text-center text-neutral-400 text-sm">Loading subordinates...</div>
              ) : subordinates.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center pt-24 pb-40 gap-4 opacity-50">
                  <div className="w-24 h-24 bg-neutral-800 rounded-2xl flex items-center justify-center relative shadow-inner">
                     <div className="absolute top-2 right-2 text-3xl opacity-20 -rotate-12">✈️</div>
                     <div className="w-16 h-12 bg-neutral-700 rounded-lg border-t-2 border-neutral-600"></div>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-500 text-[13px]">
                    No content yet <span className="text-[#ffdf00]">↻</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2 mt-2">
                  {subordinates.map((sub) => (
                    <div key={sub.id} className="bg-[#141414] border border-neutral-800 rounded-xl p-3 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>👤</span>
                          <span>Member ID: {sub.member_id}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${sub.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' : 'bg-neutral-800 text-neutral-400'}`}>
                            {sub.status}
                          </span>
                        </div>
                        <div className="text-[10px] text-neutral-500 mt-1">Phone: {sub.phone}</div>
                        <div className="text-[10px] text-neutral-500">Reg: {new Date(sub.created_at).toLocaleDateString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-neutral-400">Total Recharge</div>
                        <div className="text-[#ffdf00] font-bold text-sm">PKR {sub.total_deposit.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "Subordinate Betting" && (
            <motion.div key="sub-betting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-3 pt-3 px-3 pb-8 relative">
              <div className="flex gap-2 mb-2 items-center">
                <button
                  onClick={() => setBettingDropdownOpen(!bettingDropdownOpen)}
                  className="border border-[#ffdf00] rounded-full px-3 py-1 flex items-center gap-1 text-[#ffdf00] text-[11px] bg-[#2e0505]"
                >
                  {bettingSort === "valid_bet" ? "Valid bet sorting" : "Cumulative turnover"} <ChevronLeft className="w-3 h-3 -rotate-90" />
                </button>
                <div className="border border-neutral-700 rounded-full px-3 py-1 flex items-center justify-between flex-1 text-neutral-400 text-[11px] bg-neutral-900">
                  <input
                    type="text"
                    value={bettingSearch}
                    onChange={(e) => setBettingSearch(e.target.value)}
                    placeholder="Member ID"
                    className="bg-transparent outline-none text-white text-[11px] w-full"
                  />
                  <Search className="w-3.5 h-3.5 text-[#ffdf00] shrink-0 ml-1" />
                </div>
              </div>
              
              {/* Dropdown Menu */}
              {bettingDropdownOpen && (
                <div className="absolute top-12 left-4 w-48 bg-[#1c1c1c] rounded-xl border border-neutral-700 p-2 shadow-2xl z-30 flex flex-col">
                   <button
                     onClick={() => { setBettingSort("valid_bet"); setBettingDropdownOpen(false); }}
                     className="text-left px-3 py-2 text-[#ffdf00] font-bold text-[12px]"
                   >
                     Valid bet sorting
                   </button>
                   <button
                     onClick={() => { setBettingSort("turnover"); setBettingDropdownOpen(false); }}
                     className="text-left px-3 py-2 text-neutral-400 text-[12px] leading-tight hover:bg-neutral-800 rounded-lg"
                   >
                     Cumulative turnover sorting
                   </button>
                </div>
              )}

              {bettingLoading ? (
                <div className="py-20 text-center text-neutral-400 text-sm">Loading betting stats...</div>
              ) : bettingList.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center pt-24 pb-40 gap-4 opacity-50">
                  <div className="w-24 h-24 bg-neutral-800 rounded-2xl flex items-center justify-center relative shadow-inner">
                     <div className="absolute top-2 right-2 text-3xl opacity-20 -rotate-12">✈️</div>
                     <div className="w-16 h-12 bg-neutral-700 rounded-lg border-t-2 border-neutral-600"></div>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-500 text-[13px]">
                    No content yet <span className="text-[#ffdf00]">↻</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2 mt-2">
                  {bettingList.map((sub) => (
                    <div key={sub.id} className="bg-[#141414] border border-neutral-800 rounded-xl p-3 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-bold text-white">Member #{sub.member_id}</div>
                        <div className="text-[10px] text-neutral-500">Phone: {sub.phone}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-neutral-400">Valid Bets</div>
                        <div className="text-[#ffdf00] font-bold text-sm">PKR {sub.total_turnover.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "Subordinate Finance" && (
            <motion.div key="sub-finance" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-3 pt-3 px-3 pb-8">
              <div className="flex gap-2 mb-2 items-center">
                <button onClick={() => toast.success("Sorting applied")} className="border border-neutral-700 rounded-full px-3 py-1 flex items-center gap-1 text-neutral-300 text-[11px]">
                  Sort by recharge <ChevronLeft className="w-3 h-3 rotate-90" />
                </button>
                <div className="border border-neutral-700 rounded-full px-3 py-1 flex items-center justify-between flex-1 text-neutral-400 text-[11px] bg-neutral-900">
                  <input
                    type="text"
                    value={financeSearch}
                    onChange={(e) => setFinanceSearch(e.target.value)}
                    placeholder="Member ID"
                    className="bg-transparent outline-none text-white text-[11px] w-full"
                  />
                  <Search className="w-3.5 h-3.5 text-[#ffdf00] shrink-0 ml-1" />
                </div>
              </div>

              {financeLoading ? (
                <div className="py-20 text-center text-neutral-400 text-sm">Loading finance...</div>
              ) : financeList.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center pt-24 pb-40 gap-4 opacity-50">
                  <div className="w-24 h-24 bg-neutral-800 rounded-2xl flex items-center justify-center relative shadow-inner">
                     <div className="absolute top-2 right-2 text-3xl opacity-20 -rotate-12">✈️</div>
                     <div className="w-16 h-12 bg-neutral-700 rounded-lg border-t-2 border-neutral-600"></div>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-500 text-[13px]">
                    No content yet <span className="text-[#ffdf00]">↻</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2 mt-2">
                  {financeList.map((sub) => (
                    <div key={sub.id} className="bg-[#141414] border border-neutral-800 rounded-xl p-3 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-bold text-white">Member #{sub.member_id}</div>
                        <div className="text-[10px] text-neutral-500">Phone: {sub.phone}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-neutral-400">Total Recharge</div>
                        <div className="text-green-400 font-bold text-sm">PKR {sub.total_deposit.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "Subordinate claim" && (
            <motion.div key="sub-claim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-3 pt-3 px-3 pb-8">
              <div className="flex justify-between items-center px-1 mb-2">
                <span className="text-xs text-neutral-400">Total Claims: {claimsList.length}</span>
                <span className="text-xs text-[#ffdf00]">
                  Approved: PKR {claimsList.filter(c => c.status === 'CREDITED' || c.status === 'APPROVED').reduce((s, c) => s + c.amount, 0).toLocaleString()}
                </span>
              </div>

              {claimsLoading ? (
                <div className="py-20 text-center text-neutral-400 text-sm">Loading claims...</div>
              ) : claimsList.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center pt-24 pb-40 gap-4 opacity-50">
                  <div className="w-24 h-24 bg-neutral-800 rounded-2xl flex items-center justify-center relative shadow-inner">
                     <div className="absolute top-2 right-2 text-3xl opacity-20 -rotate-12">✈️</div>
                     <div className="w-16 h-12 bg-neutral-700 rounded-lg border-t-2 border-neutral-600"></div>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-500 text-[13px]">
                    No content yet <span className="text-[#ffdf00]">↻</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2 mt-2">
                  {claimsList.map((claim) => (
                    <div key={claim.id} className="bg-[#141414] border border-neutral-800 rounded-xl p-3 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-bold text-white">{claim.description || claim.reward_type}</div>
                        <div className="text-[10px] text-neutral-500">{new Date(claim.created_at).toLocaleString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[#ffdf00] font-bold text-sm">+PKR {claim.amount.toLocaleString()}</div>
                        <div className={`text-[10px] font-bold ${
                          claim.status === 'CREDITED' || claim.status === 'APPROVED' ? 'text-green-400' :
                          claim.status === 'PENDING' ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {claim.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "Commission Rate" && (
            <motion.div key="commission-rate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-2 pt-3 px-2 pb-8 items-start">
              {/* Left Sidebar (Vertical Tabs) */}
              <div className="w-[85px] flex flex-col gap-2 shrink-0">
                {[
                  { id: "Mini Games", icon: "🎮" },
                  { id: "Slot", icon: "🎰" },
                  { id: "Fishing", icon: "🐟" },
                  { id: "Cards", icon: "♠️" },
                  { id: "Live", icon: "🎲" },
                  { id: "Sports", icon: "⚽" }
                ].map(t => (
                  <button 
                    key={t.id}
                    onClick={() => setRateTab(t.id)}
                    className={`flex flex-col items-center justify-center py-3 rounded-lg border gap-1 transition-colors ${
                      rateTab === t.id 
                        ? "bg-[#cc0000] border-[#ff0b0b] text-white shadow-lg" 
                        : "bg-[#141414] border-neutral-800 text-neutral-400"
                    }`}
                  >
                    <span className="text-xl">{t.icon}</span>
                    <span className="text-[10px] font-medium leading-none text-center">{t.id}</span>
                  </button>
                ))}
              </div>

              {/* Table Area */}
              <div className="flex-1 bg-transparent flex flex-col rounded-xl overflow-hidden border border-neutral-800">
                {/* Table Header */}
                <div className="flex bg-[#1c1c1c] text-white text-[11px] font-bold py-3 px-2 border-b border-neutral-800">
                  <div className="flex-1 flex flex-col items-center justify-center text-center leading-tight relative">
                    Valid<br/>members
                    <div className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-[#ff0b0b] text-[9px] flex items-center justify-center text-white">?</div>
                  </div>
                  <div className="flex-[1.5] text-center leading-tight flex flex-col items-center justify-center">
                    Performance
                    <span className="text-neutral-500 font-normal text-[9px] scale-90">(Unit: piece)</span>
                  </div>
                  <div className="flex-1 text-center leading-tight flex flex-col items-center justify-center">
                    Commission<br/>Rate
                  </div>
                </div>

                {/* Table Rows */}
                <div className="flex flex-col text-[11px] font-bold text-center">
                  {(overview?.config?.tiers || [
                    { mem: 0, perf: "0.00", rate: "0.40%" },
                    { mem: 0, perf: "10,000,000.00", rate: "0.50%" },
                    { mem: 0, perf: "30,000,000.00", rate: "0.80%" },
                    { mem: 0, perf: "50,000,000.00", rate: "1.00%" },
                    { mem: 0, perf: "100,000,000.00", rate: "1.20%" },
                    { mem: 0, perf: "30,000,000.00", rate: "1.50%" },
                    { mem: 0, perf: "500,000,000.00", rate: "2.00%" },
                    { mem: 0, perf: "1,000,000,000.00", rate: "2.50%" },
                    { mem: 0, perf: "5,000,000,000.00", rate: "3.00%" }
                  ]).map((row: any, i: number) => (
                    <div key={i} className={`flex py-3 px-1 ${i % 2 !== 0 ? "bg-[#141414]" : "bg-transparent"}`}>
                      <div className="flex-1 text-white flex items-center justify-center">{row.mem}</div>
                      <div className="flex-[1.5] text-white flex items-center justify-center">{row.perf}</div>
                      <div className="flex-1 text-[#ffdf00] flex items-center justify-center">
                        {overview?.config?.category_rates?.[rateTab]
                          ? `${(Number(overview.config.category_rates[rateTab]) * 100).toFixed(2)}%`
                          : row.rate}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav activeTab="invite" />
    </main>
  );
}
