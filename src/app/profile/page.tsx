"use client";

import Link from "next/link";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, User, Gift, Wallet, CreditCard, Banknote, FileText, Settings, Shield, Search, Globe, HelpCircle, MessageSquare, Smartphone, Moon, Info, Crown, Pencil, Bell, ChevronLeft } from "lucide-react";
import BottomNav from "@/components/BottomNav";

import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { apiRequest } from '@/utils/api';
export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, logout, notifications = [], unreadNotifCount = 0, markNotifRead } = useUser();
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [vipStatus, setVipStatus] = useState<any>(null);

  useEffect(() => {
    if (showNotifModal) {
      document.body.style.overflow = 'hidden';
      window.history.pushState({ notifOpen: true }, '');
    } else {
      document.body.style.overflow = '';
    }

    const handlePopState = (e: any) => {
      if (showNotifModal) setShowNotifModal(false);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('popstate', handlePopState);
    };
  }, [showNotifModal]);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      setHasToken(!!token);
      if (token) {
        apiRequest('/vip/status').then((res: any) => setVipStatus(res)).catch(() => {});
      }
    }
  }, []);

  const menuItems = [
    { icon: <FileText className="w-5 h-5 text-[#ffdf00]" />, label: "My Records", subtext: "Details, records, reports, recover balance", highlight: true, link: "/records" },
    { icon: <FileText className="w-5 h-5 text-[#ffdf00]" />, label: "Deposit History", subtext: "View all your deposits", highlight: false, link: "/deposit-history" },{ icon: <FileText className="w-5 h-5 text-[#ffdf00]" />, label: "Withdrawal History", subtext: "View all your withdrawals", highlight: false, link: "/withdrawal-history" },
    "divider",
    { icon: <User className="w-5 h-5 text-[#ffdf00]" />, label: "Invite", subtext: "Easy money", highlight: true, link: "/invite" },
    { icon: <User className="w-5 h-5 text-[#ffdf00]" />, label: "Profile Details", subtext: "Edit profile info", highlight: false, link: "/profile/details" },
    { icon: <Shield className="w-5 h-5 text-[#ffdf00]" />, label: "Security Center", subtext: "Change password", highlight: false, link: "/profile/security" },
    { icon: <Globe className="w-5 h-5 text-[#ffdf00]" />, label: "Language", subtext: "English", highlight: false, action: () => toast("Language is already English") },
    { icon: <HelpCircle className="w-5 h-5 text-[#ffdf00]" />, label: "FAQ", subtext: "", highlight: false, link: "/support" },
    { icon: <MessageSquare className="w-5 h-5 text-[#ffdf00]" />, label: "Reward Feedback", subtext: "", highlight: false, link: "/support" },
    { icon: <Info className="w-5 h-5 text-[#ffdf00]" />, label: "About 8111C.com", subtext: "", highlight: false, link: "/about" },
  ];

  const handleMenuClick = (item: any) => {
    if (item.link) {
      window.location.href = item.link;
    } else if (item.action) {
      item.action();
    }
  };

  return (
    <main className="min-h-screen bg-[#111] text-white flex flex-col pb-20 font-sans overflow-x-hidden">
      
      {/* Top Header Section */}
            {/* Top Header Section (JJWin Style) */}
      <div className="p-3">
        <div className="relative p-5 rounded-2xl bg-[#0d0d0d] border border-red-600/30 shadow-[0_0_20px_rgba(255,0,0,0.15)] overflow-hidden">
          
          {/* Decorative Corner Flairs */}
          <div className="absolute top-0 left-0 w-24 h-24 bg-red-600/20 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-red-600/10 blur-3xl rounded-full translate-x-1/3 translate-y-1/3"></div>
          
          {/* Subtle red edge glows */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>

          {/* Top Right Icons */}
          <div className="absolute top-4 right-4 flex items-center gap-3 z-20">
            {/* Notification Bell */}
            <div className="relative cursor-pointer" onClick={() => { window.history.pushState({notifOpen: true}, ''); setShowNotifModal(true); }}>
              <Bell className="w-[22px] h-[22px] text-white hover:text-[#ffdf00] transition-colors" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#ff0000] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-[1.5px] border-[#1a1a1a]">
                  {unreadNotifCount}
                </span>
              )}
            </div>

            {/* Gift Box */}
            <div className="flex items-center bg-[#111] border border-[#ffdf00] rounded-full px-2.5 py-0.5 cursor-pointer shadow-[0_0_8px_rgba(255,223,0,0.15)] hover:bg-black transition-colors" onClick={() => toast("Gift Center coming soon!")}>
              <Gift className="w-3.5 h-3.5 text-[#ffdf00] mr-1" />
              <span className="text-[#ffdf00] font-bold text-[12px]">10-666</span>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-8 relative z-10">
            {/* Avatar with glowing ring */}
            <div onClick={() => window.location.href = "/profile/details"} className="w-[72px] h-[72px] rounded-full bg-neutral-200 border-[3px] border-[#ff3300] shadow-[0_0_15px_rgba(255,51,0,0.4)] flex items-center justify-center shrink-0 cursor-pointer relative group">
              <div className="absolute -inset-[6px] border-[2px] border-[#ff3300]/40 rounded-full group-hover:border-[#ff3300]/60 transition-colors"></div>
              <User className="w-10 h-10 text-neutral-400" />
              
              {/* Edit Pencil Badge */}
              <div className="absolute -bottom-1 -right-1 bg-[#ff3300] border-2 border-[#0d0d0d] p-1.5 rounded-full shadow-lg z-20 group-hover:scale-110 transition-transform">
                <Pencil className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
            
            {/* User Details */}
            <div className="flex-1 flex flex-col justify-center">
              {loading ? (
                <span className="text-neutral-400 text-[13px] leading-tight">Loading profile...</span>
              ) : (user || hasToken) ? (
                <div className="flex flex-col">
                  <span className="text-white font-bold text-[18px] tracking-wide">{user?.phone || user?.username || user?.email || "User"}</span>
                  {user?.player_id && <span className="text-neutral-400 text-[12px] mt-0.5 mb-1">ID: {user.player_id}</span>}
                  <span className="text-[#ffdf00] font-black text-[22px] tracking-tight">Rs {(user?.balance || 0).toFixed(2)}</span>
                </div>
              ) : (
                <span className="text-neutral-400 text-[13px] leading-tight">Please first <span className="text-white font-bold">Login</span> Or <span className="text-white font-bold">Register</span></span>
              )}
            </div>

            {/* Big VIP Crown (Top Right Logo) */}
            {(user || hasToken) && (
              <div className="shrink-0 flex items-center pr-1 self-center cursor-pointer" onClick={() => router.push("/vip")}>
                <Crown className="w-9 h-9 text-[#ff5500]" style={{ filter: "drop-shadow(0 0 10px rgba(255,85,0,0.8))" }} />
              </div>
            )}
          </div>

          {/* Proper VIP Card */}
          {(user || hasToken) && (
            <div onClick={() => router.push("/vip")} className="mt-5 border border-[#ffdf00]/30 bg-gradient-to-r from-[#1a1700] via-[#0f0a00] to-[#1a1700] rounded-xl p-3 flex items-center justify-between cursor-pointer relative shadow-[0_0_15px_rgba(255,223,0,0.08)] group z-10">
              
              {/* Left Side: Badge & Progress */}
              <div className="flex-1 pr-3 border-r border-[#ffdf00]/20 flex items-center gap-3">
                
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
                  <div className="w-full h-2.5 bg-[#111] rounded-full overflow-visible relative border border-neutral-800 shadow-inner">
                    <div className="h-full bg-gradient-to-r from-[#ffdf00] to-[#fff5cc] rounded-full relative" style={{ width: Math.min(100, (vipStatus?.requiredForNext ? (vipStatus.totalWagered / vipStatus.requiredForNext) * 100 : 0)) + '%' }}>
                      <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-[0_0_10px_#fff,0_0_20px_#ffdf00]"></div>
                    </div>
                  </div>
                  <div className="text-[11px] text-neutral-400 font-bold mt-2 text-left tracking-tight">
                    {(vipStatus?.totalWagered || 0).toLocaleString(undefined, {minimumFractionDigits: 2})} / {(vipStatus?.requiredForNext || 10000).toLocaleString(undefined, {minimumFractionDigits: 2})}
                  </div>
                </div>
              </div>
              
              {/* Right Side: Next Level Info */}
              <div className="w-[125px] pl-3 flex flex-col justify-center relative">
                <span className="text-neutral-400 text-[10px] leading-tight font-medium">Next level bonus</span>
                <span className="text-[#ffdf00] font-black text-[14px] leading-tight mt-1 mb-1.5 drop-shadow-md">Rs 50.00</span>
                <span className="text-neutral-500 text-[9px] leading-tight">VIP requires Bets {(vipStatus?.requiredForNext || 10000).toLocaleString()}</span>
                <ChevronRight className="w-4 h-4 text-[#ffdf00] absolute right-0 top-1/2 -translate-y-1/2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          )}

          {/* Action Buttons (Deposit / Withdraw) */}
          <div className="grid grid-cols-2 gap-3 mt-7 relative z-10">
            <button onClick={() => window.location.href = "/withdraw"} className="flex items-center justify-center gap-2 border-[1.5px] border-[#ffdf00]/80 bg-gradient-to-b from-[#1a1700] to-black rounded-2xl py-3 hover:bg-[#221f00] transition-colors shadow-[0_0_10px_rgba(255,223,0,0.1)]">
              <Banknote className="w-5 h-5 text-[#ffdf00]" />
              <span className="text-white font-bold text-[15px]">Withdraw</span>
              <ChevronRight className="w-4 h-4 text-[#ffdf00]" />
            </button>

            <button onClick={() => window.location.href = "/deposit"} className="flex items-center justify-center gap-2 border-[1.5px] border-[#ff0000]/80 bg-gradient-to-b from-[#1a0000] to-black rounded-2xl py-3 hover:bg-[#220000] relative transition-colors shadow-[0_0_10px_rgba(255,0,0,0.15)]">
              <div className="absolute -top-2.5 right-4 bg-[#ff0b0b] text-white text-[11px] font-black px-2 py-0.5 rounded-full shadow-lg z-10 tracking-tight">+3%</div>
              <Wallet className="w-5 h-5 text-[#ffdf00]" />
              <span className="text-white font-bold text-[15px]">Deposit</span>
              <ChevronRight className="w-4 h-4 text-[#ff0000]" />
            </button>
          </div>
        </div>
      </div>

      {/* Menu List */}
      <div className="flex flex-col bg-[#141414] flex-1">
        {menuItems.map((item, index) => {
          if (item === "divider") {
            return <div key={index} className="h-2 bg-[#0a0a0a]"></div>;
          }

          const menu = item as { icon: React.ReactNode, label: string, subtext: string, highlight: boolean, link?: string, action?: () => void };
          return (
            <button key={index} onClick={() => handleMenuClick(menu)} className="flex items-center gap-4 px-4 py-3 border-b border-neutral-800/50 hover:bg-[#1a1a1a] transition-colors group cursor-pointer">
              <div className="shrink-0 group-hover:scale-110 transition-transform">
                {menu.icon}
              </div>
              <div className="flex-1 flex flex-col items-start justify-center text-left">
                <span className="text-white font-medium text-[14px] leading-tight">{menu.label}</span>
              </div>
              {menu.subtext && (
                <div className={`text-[11px] max-w-[120px] text-right leading-tight ${menu.highlight ? 'text-[#ffdf00]' : 'text-neutral-500'}`}>
                  {menu.subtext}
                </div>
              )}
              <ChevronRight className="w-4 h-4 text-neutral-600 shrink-0 ml-1" />
            </button>
          );
        })}
      </div>

      {/* Logout Button */}
      {hasToken && (
        <div className="px-4 py-5 bg-[#0a0a0a]">
          <button 
            onClick={() => {
              logout();
              setHasToken(false);
              window.location.href = "/";
            }}
            className="w-full bg-[#1a0505] border border-[#cc0000] text-[#ff4444] font-bold py-3.5 rounded-[12px] text-[15px] hover:bg-[#cc0000] hover:text-white transition-all shadow-[0_0_15px_rgba(204,0,0,0.2)] flex items-center justify-center gap-2"
          >
            Logout
          </button>
        </div>
      )}

      
      {/* Notification Modal */}
      <AnimatePresence>
        {showNotifModal && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 50 }} 
            className="fixed top-0 h-[100dvh] left-1/2 -translate-x-1/2 w-full max-w-[400px] z-[10000] bg-[#0a0a0a] flex flex-col"
          >
            <div className="flex items-center h-14 px-4 bg-[#141414] border-b border-neutral-800">
              <button onClick={() => { if(window.history.state?.notifOpen) window.history.back(); else setShowNotifModal(false); }} className="w-8 h-8 flex items-center justify-center -ml-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer">
                <ChevronLeft className="w-6 h-6 text-neutral-400" />
              </button>
              <div className="flex-1 text-center font-bold text-[16px] text-white">Notifications</div>
              <div className="w-8 h-8"></div>
            </div>
            
            <div className="flex-1 min-h-0 overflow-y-auto p-4 flex flex-col gap-3 pb-[100px]">
              {notifications.length === 0 ? (
                <div className="text-center text-neutral-500 mt-10 font-medium">No notifications yet</div>
              ) : (
                notifications.map((notif: any) => (
                  <div 
                    key={notif.id} 
                    onClick={() => { if (!notif.is_read) markNotifRead(notif.id); }}
                    className={`p-3.5 rounded-xl border transition-all ${notif.is_read ? 'bg-[#141414] border-neutral-800' : 'bg-[#1c1c1c] border-[#ff0b0b]/50 shadow-[0_0_10px_rgba(255,11,11,0.1)] cursor-pointer'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={`font-bold text-[15px] ${notif.is_read ? 'text-neutral-400' : 'text-[#ffdf00]'}`}>{notif.title}</h3>
                      {!notif.is_read && <span className="w-2.5 h-2.5 rounded-full bg-[#ff0b0b] mt-1 shrink-0 animate-pulse"></span>}
                    </div>
                    <p className={`text-[13px] whitespace-pre-wrap leading-relaxed ${notif.is_read ? 'text-neutral-500' : 'text-neutral-200'}`}>{notif.message}</p>
                    <div className="text-[11px] text-neutral-600 mt-3 font-medium">
                      {new Date(notif.created_at).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav activeTab="profile" />
    </main>
  );
}

















