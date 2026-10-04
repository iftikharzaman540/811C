const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

const regex = /<div className="flex items-center gap-2 ml-auto shrink-0">[\s\S]*?<\/div>\s*<\/div>\s*<div className="max-w-md mx-auto relative pt-4">/;

const replacement = `        <div className="flex items-center gap-2 ml-auto shrink-0">
          {user ? (
            <>
              {/* Balance Pill */}
              <div className="flex items-center bg-black border border-[#1fdf1f]/30 rounded-[10px] px-1.5 py-1 h-[32px] gap-1.5 shrink-0 shadow-sm">
                <div className="w-[18px] h-[18px] bg-[#0d4026] rounded-full flex items-center justify-center text-[10px] text-[#1fdf1f] border border-[#1fdf1f]/50">
                  ☪
                </div>
                <span className="text-[#ffdf00] font-bold text-[14px]">{user.balance || "0.00"}</span>
                <button className="text-[#1fdf1f] hover:rotate-180 transition-transform duration-300 ml-0.5">
                  <RefreshCcw className="w-3.5 h-3.5" />
                </button>
              </div>
              
              {/* Deposit Button */}
              <div className="relative shrink-0 ml-1">
                <div className="absolute -top-1.5 -right-1.5 bg-[#ff0b0b] text-white text-[9px] font-bold px-1 rounded-sm z-10 shadow-md transform rotate-12">
                  +3%
                </div>
                <button className="bg-[#66df2f] hover:bg-[#55cc25] text-black px-2.5 rounded-lg text-[13px] font-bold min-w-[80px] flex items-center justify-center gap-1 shadow-[0_2px_10px_rgba(102,223,47,0.3)] transition-colors h-[32px]">
                  Deposit
                  <svg className="w-3 h-3 opacity-80 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                </button>
              </div>
            </>
          ) : (
            <>
              <button onClick={onLoginClick || (() => toast.success("Login coming soon"))} className="bg-[#0a0a0a] border border-[#ffdf00] text-[#ffdf00] px-3 py-1.5 rounded-[8px] text-[13px] font-medium min-w-[70px] tracking-tight shrink-0 shadow-sm hover:bg-[#1f1b02] transition-colors flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                Login
              </button>
              
              <div className="relative shrink-0">
                <button onClick={onRegisterClick || (() => toast.success("Register coming soon"))} className="bg-[#cc0000] text-white px-3 py-1.5 rounded-[8px] text-[13px] font-medium min-w-[80px] tracking-tight shrink-0 hover:bg-[#ff0000] transition-colors flex items-center justify-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 8v6m3-3h-6"></path>
                  </svg>
                  Register
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="max-w-md mx-auto relative pt-4">`;

if (code.match(regex)) {
  code = code.replace(regex, replacement);
  fs.writeFileSync('src/components/HomeScreen.tsx', code);
  console.log("Success");
} else {
  console.log("Regex not matched!");
}
