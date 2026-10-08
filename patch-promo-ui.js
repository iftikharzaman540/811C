const fs = require('fs');
let content = fs.readFileSync('src/app/promo/page.tsx', 'utf8');

const targetRegex = /\{\/\* VIP Status Card \*\/\}[\s\S]*?(?=\{\/\* Title \*\/\})/m;

const replacement = `{/* VIP Status Card */}
                {vipStatus && (
                <div className="bg-gradient-to-br from-[#1a1700] to-black rounded-xl p-4 relative overflow-hidden shadow-[0_0_15px_rgba(255,223,0,0.15)] border border-[#ffdf00]/30 mb-6">
                  {/* Small Current Level tag */}
                  <span className="bg-[#cc0000] text-white text-[10px] font-black italic px-2 py-0.5 rounded-br-lg rounded-tl-lg absolute top-0 left-0 shadow-md">Current Level</span>
                  
                  {/* Huge VIP 0 */}
                  <div className="flex items-center gap-3 mt-4">
                    <h2 className="text-white font-black text-[40px] italic tracking-tighter leading-none">VIP <span className="text-[#ffdf00]">{vipStatus.currentLevel}</span></h2>
                    {vipStatus.nextLevel && (
                      <button className="flex items-center gap-1 border border-[#ffdf00]/50 text-neutral-300 text-[10px] px-2 py-1 rounded-full hover:bg-white/5 transition-colors">
                        Level up now <ChevronRight className="w-3 h-3 text-[#ffdf00]" />
                      </button>
                    )}
                  </div>
                  
                  {/* Progress Bar Area */}
                  <div className="mt-6 mb-2 pr-[80px]">
                    <div className="w-full h-2 bg-neutral-900 rounded-full overflow-visible relative">
                      <span className="text-[#ffdf00] bg-black/80 px-1.5 rounded text-[9px] absolute -top-5 left-0 font-bold border border-[#ffdf00]/20">
                        {vipStatus.requiredForNext ? ((vipStatus.totalDeposited / vipStatus.requiredForNext) * 100).toFixed(0) : 100}%
                      </span>
                      <span className="text-neutral-500 absolute -top-5 right-0 italic font-black text-[12px] drop-shadow-md">VIP {vipStatus.nextLevel || 'MAX'}</span>
                      <div className="h-full bg-gradient-to-r from-[#ff0000] to-[#ffdf00] rounded-full relative" style={{ width: Math.min(100, (vipStatus.requiredForNext ? (vipStatus.totalDeposited / vipStatus.requiredForNext) * 100 : 100)) + '%' }}>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_10px_#fff]"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Text below progress */}
                  {vipStatus.nextLevel ? (
                    <p className="text-[12px] text-neutral-400 font-medium mt-3 w-3/4">Deposit <span className="font-bold text-[#ffdf00]">{vipStatus.remaining.toLocaleString()} PKR</span> to enjoy member benefits</p>
                  ) : (
                    <p className="text-[12px] text-neutral-400 font-medium mt-3 w-3/4">You have reached the maximum VIP level!</p>
                  )}
                  
                  {/* Big VIP Crown Logo Right */}
                  <div className="absolute -right-2 top-1/2 -translate-y-1/2 flex flex-col items-center transform scale-110">
                    <Crown className="w-16 h-16 text-[#ffdf00] fill-current drop-shadow-[0_0_15px_rgba(255,223,0,0.8)] mb-1" />
                    <div className="bg-gradient-to-r from-[#cc0000] to-[#ff0b0b] text-white font-black italic px-4 py-0.5 rounded-full border-2 border-white shadow-lg text-[18px]">VIP {vipStatus.currentLevel}</div>
                  </div>
                </div>
                )}
  
                `;

content = content.replace(targetRegex, replacement);
fs.writeFileSync('src/app/promo/page.tsx', content);
console.log('Patched promo VIP tab UI.');
