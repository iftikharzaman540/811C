const fs = require('fs');
let promoPage = fs.readFileSync('src/app/promo/page.tsx', 'utf8');

const vipTabRegex = /\{\/\* VIP TAB CONTENT \*\/\}\s*\{activeTopTab === "VIP" && \([\s\S]*?\}\)/m;

const newVipTab = `{/* VIP TAB CONTENT */}
        {activeTopTab === "VIP" && (
          <div className="w-full flex-1 overflow-y-auto pb-24 space-y-4 px-4 pt-4 bg-[#111]">
            
            {/* Wagering Progress Box */}
            {vipStatus && vipStatus.wageringRequirement > 0 && (
               <div className="bg-[#1a1700] border border-[#ffdf00]/30 p-4 rounded-xl relative shadow-[0_0_15px_rgba(255,223,0,0.08)] mb-4">
                  <h3 className="text-[#ffdf00] font-black text-lg mb-3">Wagering Progress</h3>
                  <div className="flex justify-between text-sm text-neutral-300 mb-2">
                     <span>Requirement:</span>
                     <span className="font-bold text-white">PKR {vipStatus.wageringRequirement.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-neutral-300 mb-2">
                     <span>Completed:</span>
                     <span className="font-bold text-[#00e676]">PKR {vipStatus.wageringCompleted.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-neutral-300 mb-4">
                     <span>Remaining:</span>
                     <span className="font-bold text-[#ff4d4d]">PKR {vipStatus.wageringRemaining.toLocaleString()}</span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full h-3 bg-[#111] rounded-full overflow-hidden border border-neutral-800">
                     <div 
                        className="h-full bg-gradient-to-r from-[#ffdf00] to-[#fff5cc]" 
                        style={{ width: \`\${Math.min(100, (vipStatus.wageringCompleted / vipStatus.wageringRequirement) * 100)}%\` }}
                     ></div>
                  </div>
                  <div className="text-center text-xs mt-2 text-neutral-400 font-bold">
                     {vipStatus.wageringCompleted >= vipStatus.wageringRequirement ? 
                        <span className="text-[#00e676]">Wagering Completed ?<br/>Bonus is now withdrawable</span> : 
                        "Status: Wagering in Progress"
                     }
                  </div>
               </div>
            )}

            {/* Current VIP Status */}
            <div className="bg-[#1a1700] border border-[#ffdf00]/30 p-4 rounded-xl flex items-center justify-between">
               <div>
                  <div className="text-neutral-400 text-xs">Current Level</div>
                  <div className="text-[#ffdf00] font-black text-xl italic flex items-center gap-1">
                     <Crown className="w-5 h-5 fill-current" /> VIP {vipStatus?.currentLevel || 0}
                  </div>
               </div>
               <div className="text-right">
                  <div className="text-neutral-400 text-xs">Total Turnover</div>
                  <div className="text-white font-bold text-lg">Rs {(vipStatus?.totalWagered || 0).toLocaleString()}</div>
               </div>
            </div>

            {/* VIP Levels List */}
            <h3 className="text-white font-bold text-lg mt-6 mb-2 flex items-center gap-2"><Crown className="w-5 h-5 text-[#ffdf00]"/> VIP Privileges</h3>
            <div className="space-y-3">
               {vipStatus?.levels?.filter((l: any) => l.level > 0).map((lvl: any) => {
                  const isReached = (vipStatus.totalWagered || 0) >= lvl.min_turnover;
                  const isClaimed = vipStatus.claims?.some((c: any) => c.level === lvl.level);
                  
                  return (
                     <div key={lvl.level} className="bg-[#151515] border border-neutral-800 p-4 rounded-xl flex justify-between items-center relative overflow-hidden group">
                        
                        {/* Glow effect for reached levels */}
                        {isReached && !isClaimed && <div className="absolute inset-0 bg-gradient-to-r from-[#ffdf00]/10 to-transparent pointer-events-none" />}
                        
                        <div>
                           <div className="flex items-center gap-2 mb-1">
                              <Crown className={\`w-4 h-4 \${isReached ? 'text-[#ffdf00]' : 'text-neutral-500'}\`} />
                              <span className={\`font-black italic text-lg \${isReached ? 'text-[#ffdf00]' : 'text-neutral-500'}\`}>VIP {lvl.level}</span>
                           </div>
                           <div className="text-xs text-neutral-400 mb-2">Turnover req: {(lvl.min_turnover || 0).toLocaleString()}</div>
                           <div className="text-sm font-bold text-white flex gap-1">
                              Bonus: <span className="text-[#00e676]">+{lvl.bonus_amount.toLocaleString()}</span>
                           </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2">
                           {isClaimed ? (
                              <button disabled className="px-4 py-1.5 bg-neutral-800 text-neutral-500 rounded font-bold text-xs shadow-inner">
                                 Claimed ?
                              </button>
                           ) : isReached ? (
                              <button 
                                 onClick={() => window.claimVipBonus && window.claimVipBonus(lvl.level)}
                                 className="px-4 py-1.5 bg-gradient-to-r from-[#ffdf00] to-[#b39b00] text-black rounded font-bold text-xs shadow-[0_0_10px_rgba(255,223,0,0.5)] active:scale-95 transition-transform"
                              >
                                 Claim Bonus
                              </button>
                           ) : (
                              <div className="text-right">
                                 <div className="text-[10px] text-neutral-500 mb-1">Remaining</div>
                                 <div className="text-xs text-neutral-300 font-bold">{(lvl.min_turnover - (vipStatus.totalWagered || 0)).toLocaleString()}</div>
                              </div>
                           )}
                        </div>
                     </div>
                  );
               })}
            </div>
            <div className="h-20" />
          </div>
        )}`;

promoPage = promoPage.replace(vipTabRegex, newVipTab);

const useEffectRegex = /useEffect\(\(\) => \{[\s\S]*?const params = new URLSearchParams/m;
const newUseEffect = `useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).claimVipBonus = async (level: number) => {
         const token = localStorage.getItem('token');
         try {
            const res = await fetch('https://8111c.com/api/v1/vip/claim-bonus', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
               body: JSON.stringify({ level })
            });
            const data = await res.json();
            if (data.success) {
               alert('Bonus claimed successfully!');
               window.location.reload();
            } else {
               alert(data.message || 'Failed to claim bonus');
            }
         } catch (e) {
            alert('Network error');
         }
      };
    }
    
    if (typeof window !== "undefined") {
      const params = new URLSearchParams`;

if(promoPage.includes('window.claimVipBonus')) {
   // Already injected
} else {
   promoPage = promoPage.replace(useEffectRegex, newUseEffect);
}

fs.writeFileSync('src/app/promo/page.tsx', promoPage);
console.log('Fixed regex patch on promo page');
