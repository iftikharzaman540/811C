const fs = require('fs');
const file = 'src/components/HomeScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

const startStr = `      {/* Sidebar Overlay */}`;
const endStr = `      )}
<BottomNav />`;

const startIdx = content.indexOf(startStr);
const endIdx = content.indexOf(endStr);

if (startIdx !== -1 && endIdx !== -1) {
  const replacement = `      {/* Sidebar Overlay (JJwin Style) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] flex font-sans">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
          <motion.div initial={{ x: -320 }} animate={{ x: 0 }} exit={{ x: -320 }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="relative w-[300px] h-full bg-[#1a1a1a] shadow-2xl flex flex-col overflow-hidden text-neutral-300">
            
            {/* Header */}
            <div className="px-4 py-3 bg-black flex items-center border-b border-neutral-800">
              <button onClick={() => setIsMenuOpen(false)} className="relative mr-4 p-1 cursor-pointer hover:bg-neutral-800 rounded-lg">
                <ArrowLeft className="w-6 h-6 text-white" />
                <span className="absolute -top-1 -right-1 bg-[#ff4747] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">6</span>
              </button>
              <img src="/header-logo.jpg" alt="Logo" className="h-[28px] object-contain mix-blend-screen" />
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar pb-6 px-3 pt-3 flex flex-col gap-2">
              
              {/* Language Selector */}
              <div className="bg-[#242424] rounded-lg p-3 flex items-center justify-between cursor-pointer hover:bg-[#2a2a2a] transition-colors">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-neutral-400" />
                  <span className="text-[14px]">English</span>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-500 rotate-90" />
              </div>

              {/* Search */}
              <div className="bg-[#242424] rounded-lg p-3 flex items-center gap-2">
                <Search className="w-5 h-5 text-neutral-400" />
                <input type="text" placeholder="Search" className="bg-transparent border-none outline-none text-[14px] text-white placeholder-neutral-400 w-full" />
              </div>

              {/* Game Categories Grid */}
              <div className="grid grid-cols-2 gap-2 mt-2">
                {[
                  { name: "Hot", icon: "🔥" },
                  { name: "Mini Games", icon: "🎲" },
                  { name: "Slot", icon: "🎰" },
                  { name: "Fishing", icon: "🦈" },
                  { name: "Cards", icon: "🃏" },
                  { name: "Live", icon: "👩‍💼" },
                  { name: "Sports", icon: "⚽" },
                  { name: "Recent", icon: "🕒" },
                ].map((cat) => (
                  <button key={cat.name} className="bg-[#242424] hover:bg-[#2a2a2a] rounded-lg py-3 flex flex-col items-center justify-center gap-1.5 transition-colors">
                    <span className="text-2xl">{cat.icon}</span>
                    <span className="text-[13px]">{cat.name}</span>
                  </button>
                ))}
                <button className="bg-[#242424] hover:bg-[#2a2a2a] rounded-lg py-3 flex flex-col items-center justify-center gap-1.5 transition-colors col-span-2 sm:col-span-1">
                    <span className="text-2xl">⭐</span>
                    <span className="text-[13px]">Favorites</span>
                </button>
              </div>

              {/* List Actions */}
              <div className="flex flex-col gap-1.5 mt-2">
                <button className="bg-[#242424] hover:bg-[#2a2a2a] rounded-lg p-3 flex items-center gap-3 transition-colors text-left w-full">
                  <FileText className="w-5 h-5 text-neutral-400 shrink-0" />
                  <span className="text-[14px]">Bet Record</span>
                </button>
                <button className="bg-[#242424] hover:bg-[#2a2a2a] rounded-lg p-3 flex items-center gap-3 transition-colors text-left w-full">
                  <Share2 className="w-5 h-5 text-neutral-400 shrink-0" />
                  <span className="text-[14px]">Share</span>
                </button>
                <button className="bg-[#242424] hover:bg-[#2a2a2a] rounded-lg p-3 flex items-center gap-3 transition-colors text-left w-full">
                  <Users className="w-5 h-5 text-neutral-400 shrink-0" />
                  <span className="text-[14px]">Invite</span>
                </button>
              </div>

              {/* Offer Center */}
              <div className="mt-3 text-center text-neutral-500 text-[13px]">Offer Center</div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="relative bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg p-2.5 h-[60px] flex justify-between overflow-hidden cursor-pointer hover:brightness-110">
                  <span className="text-white font-bold text-[13px] z-10 relative">Event</span>
                  <span className="absolute -top-1 right-0 bg-[#ff4747] text-white text-[10px] font-bold px-1.5 min-w-[16px] h-4 rounded-full flex items-center justify-center z-20">3</span>
                  <div className="absolute right-1 bottom-0 text-3xl opacity-90 drop-shadow-md">🎯</div>
                </div>
                <div className="relative bg-gradient-to-br from-green-400 to-green-600 rounded-lg p-2.5 h-[60px] flex justify-between overflow-hidden cursor-pointer hover:brightness-110">
                  <span className="text-white font-bold text-[13px] z-10 relative">Mission</span>
                  <span className="absolute -top-1 right-0 bg-[#ff4747] text-white text-[10px] font-bold px-1.5 min-w-[16px] h-4 rounded-full flex items-center justify-center z-20">1</span>
                  <div className="absolute right-1 bottom-0 text-3xl opacity-90 drop-shadow-md">📅</div>
                </div>
                <div className="relative bg-gradient-to-br from-red-400 to-red-500 rounded-lg p-2.5 h-[60px] flex justify-between overflow-hidden cursor-pointer hover:brightness-110">
                  <span className="text-white font-bold text-[13px] z-10 relative">Spins</span>
                  <div className="absolute right-1 bottom-0 text-3xl opacity-90 drop-shadow-md">🎡</div>
                </div>
                <div className="relative bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg p-2.5 h-[60px] flex justify-between overflow-hidden cursor-pointer hover:brightness-110">
                  <span className="text-white font-bold text-[13px] z-10 relative">Rebate</span>
                  <div className="absolute right-1 bottom-0 text-3xl opacity-90 drop-shadow-md">💰</div>
                </div>
                <div className="relative bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg p-2.5 h-[60px] flex justify-between overflow-hidden cursor-pointer hover:brightness-110">
                  <span className="text-white font-bold text-[13px] z-10 relative">VIP</span>
                  <div className="absolute right-1 bottom-0 text-3xl opacity-90 drop-shadow-md">👑</div>
                </div>
                <div className="relative bg-gradient-to-br from-pink-400 to-pink-600 rounded-lg p-2.5 h-[60px] flex justify-between overflow-hidden cursor-pointer hover:brightness-110">
                  <span className="text-white font-bold text-[13px] z-10 relative">Fund</span>
                  <span className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-1 rounded-bl-lg z-20">50%</span>
                  <div className="absolute right-1 bottom-0 text-3xl opacity-90 drop-shadow-md">👛</div>
                </div>
                <div className="relative bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg p-2.5 h-[60px] flex justify-between overflow-hidden cursor-pointer hover:brightness-110">
                  <span className="text-white font-bold text-[13px] z-10 relative leading-tight">Unclaim<br/>ed</span>
                  <span className="absolute -top-1 right-0 bg-[#ff4747] text-white text-[10px] font-bold px-1.5 min-w-[16px] h-4 rounded-full flex items-center justify-center z-20">2</span>
                  <div className="absolute right-1 bottom-0 text-3xl opacity-90 drop-shadow-md">🎁</div>
                </div>
                <div className="relative bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg p-2.5 h-[60px] flex justify-between overflow-hidden cursor-pointer hover:brightness-110">
                  <span className="text-white font-bold text-[13px] z-10 relative">History</span>
                  <div className="absolute right-1 bottom-0 text-3xl opacity-90 drop-shadow-md">📜</div>
                </div>
              </div>

              {/* Text Links */}
              <div className="flex flex-col gap-1 mt-4">
                <button className="p-2 flex items-center gap-3 text-neutral-400 hover:text-white transition-colors text-left w-full">
                  <Download className="w-5 h-5 shrink-0" /> <span className="text-[14px]">APP Download</span>
                </button>
                <button className="p-2 flex items-center gap-3 text-neutral-400 hover:text-white transition-colors text-left w-full">
                  <Headset className="w-5 h-5 shrink-0" /> <span className="text-[14px]">Customer Service</span>
                </button>
                <button className="p-2 flex items-center gap-3 text-neutral-400 hover:text-white transition-colors text-left w-full">
                  <HelpCircle className="w-5 h-5 shrink-0" /> <span className="text-[14px]">FAQ</span>
                </button>
                <button className="p-2 flex items-center gap-3 text-neutral-400 hover:text-white transition-colors text-left w-full">
                  <Info className="w-5 h-5 shrink-0" /> <span className="text-[14px]">About 8111c.com</span>
                </button>
                <button className="p-2 flex items-center gap-3 text-neutral-400 hover:text-white transition-colors text-left w-full">
                  <MapPin className="w-5 h-5 shrink-0" /> <span className="text-[14px]">Find us</span>
                </button>
                <button className="p-2 flex items-center gap-3 text-neutral-400 hover:text-white transition-colors text-left w-full">
                  <Moon className="w-5 h-5 shrink-0" /> <span className="text-[14px]">Night mode</span>
                </button>
              </div>

              {/* Official Channels */}
              <div className="mt-4 mb-2 text-neutral-500 text-[13px] px-2 text-left w-full">Official Channel</div>
              <div className="flex flex-col gap-1">
                <button className="p-2 flex items-center gap-3 text-neutral-400 hover:bg-[#242424] rounded-lg transition-colors text-left w-full">
                  <div className="w-6 h-6 rounded bg-[#25D366] flex items-center justify-center shrink-0"><MessageCircle className="w-4 h-4 text-white" /></div>
                  <span className="text-[14px]">Whatsapp Channel</span>
                </button>
                <button className="p-2 flex items-center gap-3 text-neutral-400 hover:bg-[#242424] rounded-lg transition-colors text-left w-full">
                  <div className="w-6 h-6 rounded bg-[#1877F2] flex items-center justify-center shrink-0"><Facebook className="w-4 h-4 text-white" /></div>
                  <span className="text-[14px]">Facebook channel</span>
                </button>
                <button className="p-2 flex items-center gap-3 text-neutral-400 hover:bg-[#242424] rounded-lg transition-colors text-left w-full">
                  <div className="w-6 h-6 rounded bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] flex items-center justify-center shrink-0"><Instagram className="w-4 h-4 text-white" /></div>
                  <span className="text-[14px]">Instagram channel</span>
                </button>
                <button className="p-2 flex items-center gap-3 text-neutral-400 hover:bg-[#242424] rounded-lg transition-colors text-left w-full">
                  <div className="w-6 h-6 rounded bg-[#0088cc] flex items-center justify-center shrink-0"><Send className="w-4 h-4 text-white -ml-0.5" /></div>
                  <span className="text-[14px]">Telegram channel</span>
                </button>
                <button className="p-2 flex items-center gap-3 text-neutral-400 hover:bg-[#242424] rounded-lg transition-colors text-left w-full">
                  <div className="w-6 h-6 rounded bg-black border border-neutral-700 flex items-center justify-center shrink-0"><Twitter className="w-4 h-4 text-white" /></div>
                  <span className="text-[14px]">Twitter</span>
                </button>
              </div>

              {!user && (
                <div className="mt-4 pt-4 border-t border-neutral-800 pb-8 flex flex-col w-full">
                  <button onClick={() => { setIsMenuOpen(false); onLoginClick(); }} className="w-full bg-neutral-800 text-white font-bold py-2.5 rounded-lg mb-2 hover:brightness-110">Login</button>
                  <button onClick={() => { setIsMenuOpen(false); onRegisterClick(); }} className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-2.5 rounded-lg hover:brightness-110">Register</button>
                </div>
              )}
              {user && (
                <div className="mt-4 pt-4 border-t border-neutral-800 pb-8 flex flex-col w-full">
                  <button onClick={() => { logout(); setIsMenuOpen(false); }} className="w-full bg-neutral-800 text-neutral-400 font-bold py-2.5 rounded-lg hover:bg-[#cc0000] hover:text-white transition-colors">Logout</button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
<BottomNav />`;

  const newContent = content.substring(0, startIdx) + replacement + content.substring(endIdx + endStr.length);
  fs.writeFileSync(file, newContent, 'utf8');
  console.log("REPLACED SUCCESSFULLY");
} else {
  console.log("Not found");
}
