"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { ChevronLeft, Share, Copy, Calendar } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { motion, AnimatePresence } from "framer-motion";

export default function InvitePage() {
  const [activeTab, setActiveTab] = useState("Home");
  const tabs = ["Home", "Promotion Sharing", "My Data", "Performance", "Commission", "Subordinate Information", "Subordinate Betting", "Subordinate Finance", "Subordinate claim", "Commission Rate"];
  
  const [dateModalOpen, setDateModalOpen] = useState(false);
  const [rateTab, setRateTab] = useState("Mini Games");

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
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className="text-[14px]">🏆</span>
                    <span className="text-neutral-400">Agent ID:</span>
                    <span className="font-bold text-white">63****115</span>
                    <span className="text-neutral-400 ml-1">Commission earned today:</span>
                    <span className="text-[#ffdf00] font-bold">249,714.13</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className="text-[14px]">🔥</span>
                    <span className="text-neutral-400">Agent ID:</span>
                    <span className="font-bold text-white">34****980</span>
                    <span className="text-neutral-400 ml-1">Commission earned today:</span>
                    <span className="text-[#ffdf00] font-bold">19,486.07</span>
                  </div>
                </div>
              </div>

              {/* Banner Carousel */}
              <div className="px-3 mt-1">
                <div className="w-full aspect-[21/9] rounded-xl overflow-hidden relative border border-[#ff0b0b] shadow-[0_0_15px_rgba(255,11,11,0.2)]">
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10 flex flex-col justify-center px-4">
                    <img src="/splash-logo.png" alt="Logo" className="h-4 w-auto mb-2 mix-blend-screen opacity-90 object-left object-contain" />
                    <h2 className="text-[#ffdf00] text-lg font-black tracking-tighter italic">Invitation Event</h2>
                    <p className="text-white text-xs mt-1 leading-tight">Each player you invite<br/>Get <span className="text-[#ffdf00] font-bold text-sm">Rs 10,000</span></p>
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
                    <span className="text-neutral-500 font-bold">-</span>
                    <div className="flex flex-col items-end">
                      <span className="text-neutral-500 text-[11px]">Number of audits</span>
                      <span className="text-white text-[13px] font-bold">-</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="bg-[#2a1b05] border border-[#ffdf00]/30 text-[#ffdf00] text-[10px] px-2 py-0.5 rounded shadow-inner">
                      Infinite range
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-neutral-500 text-[11px]">Settlement cycle</span>
                      <span className="text-white text-[13px] font-bold">Daily settlement</span>
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
                      <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://8111C.com" alt="QR" className="w-full h-full" />
                    </div>
                    <button onClick={() => toast.success("Invitation saved to gallery!")} className="w-full bg-[#cc0000] text-white text-[10px] font-bold py-1.5 rounded text-center leading-tight shadow-md hover:bg-[#ff0b0b]">
                      Save<br/>invitation...
                    </button>
                  </div>

                  {/* Links & Socials Section */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex items-center bg-[#111111] border border-neutral-700 rounded-lg p-2 h-9 shadow-inner">
                      <span className="flex-1 text-[11px] text-neutral-400 truncate">https://8111C.com/invite</span>
                      <div className="h-4 w-[1px] bg-neutral-700 mx-2"></div>
                      <Copy onClick={() => { navigator.clipboard.writeText("https://8111C.com/invite"); toast.success("Link copied!"); }} className="w-4 h-4 text-[#ffdf00] cursor-pointer" />
                    </div>
                    
                    <div className="flex justify-between items-center mt-3 px-1">
                      <div onClick={() => navigator.share ? navigator.share({title: "Join 8111C", url: "https://8111C.com/invite"}) : toast.success("Opening share dialog...")} className="flex flex-col items-center gap-1 cursor-pointer">
                        <div className="w-9 h-9 rounded-full border border-neutral-700 flex items-center justify-center text-[#ffdf00]">
                          <Share className="w-4 h-4" />
                        </div>
                        <span className="text-[9px] text-neutral-400">Share</span>
                      </div>
                      <div onClick={() => window.open("https://wa.me/?text=Join%20me%20on%208111C!%20https://8111C.com/invite", "_blank")} className="flex flex-col items-center gap-1 cursor-pointer">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA" className="w-9 h-9" />
                        <span className="text-[9px] text-neutral-400">WhatsApp</span>
                      </div>
                      <div onClick={() => window.open("https://t.me/share/url?url=https://8111C.com/invite&text=Join%20me!", "_blank")} className="flex flex-col items-center gap-1 cursor-pointer">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg" alt="TG" className="w-9 h-9" />
                        <span className="text-[9px] text-neutral-400">Telegram</span>
                      </div>
                      <div onClick={() => window.open("https://www.facebook.com/sharer/sharer.php?u=https://8111C.com/invite", "_blank")} className="flex flex-col items-center gap-1 cursor-pointer">
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
                      <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://8111C.com" alt="QR" className="w-full h-full" />
                    </div>
                    <button onClick={() => toast.success("Invitation saved to gallery!")} className="w-full bg-[#cc0000] text-white text-[9px] font-bold py-1.5 rounded text-center leading-tight shadow-md hover:bg-[#ff0b0b]">
                      Save<br/>invitation...
                    </button>
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex items-center bg-[#111111] border border-neutral-700 rounded-lg p-2 h-9 shadow-inner">
                      <span className="flex-1 text-[11px] text-neutral-400 truncate">https://8111C.com/invite</span>
                      <div className="h-4 w-[1px] bg-neutral-700 mx-2"></div>
                      <Copy onClick={() => { navigator.clipboard.writeText("https://8111C.com/invite"); toast.success("Link copied!"); }} className="w-4 h-4 text-[#ffdf00] cursor-pointer" />
                    </div>
                    <div className="flex justify-between items-center mt-3 px-1">
                      <div onClick={() => navigator.share ? navigator.share({title: "Join 8111C", url: "https://8111C.com/invite"}) : toast.success("Opening share dialog...")} className="flex flex-col items-center gap-1 cursor-pointer">
                        <div className="w-8 h-8 rounded-full border border-neutral-700 flex items-center justify-center text-[#ffdf00]"><Share className="w-3.5 h-3.5" /></div>
                        <span className="text-[8px] text-neutral-400">Share</span>
                      </div>
                      <div onClick={() => window.open("https://wa.me/?text=Join%20me%20on%208111C!%20https://8111C.com/invite", "_blank")} className="flex flex-col items-center gap-1 cursor-pointer">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA" className="w-8 h-8" />
                        <span className="text-[8px] text-neutral-400">WhatsApp</span>
                      </div>
                      <div onClick={() => window.open("https://t.me/share/url?url=https://8111C.com/invite&text=Join%20me!", "_blank")} className="flex flex-col items-center gap-1 cursor-pointer">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg" alt="TG" className="w-8 h-8" />
                        <span className="text-[8px] text-neutral-400">Telegram</span>
                      </div>
                      <div onClick={() => window.open("https://www.facebook.com/sharer/sharer.php?u=https://8111C.com/invite", "_blank")} className="flex flex-col items-center gap-1 cursor-pointer">
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
                  {/* Decorative glowing lines to simulate tree */}
                  <div className="absolute w-[2px] h-32 bg-[#ff0b0b] top-4 shadow-[0_0_8px_rgba(255,11,11,0.8)]"></div>
                  <div className="absolute w-[60%] h-[2px] bg-[#ff0b0b] top-12 shadow-[0_0_8px_rgba(255,11,11,0.8)]"></div>
                  <div className="absolute w-[2px] h-32 bg-[#ffdf00] top-4 left-[20%] shadow-[0_0_8px_rgba(255,223,0,0.8)]"></div>
                  <div className="absolute w-[2px] h-32 bg-[#ffdf00] top-4 right-[20%] shadow-[0_0_8px_rgba(255,223,0,0.8)]"></div>
                  
                  {/* Nodes mockup */}
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
                {["Today", "Yesterday", "This Week", "Last Week", "This Month"].map((btn, i) => (
                  <button key={i} className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[12px] font-medium transition-colors border ${i === 0 ? "bg-[#cc0000] border-[#cc0000] text-white shadow-md" : "bg-[#141414] border-neutral-700 text-neutral-400"}`}>
                    {btn}
                  </button>
                ))}
              </div>

              {/* Commission Card */}
              <div className="px-3">
                <div className="bg-[#141414] rounded-xl p-4 flex flex-col gap-3 border border-neutral-800 shadow-lg">
                  <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
                    <h3 className="text-[14px] font-bold text-white">Today Commission</h3>
                    <div className="flex flex-col items-end">
                      <span className="text-[14px] font-bold text-white">-</span>
                      <span className="text-[10px] text-neutral-500">(Total commission -)</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2.5 text-[12px]">
                    <div className="flex justify-between text-neutral-300">
                      <span>Direct commission</span>
                      <span>-</span>
                    </div>
                    <div className="flex justify-between text-neutral-300">
                      <span>Other commission</span>
                      <span>-</span>
                    </div>
                    <div className="flex justify-between text-neutral-300">
                      <span>Promotional event rewards</span>
                      <span>-</span>
                    </div>
                    <div className="flex justify-between text-neutral-300">
                      <span>Agent activity rewards</span>
                      <span>-</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-3 mt-1 pb-8">
                <h3 className="text-[14px] font-bold text-white text-center mb-3">All Data</h3>
                
                <div className="flex flex-col gap-3">
                  {[
                    { title: "Total new users", sub1: "Subordinate Stats", sub2: "Other Stats" },
                    { title: "Total deposit (Users)", sub1: "Subordinate Stats", sub2: "Other Stats" },
                    { title: "Total first charge (Number of people)", sub1: "Subordinate Stats", sub2: "Other Stats" },
                    { title: "Same-day reg. first-deposit (Number of people)", sub1: "Subordinate Stats", sub2: "Other Stats" }
                  ].map((item, i) => (
                    <div key={i} className="bg-[#141414] rounded-xl p-4 flex flex-col gap-3 border border-neutral-800 shadow-md">
                      <div className="flex justify-between items-start">
                        <span className="text-[13px] font-bold text-white w-2/3">{item.title}</span>
                        <span className="text-[13px] font-bold text-white">-</span>
                      </div>
                      <div className="flex flex-col gap-1 text-[11px] text-neutral-500">
                        <div className="flex justify-between">
                          <span>{item.sub1}</span>
                          <span>-</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{item.sub2}</span>
                          <span>-</span>
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
                Today <ChevronLeft className="w-3.5 h-3.5 rotate-90" />
              </button>

              <div className="flex-1 flex items-center justify-center pt-20 pb-40">
                <p className="text-neutral-500 text-sm">No data available</p>
              </div>

              {/* Date Modal Overlay */}
              <AnimatePresence>
                {dateModalOpen && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
                  >
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                      className="w-full max-w-sm bg-[#1c1c1c] rounded-2xl border border-neutral-800 p-4 shadow-2xl flex flex-col gap-4"
                    >
                      <div className="grid grid-cols-3 gap-2">
                        {["Today", "Yesterday", "This Week", "Last Week", "This Month", "Last Month"].map((btn, i) => (
                          <button key={i} className={`py-2 text-[11px] rounded-lg font-bold border transition-colors ${i === 0 ? "border-[#ff0b0b] text-[#ffdf00] shadow-[0_0_8px_rgba(255,11,11,0.2)] bg-[#2e0505]" : "border-neutral-800 text-white hover:bg-neutral-800"}`}>
                            {btn}
                          </button>
                        ))}
                      </div>
                      <button className="py-2 text-[11px] rounded-lg font-bold border border-neutral-800 text-white hover:bg-neutral-800 w-1/3">
                        All
                      </button>

                      <div className="mt-2">
                        <h4 className="text-[12px] font-bold text-white mb-2">Custom</h4>
                        <div className="flex gap-4">
                          <div className="flex-1 flex flex-col items-center">
                            <span className="text-[11px] text-neutral-400 mb-2">Start Date</span>
                            <div className="h-20 overflow-hidden w-full relative flex flex-col items-center justify-center text-white border-y border-neutral-700">
                              <div className="absolute inset-0 bg-gradient-to-b from-[#1c1c1c] via-transparent to-[#1c1c1c] pointer-events-none z-10"></div>
                              <div className="text-[13px] opacity-30 my-1">22 &nbsp;&nbsp; 07</div>
                              <div className="text-[13px] opacity-60 my-1">23 &nbsp;&nbsp; 08</div>
                              <div className="text-[15px] font-bold my-1 text-[#ffdf00]">24 &nbsp;&nbsp; 09 &nbsp;&nbsp; 2026</div>
                            </div>
                          </div>
                          <div className="flex-1 flex flex-col items-center">
                            <span className="text-[11px] text-neutral-400 mb-2">End Date</span>
                            <div className="h-20 overflow-hidden w-full relative flex flex-col items-center justify-center text-white border-y border-neutral-700">
                              <div className="absolute inset-0 bg-gradient-to-b from-[#1c1c1c] via-transparent to-[#1c1c1c] pointer-events-none z-10"></div>
                              <div className="text-[15px] font-bold my-1 text-[#ffdf00] mt-auto mb-2">24 &nbsp;&nbsp; 09 &nbsp;&nbsp; 2026</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 mt-4">
                        <button onClick={() => setDateModalOpen(false)} className="flex-1 py-3 rounded-xl border border-[#ff0b0b] text-[#ffdf00] font-bold text-[13px] hover:bg-[#2e0505] transition-colors">
                          Cancel
                        </button>
                        <button onClick={() => setDateModalOpen(false)} className="flex-1 py-3 rounded-xl bg-[#cc0000] text-white font-bold text-[13px] hover:bg-[#ff0b0b] transition-colors shadow-lg">
                          Confirm
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {(activeTab === "Commission") && (
            <motion.div key="commission" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-3 pt-3 px-3 pb-8">
              <div className="text-[12px] text-neutral-400 px-2 pb-2 border-b border-neutral-800">
                Settlement cycle <span className="text-white">-</span>
              </div>
              
              <button 
                onClick={() => setDateModalOpen(true)}
                className="self-start border border-[#ff0b0b] rounded-full px-4 py-1.5 flex items-center gap-1.5 text-[#ffdf00] text-[11px] hover:bg-[#2e0505] transition-colors"
              >
                Today <ChevronLeft className="w-3.5 h-3.5 rotate-90" />
              </button>

              <div className="flex-1 flex items-center justify-center pt-20 pb-40">
                <p className="text-neutral-500 text-sm">No data available</p>
              </div>
            </motion.div>
          )}

          {(activeTab === "Subordinate Information") && (
            <motion.div key="sub-info" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-3 pt-3 px-3 pb-8">
              <div className="flex gap-2 mb-4">
                <button className="border border-neutral-700 rounded-full px-3 py-1 flex items-center gap-1 text-neutral-300 text-[11px]">
                  Today <ChevronLeft className="w-3 h-3 rotate-90" />
                </button>
                <button onClick={() => toast.success("Sorting applied")} className="border border-neutral-700 rounded-full px-3 py-1 flex items-center gap-1 text-neutral-300 text-[11px]">
                  Sort by login date <ChevronLeft className="w-3 h-3 rotate-90" />
                </button>
                <button onClick={() => toast("Search feature coming soon")} className="border border-neutral-700 rounded-full px-3 py-1 flex items-center justify-between flex-1 text-neutral-500 text-[11px]">
                  Member ID
                  <span className="text-[#ffdf00]">🔍</span>
                </button>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center pt-24 pb-40 gap-4 opacity-50">
                <div className="w-24 h-24 bg-neutral-800 rounded-2xl flex items-center justify-center relative shadow-inner">
                   {/* Empty box graphic mockup */}
                   <div className="absolute top-2 right-2 text-3xl opacity-20 -rotate-12">✈️</div>
                   <div className="w-16 h-12 bg-neutral-700 rounded-lg border-t-2 border-neutral-600"></div>
                </div>
                <div className="flex items-center gap-2 text-neutral-500 text-[13px]">
                  No content yet <span className="text-[#ffdf00]">↻</span>
                </div>
              </div>
            </motion.div>
          )}

          {(activeTab === "Subordinate Betting") && (
            <motion.div key="sub-betting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-3 pt-3 px-3 pb-8 relative">
              <div className="flex gap-2 mb-4">
                <button className="border border-neutral-700 rounded-full px-3 py-1 flex items-center gap-1 text-neutral-300 text-[11px]">
                  Today <ChevronLeft className="w-3 h-3 rotate-90" />
                </button>
                <button onClick={() => toast.success("Dropdown opened")} className="border border-[#ffdf00] rounded-full px-3 py-1 flex items-center gap-1 text-[#ffdf00] text-[11px] bg-[#2e0505]">
                  Valid bet sorting <ChevronLeft className="w-3 h-3 -rotate-90" />
                </button>
                <button onClick={() => toast("Search feature coming soon")} className="border border-neutral-700 rounded-full px-3 py-1 flex items-center justify-between flex-1 text-neutral-500 text-[11px]">
                  Member ID
                  <span className="text-[#ffdf00]">🔍</span>
                </button>
              </div>
              
              {/* Dropdown Menu Mockup */}
              <div className="absolute top-12 left-24 w-48 bg-[#1c1c1c] rounded-xl border border-neutral-700 p-2 shadow-2xl z-20 flex flex-col">
                 <button className="text-left px-3 py-2 text-[#ffdf00] font-bold text-[12px]">Valid bet sorting</button>
                 <button className="text-left px-3 py-2 text-neutral-400 text-[12px] leading-tight hover:bg-neutral-800 rounded-lg">Cumulative win and loss sorting</button>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center pt-24 pb-40 gap-4 opacity-50">
                <div className="w-24 h-24 bg-neutral-800 rounded-2xl flex items-center justify-center relative shadow-inner">
                   <div className="absolute top-2 right-2 text-3xl opacity-20 -rotate-12">✈️</div>
                   <div className="w-16 h-12 bg-neutral-700 rounded-lg border-t-2 border-neutral-600"></div>
                </div>
                <div className="flex items-center gap-2 text-neutral-500 text-[13px]">
                  No content yet <span className="text-[#ffdf00]">↻</span>
                </div>
              </div>
            </motion.div>
          )}

          {(activeTab === "Subordinate Finance") && (
            <motion.div key="sub-finance" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-3 pt-3 px-3 pb-8">
              <div className="flex gap-2 mb-4">
                <button className="border border-neutral-700 rounded-full px-3 py-1 flex items-center gap-1 text-neutral-300 text-[11px]">
                  Today <ChevronLeft className="w-3 h-3 rotate-90" />
                </button>
                <button onClick={() => toast.success("Sorting applied")} className="border border-neutral-700 rounded-full px-3 py-1 flex items-center gap-1 text-neutral-300 text-[11px]">
                  Sort by recharge... <ChevronLeft className="w-3 h-3 rotate-90" />
                </button>
                <button onClick={() => toast("Search feature coming soon")} className="border border-neutral-700 rounded-full px-3 py-1 flex items-center justify-between flex-1 text-neutral-500 text-[11px]">
                  Member ID
                  <span className="text-[#ffdf00]">🔍</span>
                </button>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center pt-24 pb-40 gap-4 opacity-50">
                <div className="w-24 h-24 bg-neutral-800 rounded-2xl flex items-center justify-center relative shadow-inner">
                   <div className="absolute top-2 right-2 text-3xl opacity-20 -rotate-12">✈️</div>
                   <div className="w-16 h-12 bg-neutral-700 rounded-lg border-t-2 border-neutral-600"></div>
                </div>
                <div className="flex items-center gap-2 text-neutral-500 text-[13px]">
                  No content yet <span className="text-[#ffdf00]">↻</span>
                </div>
              </div>
            </motion.div>
          )}

          {(activeTab === "Subordinate claim") && (
            <motion.div key="sub-claim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-3 pt-3 px-3 pb-8">
              <div className="flex gap-2 mb-4">
                <button className="border border-neutral-700 rounded-full px-3 py-1 flex items-center gap-1 text-neutral-300 text-[11px]">
                  Today <ChevronLeft className="w-3 h-3 rotate-90" />
                </button>
                <button onClick={() => toast.success("Sorting applied")} className="border border-neutral-700 rounded-full px-3 py-1 flex items-center gap-1 text-neutral-300 text-[11px]">
                  Total collection o... <ChevronLeft className="w-3 h-3 rotate-90" />
                </button>
                <button onClick={() => toast("Search feature coming soon")} className="border border-neutral-700 rounded-full px-3 py-1 flex items-center justify-between flex-1 text-neutral-500 text-[11px]">
                  Member ID
                  <span className="text-[#ffdf00]">??</span>
                </button>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center pt-24 pb-40 gap-4 opacity-50">
                <div className="w-24 h-24 bg-neutral-800 rounded-2xl flex items-center justify-center relative shadow-inner">
                   <div className="absolute top-2 right-2 text-3xl opacity-20 -rotate-12">??</div>
                   <div className="w-16 h-12 bg-neutral-700 rounded-lg border-t-2 border-neutral-600"></div>
                </div>
                <div className="flex items-center gap-2 text-neutral-500 text-[13px]">
                  No content yet <span className="text-[#ffdf00]">?</span>
                </div>
              </div>
            </motion.div>
          )}

          {(activeTab === "Commission Rate") && (
            <motion.div key="commission-rate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-2 pt-3 px-2 pb-8 items-start">
              {/* Left Sidebar (Vertical Tabs) */}
              <div className="w-[85px] flex flex-col gap-2 shrink-0">
                {[
                  { id: "Mini Games", icon: "???" },
                  { id: "Slot", icon: "??" },
                  { id: "Fishing", icon: "??" },
                  { id: "Cards", icon: "??" },
                  { id: "Live", icon: "?????" },
                  { id: "Sports", icon: "?" }
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
                    <span className="text-xl grayscale opacity-80">{t.icon}</span>
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
                  {[
                    { mem: 0, perf: "0.00", rate: "0.40%" },
                    { mem: 0, perf: "10,000,000.00", rate: "0.50%" },
                    { mem: 0, perf: "30,000,000.00", rate: "0.80%" },
                    { mem: 0, perf: "50,000,000.00", rate: "1.00%" },
                    { mem: 0, perf: "100,000,000.00", rate: "1.20%" },
                    { mem: 0, perf: "300,000,000.00", rate: "1.50%" },
                    { mem: 0, perf: "500,000,000.00", rate: "2.00%" },
                    { mem: 0, perf: "1,000,000,000.00", rate: "2.50%" },
                    { mem: 0, perf: "5,000,000,000.00", rate: "3.00%" }
                  ].map((row, i) => (
                    <div key={i} className={`flex py-3 px-1 ${i % 2 !== 0 ? "bg-[#141414]" : "bg-transparent"}`}>
                      <div className="flex-1 text-white flex items-center justify-center">{row.mem}</div>
                      <div className="flex-[1.5] text-white flex items-center justify-center">{row.perf}</div>
                      <div className="flex-1 text-[#ffdf00] flex items-center justify-center">{row.rate}</div>
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




