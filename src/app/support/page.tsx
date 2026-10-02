"use client";
import toast from "react-hot-toast";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MessageCircle, Download, HelpCircle, FileText, Search, Settings, X } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import LiveChatPopup from "@/components/LiveChatPopup";
import { motion, AnimatePresence } from "framer-motion";

const INITIAL_NEWS = [
  { id: 'n1', title: "🔥 8 great benefits for referring friends", date: "26/09/2026 00:00:00", read: false, content: "Invite friends and get up to 8 amazing benefits! For every friend who signs up and recharges, you get exclusive bonuses and daily rebate boosts." },
  { id: 'n2', title: "🔥 BREAKING NEWS: Live Sports Event", date: "14/09/2026 00:00:00", read: false, content: "The UEFA Champions League finals are here! Bet on your favorite team with 0% margin and get extra cashback if they win." },
  { id: 'n3', title: "🎉 Welcome to 8111C.com Platform", date: "13/08/2026 00:00:00", read: false, content: "Welcome to 8111C, the best online casino platform. Enjoy thousands of games from top providers, instant withdrawals, and 24/7 customer support." },
  { id: 'n4', title: "🎉 8111C grandly launches agent bet...", date: "10/08/2026 00:00:00", read: false, content: "Become an agent today and earn commission for life! We provide the best rates in the industry, up to 55% revenue share." }
];

const INITIAL_NOTICES = [
  { id: 'no1', title: "🌸 New User Recharge bonus", date: "23/09/2026 12:00:00", read: false, content: "New users who recharge for the first time will receive a 100% bonus up to 10,000 RS. Claim it in the Offer Center!" },
  { id: 'no2', title: "🌸 New VIP tier system update", date: "22/09/2026 12:00:00", read: false, content: "We've updated our VIP system. You can now level up faster by playing slot games. Enjoy higher withdrawal limits and personal account managers." },
  { id: 'no3', title: "🎉 Huge Tuesday Bonus Waiting!", date: "22/09/2026 12:00:00", read: false, content: "Log in today and spin the Lucky Wheel for a chance to win up to 50,000 RS! Every Tuesday brings massive rewards." },
  { id: 'no4', title: "📢 EVO Live Casino Weekly Rewards", date: "21/09/2026 12:00:00", read: false, content: "Play Evolution Gaming live tables this week and get a 5% rebate on all your bets, automatically credited every Monday." },
  { id: 'no5', title: "📢 Cricket Sport Weekly Allowances", date: "21/09/2026 08:00:00", read: false, content: "Get a free 500 RS bet on any Cricket match every weekend. Valid for all users with a minimum deposit history." },
  { id: 'no6', title: "🚀 Hey 8111C Players in Pakistan! 🎉", date: "21/09/2026 00:00:00", read: false, content: "We have fully integrated EasyPaisa and JazzCash for instant deposits and withdrawals. Enjoy seamless transactions!" },
  { id: 'no7', title: "🌸 System Maintenance Complete", date: "20/09/2026 12:00:00", read: false, content: "Our scheduled maintenance is complete. All systems are operational and faster than ever." },
  { id: 'no8', title: "🌸 Withdrawal Limit Increased", date: "18/09/2026 12:00:00", read: false, content: "Due to popular demand, we have increased the daily withdrawal limit for all VIP 3+ members." }
];

const INITIAL_MARQUEE = [
  { id: 'm1', title: "8111c official website 【 8111c.vip 】 Collection ~ ...", read: false, content: "Bookmark our official domains: 8111c.com, 8111c.vip. Beware of fake sites!" },
  { id: 'm2', title: "Welcome to 8111C.com - The Premier Online ...", read: false, content: "Play responsibly and enjoy the best gaming experience with 8111C." }
];


