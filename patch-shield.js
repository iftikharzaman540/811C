const fs = require('fs');
let content = fs.readFileSync('src/app/profile/page.tsx', 'utf8');

const oldCardRegex = /\{\/\* Proper VIP Card \*\/\}[\s\S]*?(?=\{\/\* Action Buttons)/m;

const newCard = `{/* Proper VIP Card */}
          {(user || hasToken) && (
            <div onClick={() => window.location.href = '/promo?tab=VIP'} className="mt-5 border border-[#ffdf00]/30 bg-gradient-to-r from-[#1a1700] via-[#0f0a00] to-[#1a1700] rounded-xl p-3 flex items-center justify-between cursor-pointer relative shadow-[0_0_15px_rgba(255,223,0,0.08)] group z-10">
              
              {/* Left Side: Badge & Progress */}
              <div className="flex-1 pr-3 border-r border-[#ffdf00]/20 flex items-center gap-3">
                
                {/* Shield Badge */}
                <div className="relative w-[50px] h-[60px] flex-shrink-0 flex flex-col items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full drop-shadow-[0_0_8px_rgba(255,223,0,0.5)]" viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 0L40 10V25C40 35 20 48 20 48C20 48 0 35 0 25V10L20 0Z" fill="url(#goldGradient)"/>
                    <path d="M20 2L38 11V24.5C38 33.5 20 45 20 45C20 45 2 33.5 2 24.5V11L20 2Z" fill="url(#darkGradient)"/>
                    <defs>
                      <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="48" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#ffe54c"/>
                        <stop offset="0.5" stopColor="#ffdf00"/>
                        <stop offset="1" stopColor="#997a00"/>
                      </linearGradient>
                      <linearGradient id="darkGradient" x1="0" y1="0" x2="0" y2="48" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#2a2000"/>
                        <stop offset="1" stopColor="#0a0800"/>
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="z-10 flex flex-col items-center mt-[-4px]">
                    <Crown className="w-5 h-5 text-[#ffdf00] fill-current mb-0.5" />
                    <span className="text-[#ffdf00] font-black text-[12px] italic leading-none drop-shadow-md">VIP {vipStatus?.currentLevel || 0}</span>
                  </div>
                </div>

                {/* Progress */}
                <div className="flex-1 flex flex-col justify-center">
                  <div className="w-full h-2.5 bg-[#111] rounded-full overflow-visible relative border border-neutral-800 shadow-inner">
                    <div className="h-full bg-gradient-to-r from-[#ffdf00] to-[#fff5cc] rounded-full relative" style={{ width: Math.min(100, (vipStatus?.requiredForNext ? (vipStatus.totalDeposited / vipStatus.requiredForNext) * 100 : 0)) + '%' }}>
                      <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-[0_0_10px_#fff,0_0_20px_#ffdf00]"></div>
                    </div>
                  </div>
                  <div className="text-[11px] text-neutral-400 font-bold mt-2 text-left tracking-tight">
                    {(vipStatus?.totalDeposited || 0).toLocaleString(undefined, {minimumFractionDigits: 2})} / {(vipStatus?.requiredForNext || 10000).toLocaleString(undefined, {minimumFractionDigits: 2})}
                  </div>
                </div>
              </div>
              
              {/* Right Side: Next Level Info */}
              <div className="w-[125px] pl-3 flex flex-col justify-center relative">
                <span className="text-neutral-400 text-[10px] leading-tight font-medium">Next level bonus</span>
                <span className="text-[#ffdf00] font-black text-[14px] leading-tight mt-1 mb-1.5 drop-shadow-md">Rs 50.00</span>
                <span className="text-neutral-500 text-[9px] leading-tight">VIP requires Bets {(vipStatus?.requiredForNext || 10000).toLocaleString()}</span>
                <ChevronRight className="w-4 h-4 text-[#ffdf00] absolute right-0 top-1/2 -translate-y-1/2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          )}

          `;

content = content.replace(oldCardRegex, newCard);

// Also remove `&& vipStatus` from rendering condition if I had it anywhere else
fs.writeFileSync('src/app/profile/page.tsx', content);
console.log('Patched profile VIP shield UI.');
