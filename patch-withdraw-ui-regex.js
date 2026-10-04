const fs = require('fs');
let code = fs.readFileSync('src/components/WithdrawScreen.tsx', 'utf8');

const regexBtn = /<button[\s\S]*?onClick=\{handleWithdraw\}/;
const match = code.match(regexBtn);

if (match) {
  const wageringUI = `
            <div className="mb-5 text-[13px] space-y-1.5 font-medium">
              {req > 0 && !isEligible && (
                <div className="text-[#4a90e2] flex items-start gap-1.5">
                  <span className="mt-1.5 w-1 h-1 bg-[#4a90e2] rounded-full shrink-0"></span>
                  You still need {remaining.toLocaleString()} valid bets to withdraw money!
                </div>
              )}
              {req > 0 && isEligible && (
                <div className="text-green-500 flex items-start gap-1.5">
                  <span className="mt-1.5 w-1 h-1 bg-green-500 rounded-full shrink-0"></span>
                  You have completed the required valid bets.
                </div>
              )}
              <div className="text-[#4a90e2] flex items-center gap-1.5">
                <span className="w-1 h-1 bg-[#4a90e2] rounded-full shrink-0"></span>
                Withdraw time 00:00-23:59
              </div>
              <div className="text-[#4a90e2] flex items-center gap-1.5">
                <span className="w-1 h-1 bg-[#4a90e2] rounded-full shrink-0"></span>
                Inday Remaining Withdrawal Times: {remainingDaily}
              </div>
              <div className="text-[#4a90e2] flex items-center gap-1.5">
                <span className="w-1 h-1 bg-[#4a90e2] rounded-full shrink-0"></span>
                Withdrawal amount range: 500-50,000
              </div>
            </div>

            ` + match[0];
            
  code = code.replace(regexBtn, wageringUI);
  fs.writeFileSync('src/components/WithdrawScreen.tsx', code);
  console.log("Patched WithdrawScreen UI successfully!");
} else {
  console.log("Still could not find the button tag.");
}
