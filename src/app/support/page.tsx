"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronDown, Mail, Search, MessageCircle, Send, X, Phone, MessageSquare, Plus } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const INITIAL_MAIL = [
  { id: 'n1', title: "🚀 8 great benefits for referring friends", date: "26/09/2026 00:00:00", read: false, content: "Invite friends and get up to 8 amazing benefits! For every friend who signs up and recharges, you get exclusive bonuses and daily rebate boosts." },
  { id: 'no1', title: "🎉 New User Recharge bonus", date: "23/09/2026 12:00:00", read: false, content: "New users who recharge for the first time will receive a 100% bonus up to 10,000 RS. Claim it in the Offer Center!" },
  { id: 'no2', title: "🎉 New VIP tier system update", date: "22/09/2026 12:00:00", read: false, content: "We've updated our VIP system. You can now level up faster by playing slot games. Enjoy higher withdrawal limits and personal account managers." },
];

export default function SupportPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Service center");
  const [mails, setMails] = useState(INITIAL_MAIL);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [faqExpanded, setFaqExpanded] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");

  const unreadMails = mails.filter(m => !m.read).length;
  
  const filteredMails = mails.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMessageClick = (msg: any) => {
    setSelectedMessage(msg);
    setMails(mails.map(m => m.id === msg.id ? { ...m, read: true } : m));
  };

  const submitFeedback = () => {
    if (!feedbackText.trim()) return toast.error("Please enter your feedback");
    toast.success("Feedback submitted successfully. Thank you!");
    setFeedbackText("");
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col pb-16 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between h-14 px-4 bg-[#141414] border-b border-neutral-800 shrink-0 sticky top-0 z-20">
        <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center -ml-2 rounded-full hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-6 h-6 text-[#00aaff]" />
        </button>
        <h1 className="text-[17px] font-medium text-white tracking-wide">Message Center</h1>
        <div className="w-8"></div>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#141414] border-b border-neutral-800 shrink-0">
        {["Service center", "Mail", "Feedback"].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-[14px] font-medium relative transition-colors ${activeTab === tab ? 'text-[#00aaff]' : 'text-neutral-400 hover:text-neutral-200'}`}
          >
            {tab}
            {tab === "Mail" && unreadMails > 0 && (
              <span className="absolute top-2.5 right-6 w-2 h-2 bg-red-500 rounded-full border border-[#141414]"></span>
            )}
            {activeTab === tab && (
              <motion.div layoutId="supportTab" className="absolute bottom-0 left-1/4 right-1/4 h-[3px] bg-[#00aaff] rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar relative bg-[#0a0a0a]">
        <AnimatePresence mode="wait">
          
          {/* SERVICE CENTER TAB */}
          {activeTab === "Service center" && (
            <motion.div key="service" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-3 p-3 pb-8">
              
              {/* 24/7 Customer Support Card */}
              <div className="bg-[#1c1c1c] rounded-xl border border-neutral-800 overflow-hidden shadow-lg p-4 flex gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#00aaff] to-[#0055ff] p-[2px] shrink-0 relative shadow-[0_0_15px_rgba(0,170,255,0.3)]">
                  <div className="w-full h-full bg-[#111] rounded-full flex items-center justify-center overflow-hidden">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Support&backgroundColor=111111" alt="Support" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-[#1c1c1c]"></div>
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="text-[15px] font-bold text-white mb-1">24/7 Customer Support</h3>
                  <p className="text-[11px] text-neutral-400 leading-snug mb-3">If you encounter any problems in the game, please contact our customer service</p>
                  <button onClick={() => window.open('https://t.me/Game8111c', '_blank')} className="w-fit bg-gradient-to-r from-[#211144] to-[#3a1b7a] border border-[#4c2299] text-white px-5 py-2 rounded-lg text-[12px] font-bold shadow-md active:scale-95 transition-transform hover:brightness-110">
                    Contact Now
                  </button>
                </div>
              </div>

              {/* Other Help Center Title */}
              <div className="flex items-center gap-2 mt-2 px-1">
                <MessageSquare className="w-4 h-4 text-[#00aaff]" />
                <h3 className="text-[14px] font-bold text-[#00aaff]">Other Help Center</h3>
              </div>

              {/* Other Help Center List */}
              <div className="bg-[#1c1c1c] rounded-xl border border-neutral-800 overflow-hidden shadow-lg flex flex-col">
                
                {/* Google */}
                <div className="flex items-center p-4 border-b border-neutral-800/50 bg-[#1c1c1c] hover:bg-[#252525] transition-colors">
                  <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-md">
                    <svg className="w-6 h-6" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  </div>
                  <div className="flex-1 px-3">
                    <h4 className="text-[13px] font-bold text-white leading-tight">Google</h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5">Official Google Mail</p>
                  </div>
                  <button onClick={() => window.open('mailto:support@8111c.com', '_blank')} className="shrink-0 bg-gradient-to-r from-[#211144] to-[#3a1b7a] border border-[#4c2299] text-white px-3 py-1.5 rounded-lg text-[11px] font-bold shadow-md active:scale-95 transition-transform">
                    Contact Now
                  </button>
                </div>

                {/* Facebook */}
                <div className="flex items-center p-4 border-b border-neutral-800/50 bg-[#2b2447] hover:bg-[#342b57] transition-colors">
                  <div className="w-11 h-11 bg-[#1877F2] rounded-xl flex items-center justify-center shrink-0 shadow-md">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </div>
                  <div className="flex-1 px-3">
                    <h4 className="text-[13px] font-bold text-white leading-tight">Facebook Official</h4>
                    <p className="text-[10px] text-neutral-300 mt-0.5 leading-snug">Follow 8111C on Facebook for daily bonuses, latest updates, and exclusive rewards!</p>
                  </div>
                  <button onClick={() => window.open('https://facebook.com', '_blank')} className="shrink-0 bg-gradient-to-r from-[#3a1b7a] to-[#4c2299] border border-[#5d2bbc] text-white px-3 py-1.5 rounded-lg text-[11px] font-bold shadow-md active:scale-95 transition-transform">
                    Contact Now
                  </button>
                </div>

                {/* WhatsApp */}
                <div className="flex items-center p-4 border-b border-neutral-800/50 bg-[#1c1c1c] hover:bg-[#252525] transition-colors">
                  <div className="w-11 h-11 bg-[#25D366] rounded-xl flex items-center justify-center shrink-0 shadow-md">
                    <Phone className="w-6 h-6 text-white" fill="currentColor" />
                  </div>
                  <div className="flex-1 px-3">
                    <h4 className="text-[13px] font-bold text-white leading-tight">WhatsApp official</h4>
                    <p className="text-[10px] text-neutral-400 mt-0.5 leading-snug">Follow 8111C on WhatsApp for daily bonuses, latest updates, and exclusive rewards!</p>
                  </div>
                  <button onClick={() => window.open('https://wa.me/1234567890', '_blank')} className="shrink-0 bg-gradient-to-r from-[#211144] to-[#3a1b7a] border border-[#4c2299] text-white px-3 py-1.5 rounded-lg text-[11px] font-bold shadow-md active:scale-95 transition-transform">
                    Contact Now
                  </button>
                </div>

                {/* Telegram */}
                <div className="flex items-center p-4 bg-[#2b2447] hover:bg-[#342b57] transition-colors">
                  <div className="w-11 h-11 bg-[#229ED9] rounded-xl flex items-center justify-center shrink-0 shadow-md">
                    <Send className="w-5 h-5 text-white" fill="currentColor" />
                  </div>
                  <div className="flex-1 px-3">
                    <h4 className="text-[13px] font-bold text-white leading-tight">telegram official</h4>
                    <p className="text-[10px] text-neutral-300 mt-0.5 leading-snug">Follow 8111C on Telegram for daily bonuses, latest updates, and exclusive rewards!</p>
                  </div>
                  <button onClick={() => window.open('https://t.me/Game8111c', '_blank')} className="shrink-0 bg-gradient-to-r from-[#3a1b7a] to-[#4c2299] border border-[#5d2bbc] text-white px-3 py-1.5 rounded-lg text-[11px] font-bold shadow-md active:scale-95 transition-transform">
                    Contact Now
                  </button>
                </div>

              </div>

              {/* FAQ Title */}
              <div className="flex items-center gap-2 mt-2 px-1">
                <h3 className="text-[14px] font-bold text-[#00aaff]">FAQ</h3>
              </div>

              {/* FAQ Accordion */}
              <div className="bg-[#1c1c1c] rounded-xl border border-neutral-800 overflow-hidden shadow-lg">
                <button 
                  onClick={() => setFaqExpanded(!faqExpanded)} 
                  className="w-full flex items-center justify-between p-4 bg-[#1c1c1c] hover:bg-[#252525] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#2a2a2a] border border-neutral-700 flex items-center justify-center">
                      <Plus className="w-4 h-4 text-[#ffdf00]" />
                    </div>
                    <span className="text-[13px] font-medium text-white">Become an Agent & Earn</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform ${faqExpanded ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {faqExpanded && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                      <div className="p-4 pt-0 border-t border-neutral-800 text-[12px] text-neutral-400 leading-relaxed">
                        Become a partner agent with 8111C and earn huge commissions! Share your unique referral link to invite friends. The more they play, the more you earn. Up to 55% lifetime commission! Contact customer service to apply.
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </motion.div>
          )}

          {/* MAIL TAB */}
          {activeTab === "Mail" && (
            <motion.div key="mail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex flex-col gap-3 pt-3 px-3 pb-8">
              <div className="flex gap-2 mb-2">
                <div className="flex-1 flex items-center bg-[#141414] border border-neutral-700 rounded-full px-3 py-2 shadow-inner focus-within:ring-1 focus-within:ring-[#00aaff] transition-all">
                  <input type="text" placeholder="Search mail..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent border-none outline-none text-[12px] text-white w-full placeholder:text-neutral-500" />
                  <Search className="w-4 h-4 text-neutral-500 shrink-0" />
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                {filteredMails.map((item) => (
                  <div key={item.id} onClick={() => handleMessageClick(item)} className="bg-[#1c1c1c] rounded-lg p-3.5 flex items-center gap-3 border border-neutral-800 shadow-md cursor-pointer hover:border-[#00aaff]/50 transition-colors group">
                    <div className="relative shrink-0 w-10 h-10 bg-[#252525] rounded-full flex items-center justify-center">
                       <Mail className={`w-4 h-4 transition-colors ${item.read ? 'text-neutral-500' : 'text-[#ffdf00]'}`} />
                       {!item.read && <div className="w-2.5 h-2.5 rounded-full bg-red-500 absolute 0 right-0 border-2 border-[#1c1c1c]"></div>}
                    </div>
                    <div className="flex-1 flex flex-col justify-center overflow-hidden">
                      <h4 className={`text-[13px] font-bold truncate ${item.read ? 'text-neutral-400' : 'text-white'}`}>{item.title}</h4>
                      <p className="text-[11px] text-neutral-500 truncate mt-0.5">{item.content}</p>
                      <span className="text-[9px] text-neutral-600 mt-1">{item.date}</span>
                    </div>
                  </div>
                ))}
                {filteredMails.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-10 opacity-50">
                    <Mail className="w-12 h-12 text-neutral-600 mb-3" />
                    <span className="text-[13px] text-neutral-500">No mail found</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* FEEDBACK TAB */}
          {activeTab === "Feedback" && (
            <motion.div key="feedback" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex flex-col gap-4 pt-4 px-4 pb-8">
              <div className="bg-[#1c1c1c] rounded-xl border border-neutral-800 p-4 shadow-lg">
                <h3 className="text-[14px] font-bold text-white mb-2">We Value Your Feedback</h3>
                <p className="text-[11px] text-neutral-400 mb-4 leading-relaxed">Tell us how we can improve your gaming experience or report any issues you faced.</p>
                
                <textarea 
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Enter your feedback here..."
                  className="w-full h-32 bg-[#0f0f0f] border border-neutral-800 rounded-lg p-3 text-[13px] text-white outline-none focus:border-[#00aaff] transition-colors resize-none placeholder:text-neutral-600 mb-4"
                ></textarea>

                <button onClick={submitFeedback} className="w-full bg-[#ffdf00] text-black font-bold text-[14px] py-3 rounded-lg shadow-[0_4px_15px_rgba(255,223,0,0.3)] hover:brightness-110 active:scale-95 transition-all">
                  Submit Feedback
                </button>
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
            className="fixed inset-0 z-[100] bg-[#0a0a0a] flex flex-col"
          >
            <div className="flex items-center h-14 px-4 bg-[#141414] border-b border-neutral-800">
              <div onClick={() => setSelectedMessage(null)} className="w-8 h-8 flex items-center justify-center -ml-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer">
                <ChevronLeft className="w-6 h-6 text-neutral-400" />
              </div>
              <div className="flex-1 text-center font-medium text-[16px] text-white capitalize">Mail Details</div>
              <div className="w-8 h-8"></div>
            </div>
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
              <h2 className="text-[18px] font-bold text-white leading-snug">{selectedMessage.title}</h2>
              {selectedMessage.date && <p className="text-[11px] text-neutral-500 border-b border-neutral-800 pb-4">{selectedMessage.date}</p>}
              <div className="text-[13px] text-neutral-300 leading-relaxed whitespace-pre-wrap mt-2">
                {selectedMessage.content}
              </div>
            </div>
            <div className="p-4 bg-[#141414] border-t border-neutral-800">
              <button onClick={() => setSelectedMessage(null)} className="w-full bg-neutral-800 text-white font-medium rounded-lg py-3 hover:bg-neutral-700 transition-colors">
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
