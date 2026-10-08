const fs = require('fs');
let content = fs.readFileSync('src/app/profile/page.tsx', 'utf8');

const targetContent = `            {/* VIP Crown */}
            {(user || hasToken) && (
              <div className="shrink-0 flex items-center pr-1 self-center">
                <Crown className="w-7 h-7 text-[#ff5500]" style={{ filter: "drop-shadow(0 0 5px rgba(255,85,0,0.8))" }} />
              </div>
            )}
          </div>`;

const replacement = `            {/* Big VIP Crown (Top Right Logo) */}
            {(user || hasToken) && (
              <div className="shrink-0 flex items-center pr-1 self-center cursor-pointer" onClick={() => window.location.href = '/promo?tab=VIP'}>
                <Crown className="w-9 h-9 text-[#ff5500]" style={{ filter: "drop-shadow(0 0 10px rgba(255,85,0,0.8))" }} />
              </div>
            )}
          </div>

          {/* Proper VIP Card */}
          {(user || hasToken) && vipStatus && (
            <div onClick={() => window.location.href = '/promo?tab=VIP'} className="mt-5 border border-[#ffdf00]/40 bg-gradient-to-r from-[#1a1700] via-[#0a0a0a] to-[#1a1700] rounded-xl p-3 flex items-center justify-between cursor-pointer relative overflow-hidden shadow-[0_0_15px_rgba(255,223,0,0.05)] group">
              {/* Left Side: Badge & Progress */}
              <div className="flex-1 pr-4 border-r border-[#ffdf00]/20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-gradient-to-b from-[#ffdf00] to-[#b39b00] text-black text-[13px] font-black italic px-2 py-0.5 rounded shadow-md flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5" /> VIP {vipStatus.currentLevel}
                  </div>
                </div>
                <div className="w-full h-1.5 bg-[#222] rounded-full overflow-visible relative mt-1.5">
                  <div className="h-full bg-gradient-to-r from-[#ffdf00] to-[#ffaa00] rounded-full relative" style={{ width: Math.min(100, (vipStatus.requiredForNext ? (vipStatus.totalDeposited / vipStatus.requiredForNext) * 100 : 100)) + '%' }}>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_#fff]"></div>
                  </div>
                </div>
                <div className="text-[11px] text-neutral-400 font-bold mt-2 text-center tracking-tight">
                  {(vipStatus.totalDeposited || 0).toLocaleString(undefined, {minimumFractionDigits: 2})} / {(vipStatus.requiredForNext || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}
                </div>
              </div>
              
              {/* Right Side: Next Level Info */}
              <div className="w-[140px] pl-4 flex flex-col justify-center relative">
                <span className="text-neutral-400 text-[11px] leading-tight font-medium">Next level bonus</span>
                <span className="text-[#ffdf00] font-black text-[15px] leading-tight mt-1 mb-1.5">Rs 500.00</span>
                <span className="text-neutral-500 text-[9.5px] leading-tight">VIP requires Bets {(vipStatus.requiredForNext || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                <ChevronRight className="w-5 h-5 text-[#ffdf00] absolute right-0 top-1/2 -translate-y-1/2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          )}`;

content = content.replace(targetContent, replacement);
fs.writeFileSync('src/app/profile/page.tsx', content);
console.log('Patched profile VIP card UI.');