export default function SupportPage() {
  const [activeTab, setActiveTab] = useState("Support");
  const [subTab, setSubTab] = useState("Other Support");

  const [news, setNews] = useState(INITIAL_NEWS);
  const [notices, setNotices] = useState(INITIAL_NOTICES);
  const [marquees, setMarquees] = useState(INITIAL_MARQUEE);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [showLiveChat, setShowLiveChat] = useState(false);

  const unreadNews = news.filter(n => !n.read).length;
  const unreadNotices = notices.filter(n => !n.read).length;

  const tabs = [
    { id: "Support", badge: null },
    { id: "News", badge: unreadNews > 0 ? unreadNews : null },
    { id: "Notice", badge: unreadNotices > 0 ? unreadNotices : null },
    { id: "Marquee", badge: null }
  ];

  const handleMessageClick = (msg: any, type: string) => {
    setSelectedMessage({ ...msg, type });
    if (type === 'news') {
      setNews(news.map(n => n.id === msg.id ? { ...n, read: true } : n));
    } else if (type === 'notice') {
      setNotices(notices.map(n => n.id === msg.id ? { ...n, read: true } : n));
    } else if (type === 'marquee') {
      setMarquees(marquees.map(n => n.id === msg.id ? { ...n, read: true } : n));
    }
  };

  const filteredNews = news.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredNotices = notices.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredMarquees = marquees.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <main className="flex flex-col min-h-screen bg-[#0a0a0a] text-white font-sans pb-20 relative">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#141414] border-b border-neutral-800">
        <div className="flex items-center h-14 px-4">
          <Link href="/" className="w-8 h-8 flex items-center justify-center -ml-2 rounded-full hover:bg-white/10 transition-colors">
            <ChevronLeft className="w-6 h-6 text-neutral-400" />
          </Link>
          <div className="flex-1 text-center font-bold text-[16px] text-white">Message Center</div>
          <div className="w-8 h-8 flex items-center justify-center -mr-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer">
            <Settings className="w-5 h-5 text-neutral-400" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-2 overflow-x-auto no-scrollbar border-b border-neutral-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSearchQuery(""); }}
              className={`relative px-5 py-3 text-[14px] font-bold whitespace-nowrap transition-colors ${
                activeTab === tab.id ? "text-[#ffdf00]" : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              {tab.id}
              {tab.badge && (
                <span className="absolute top-2 right-1 bg-[#ff0b0b] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                  {tab.badge}
                </span>
              )}
              {activeTab === tab.id && (
                <motion.div layoutId="supportTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ff0b0b]" />
              )}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar relative">
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
                  <button onClick={() => setShowLiveChat(true)} className="flex-1 border border-[#ff0b0b] text-[#ffdf00] rounded-lg py-2.5 text-[12px] font-medium hover:bg-[#2e0505] transition-colors shadow-[0_0_10px_rgba(255,11,11,0.2)]">Customer Service</button>
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
                  <div className="flex flex-col p-2 space-y-3">
                    {/* Live Chat */}
                    <button onClick={() => setShowLiveChat(true)} className="w-full relative rounded-xl overflow-hidden hover:scale-[1.02] transition-transform active:scale-95 shadow-lg border border-neutral-800 bg-black flex flex-col">
                      <div className="w-full bg-black flex items-center justify-center p-2">
                        <img src="/support/livechat.jpg" alt="Live Chat" className="w-full h-[140px] object-cover rounded-lg" />
                      </div>
                      <div className="w-full bg-[#cc0000] py-2 text-center text-white font-bold text-[14px]">
                        Contact Live Support
                      </div>
                    </button>

                    {/* WhatsApp */}
                    <a href="https://whatsapp.com/channel/0029VbDJdVw7j6gCK3T1YG0i" target="_blank" rel="noopener noreferrer" className="w-full relative rounded-xl overflow-hidden hover:scale-[1.02] transition-transform active:scale-95 shadow-lg border border-neutral-800 bg-black flex flex-col">
                      <div className="w-full bg-black flex items-center justify-center p-2">
                        <img src="/support/whatsapp.jpg" alt="WhatsApp" className="w-full h-[140px] object-cover rounded-lg" />
                      </div>
                      <div className="w-full bg-[#25D366] py-2 text-center text-white font-bold text-[14px]">
                        WhatsApp Channel
                      </div>
                    </a>

                    {/* Facebook */}
                    <a href="https://www.facebook.com/share/1JzvPey4hQ/" target="_blank" rel="noopener noreferrer" className="w-full relative rounded-xl overflow-hidden hover:scale-[1.02] transition-transform active:scale-95 shadow-lg border border-neutral-800 bg-black flex flex-col">
                      <div className="w-full bg-black flex items-center justify-center p-2">
                        <img src="/support/facebook.jpg" alt="Facebook" className="w-full h-[140px] object-cover rounded-lg" />
                      </div>
                      <div className="w-full bg-[#1877F2] py-2 text-center text-white font-bold text-[14px]">
                        Facebook Channel
                      </div>
                    </a>
                  </div>
                )}
                {subTab === "Telegram Support" && (
                  <>
                    {/* Line 1 */}
                    <a href="https://t.me/Game8111c" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 border-b border-neutral-800 hover:bg-white/5 transition-colors w-full">
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
                    <a href="https://t.me/Game8111c" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 hover:bg-white/5 transition-colors w-full">
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
                  <button onClick={() => window.location.href = '/8111c.apk'} className="shrink-0 flex items-center gap-1.5 bg-[#cc0000] border border-[#ff0b0b] text-white text-[12px] font-bold px-3 py-1.5 rounded shadow-md hover:scale-105 transition-transform"><Download className="w-3.5 h-3.5" /> Download APP</button>
                  <button onClick={() => toast.success('Fetching Proxy FAQ...')} className="shrink-0 flex items-center gap-1.5 bg-[#141414] border border-neutral-700 text-neutral-300 hover:text-white hover:border-[#ffdf00] transition-colors text-[12px] font-medium px-3 py-1.5 rounded">
                    🤝 Proxy Problem
                  </button>
                  <button onClick={() => toast.success('Fetching Reload FAQ...')} className="shrink-0 flex items-center gap-1.5 bg-[#141414] border border-neutral-700 text-neutral-300 hover:text-white hover:border-[#ffdf00] transition-colors text-[12px] font-medium px-3 py-1.5 rounded">
                    💳 Reload Que...
                  </button>
                </div>

                <div className="mt-2">
                  <button onClick={() => toast('1. Download APK\\n2. Enable Unknown Sources\\n3. Install & Play', { icon: '📱', style: { background: '#333', color: '#fff'} })} className="w-full flex justify-between items-center text-[12px] font-medium text-white hover:text-[#ffdf00] transition-colors py-1"><span>1. APP installation steps</span><ChevronRight className="w-4 h-4 text-neutral-500" /></button>
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
                <div className="flex-1 flex items-center bg-[#141414] border border-neutral-700 rounded-full px-3 py-1.5 shadow-inner focus-within:ring-1 focus-within:ring-[#ffdf00] transition-all">
                  <input type="text" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent border-none outline-none text-[11px] text-white w-full placeholder:text-neutral-500" />
                  <Search className="w-3.5 h-3.5 text-[#ffdf00] shrink-0" />
                </div>
              </div>

              {/* News List */}
              <div className="flex flex-col gap-2.5">
                {filteredNews.map((item) => (
                  <div key={item.id} onClick={() => handleMessageClick(item, 'news')} className="bg-[#1c1c1c] rounded-lg p-3 flex items-center gap-3 border border-neutral-800 shadow-md cursor-pointer hover:border-[#ff0b0b] transition-colors group">
                    <div className="relative shrink-0">
                       <FileText className={`w-6 h-6 transition-colors ${item.read ? 'text-neutral-600' : 'text-neutral-400 group-hover:text-[#ffdf00]'}`} />
                       {!item.read && <div className="w-2.5 h-2.5 rounded-full bg-[#cc0000] absolute -top-1 -right-1 border-2 border-[#1c1c1c]"></div>}
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h4 className={`text-[12px] font-bold truncate ${item.read ? 'text-neutral-400' : 'text-white'}`}>{item.title}</h4>
                      <span className="text-[9px] text-neutral-500 mt-0.5">{item.date}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className={`text-[12px] font-bold transition-colors ${item.read ? 'text-neutral-600' : 'text-white group-hover:text-[#ffdf00]'}`}>{item.read ? 'Read' : 'Unread'}</span>
                      <ChevronRight className="w-4 h-4 text-neutral-500" />
                    </div>
                  </div>
                ))}
                {filteredNews.length === 0 && (
                  <div className="text-center text-neutral-500 text-[12px] mt-4">No news found</div>
                )}
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
                <div className="flex-1 flex items-center bg-[#141414] border border-neutral-700 rounded-full px-3 py-1.5 shadow-inner focus-within:ring-1 focus-within:ring-[#ffdf00] transition-all">
                  <input type="text" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent border-none outline-none text-[11px] text-white w-full placeholder:text-neutral-500" />
                  <Search className="w-3.5 h-3.5 text-[#ffdf00] shrink-0" />
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                {filteredNotices.map((item) => (
                  <div key={item.id} onClick={() => handleMessageClick(item, 'notice')} className="bg-[#1c1c1c] rounded-lg p-3 flex items-center gap-3 border border-neutral-800 shadow-md cursor-pointer hover:border-[#ff0b0b] transition-colors group">
                    <div className="relative shrink-0">
                       <MessageCircle className={`w-6 h-6 fill-neutral-600 transition-colors ${item.read ? 'text-neutral-600' : 'text-neutral-400 group-hover:fill-[#ffdf00] group-hover:text-[#ffdf00]'}`} />
                       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-0.5">
                         <div className="w-1 h-1 bg-[#1c1c1c] rounded-full"></div>
                         <div className="w-1 h-1 bg-[#1c1c1c] rounded-full"></div>
                         <div className="w-1 h-1 bg-[#1c1c1c] rounded-full"></div>
                       </div>
                       {!item.read && <div className="w-2.5 h-2.5 rounded-full bg-[#cc0000] absolute -top-1 -right-1 border-2 border-[#1c1c1c]"></div>}
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h4 className={`text-[12px] font-bold truncate ${item.read ? 'text-neutral-400' : 'text-white'}`}>{item.title}</h4>
                      <span className="text-[9px] text-neutral-500 mt-0.5">{item.date}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className={`text-[12px] font-bold transition-colors ${item.read ? 'text-neutral-600' : 'text-white group-hover:text-[#ffdf00]'}`}>{item.read ? 'Read' : 'Unread'}</span>
                      <ChevronRight className="w-4 h-4 text-neutral-500" />
                    </div>
                  </div>
                ))}
                {filteredNotices.length === 0 && (
                  <div className="text-center text-neutral-500 text-[12px] mt-4">No notices found</div>
                )}
              </div>
            </motion.div>
          )}

          {(activeTab === "Marquee") && (
            <motion.div key="marquee" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-3 pt-3 px-3 pb-8">
              <div className="flex gap-2 mb-2">
                <div className="flex-1 flex items-center bg-[#141414] border border-neutral-700 rounded-full px-3 py-1.5 shadow-inner w-full focus-within:ring-1 focus-within:ring-[#ffdf00] transition-all">
                  <input type="text" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent border-none outline-none text-[11px] text-white w-full placeholder:text-neutral-500" />
                  <Search className="w-3.5 h-3.5 text-[#ffdf00] shrink-0" />
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                {filteredMarquees.map((item) => (
                  <div key={item.id} onClick={() => handleMessageClick(item, 'marquee')} className="bg-[#1c1c1c] rounded-lg py-4 px-3 flex items-center gap-3 border border-neutral-800 shadow-md cursor-pointer hover:border-[#ff0b0b] transition-colors group">
                    <div className="shrink-0 pl-1">
                       <span className={`text-xl transition-all ${item.read ? 'grayscale opacity-30' : 'grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100'}`}>🔊</span>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h4 className={`text-[12px] font-bold truncate ${item.read ? 'text-neutral-500' : 'text-white'}`}>{item.title}</h4>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <ChevronRight className="w-4 h-4 text-neutral-500" />
                    </div>
                  </div>
                ))}
                {filteredMarquees.length === 0 && (
                  <div className="text-center text-neutral-500 text-[12px] mt-4">No marquees found</div>
                )}
              </div>
            </motion.div>
          )}
          
        </AnimatePresence>
      </div>

      <BottomNav activeTab="support" />

      {/* Message Viewer Modal */}
      <AnimatePresence>
        {selectedMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 50 }} 
            className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[400px] z-50 bg-[#0a0a0a] flex flex-col"
          >
            <div className="flex items-center h-14 px-4 bg-[#141414] border-b border-neutral-800">
              <div onClick={() => setSelectedMessage(null)} className="w-8 h-8 flex items-center justify-center -ml-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer">
                <ChevronLeft className="w-6 h-6 text-neutral-400" />
              </div>
              <div className="flex-1 text-center font-bold text-[16px] text-white capitalize">{selectedMessage.type} Details</div>
              <div className="w-8 h-8"></div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              <h2 className="text-[18px] font-bold text-[#ffdf00] leading-snug">{selectedMessage.title}</h2>
              {selectedMessage.date && <p className="text-[11px] text-neutral-500 border-b border-neutral-800 pb-3">{selectedMessage.date}</p>}
              <div className="text-[14px] text-neutral-200 leading-relaxed whitespace-pre-wrap">
                {selectedMessage.content}
              </div>
            </div>
            <div className="p-4 bg-[#141414] border-t border-neutral-800">
              <button onClick={() => setSelectedMessage(null)} className="w-full bg-[#cc0000] text-white font-bold rounded-lg py-3 hover:bg-[#ff0b0b] transition-colors shadow-lg">
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {showLiveChat && <LiveChatPopup onClose={() => setShowLiveChat(false)} />}
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




