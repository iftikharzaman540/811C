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
// Also remove setWithdrawPwd("") from success callback
code = code.replace(/setWithdrawPwd\(""\);\s*/, '');

// 5. Remove renderBoxes function
code = code.replace(/const renderBoxes = \([\s\S]*?\n  \};\s*/, '');

// 6. Simplify the UI rendering (Remove the ternary operator for hasPassword)
// It starts with {!hasPassword ? ( and ends with )}
// We can use regex to remove the top part, and just leave the real UI.
code = code.replace(/if \(hasPassword === null\) return <div className="min-h-screen bg-\[\#111\]"><\/div>;\s*/, '');
code = code.replace(/<h1 className="text-lg font-bold">\{!hasPassword \? "Withdrawal Password" : "Withdraw Funds"\}<\/h1>/, '<h1 className="text-lg font-bold">Withdraw Funds</h1>');

// This regex replaces everything from {!hasPassword ? ( up to {/* Real Withdraw UI */}
code = code.replace(/\{!hasPassword \? \([\s\S]*?\{\/\* Real Withdraw UI \*\/\}/, '{/* Real Withdraw UI */}');

// And remove the closing )} at the end of the file
code = code.replace(/<\/button>\s*<\/>\s*\)\}\s*<\/div>/, '</button>\n      </div>');

// 7. Remove the Withdrawal Password input box UI
code = code.replace(/<div className="mb-8 relative">\s*<label className="text-sm font-medium text-neutral-300 block mb-2">Withdrawal Password<\/label>\s*<div className="relative">\s*\{renderBoxes\(withdrawPwd\)\}\s*<input\s*type="text"\s*inputMode="numeric"\s*className="absolute inset-0 w-full h-full opacity-0 cursor-text"\s*value=\{withdrawPwd\}\s*onChange=\{\(e\) => handleInput\(e\.target\.value, setWithdrawPwd\)\}\s*\/>\s*<\/div>\s*<\/div>/, '');

// 8. Fix the button disabled and className logic
code = code.replace(/withdrawPwd\.length !== 6 \|\| /g, '');
code = code.replace(/withdrawPwd\.length === 6 && /g, '');

fs.writeFileSync('src/components/WithdrawScreen.tsx', code);
console.log("WithdrawScreen cleaned up");
