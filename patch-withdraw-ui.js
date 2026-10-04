const fs = require('fs');
let code = fs.readFileSync('src/components/WithdrawScreen.tsx', 'utf8');

const targetBtn = `<button 
              onClick={handleWithdraw}`;

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

            <button 
              onClick={handleWithdraw}`;

if (code.includes(targetBtn)) {
  code = code.replace(targetBtn, wageringUI);
} else {
  console.log("Could not find button tag");
}

const targetDisabled = `withdrawPwd.length !== 6 || !amount || !accountNo || !accountTitle || cnic.length !== 13 || (provider === "BANK_TRANSFER" && !bankName)}`;
const replacementDisabled = `withdrawPwd.length !== 6 || !amount || !accountNo || !accountTitle || cnic.length !== 13 || (provider === "BANK_TRANSFER" && !bankName) || !isEligible}`;

code = code.replace(targetDisabled, replacementDisabled);

const targetClass = `withdrawPwd.length === 6 && amount && accountNo && accountTitle && cnic.length === 13 && (provider !== "BANK_TRANSFER" || bankName) ?`;
const replacementClass = `isEligible && withdrawPwd.length === 6 && amount && accountNo && accountTitle && cnic.length === 13 && (provider !== "BANK_TRANSFER" || bankName) ?`;

code = code.replace(targetClass, replacementClass);

fs.writeFileSync('src/components/WithdrawScreen.tsx', code);
console.log("Patched WithdrawScreen.tsx");
