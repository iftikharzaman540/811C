"use client";

import Link from "next/link";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { ChevronRight, User, Gift, Wallet, CreditCard, Banknote, FileText, Settings, Shield, Search, Globe, HelpCircle, MessageSquare, Smartphone, Moon, Info, Crown, Pencil } from "lucide-react";
import BottomNav from "@/components/BottomNav";

import { useUser } from '@/context/UserContext';
export default function ProfilePage() {
  const { user, loading, logout } = useUser();
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasToken(!!localStorage.getItem("token"));
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

          {/* Top Right Gift Box */}
          <div className="absolute top-4 right-4 flex items-center bg-[#111] border border-[#ffdf00] rounded-full px-2.5 py-0.5 z-10 cursor-pointer shadow-[0_0_8px_rgba(255,223,0,0.15)] hover:bg-black transition-colors" onClick={() => toast("Gift Center coming soon!")}>
            <Gift className="w-3.5 h-3.5 text-[#ffdf00] mr-1" />
            <span className="text-[#ffdf00] font-bold text-[12px]">10-666</span>
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

            {/* VIP Crown */}
            {(user || hasToken) && (
              <div className="shrink-0 flex items-center pr-1 self-center">
                <Crown className="w-7 h-7 text-[#ff5500]" style={{ filter: "drop-shadow(0 0 5px rgba(255,85,0,0.8))" }} />
              </div>
            )}
          </div>

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

      <BottomNav activeTab="profile" />
    </main>
  );
}

















