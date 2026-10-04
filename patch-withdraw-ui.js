const fs = require('fs');

let withdrawScreen = fs.readFileSync('src/components/WithdrawScreen.tsx', 'utf8');

// Replace "Minimum 500" with "Minimum 100" in amount input
withdrawScreen = withdrawScreen.replace(/placeholder="Minimum 500"/g, 'placeholder="Minimum 100"');
withdrawScreen = withdrawScreen.replace(/if \(Number\(amount\) < 500\)/g, 'if (Number(amount) < 100)');
withdrawScreen = withdrawScreen.replace(/toast\.error\("Minimum withdrawal amount is 500"\)/g, 'toast.error("Minimum withdrawal amount is PKR 100")');

// Add wagering variables early in the render block:
const req = `const req = Number(user?.current_wagering_requirement || 0);
  const comp = Number(user?.current_wagering_completed || 0);
  const remaining = Math.max(0, req - comp);
  const progress = req > 0 ? Math.min(100, (comp / req) * 100).toFixed(0) : 100;
  const isEligible = comp >= req;
  const todayCount = Number(user?.today_withdrawals_count || 0);
  const remainingDaily = Math.max(0, 15 - todayCount);
`;
// Inject right before return
withdrawScreen = withdrawScreen.replace(/if \(hasPassword === null\) return <div/g, req + '\n  if (hasPassword === null) return <div');

// Update validation logic in handleWithdraw (which likely posts to /withdraw)
const searchWithdrawLogic = `if (Number(amount) > user.balance) {`;
const replaceWithdrawLogic = `
    if (Number(amount) > 50000) {
      toast.error("Maximum withdrawal amount is PKR 50,000");
      return;
    }
    if (!isEligible) {
      toast.error(\`Wagering requirement incomplete. Play PKR \${remaining} more to withdraw.\`);
      return;
    }
    if (todayCount >= 15) {
      toast.error("Daily withdrawal limit reached. You can make withdrawals again tomorrow.");
      return;
    }
    if (Number(amount) > user.balance) {
`;
withdrawScreen = withdrawScreen.replace(searchWithdrawLogic, replaceWithdrawLogic);

// Build the UI for Wagering and Daily Limits
const newUI = `
            {/* Real Withdraw UI */}
            
            {/* Wagering Progress Box */}
            <div className="bg-[#1a1a1a] rounded-xl p-4 mb-4 border border-neutral-800 shadow-lg">
               <h3 className="text-white font-bold mb-3 flex items-center justify-between">
                 Withdrawal Eligibility
                 {isEligible ? (
                   <span className="text-[#1fdf1f] text-xs px-2 py-1 bg-[#1fdf1f]/10 rounded flex items-center gap-1">✅ Available</span>
                 ) : (
                   <span className="text-[#ff5555] text-xs px-2 py-1 bg-[#ff5555]/10 rounded flex items-center gap-1">🔒 Locked</span>
                 )}
               </h3>
               
               <div className="space-y-1.5 text-sm text-neutral-400 mb-3">
                 <div className="flex justify-between"><span>Required Betting:</span> <span className="text-white">PKR {req}</span></div>
                 <div className="flex justify-between"><span>Bet Played:</span> <span className="text-white">PKR {comp}</span></div>
                 <div className="flex justify-between font-medium"><span>Remaining:</span> <span className={isEligible ? "text-[#1fdf1f]" : "text-[#ffdf00]"}>PKR {remaining}</span></div>
               </div>

               <div className="w-full bg-neutral-800 rounded-full h-2 mb-1 overflow-hidden">
                 <div className="bg-gradient-to-r from-[#ffdf00] to-[#ffaa00] h-2 rounded-full transition-all duration-500" style={{ width: \`\${progress}%\` }}></div>
               </div>
               <div className="flex justify-between text-xs text-neutral-500">
                 <span>Progress: {progress}%</span>
                 {!isEligible && <span className="text-[#ff5555]">Play PKR {remaining} more to unlock</span>}
               </div>
            </div>

            <div className="bg-[#1a1a1a] rounded-xl p-4 mb-4 border border-neutral-800 flex justify-between items-center shadow-lg">
               <div className="text-sm">
                 <p className="text-neutral-400">Today's Withdrawals</p>
                 <p className="text-white font-bold">{todayCount} / 15</p>
               </div>
               <div className="text-right text-sm">
                 <p className="text-neutral-400">Remaining Today</p>
                 <p className={remainingDaily > 0 ? "text-[#1fdf1f] font-bold" : "text-[#ff5555] font-bold"}>{remainingDaily}</p>
               </div>
            </div>

            <div className="bg-gradient-to-r from-neutral-800 to-neutral-900 rounded-xl p-4 mb-6 border border-neutral-700 shadow-lg">
`;

withdrawScreen = withdrawScreen.replace(/\{\/\* Real Withdraw UI \*\/\}\s*<div className="bg-gradient-to-r from-neutral-800 to-neutral-900 rounded-xl p-4 mb-6 border/m, newUI);

// Update button disable state
const btnSearch = `disabled={isLoading || !amount || !accountDetails}`;
const btnReplace = `disabled={isLoading || !amount || !accountDetails || !isEligible || todayCount >= 15 || Number(amount) < 100 || Number(amount) > 50000}`;
withdrawScreen = withdrawScreen.replace(btnSearch, btnReplace);

const btnTextSearch = `{isLoading ? "Processing..." : "Withdraw"}`;
const btnTextReplace = `{isLoading ? "Processing..." : (!isEligible ? "Withdrawal Locked" : (todayCount >= 15 ? "Daily Limit Reached" : "Withdraw"))}`;
withdrawScreen = withdrawScreen.replace(btnTextSearch, btnTextReplace);

fs.writeFileSync('src/components/WithdrawScreen.tsx', withdrawScreen);
console.log("Withdraw UI patched.");
