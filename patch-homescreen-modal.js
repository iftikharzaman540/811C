const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

const modalCode = `
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
              <button onClick={() => setShowNotifModal(false)} className="w-8 h-8 flex items-center justify-center -ml-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer">
                <ChevronLeft className="w-6 h-6 text-neutral-400" />
              </button>
              <div className="flex-1 text-center font-bold text-[16px] text-white">Notifications</div>
              <div className="w-8 h-8"></div>
            </div>
            
            <div className="flex-1 min-h-0 overflow-y-auto p-4 flex flex-col gap-3">
              {notifications.length === 0 ? (
                <div className="text-center text-neutral-500 mt-10">No notifications yet</div>
              ) : (
                notifications.map((notif: any) => (
                  <div 
                    key={notif.id} 
                    onClick={() => { if (!notif.is_read) markNotifRead(notif.id); }}
                    className={\`p-3 rounded-lg border \${notif.is_read ? 'bg-[#141414] border-neutral-800' : 'bg-[#1c1c1c] border-[#ff0b0b]/50 shadow-md cursor-pointer'}\`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={\`font-bold text-[14px] \${notif.is_read ? 'text-neutral-400' : 'text-[#ffdf00]'}\`}>{notif.title}</h3>
                      {!notif.is_read && <span className="w-2 h-2 rounded-full bg-[#ff0b0b] mt-1 shrink-0"></span>}
                    </div>
                    <p className={\`text-[12px] whitespace-pre-wrap \${notif.is_read ? 'text-neutral-500' : 'text-neutral-200'}\`}>{notif.message}</p>
                    <div className="text-[10px] text-neutral-600 mt-2">
                      {new Date(notif.created_at).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
<BottomNav />
`;

code = code.replace(
  /<BottomNav \/>/,
  modalCode
);

fs.writeFileSync('src/components/HomeScreen.tsx', code);
console.log("Successfully injected Notification Modal code before BottomNav!");
