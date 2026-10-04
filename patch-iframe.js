const fs = require('fs');
let code = fs.readFileSync('src/components/DepositScreen.tsx', 'utf8');

// Add iframeUrl state
code = code.replace(/const \[pollingRef, setPollingRef\] = useState<string \| null>\(null\);\s*/, 'const [pollingRef, setPollingRef] = useState<string | null>(null);\n  const [iframeUrl, setIframeUrl] = useState<string | null>(null);\n');

// When response is successful, set iframeUrl
code = code.replace(/if \(resData\.reference\) \{\s*setPollingRef\(resData\.reference\);\s*toast\.success\("Deposit initiated!"\);\s*\}/, `if (resData.reference) {
          setPollingRef(resData.reference);
          setIframeUrl(resData.payment_url || null);
          toast.success("Deposit initiated!");
        }`);

// Clear iframeUrl on success or error
code = code.replace(/setPollingRef\(null\);\s*setAmount\(""\);/g, 'setPollingRef(null);\n          setIframeUrl(null);\n          setAmount("");');
code = code.replace(/toast\.error\("Deposit failed or was rejected\."\);\s*setPollingRef\(null\);/g, 'toast.error("Deposit failed or was rejected.");\n          setPollingRef(null);\n          setIframeUrl(null);');

// Change the Cancel button to also clear iframeUrl
code = code.replace(/onClick=\{\(\) => \{ setPollingRef\(null\); setLoading\(false\); \}\}/g, 'onClick={() => { setPollingRef(null); setIframeUrl(null); setLoading(false); }}');

// Update the overlay to show iframe if available
const newOverlay = `
      {pollingRef && (
        <div className="fixed inset-0 z-[9999] bg-black/90 flex flex-col items-center justify-center p-4 text-center backdrop-blur-md">
          {iframeUrl ? (
             <div className="w-full max-w-[400px] h-[500px] bg-white rounded-xl overflow-hidden relative shadow-2xl">
               <div className="absolute inset-0 flex items-center justify-center bg-white z-0">
                  <div className="w-10 h-10 border-4 border-[#ffdf00] border-t-transparent rounded-full animate-spin"></div>
               </div>
               <iframe src={iframeUrl} className="w-full h-full relative z-10 border-none" sandbox="allow-scripts allow-same-origin allow-forms allow-popups" />
             </div>
          ) : (
            <>
              <div className="w-16 h-16 border-4 border-[#ffdf00] border-t-transparent rounded-full animate-spin mb-6"></div>
              <h2 className="text-[#ffdf00] text-2xl font-black mb-3">Waiting for Payment</h2>
              <p className="text-neutral-300 text-[15px] mb-8 max-w-[280px]">
                Please check your mobile phone and enter your MPIN to authorize the deposit. Do not close this screen.
              </p>
            </>
          )}
          <button 
            onClick={() => { setPollingRef(null); setIframeUrl(null); setLoading(false); }}
            className="text-neutral-400 text-sm hover:text-white underline mt-6"
          >
            Cancel
          </button>
        </div>
      )}
`;

code = code.replace(/\{pollingRef && \([\s\S]*?Cancel\s*<\/button>\s*<\/div>\s*\)\}/, newOverlay);

fs.writeFileSync('src/components/DepositScreen.tsx', code);
console.log("Patched DepositScreen.tsx to show iframe for payment URL");
