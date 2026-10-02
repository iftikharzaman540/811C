"use client";

import Link from "next/link";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { ChevronRight, User, Gift, Wallet, CreditCard, Banknote, FileText, Settings, Shield, Search, Globe, HelpCircle, MessageSquare, Smartphone, Moon, Info } from "lucide-react";
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
    { icon: <FileText className="w-5 h-5 text-[#ffdf00]" />, label: "My Records", subtext: "Details, records, reports, recover balance", highlight: true, link: "/admin/financials" },
    { icon: <Settings className="w-5 h-5 text-[#ff0b0b]" />, label: "Manage withdrawal", subtext: "", highlight: false, link: "/withdraw" },
    "divider",
    { icon: <User className="w-5 h-5 text-[#ffdf00]" />, label: "Invite", subtext: "Easy money", highlight: true, link: "/invite" },
    { icon: <User className="w-5 h-5 text-[#ffdf00]" />, label: "Profile", subtext: "", highlight: false, link: "/profile" },
    { icon: <Shield className="w-5 h-5 text-[#ffdf00]" />, label: "Security Center", subtext: "", highlight: false, action: () => toast.success("Opening Security Center...") },
    { icon: <Search className="w-5 h-5 text-[#ffdf00]" />, label: "Find us", subtext: "Prevent it from opening", highlight: false, action: () => toast.success("Opening Find Us...") },
    { icon: <Globe className="w-5 h-5 text-[#ffdf00]" />, label: "Language", subtext: "English", highlight: false, action: () => toast("Language is already English") },
    { icon: <HelpCircle className="w-5 h-5 text-[#ffdf00]" />, label: "FAQ", subtext: "", highlight: false, link: "/support" },
    { icon: <MessageSquare className="w-5 h-5 text-[#ffdf00]" />, label: "Reward Feedback", subtext: "", highlight: false, link: "/support" },
    { icon: <Smartphone className="w-5 h-5 text-[#ffdf00]" />, label: "Login device", subtext: "", highlight: false, action: () => toast.success("Current Device: Web/Mobile") },
    { icon: <Moon className="w-5 h-5 text-[#ffdf00]" />, label: "Night mode", subtext: "", highlight: false, action: () => toast("Night mode is active!") },
    { icon: <Info className="w-5 h-5 text-[#ffdf00]" />, label: "About 8111C.com", subtext: "", highlight: false, action: () => toast.success("8111C.com Version 1.0.0") },
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
      <div className="relative pt-6 px-4 pb-6 bg-gradient-to-b from-[#2e0505] to-[#111]">
        {/* Background decorative waves could go here */}
        
        {/* Gift Box Top Right */}
        <div className="absolute top-2 right-4 flex items-center bg-[#1a1a1a] rounded-full px-2 py-0.5 border border-neutral-700 shadow-lg cursor-pointer hover:bg-neutral-800" onClick={() => toast("Gift Center coming soon!")}>
          <Gift className="w-4 h-4 text-[#ffdf00] mr-1" />
          <span className="text-[#ffdf00] font-bold text-[11px]">10-666</span>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <div className="w-16 h-16 rounded-full bg-neutral-200 flex items-center justify-center shrink-0">
            <User className="w-8 h-8 text-neutral-400" />
          </div>
          <div className="flex-1 flex flex-col justify-center">
            {loading ? (
              <span className="text-neutral-400 text-[13px] leading-tight">Loading profile...</span>
            ) : (user || hasToken) ? (
              <div className="flex flex-col">
                <span className="text-white font-bold text-[14px]">{user?.phone || user?.email || "User"}</span>
                {user?.player_id && <span className="text-neutral-400 text-[11px] mb-1">ID: {user.player_id}</span>}
                <span className="text-[#ffdf00] font-bold text-[16px]">Rs {(user?.balance || 0).toFixed(2)}</span>
              </div>
            ) : (
              <span className="text-neutral-400 text-[13px] leading-tight">Please first <span className="text-white font-bold">Login</span> Or <span className="text-white font-bold">Register</span></span>
            )}
          </div>
          {(!loading && !user && !hasToken) && <div className="flex gap-2 shrink-0">
            <button onClick={() => window.location.href = "/?login=true"} className="bg-[#cc0000] text-white font-bold text-[12px] px-4 py-1.5 rounded shadow-lg hover:bg-[#ff0b0b] transition-colors">
              Login
            </button>
            <button onClick={() => window.location.href = "/?register=true"} className="bg-transparent border border-[#ff0b0b] text-[#ffdf00] font-bold text-[12px] px-4 py-1.5 rounded hover:bg-[#2e0505] transition-colors">
              Register
            </button>
          </div>}
        </div>

        {/* 3 Action Buttons */}
        <div className="flex justify-between items-end mt-8 px-4">
          <div onClick={() => window.location.href = "/withdraw"} className="flex flex-col items-center gap-2 relative cursor-pointer hover:scale-105 transition-transform">
            <Banknote className="w-9 h-9 text-[#ffdf00]" />
            <span className="text-white font-medium text-[12px]">Withdraw</span>
          </div>
          <div onClick={() => window.location.href = "/deposit"} className="flex flex-col items-center gap-2 relative cursor-pointer hover:scale-105 transition-transform">
            <div className="absolute -top-3 -right-3 bg-[#cc0000] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full border border-[#111] z-10">+3%</div>
            <Wallet className="w-9 h-9 text-[#ffdf00]" />
            <span className="text-white font-medium text-[12px]">Deposit</span>
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
            <button key={index} onClick={() => handleMenuClick(menu)} className="flex items-center gap-4 px-4 py-4 border-b border-neutral-800/50 hover:bg-[#1a1a1a] transition-colors group cursor-pointer">
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
        <div className="px-4 py-8 bg-[#0a0a0a]">
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


