const fs = require('fs');
let code = fs.readFileSync('src/app/profile/page.tsx', 'utf8');

// 1. Add missing imports
code = code.replace(
  'import { useState, useEffect } from "react";',
  'import { useState, useEffect } from "react";\nimport { motion, AnimatePresence } from "framer-motion";'
);
code = code.replace(
  ', Crown, Pencil } from "lucide-react";',
  ', Crown, Pencil, Bell, ChevronLeft } from "lucide-react";'
);

// 2. Add showNotifModal state and destructured useUser context
code = code.replace(
  'const { user, loading, logout } = useUser();',
  `const { user, loading, logout, notifications = [], unreadNotifCount = 0, markNotifRead } = useUser();
  const [showNotifModal, setShowNotifModal] = useState(false);

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
  }, [showNotifModal]);`
);

// 3. Replace Gift 10-666 with Bell icon
const oldGiftBox = `            {/* Top Right Gift Box */}
            <div className="absolute top-4 right-4 flex items-center bg-[#111] border border-[#ffdf00] rounded-full px-2.5 py-0.5 z-10 cursor-pointer shadow-[0_0_8px_rgba(255,223,0,0.15)] hover:bg-black transition-colors" onClick={() => toast("Gift Center coming soon!")}>
              <Gift className="w-3.5 h-3.5 text-[#ffdf00] mr-1" />
              <span className="text-[#ffdf00] font-bold text-[12px]">10-666</span>
            </div>`;

const newBellBox = `            {/* Top Right Notification Bell */}
            <div className="absolute top-4 right-4 flex items-center justify-center bg-[#111] border border-[#ff0b0b]/50 rounded-full w-9 h-9 z-10 cursor-pointer shadow-[0_0_10px_rgba(255,11,11,0.2)] hover:bg-black transition-colors" onClick={() => setShowNotifModal(true)}>
              <Bell className="w-4 h-4 text-neutral-300" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#ff0b0b] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-md z-10 min-w-[18px] text-center">
                  {unreadNotifCount}
                </span>
              )}
            </div>`;

code = code.replace(oldGiftBox, newBellBox);

// 4. Inject Notification Modal before BottomNav
const modalJSX = `
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
                    className={\`p-3.5 rounded-xl border transition-all \${notif.is_read ? 'bg-[#141414] border-neutral-800' : 'bg-[#1c1c1c] border-[#ff0b0b]/50 shadow-[0_0_10px_rgba(255,11,11,0.1)] cursor-pointer'}\`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={\`font-bold text-[15px] \${notif.is_read ? 'text-neutral-400' : 'text-[#ffdf00]'}\`}>{notif.title}</h3>
                      {!notif.is_read && <span className="w-2.5 h-2.5 rounded-full bg-[#ff0b0b] mt-1 shrink-0 animate-pulse"></span>}
                    </div>
                    <p className={\`text-[13px] whitespace-pre-wrap leading-relaxed \${notif.is_read ? 'text-neutral-500' : 'text-neutral-200'}\`}>{notif.message}</p>
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
`;

code = code.replace(
  /<BottomNav activeTab="profile" \/>/,
  modalJSX + "\n      <BottomNav activeTab=\"profile\" />"
);

fs.writeFileSync('src/app/profile/page.tsx', code);
console.log("Updated Profile page with Notification logic and UI!");
