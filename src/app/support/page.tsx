"use client";
import toast from "react-hot-toast";


import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MessageCircle, Download, HelpCircle, FileText, Search, Settings } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { motion, AnimatePresence } from "framer-motion";

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState("Support");
  const [subTab, setSubTab] = useState("Other Support");

  const tabs = [
    { id: "Support", badge: null },
    { id: "News", badge: 4 },
    { id: "Notice", badge: 27 },
    { id: "Marquee", badge: null }
  ];

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col pb-24 font-sans overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#141414] border-b border-neutral-800 flex items-center justify-center h-[50px] px-4">
        <Link href="/" className="absolute left-4">
          <ChevronLeft className="w-6 h-6 text-neutral-400" />
        </Link>
        <h1 className="text-[17px] font-medium tracking-wide">Message Center</h1>
      </header>

      {/* Tabs Menu */}
      <div className="sticky top-[50px] z-40 bg-[#141414] border-b border-neutral-800">
        <div className="flex overflow-x-auto no-scrollbar px-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-4 py-3 text-[14px] font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
                activeTab === tab.id ? "text-[#ffdf00]" : "text-white"
              }`}
            >
              {tab.id}
              {tab.badge && (
                <div className="bg-[#cc0000] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center -translate-y-2 shadow-md">
                  {tab.badge}
                </div>
              )}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="support-tab"
                  className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#ff0b0b]"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 w-full max-w-md mx-auto">
        <AnimatePresence mode="wait">
          
          {activeTab === "Support" && (
            <motion.div key="support" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col">
              
              {/* 24/7 Customer Service Header Area */}
              <div className="px-4 pt-5 pb-4 bg-[#141414] border-b border-neutral-800">
                <h2 className="text-[16px] font-bold text-white mb-1">24/7 Customer Service</h2>
                <p className="text-[12px] text-neutral-400 mb-4 leading-tight">
                  Chat with the professional customer service online to solve your problems.
                </p>
                <div className="flex gap-3">
                  <button onClick={() => window.open('https://t.me/Game8111c', '_blank')} className="flex-1 border border-[#ff0b0b] text-[#ffdf00] rounded-lg py-2.5 text-[12px] font-medium hover:bg-[#2e0505] transition-colors shadow-[0_0_10px_rgba(255,11,11,0.2)]">Customer Service</button>
                  <button onClick={() => window.open('https://t.me/Game8111c', '_blank')} className="flex-1 border border-[#ff0b0b] text-[#ffdf00] rounded-lg py-2.5 text-[12px] font-medium hover:bg-[#2e0505] transition-colors shadow-[0_0_10px_rgba(255,11,11,0.2)]">Telegram CS</button>
                </div>
              </div>

              {/* Sub Tabs */}
              <div className="flex px-4 border-b border-neutral-800 bg-[#141414]">
                <button 
                  onClick={() => setSubTab("Other Support")}
                  className={`flex items-center gap-1.5 py-3 px-2 border-b-2 transition-colors ${subTab === "Other Support" ? "border-[#ff0b0b] text-[#ffdf00]" : "border-transparent text-white"}`}
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span className="text-[13px] font-medium">Other Support</span>
                </button>
                <button 
                  onClick={() => setSubTab("Telegram Support")}
                  className={`flex items-center gap-1.5 py-3 px-4 border-b-2 transition-colors ml-4 ${subTab === "Telegram Support" ? "border-[#ff0b0b] text-[#ffdf00]" : "border-transparent text-white"}`}
                >
                  <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center"><span className="text-[10px] text-white">✈</span></div>
                  <span className="text-[13px] font-medium">Telegram Support</span>
                </button>
              </div>

              {/* Support Lines List */}
              <div className="flex flex-col bg-[#1c1c1c] mx-2 mt-2 rounded-xl border border-neutral-800 overflow-hidden shadow-lg">
                
                {subTab === "Other Support" && (
                  <>
                    {/* Line 1 */}
                    <a href="https://t.me/Game8111c" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 border-b border-neutral-800 hover:bg-white/5 transition-colors block w-full">
                      <div className="w-10 h-10 rounded-full bg-[#1da1f2] flex items-center justify-center shrink-0 shadow-md">
                        <HeadsetIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <span className="text-[11px] text-neutral-400 leading-tight">Nickname: <span className="text-white font-bold text-[13px]">Customer Service Line</span></span>
                        <div className="flex items-center gap-1">
                          <span className="text-[13px] font-bold text-white">Customer Service Line</span>
                          <span className="text-neutral-400 text-[12px]">??</span>
                        </div>
                        <span className="text-[10px] text-neutral-500">Online time: 00:00 - 23:59</span>
                      </div>
                      <div className="bg-[#cc0000] text-white font-bold text-[11px] py-1.5 px-3 rounded shadow-md hover:scale-95 transition-transform text-center shrink-0">Contact<br/>Now</div></a>

                    {/* Line 2 */}
                    <a href="https://whatsapp.com/channel/0029VbDJdVw7j6gCK3T1YG0i" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 border-b border-neutral-800 hover:bg-white/5 transition-colors block w-full">
                      <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shrink-0 shadow-md">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA" className="w-6 h-6 invert" />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <span className="text-[11px] text-neutral-400 leading-tight">Nickname: <span className="text-white font-bold text-[13px]">WhatsApp</span></span>
                        <div className="flex items-center gap-1">
                          <span className="text-[13px] font-bold text-white">WhatsApp |Channel</span>
                          <span className="text-neutral-400 text-[12px]">??</span>
                        </div>
                        <span className="text-[10px] text-neutral-500">Online time: 00:00 - 23:59</span>
                      </div>
                      <div className="bg-[#cc0000] text-white font-bold text-[11px] py-1.5 px-3 rounded shadow-md hover:scale-95 transition-transform text-center shrink-0">Contact<br/>Now</div>
                    </a>

                    {/* Line 3 */}
                    <a href="https://www.facebook.com/share/1JzvPey4hQ/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 border-b border-neutral-800 hover:bg-white/5 transition-colors block w-full">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0 shadow-md">
                        <span className="text-white font-bold text-xl font-serif">f</span>
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <span className="text-[11px] text-neutral-400 leading-tight">Nickname: <span className="text-white font-bold text-[13px]">Facebook</span></span>
                        <div className="flex items-center gap-1">
                          <span className="text-[13px] font-bold text-white">Facebook | Channel</span>
                          <span className="text-neutral-400 text-[12px]">??</span>
                        </div>
                        <span className="text-[10px] text-neutral-500">Online time: 00:00 - 23:59</span>
                      </div>
                      <div className="bg-[#cc0000] text-white font-bold text-[11px] py-1.5 px-3 rounded shadow-md hover:scale-95 transition-transform text-center shrink-0">Contact<br/>Now</div>
                    </a>

                    {/* Line 4 */}
                    <a href="https://t.me/Game8111c" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 border-b border-neutral-800 hover:bg-white/5 transition-colors block w-full">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 flex items-center justify-center shrink-0 shadow-md">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" alt="IG" className="w-5 h-5 invert" />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <span className="text-[11px] text-neutral-400 leading-tight">Nickname: <span className="text-white font-bold text-[13px]">Instagram</span></span>
                        <div className="flex items-center gap-1">
                          <span className="text-[13px] font-bold text-white">Instagram | Channel</span>
                          <span className="text-neutral-400 text-[12px]">??</span>
                        </div>
                        <span className="text-[10px] text-neutral-500">Online time: 00:00 - 23:59</span>
                      </div>
                      <div className="bg-[#cc0000] text-white font-bold text-[11px] py-1.5 px-3 rounded shadow-md hover:scale-95 transition-transform text-center shrink-0">Contact<br/>Now</div></a>

                    {/* Line 5 */}
                    <a href="https://t.me/Game8111c" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 hover:bg-white/5 transition-colors block w-full">
                      <div className="w-10 h-10 rounded-full bg-black border border-neutral-700 flex items-center justify-center shrink-0 shadow-md">
                        <span className="text-white font-bold text-xl">??</span>
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <span className="text-[11px] text-neutral-400 leading-tight">Nickname: <span className="text-white font-bold text-[13px]">Twitter</span></span>
                        <div className="flex items-center gap-1">
                          <span className="text-[13px] font-bold text-white">Twitter | Channel</span>
                          <span className="text-neutral-400 text-[12px]">??</span>
                        </div>
                        <span className="text-[10px] text-neutral-500">Online time: 00:00 - 23:59</span>
                      </div>
                      <div className="bg-[#cc0000] text-white font-bold text-[11px] py-1.5 px-3 rounded shadow-md hover:scale-95 transition-transform text-center shrink-0">Contact<br/>Now</div></a>
                  </>
                )}

                {subTab === "Telegram Support" && (
                  <>
                    {/* Line 1 */}
                    <a href="https://t.me/Game8111c" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 border-b border-neutral-800 hover:bg-white/5 transition-colors block w-full">
                      <div className="w-10 h-10 rounded-full bg-[#0088cc] flex items-center justify-center shrink-0 shadow-md">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg" alt="TG" className="w-10 h-10" />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <span className="text-[11px] text-neutral-400 leading-tight">Nickname: <span className="text-white font-bold text-[13px]">Online Customer Service</span></span>
                        <div className="flex items-center gap-1">
                          <span className="text-[13px] font-bold text-white">8111Capp</span>
                          <span className="text-neutral-400 text-[12px]">??</span>
                        </div>
                        <span className="text-[10px] text-neutral-500">Online time: 00:00 - 23:59</span>
                      </div>
                      <div className="bg-[#cc0000] text-white font-bold text-[11px] py-1.5 px-3 rounded shadow-md hover:scale-95 transition-transform text-center shrink-0">Contact<br/>Now</div></a>

                    {/* Line 2 */}
                    <a href="https://t.me/Game8111c" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 hover:bg-white/5 transition-colors block w-full">
                      <div className="w-10 h-10 rounded-full bg-[#0088cc] flex items-center justify-center shrink-0 shadow-md">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg" alt="TG" className="w-10 h-10" />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <span className="text-[11px] text-neutral-400 leading-tight">Nickname: <span className="text-white font-bold text-[13px]">Telegram</span></span>
                        <div className="flex items-center gap-1">
                          <span className="text-[13px] font-bold text-white">Telegram Channel</span>
                          <span className="text-neutral-400 text-[12px]">??</span>
                        </div>
                        <span className="text-[10px] text-neutral-500">Online time: 00:00 - 23:59</span>
                      </div>
                      <div className="bg-[#cc0000] text-white font-bold text-[11px] py-1.5 px-3 rounded shadow-md hover:scale-95 transition-transform text-center shrink-0">Contact<br/>Now</div></a>
                  </>
                )}

              </div>

              {/* Help Center */}
              <div className="bg-[#1c1c1c] mx-2 mt-4 mb-6 rounded-xl border border-neutral-800 p-4 shadow-lg flex flex-col gap-4">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-[15px] font-bold text-white shrink-0">Help Center</h3>
                  <div className="flex-1 flex items-center bg-[#111111] border border-neutral-700 rounded-full px-3 py-1.5 shadow-inner">
                    <input type="text" onKeyDown={(e) => { if(e.key === 'Enter') { toast.success('Searching knowledge base...'); e.currentTarget.value = ''; } }} placeholder="Enter your question" className="bg-transparent border-none outline-none text-[11px] text-white w-full placeholder:text-neutral-500" />
                    <Search className="w-4 h-4 text-[#ffdf00] shrink-0" />
                  </div>
                </div>
                
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  <button onClick={() => toast.success('Starting APK download...')} className="shrink-0 flex items-center gap-1.5 bg-[#cc0000] border border-[#ff0b0b] text-white text-[12px] font-bold px-3 py-1.5 rounded shadow-md hover:scale-105 transition-transform"><Download className="w-3.5 h-3.5" /> Download APP</button>
                  <button onClick={() => toast.success('Fetching Proxy FAQ...')} className="shrink-0 flex items-center gap-1.5 bg-[#141414] border border-neutral-700 text-neutral-300 hover:text-white hover:border-[#ffdf00] transition-colors hover:text-white hover:border-[#ffdf00] transition-colors text-[12px] font-medium px-3 py-1.5 rounded">
                    🤝 Proxy Problem
                  </button>
                  <button onClick={() => toast.success('Fetching Reload FAQ...')} className="shrink-0 flex items-center gap-1.5 bg-[#141414] border border-neutral-700 text-neutral-300 text-[12px] font-medium px-3 py-1.5 rounded">
                    💳 Reload Que...
                  </button>
                </div>

                <div className="mt-2">
                  <button onClick={() => toast('1. Download APK\n2. Enable Unknown Sources\n3. Install & Play', { icon: 'ðŸ“±', style: { background: '#333', color: '#fff'} })} className="w-full flex justify-between items-center text-[12px] font-medium text-white hover:text-[#ffdf00] transition-colors py-1"><span>1. APP installation steps</span><ChevronRight className="w-4 h-4 text-neutral-500" /></button>
                </div>
              </div>

            </motion.div>
          )}

          {(activeTab === "News") && (
            <motion.div key="news" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-3 pt-3 px-3 pb-8">
              {/* Filters */}
              <div className="flex gap-2 mb-2">
                <div className="bg-[#141414] border border-neutral-700 rounded-full px-3 py-1.5 flex items-center gap-1 text-neutral-400 text-[11px] shrink-0">
                  All <ChevronLeft className="w-3 h-3 -rotate-90 ml-2" />
                </div>
                <div className="bg-[#141414] border border-neutral-700 rounded-full px-3 py-1.5 flex items-center gap-1 text-neutral-400 text-[11px] shrink-0">
                  All <ChevronLeft className="w-3 h-3 -rotate-90 ml-2" />
                </div>
                <div className="flex-1 flex items-center bg-[#141414] border border-neutral-700 rounded-full px-3 py-1.5 shadow-inner">
                  <input type="text" placeholder="Search" className="bg-transparent border-none outline-none text-[11px] text-white w-full placeholder:text-neutral-500" />
                  <Search className="w-3.5 h-3.5 text-[#ffdf00] shrink-0" />
                </div>
              </div>

              {/* News List */}
              <div className="flex flex-col gap-2.5">
                {[
                  { title: "🔥 8 great benefits for referring frien...", date: "26/09/2026 00:00:00" },
                  { title: "🔥 BREAKING NEWS: Live Sports E...", date: "14/09/2026 00:00:00" },
                  { title: "🎉 Welcome to 8111C.com Platform ...", date: "13/08/2026 00:00:00" },
                  { title: "🎉 8111C grandly launches agent bet...", date: "10/08/2026 00:00:00" }
                ].map((item, i) => (
                  <div key={i} className="bg-[#1c1c1c] rounded-lg p-3 flex items-center gap-3 border border-neutral-800 shadow-md cursor-pointer hover:border-[#ff0b0b] transition-colors group">
                    <div className="relative shrink-0">
                       <FileText className="w-6 h-6 text-neutral-500 group-hover:text-[#ffdf00] transition-colors" />
                       <div className="w-2.5 h-2.5 rounded-full bg-[#cc0000] absolute -top-1 -right-1 border-2 border-[#1c1c1c]"></div>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h4 className="text-[12px] font-bold text-white truncate">{item.title}</h4>
                      <span className="text-[9px] text-neutral-500 mt-0.5">{item.date}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[12px] font-bold text-white group-hover:text-[#ffdf00] transition-colors">Unread</span>
                      <ChevronRight className="w-4 h-4 text-neutral-500" />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {(activeTab === "Notice") && (
            <motion.div key="notice" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-3 pt-3 px-3 pb-8">
              <div className="flex gap-2 mb-2">
                <div className="bg-[#141414] border border-neutral-700 rounded-full px-3 py-1.5 flex items-center gap-1 text-neutral-400 text-[11px] shrink-0">
                  All <ChevronLeft className="w-3 h-3 -rotate-90 ml-2" />
                </div>
                <div className="bg-[#141414] border border-neutral-700 rounded-full px-3 py-1.5 flex items-center gap-1 text-neutral-400 text-[11px] shrink-0">
                  All <ChevronLeft className="w-3 h-3 -rotate-90 ml-2" />
                </div>
                <div className="flex-1 flex items-center bg-[#141414] border border-neutral-700 rounded-full px-3 py-1.5 shadow-inner">
                  <input type="text" placeholder="Search" className="bg-transparent border-none outline-none text-[11px] text-white w-full placeholder:text-neutral-500" />
                  <Search className="w-3.5 h-3.5 text-[#ffdf00] shrink-0" />
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                {[
                  { title: "🌸 New User Recharge bonus ondep...", date: "23/09/2026 12:00:00" },
                  { title: "🌸 New User Recharge bonus ondep...", date: "22/09/2026 12:00:00" },
                  { title: "🎉 Huge Tuesday Bonus Waiting!", date: "22/09/2026 12:00:00" },
                  { title: "📢 EVO Live Casino Weekly Rewar...", date: "21/09/2026 12:00:00" },
                  { title: "📢 Cricket Sport Weekly Allowances...", date: "21/09/2026 08:00:00" },
                  { title: "🚀 Hey 8111C Players in Pakistan! 🎉", date: "21/09/2026 00:00:00" },
                  { title: "🌸 New User Recharge bonus ondep...", date: "20/09/2026 12:00:00" },
                  { title: "🌸 New User Recharge bonus ondep...", date: "18/09/2026 12:00:00" }
                ].map((item, i) => (
                  <div key={i} className="bg-[#1c1c1c] rounded-lg p-3 flex items-center gap-3 border border-neutral-800 shadow-md cursor-pointer hover:border-[#ff0b0b] transition-colors group">
                    <div className="relative shrink-0">
                       <MessageCircle className="w-6 h-6 fill-neutral-600 text-neutral-600 group-hover:fill-[#ffdf00] group-hover:text-[#ffdf00] transition-colors" />
                       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-0.5">
                         <div className="w-1 h-1 bg-[#1c1c1c] rounded-full"></div>
                         <div className="w-1 h-1 bg-[#1c1c1c] rounded-full"></div>
                         <div className="w-1 h-1 bg-[#1c1c1c] rounded-full"></div>
                       </div>
                       <div className="w-2.5 h-2.5 rounded-full bg-[#cc0000] absolute -top-1 -right-1 border-2 border-[#1c1c1c]"></div>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h4 className="text-[12px] font-bold text-white truncate">{item.title}</h4>
                      <span className="text-[9px] text-neutral-500 mt-0.5">{item.date}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[12px] font-bold text-white group-hover:text-[#ffdf00] transition-colors">Unread</span>
                      <ChevronRight className="w-4 h-4 text-neutral-500" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center gap-2 mt-4 pb-4">
                <button className="w-8 h-8 flex items-center justify-center rounded bg-[#cc0000] text-white font-bold text-[12px] shadow-md">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded bg-transparent border border-neutral-700 text-neutral-400 font-bold text-[12px] hover:border-[#ff0b0b] hover:text-[#ffdf00]">2</button>
                <button className="w-8 h-8 flex items-center justify-center rounded bg-transparent border border-neutral-700 text-neutral-400 font-bold text-[12px] hover:border-[#ff0b0b] hover:text-[#ffdf00]">3</button>
                <button className="w-8 h-8 flex items-center justify-center rounded bg-transparent border border-neutral-700 text-neutral-400 hover:border-[#ff0b0b] hover:text-[#ffdf00]">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {(activeTab === "Marquee") && (
            <motion.div key="marquee" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-3 pt-3 px-3 pb-8">
              <div className="flex gap-2 mb-2">
                <div className="flex-1 flex items-center bg-[#141414] border border-neutral-700 rounded-full px-3 py-1.5 shadow-inner max-w-[200px]">
                  <input type="text" placeholder="Search" className="bg-transparent border-none outline-none text-[11px] text-white w-full placeholder:text-neutral-500" />
                  <Search className="w-3.5 h-3.5 text-[#ffdf00] shrink-0" />
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                {[
                  { title: "8111c official website 【8111c.vip】 Collection ~ ..." },
                  { title: "Welcome to 8111C.com - The Premier Online ..." }
                ].map((item, i) => (
                  <div key={i} className="bg-[#1c1c1c] rounded-lg py-4 px-3 flex items-center gap-3 border border-neutral-800 shadow-md cursor-pointer hover:border-[#ff0b0b] transition-colors group">
                    <div className="shrink-0 pl-1">
                       <span className="text-xl grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all">🔊</span>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h4 className="text-[12px] font-bold text-white truncate">{item.title}</h4>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <ChevronRight className="w-4 h-4 text-neutral-500" />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
          
        </AnimatePresence>
      </div>

      <BottomNav activeTab="support" />
    </main>
  );
}

// Simple internal icon since lucide doesn't have an exact matching headset with speech bubble
function HeadsetIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
    </svg>
  );
}



