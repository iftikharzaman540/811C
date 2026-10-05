const fs = require('fs');
let code = fs.readFileSync('src/app/profile/page.tsx', 'utf8');

const target = `          {/* Top Right Gift Box */}
          <div className="absolute top-4 right-4 flex items-center bg-[#111] border border-[#ffdf00] rounded-full px-2.5 py-0.5 z-10 cursor-pointer shadow-[0_0_8px_rgba(255,223,0,0.15)] hover:bg-black transition-colors" onClick={() => toast("Gift Center coming soon!")}>
            <Gift className="w-3.5 h-3.5 text-[#ffdf00] mr-1" />
            <span className="text-[#ffdf00] font-bold text-[12px]">10-666</span>
          </div>`;

const replacement = `          {/* Top Right Icons */}
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
          </div>`;

code = code.replace(target, replacement);
fs.writeFileSync('src/app/profile/page.tsx', code);
