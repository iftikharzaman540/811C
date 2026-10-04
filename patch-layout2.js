const fs = require('fs');
let code = fs.readFileSync('src/components/DepositScreen.tsx', 'utf8');

const newJSX = `return (
    <div className="min-h-screen bg-[#111] text-white flex flex-col font-sans pb-8">
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-[#1a1a1a] sticky top-0 z-50">
        <button onClick={() => router.back()} className="text-[#ffdf00] hover:text-white p-1 -ml-1">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold">Deposit</h1>
        <div className="flex gap-4 text-[#ffdf00]">
          <HeadphonesIcon className="w-5 h-5 cursor-pointer" onClick={() => router.push("/support")} />
          <FileText className="w-5 h-5 cursor-pointer" onClick={() => router.push("/deposit-history")} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-4">
        
        {/* Balance */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-bold text-neutral-200">Balance</span>
          <div className="flex items-center bg-black border border-neutral-800 rounded-full px-3 py-1 gap-1.5">
             <div className="w-4 h-4 bg-[#332a00] rounded-full flex items-center justify-center text-[10px] text-[#ffdf00] border border-[#ffdf00]/50">
                C
             </div>
             <span className="text-[#ffdf00] font-bold text-sm">{(user?.balance || 0).toFixed(2)}</span>
             <button className="text-[#ffdf00]">
                <RefreshCcw className="w-4 h-4" />
             </button>
          </div>
        </div>

        {/* Payment Method */}
        <h2 className="text-sm font-bold text-neutral-200 mb-2">Payment method</h2>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button onClick={() => setMethod("JazzCash_0")} className={\`h-12 rounded-lg border flex items-center justify-center gap-2 transition-all \${method.includes("JazzCash") ? "border-[#ffdf00] bg-black text-[#ffdf00]" : "border-neutral-700 bg-[#1a1a1a] text-neutral-400"}\`}>
            <img src="/jazzcash.png" alt="JazzCash" className="w-6 h-6 object-contain rounded" />
            <span className="text-sm font-medium">JazzCash</span>
          </button>
          <button onClick={() => setMethod("EasyPaisa_0")} className={\`h-12 rounded-lg border flex items-center justify-center gap-2 transition-all \${method.includes("EasyPaisa") ? "border-[#ffdf00] bg-black text-[#ffdf00]" : "border-neutral-700 bg-[#1a1a1a] text-neutral-400"}\`}>
            <img src="/easypaisa.png" alt="EasyPaisa" className="w-6 h-6 object-contain rounded bg-white p-0.5" />
            <span className="text-sm font-medium">EasyPaisa</span>
          </button>
        </div>

        <div className="flex justify-center mb-4">
          <button onClick={() => setChannelsExpanded(!channelsExpanded)} className="flex items-center text-[#ffdf00] text-xs font-bold">
            {channelsExpanded ? "Collapse" : "Expand"} {channelsExpanded ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
          </button>
        </div>

        {channelsExpanded && (
          <div className="grid grid-cols-3 gap-2 border-t border-neutral-800 pt-3 relative mb-4">
            {["Fast", "Fast", "Fast", "Fast"].map((m, i) => {
              const baseMethod = method.split('_')[0];
              const subMethod = \`\${baseMethod}_\${i}\`;
              return (
              <button 
                key={i} 
                onClick={() => setMethod(subMethod)}
                className={\`relative h-10 rounded-md border flex items-center justify-center text-xs \${method === subMethod || (method === baseMethod && i === 0) ? "border-[#ffdf00] text-[#ffdf00] bg-black/40" : "border-neutral-700 text-neutral-400 bg-[#1a1a1a]"}\`}
              >
                {baseMethod}
                <span className="absolute -top-1.5 -right-1 bg-[#ff0b0b] text-white text-[8px] font-bold px-1 rounded-sm">Fast</span>
              </button>
            )})}
          </div>
        )}

        {/* Mobile Number */}
        <h2 className="text-sm font-bold text-neutral-200 mb-2">Mobile Number (JazzCash / EasyPaisa)</h2>
        <div className="flex bg-[#1a1a1a] border border-neutral-700 rounded-md items-center px-3 h-12 focus-within:border-[#ffdf00] mb-4">
          <span className="text-neutral-400 mr-2 text-sm">+92</span>
          <input 
            type="tel" 
            value={accountNo}
            onChange={(e) => setAccountNo(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
            placeholder="3001234567" 
            className="bg-transparent border-none outline-none w-full text-white text-sm"
          />
        </div>

        {/* Deposit Amount */}
        <h2 className="text-sm font-bold text-neutral-200 mb-2">Deposit amount</h2>
        <div className="flex bg-[#1a1a1a] border border-[#ff0b0b]/40 rounded-md items-center px-3 h-12 focus-within:border-[#ff0b0b] mb-4">
          <span className="text-white font-medium mr-2 text-sm">"Rs"</span>
          <input 
            type="number" 
            placeholder={"Min 100~Max 200,000"} 
            className="bg-transparent flex-1 text-white outline-none text-sm placeholder-neutral-500"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {depositAmounts.map((amt) => (
            <button 
              key={amt}
              onClick={() => setAmount(amt.toString())}
              className={\`h-12 rounded-md flex flex-col items-center justify-center border transition-all \${amount === amt.toString() ? "border-[#ffdf00] bg-black" : "border-neutral-800 bg-[#1a1a1a]"}\`}
            >
              <span className="text-white font-bold text-xs">{amt.toLocaleString()}</span>
              <span className="text-[#ffdf00] font-bold text-[9px]">+{getBonus(amt)}</span>
            </button>
          ))}
        </div>

        {/* INLINE DEPOSIT BUTTON (moved from bottom fixed position) */}
        <button 
          onClick={handleDeposit} 
          disabled={loading} 
          className={\`w-full h-12 rounded-lg font-bold text-[15px] mb-6 transition-all \${amount ? "bg-[#ffdf00] text-black shadow-[0_2px_15px_rgba(255,223,0,0.3)]" : "bg-[#444] text-neutral-300"} \${loading ? "opacity-50" : ""}\`}
        >
          {loading ? "Processing..." : "Deposit Now"}
        </button>

        {/* Deposit Promotion */}
        <div className="border border-neutral-700 rounded-lg bg-[#151515] overflow-hidden mb-6">
          <div className="flex items-center justify-between p-3 border-b border-neutral-800 bg-[#1a1a1a]">
            <div className="flex items-center gap-2">
              <span className="text-xl leading-none">??</span>
              <span className="text-white font-bold text-sm">Deposit promotion</span>
            </div>
            <div className="flex items-center bg-[#2a1010] text-[#ff0b0b] text-[10px] px-1.5 py-0.5 rounded border border-[#ff0b0b]/30 gap-1 font-mono">
              <span className="text-[#ffdf00] font-bold">?LT</span> 07:43:11.6
            </div>
          </div>
          
          <div className="p-3">
            <div className="text-center text-[10px] text-neutral-500 mb-3">
               ----- Automatically participated in the following activities -----
            </div>

            <div className="flex flex-col gap-2">
              {[
                { bonus: "7.00", tag: "Deposit again 100 to receive", condition: "Total deposit >= 100" },
                { bonus: "20.00", condition: "First Deposit >= 300" },
                { bonus: "17.00", tag: "Deposit again 500 to receive", condition: "Total deposit >= 500" },
                { bonus: "30.00", condition: "First Deposit >= 600", hidden: true },
                { bonus: "50.00", condition: "First Deposit >= 1,000", hidden: true },
              ].map((item, i) => (
                (!item.hidden || promoExpanded) && (
                  <div key={i} className="flex items-center justify-between bg-[#1f1f1f] rounded-lg p-2.5 relative">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 opacity-70 flex items-center justify-center text-xl">??</div>
                      <span className="text-neutral-400 text-xs font-medium">Bonus {item.bonus}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      {item.tag && (
                         <div className="absolute -top-2 right-2 bg-[#ff5555] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-md z-10">
                           {item.tag}
                         </div>
                      )}
                      <span className="text-neutral-500 text-[10px] mt-1">{item.condition}</span>
                    </div>
                  </div>
                )
              ))}
            </div>

            <button 
              onClick={() => setPromoExpanded(!promoExpanded)} 
              className="w-full flex items-center justify-center text-[#ffdf00] text-xs font-bold mt-4"
            >
              {promoExpanded ? "Fold" : "Expand"} {promoExpanded ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
            </button>
          </div>
        </div>

        {/* INSTRUCTIONS ADDED AT THE BOTTOM */}
        <div className="bg-[#1a1a1a] rounded-lg p-4 border border-neutral-800 mb-8">
           <h3 className="text-[#ffdf00] font-bold text-sm mb-2">Recharge Instructions</h3>
           <p className="text-neutral-300 text-xs leading-relaxed mb-3">
             8111c.com ke recharge orders <span className="text-white font-bold">1-3 minutes</span> mein credit ho jayenge.<br/>
             Agar network mein masla hone ki wajah se payment na ho sake, to barah-e-karam <span className="text-white font-bold">recharge order dobara submit karein</span> aur phir recharge karein.
           </p>

           <h3 className="text-[#ffdf00] font-bold text-sm mb-2 mt-4">Important Tips</h3>
           <ul className="text-neutral-300 text-xs leading-relaxed space-y-2">
             <li>Payment karne se pehle <span className="text-white font-bold">payment amount change na karein</span>.</li>
             <li><span className="text-white font-bold">Saved account par baar baar payment na karein.</span> Barah-e-karam yaad rakhein ke har baar recharge karte waqt <span className="text-white font-bold">8111c.com se latest recharge method</span> hasil karna zaroori hai.</li>
           </ul>
        </div>
      </div>

      {/* Popup Overlay */}
      {pollingRef && (
        <div className="fixed inset-0 z-[9999] bg-black/90 flex flex-col items-center justify-center p-4 text-center backdrop-blur-md">
            <div className="w-16 h-16 border-4 border-[#ffdf00] border-t-transparent rounded-full animate-spin mb-6"></div>
            <h2 className="text-[#ffdf00] text-2xl font-black mb-3">Waiting for Payment</h2>
            <p className="text-neutral-300 text-[15px] mb-8 max-w-[280px]">
              A payment window has opened. Please complete the payment there and check your mobile phone for the MPIN prompt. Do not close this screen.
            </p>
            <button 
              onClick={() => { setPollingRef(null); if (popupWindowRef.current) popupWindowRef.current.close(); popupWindowRef.current = null; setLoading(false); }}
              className="text-neutral-400 text-sm hover:text-white underline mt-6"
            >
              Cancel
            </button>
        </div>
      )}
    </div>
  );
}`;

code = code.replace(/return \(\s*<div className="min-h-screen[\s\S]*/, newJSX);
fs.writeFileSync('src/components/DepositScreen.tsx', code);
console.log("Properly patched DepositScreen layout!");
