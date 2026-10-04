const fs = require('fs');
let code = fs.readFileSync('src/components/WithdrawScreen.tsx', 'utf8');

// 1. Remove state declarations for passwords
code = code.replace(/const \[hasPassword, setHasPassword\] = useState<boolean \| null>\(null\);\s*/, '');
code = code.replace(/const \[password, setPassword\] = useState\(""\);\s*/, '');
code = code.replace(/const \[confirmPassword, setConfirmPassword\] = useState\(""\);\s*/, '');
code = code.replace(/const \[withdrawPwd, setWithdrawPwd\] = useState\(""\);\s*/, '');

// 2. Remove useEffect for localStorage withdrawal pwd
code = code.replace(/useEffect\(\(\) => \{\s*if \(typeof window !== "undefined"\) \{\s*const stored = localStorage\.getItem\("withdraw_pwd"\);\s*setHasPassword\(!!stored\);\s*\}\s*\}, \[\]\);\s*/, '');

// 3. Remove handleInput and handleSetPassword
code = code.replace(/const handleInput = [\s\S]*?setter\(clean\);\s*};\s*/, '');
code = code.replace(/const handleSetPassword = \(\) => \{[\s\S]*?setHasPassword\(true\);\s*};\s*/, '');

// 4. Remove password check in handleWithdraw
code = code.replace(/if \(withdrawPwd !== localStorage\.getItem\("withdraw_pwd"\)\) \{\s*toast\.error\("Incorrect withdrawal password"\);\s*return;\s*\}\s*/, '');
code = code.replace(/setWithdrawPwd\(""\);\s*/, '');

// 5. Remove renderBoxes function
code = code.replace(/const renderBoxes = \([\s\S]*?\n  \};\s*/, '');

// 6. Simplify the UI rendering
code = code.replace(/if \(hasPassword === null\) return <div className="min-h-screen bg-\[\#111\]"><\/div>;\s*/, '');
code = code.replace(/<h1 className="text-lg font-bold">\{!hasPassword \? "Withdrawal Password" : "Withdraw Funds"\}<\/h1>/, '<h1 className="text-lg font-bold">Withdraw Funds</h1>');
code = code.replace(/\{!hasPassword \? \([\s\S]*?\{\/\* Real Withdraw UI \*\/\}/, '{/* Real Withdraw UI */}');
code = code.replace(/<\/button>\s*<\/>\s*\)\}\s*<\/div>/, '</button>\n      </div>');

// 7. Remove the Withdrawal Password input box UI
code = code.replace(/<div className="mb-8 relative">\s*<label className="text-sm font-medium text-neutral-300 block mb-2">Withdrawal Password<\/label>\s*<div className="relative">\s*\{renderBoxes\(withdrawPwd\)\}\s*<input\s*type="text"\s*inputMode="numeric"\s*className="absolute inset-0 w-full h-full opacity-0 cursor-text"\s*value=\{withdrawPwd\}\s*onChange=\{\(e\) => handleInput\(e\.target\.value, setWithdrawPwd\)\}\s*\/>\s*<\/div>\s*<\/div>/, '');

// 8. Fix the button disabled and className logic
code = code.replace(/withdrawPwd\.length !== 6 \|\| /g, '');
code = code.replace(/withdrawPwd\.length === 6 && /g, '');

// 9. Add wagering variable calculations at the start of the component render (before return)
const wageringVars = `
  const req = Number(user?.current_wagering_requirement || 0);
  const comp = Number(user?.current_wagering_completed || 0);
  const remaining = Math.max(0, req - comp);
  const isEligible = comp >= req;
  const todayCount = Number(user?.today_withdrawals_count || 0);
  const remainingDaily = Math.max(0, 15 - todayCount);

  return (`;
code = code.replace(/return \(/, wageringVars);

// 10. Add Wagering UI text right above the button
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
code = code.replace(/<button \s*onClick=\{handleWithdraw\}/, wageringUI);

// 11. Add isEligible logic to the button
code = code.replace(/disabled=\{isSubmitting \|\| !amount/, 'disabled={isSubmitting || !isEligible || !amount');
code = code.replace(/className=\{`w-full py-4 rounded-lg font-bold text-\[16px\] text-black \$\{!isSubmitting && amount/, 'className={`w-full py-4 rounded-lg font-bold text-[16px] text-black ${!isSubmitting && isEligible && amount');


fs.writeFileSync('src/components/WithdrawScreen.tsx', code);
console.log("Patched WithdrawScreen with both features successfully!");
